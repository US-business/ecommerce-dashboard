"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { t, dir } = useI18nStore()
  const { user, isSuperAdmin } = useAuthStore()

  return (
    <div className="space-y-6">
      <div className={cn(dir === "rtl" && "text-right")}>
        <h1 className="text-3xl font-bold">{t("navigation.dashboard")}</h1>
        <p className="text-muted-foreground">
          {dir === "rtl"
            ? `${user?.username} ،مرحباً بك في لوحة التحكم${isSuperAdmin ? " (مدير عام)" : ""}`
            : `Welcome to your e-commerce dashboard, ${user?.username}${isSuperAdmin && " (Super Administrator)"}`}
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className={cn(dir === "rtl" && "text-right")}>
          {dir === "rtl"
            ? "وضع التجربة: استخدام المصادقة التجريبية. اربط قاعدة البيانات لتفعيل الوظائف الكاملة."
            : "Demo Mode: Using demo authentication. Connect your database to enable full functionality."}
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader
            className={cn(
              "flex flex-row items-center justify-between space-y-0 pb-2",
              dir === "rtl" && "flex-row-reverse",
            )}
          >
            <CardTitle className={cn("text-sm font-medium", dir === "rtl" && "text-right")}>
              {t("products.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className={cn(dir === "rtl" && "text-right")}>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">{dir === "rtl" ? "إجمالي المنتجات" : "Total products"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            className={cn(
              "flex flex-row items-center justify-between space-y-0 pb-2",
              dir === "rtl" && "flex-row-reverse",
            )}
          >
            <CardTitle className={cn("text-sm font-medium", dir === "rtl" && "text-right")}>
              {t("orders.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className={cn(dir === "rtl" && "text-right")}>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">{dir === "rtl" ? "إجمالي الطلبات" : "Total orders"}</p>
          </CardContent>
        </Card>

        {isSuperAdmin && (
          <>
            <Card>
              <CardHeader
                className={cn(
                  "flex flex-row items-center justify-between space-y-0 pb-2",
                  dir === "rtl" && "flex-row-reverse",
                )}
              >
                <CardTitle className={cn("text-sm font-medium", dir === "rtl" && "text-right")}>
                  {t("users.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className={cn(dir === "rtl" && "text-right")}>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  {dir === "rtl" ? "المستخدمون التجريبيون" : "Demo users"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                className={cn(
                  "flex flex-row items-center justify-between space-y-0 pb-2",
                  dir === "rtl" && "flex-row-reverse",
                )}
              >
                <CardTitle className={cn("text-sm font-medium", dir === "rtl" && "text-right")}>
                  {t("coupons.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className={cn(dir === "rtl" && "text-right")}>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  {dir === "rtl" ? "إجمالي الكوبونات" : "Total coupons"}
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {!isSuperAdmin && (
          <Card>
            <CardHeader
              className={cn(
                "flex flex-row items-center justify-between space-y-0 pb-2",
                dir === "rtl" && "flex-row-reverse",
              )}
            >
              <CardTitle className={cn("text-sm font-medium", dir === "rtl" && "text-right")}>
                {t("categories.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(dir === "rtl" && "text-right")}>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">{dir === "rtl" ? "إجمالي الفئات" : "Total categories"}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={cn(dir === "rtl" && "text-right")}>
            {dir === "rtl" ? "البدء" : "Getting Started"}
          </CardTitle>
        </CardHeader>
        <CardContent className={cn("space-y-4", dir === "rtl" && "text-right")}>
          <div>
            <h4 className="font-medium mb-2">{dir === "rtl" ? "بيانات الدخول التجريبية:" : "Demo Credentials:"}</h4>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="p-3 bg-muted rounded">
                <strong>{dir === "rtl" ? "مدير عام:" : "Super Admin:"}</strong>
                <br />
                <code className="text-sm">admin@example.com</code>
                <br />
                <code className="text-sm">admin123</code>
              </div>
              <div className="p-3 bg-muted rounded">
                <strong>{dir === "rtl" ? "مشاهد:" : "Viewer:"}</strong>
                <br />
                <code className="text-sm">viewer@example.com</code>
                <br />
                <code className="text-sm">viewer123</code>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">{dir === "rtl" ? "الخطوات التالية:" : "Next Steps:"}</h4>
            <ol
              className={cn(
                "list-decimal text-sm space-y-1",
                dir === "rtl" ? "list-inside text-right" : "list-inside",
              )}
            >
              <li>
                {dir === "rtl" ? "إعداد متغير البيئة DATABASE_URL" : "Set up your DATABASE_URL environment variable"}
              </li>
              <li>
                {dir === "rtl" ? "تشغيل سكريبت تهيئة قاعدة البيانات" : "Run the database initialization script"}
              </li>
              <li>
                {dir === "rtl" ? "البدء في إدارة المنتجات والفئات" : "Start managing your products and categories"}
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
