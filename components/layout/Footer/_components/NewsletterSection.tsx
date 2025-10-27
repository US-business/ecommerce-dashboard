"use client"

import { Input } from "@/components/shadcnUI/input"
import { Button } from "@/components/shadcnUI/button"
import { ArrowRight, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewsletterSectionProps {
  dir: string
  lang?: string
  className?: string
}

export function NewsletterSection({ dir, lang = 'en', className = '' }: NewsletterSectionProps) {
  return (
    <div className={cn(
      "lg:col-span-2 space-y-8",
      className
    )}>
      {/* Logo & Description */}
      <div className="space-y-6 ">
        <div className={cn(
          "flex items-center justify-center gap-3 bg-amber-50 p-2 rounded-lg border border-amber-600/60")}>

          <div className="text-center text-amber-800">
            <h3 className="text-xl font-mono font-semibold  ">
              {dir === 'rtl' ? "دبى للتجارة" : "Dubai-trading" }
            </h3>
            <p className=" text-sm">
              {dir === 'rtl' ? "تجربة تسوق استثنائية" : "Exceptional Shopping Experience"}
            </p>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed text-sm text-center">
          {dir === 'rtl'
            ? "نحن نقدم أفضل المنتجات بأسعار تنافسية مع خدمة عملاء متميزة. ثقة عملائنا هي أولويتنا الأولى."
            : "We offer the best products at competitive prices with exceptional customer service. Our customers' trust is our top priority."
          }
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">50K+</div>
            <div className="text-muted-foreground text-xs">
              {dir === 'rtl' ? "عميل سعيد" : "Happy Customers"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">10K+</div>
            <div className="text-muted-foreground text-xs">
              {dir === 'rtl' ? "منتج مباع" : "Products Sold"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">4.9★</div>
            <div className="text-muted-foreground text-xs">
              {dir === 'rtl' ? "تقييم متوسط" : "Avg Rating"}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="space-y-4 pt-4 text-center ">
        <div className={cn(
          "flex items-center gap-2 justify-center","flex-row"
        )}>
          <Mail className="w-5 h-5 text-primary" />
          <h4 className=" font-semibold text-foreground  ">
            {dir === 'rtl' ? "اشترك في نشرتنا الإخبارية" : "Subscribe to Our Newsletter"}
          </h4>
        </div>
        <p className="text-muted-foreground text-sm">
          {dir === 'rtl'
            ? "احصل على أحدث العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني"
            : "Get the latest offers and new products directly in your email"
          }
        </p>
        <div className={cn(
          "flex gap-2","flex-row"
        )}>
          <Input
            type="email"
            placeholder={dir === 'rtl' ? "أدخل بريدك الإلكتروني" : "Enter your email"}
            className="flex-1 outline outline-amber-500/60 placeholder:text-amber-700"
          />
          <Button className="px-6 gap-2 bg-amber-600 hover:bg-amber-500">
            {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : null}
            {dir === 'rtl' ? "اشترك" : "Subscribe"}
            {dir === "ltr" ? <ArrowRight className="w-4 h-4" /> : null}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewsletterSection