"use server";

import { db } from "@/lib/db";
import { orders, users, products } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function getDashboardStats() {
   try {
      // Get total number of orders
      const totalOrders = await db
         .select({ count: orders.id })
         .from(orders)
         .then(result => Number(result[0]?.count) || 0);

      // Get total revenue
      const revenue = await db
         .select({
            total: orders.totalAmount
         })
         .from(orders)
         .where(eq(orders.status, "delivered"));

      const totalRevenue = revenue.reduce((acc, curr) => acc + Number(curr.total || 0), 0);

      // Get total number of users
      const totalUsers = await db
         .select({ count: users.id })
         .from(users)
         .then(result => Number(result[0]?.count) || 0);

      // Get total number of products
      const totalProducts = await db
         .select({ count: products.id })
         .from(products)
         .then(result => Number(result[0]?.count) || 0);

      // Get recent orders (last 5)
      const recentOrders = await db.query.orders.findMany({
         with: {
            user: true,
            items: {
               with: {
                  product: true,
               },
            },
         },
         orderBy: [desc(orders.createdAt)],
         limit: 5,
      });

      // Get orders by status
      const ordersByStatus = await db
         .select({
            status: orders.status,
            count: sql<number>`count(${orders.id})`
         })
         .from(orders)
         .groupBy(orders.status);

      // Get monthly revenue for the last 6 months
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);

      const monthlyRevenue = await db
         .select({
            totalAmount: orders.totalAmount,
            createdAt: orders.createdAt,
         })
         .from(orders)
         .where(eq(orders.status, "delivered"));

      const monthlyStats = monthlyRevenue.reduce((acc: Record<string, number>, curr) => {
         const monthYear = (curr.createdAt ?? new Date()).toISOString().slice(0, 7); // Format: YYYY-MM
         acc[monthYear] = (acc[monthYear] || 0) + Number(curr.totalAmount || 0);
         return acc;
      }, {});

      return {
         success: true,
         data: {
            totalOrders,
            totalRevenue,
            totalUsers,
            totalProducts,
            recentOrders,
            ordersByStatus,
            monthlyStats
         }
      };
   } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
         success: false,
         error: "Failed to fetch dashboard statistics"
      };
   }
}