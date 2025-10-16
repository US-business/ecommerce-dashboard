"use client"

import React from 'react';
import { Card, CardContent } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import {
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  CreditCard,
  Zap,
  Gift,
  Award,
  LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores"

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  delay?: number;
}

interface FeaturesSectionProps {
  className?: string;
  dir?: 'ltr' | 'rtl';
}

export function FeaturesSection({ className = '', dir = 'ltr' }: FeaturesSectionProps) {
  const { t } = useI18nStore()

  const features: FeatureProps[] = [
    {
      icon: Truck,
      title: dir === 'rtl' ? "شحن مجاني" : "Free Shipping",
      description: dir === 'rtl' ? "شحن مجاني للطلبات فوق $50" : "Free shipping on orders over $50",
      badge: dir === 'rtl' ? "شائع" : "Popular",
      delay: 0
    },
    {
      icon: Shield,
      title: dir === 'rtl' ? "دفع آمن" : "Secure Payment",
      description: dir === 'rtl' ? "حماية SSL وتشفير متقدم" : "SSL protection and advanced encryption",
      badge: dir === 'rtl' ? "آمن" : "Secure",
      delay: 100
    },
    {
      icon: RotateCcw,
      title: dir === 'rtl' ? "إرجاع سهل" : "Easy Returns",
      description: dir === 'rtl' ? "إرجاع مجاني خلال 30 يوم" : "Free returns within 30 days",
      badge: dir === 'rtl' ? "مرن" : "Flexible",
      delay: 200
    },
    {
      icon: Headphones,
      title: dir === 'rtl' ? "دعم 24/7" : "24/7 Support",
      description: dir === 'rtl' ? "فريق دعم متاح على مدار الساعة" : "Support team available 24/7",
      badge: dir === 'rtl' ? "سريع" : "Fast",
      delay: 300
    },
    {
      icon: Zap,
      title: dir === 'rtl' ? "توصيل سريع" : "Fast Delivery",
      description: dir === 'rtl' ? "توصيل خلال 24 ساعة في المدن الرئيسية" : "Delivery within 24 hours in major cities",
      badge: dir === 'rtl' ? "سريع" : "Quick",
      delay: 400
    },
    {
      icon: Gift,
      title: dir === 'rtl' ? "هدايا وعروض" : "Gifts & Offers",
      description: dir === 'rtl' ? "عروض خاصة وعروض ترويجية مستمرة" : "Special offers and ongoing promotions",
      badge: dir === 'rtl' ? "مميز" : "Special",
      delay: 500
    }
  ]

  return (
    <section className={cn(
      "py-20 bg-white dark:bg-slate-900",
      className
    )}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={cn(
          "text-center mb-16",
          dir === 'rtl' && "text-center"
        )}>
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            {dir === 'rtl' ? "لماذا تختارنا؟" : "Why Choose Us?"}
          </Badge>

          <h2 className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold mb-6",
            "bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
          )}>
            {dir === 'rtl' ? "مميزات تجعلنا الأفضل" : "Features That Make Us The Best"}
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {dir === 'rtl'
              ? "نقدم تجربة تسوق متكاملة تجمع بين الجودة العالية والخدمة المتميزة والأسعار التنافسية"
              : "We provide a complete shopping experience that combines high quality, excellent service and competitive prices"
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={cn(
                "group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700",
                "border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2",
                "overflow-hidden"
              )}
              style={{
                animationDelay: `${feature.delay}ms`
              }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardContent className="relative p-8">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>

                  {feature.badge && (
                    <Badge className="absolute -top-2 -right-2 bg-accent/20 text-accent hover:bg-accent/30 text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-lg transition-all duration-300 pointer-events-none" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={cn(
          "text-center mt-16",
          dir === 'rtl' && "text-center"
        )}>
          <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
            <Award className="w-8 h-8 text-primary" />
            <div className={cn(dir === 'rtl' ? "text-right" : "text-left")}>
              <div className="font-bold text-slate-900 dark:text-white">
                {dir === 'rtl' ? "أكثر من مليون عميل راضٍ" : "Over 1M+ Satisfied Customers"}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {dir === 'rtl' ? "انضم إلينا اليوم واختبر الفرق" : "Join us today and experience the difference"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
