"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, Users, Ticket, Star, Image, UserCircle } from "lucide-react"
import { useAuth } from "@/lib/stores"

const navigation = [
  {
    name: "navigation.dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "viewer"],
  },
  {
    name: "navigation.products",
    href: "/dashboard/products",
    icon: Package,
    roles: ["super_admin", "viewer"],
  },
  {
    name: "navigation.categories",
    href: "/dashboard/categories",
    icon: FolderOpen,
    roles: ["super_admin", "viewer"],
  },
  {
    name: "navigation.orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    roles: ["super_admin", "viewer"],
  },
  {
    name: "navigation.users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["super_admin"], // Only super admin can manage users
  },
  {
    name: "navigation.coupons",
    href: "/dashboard/coupons",
    icon: Ticket,
    roles: ["super_admin"], // Only super admin can manage coupons
  },
  {
    name: "navigation.reviews",
    href: "/dashboard/reviews",
    icon: Star,
    roles: ["super_admin", "viewer"],
  },
  {
    name: "navigation.gallery",
    href: "/dashboard/gallery",
    icon: Image,
    roles: ["super_admin", "viewer"],
  },
  {
    name: "navigation.profile",
    href: "/account",
    icon: UserCircle,
    roles: ["super_admin", "viewer"],
  },
]

export function Sidebar() {
  const { t, dir } = useI18nStore()
  const { user } = useAuth()
  const pathname = usePathname()

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter((item) => user && item.roles.includes(user.role))

  return (
    <div className={cn("flex h-full flex-col bg-white", dir === "rtl" ? "border-l" : "border-r")}>
      <div
        className={cn("flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6", dir === "rtl" && "flex-row-reverse")}
      >
        <Link
          href="/"
          className={cn("flex items-center gap-2 font-semibold", dir === "rtl" && "flex-row-reverse")}
        >
          <Package className="h-6 w-6" />
          <span>E-Commerce</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                // className={cn(
                //   "justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary mb-1",
                //   isActive && "bg-muted text-primary",
                //   dir === "rtl" && "flex-row-reverse justify-end",
                // )}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted transition-all hover:text-primary",
                  isActive && "bg-muted text-primary",
                  dir === "rtl" && "flex-row-reverse text-right",
                )}
              >
                <Icon className="h-4 w-4" />
                {t(item.name as any)}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
