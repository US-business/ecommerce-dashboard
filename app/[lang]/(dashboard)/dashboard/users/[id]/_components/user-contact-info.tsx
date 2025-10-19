"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserContactInfoProps {
  email: string
  phoneNumber?: string
  address?: string
  createdAt: string
}

export function UserContactInfo({ email, phoneNumber, address, createdAt }: UserContactInfoProps) {
  const { t, dir } = useI18nStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(dir === "rtl" && "text-right")}>
          {dir === "rtl" ? "معلومات الاتصال" : "Contact Information"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
          <Mail className="h-4 w-4 text-muted-foreground" />
          <div className={cn(dir === "rtl" && "text-right")}>
            <p className="text-sm text-muted-foreground">{t("users.email")}</p>
            <p className="font-medium">{email}</p>
          </div>
        </div>

        {phoneNumber && (
          <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div className={cn(dir === "rtl" && "text-right")}>
              <p className="text-sm text-muted-foreground">{t("users.phoneNumber")}</p>
              <p className="font-medium">{phoneNumber}</p>
            </div>
          </div>
        )}

        {address && (
          <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div className={cn(dir === "rtl" && "text-right")}>
              <p className="text-sm text-muted-foreground">{t("users.address")}</p>
              <p className="font-medium">{address}</p>
            </div>
          </div>
        )}

        <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className={cn(dir === "rtl" && "text-right")}>
            <p className="text-sm text-muted-foreground">{dir === "rtl" ? "تاريخ الإنشاء" : "Created At"}</p>
            <p className="font-medium">{new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
