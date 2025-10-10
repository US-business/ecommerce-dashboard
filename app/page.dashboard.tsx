"use client"

import { DashboardContent } from "@/app/[lang]/(dashboard)/dashboard/_components/DashboardContent"

// Mock dictionary
const mockDictionary = {
  dashboard: {
    title: "Dashboard",
    stats: {
      total_revenue: "Total Revenue",
      total_orders: "Total Orders",
      total_customers: "Total Customers",
      total_products: "Total Products"
    },
    revenue_over_time: "Revenue Over Time",
    recent_orders: {
      title: "Recent Orders",
      view_all: "View All"
    }
  }
}

// Mock data
const mockData = {
  totalOrders: 1234,
  totalRevenue: 45678.90,
  totalUsers: 567,
  totalProducts: 89,
  recentOrders: [
    {
      id: "ORD-001",
      userId: "user1",
      user: {
        username: "John Doe",
        email: "john@example.com"
      },
      status: "delivered",
      totalAmount: 299.99,
      createdAt: new Date("2024-01-15")
    },
    {
      id: "ORD-002",
      userId: "user2",
      user: {
        username: "Jane Smith",
        email: "jane@example.com"
      },
      status: "processing",
      totalAmount: 149.50,
      createdAt: new Date("2024-01-14")
    },
    {
      id: "ORD-003",
      userId: "user3",
      user: {
        username: "Bob Johnson",
        email: "bob@example.com"
      },
      status: "shipped",
      totalAmount: 599.00,
      createdAt: new Date("2024-01-13")
    },
    {
      id: "ORD-004",
      userId: "user4",
      user: {
        username: "Alice Brown",
        email: "alice@example.com"
      },
      status: "pending",
      totalAmount: 89.99,
      createdAt: new Date("2024-01-12")
    },
    {
      id: "ORD-005",
      userId: "user5",
      user: {
        username: "Charlie Wilson",
        email: "charlie@example.com"
      },
      status: "delivered",
      totalAmount: 399.99,
      createdAt: new Date("2024-01-11")
    }
  ],
  monthlyStats: {
    "2024-01": 12500,
    "2023-12": 15200,
    "2023-11": 13800,
    "2023-10": 11200,
    "2023-09": 14500,
    "2023-08": 16800
  }
}

export default function DashboardPreview() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardContent
        dictionary={mockDictionary}
        direction="ltr"
        data={mockData}
      />
    </div>
  )
}