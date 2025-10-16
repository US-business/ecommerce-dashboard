"use client"

import React from 'react';
import { Badge } from "@/components/shadcnUI/badge"
import {
  Shield,
  Lock,
  CreditCard,
  Award,
  CheckCircle,
  Globe,
  Users,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores"

interface TrustIndicatorProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
}

interface TrustIndicatorsProps {
  className?: string;
  dir?: 'ltr' | 'rtl';
}

export function TrustIndicators({ className = '', dir = 'ltr' }: TrustIndicatorsProps) {
  const { t } = useI18nStore()

  const indicators: TrustIndicatorProps[] = [
    {
      icon: Shield,
      title: dir === 'rtl' ? "أمان مضمون" : "Guaranteed Security",
      description: dir === 'rtl' ? "حماية متقدمة لبياناتك الشخصية" : "Advanced protection for your personal data",
      delay: 0
    },
    {
      icon: CreditCard,
      title: dir === 'rtl' ? "دفع آمن" : "Secure Payment",
      description: dir === 'rtl' ? "طرق دفع متعددة ومشفرة بالكامل" : "Multiple payment methods fully encrypted",
      delay: 100
    },
    {
      icon: Award,
      title: dir === 'rtl' ? "جودة مضمونة" : "Quality Guaranteed",
      description: dir === 'rtl' ? "منتجات أصلية مع ضمان الجودة" : "Authentic products with quality guarantee",
      delay: 200
    },
    {
      icon: Clock,
      title: dir === 'rtl' ? "توصيل سريع" : "Fast Delivery",
      description: dir === 'rtl' ? "توصيل خلال 24 ساعة في معظم المناطق" : "Delivery within 24 hours in most areas",
      delay: 300
    },
    {
      icon: Users,
      title: dir === 'rtl' ? "دعم عملاء" : "Customer Support",
      description: dir === 'rtl' ? "فريق دعم متخصص متاح 24/7" : "Specialized support team available 24/7",
      delay: 400
    },
    {
      icon: CheckCircle,
      title: dir === 'rtl' ? "رضا مضمون" : "Satisfaction Guaranteed",
      description: dir === 'rtl' ? "إرجاع مجاني خلال 30 يوم" : "Free returns within 30 days",
      delay: 500
    }
  ]

  return (
    <section className={cn(
      "py-16 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-t border-slate-200 dark:border-slate-700",
      className
    )}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={cn(
          "text-center mb-12",
          dir === 'rtl' && "text-center"
        )}>
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200">
            <Shield className="w-4 h-4 mr-2" />
            {dir === 'rtl' ? "موثوق وآمن" : "Trusted & Secure"}
          </Badge>

          <h2 className={cn(
            "text-2xl md:text-3xl font-bold mb-4",
            "text-slate-900 dark:text-white"
          )}>
            {dir === 'rtl' ? "تسوق بثقة تامة" : "Shop with Complete Confidence"}
          </h2>

          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {dir === 'rtl'
              ? "نحن ملتزمون بحماية خصوصيتك وتقديم أفضل تجربة تسوق آمنة وموثوقة"
              : "We are committed to protecting your privacy and providing the best secure and reliable shopping experience"
            }
          </p>
        </div>

        {/* Trust Indicators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className={cn(
                "group flex items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-700",
                "hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/5"
              )}
              style={{
                animationDelay: `${indicator.delay}ms`
              }}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <indicator.icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className={cn(
                "flex-1",
                dir === 'rtl' ? "text-right" : "text-left"
              )}>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">
                  {indicator.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {indicator.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <div className={cn(
          "mt-16 flex flex-wrap justify-center items-center gap-6",
          dir === 'rtl' ? "flex-row-reverse" : "flex-row"
        )}>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 rounded-full">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              SSL {dir === 'rtl' ? "مشفر" : "Encrypted"}
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              PCI {dir === 'rtl' ? "متوافق" : "Compliant"}
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
              {dir === 'rtl' ? "موثوق عالمياً" : "Globally Trusted"}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustIndicators
