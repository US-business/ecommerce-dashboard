"use client"

import React from 'react';
import { Card, CardContent } from "@/components/shadcnUI/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores"

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  verified?: boolean;
  dir?: 'ltr' | 'rtl';
}

interface TestimonialsSectionProps {
  className?: string;
  dir?: 'ltr' | 'rtl';
} 

const testimonials: TestimonialProps[] = [
  {
    name: "سارة أحمد",
    role: "عميلة منتظمة",
    content: "تجربة تسوق ممتازة! جودة المنتجات عالية وسعرها مناسب. خدمة العملاء سريعة ومتعاونة.",
    rating: 5,
    verified: true,
    dir: 'rtl'
  },
  {
    name: "محمد علي",
    role: "عميل جديد",
    content: "أول مرة أطلب من هذا المتجر وانبهرت بالسرعة في التوصيل والتعبئة الآمنة للمنتجات.",
    rating: 5,
    verified: true,
    dir: 'rtl'
  },
  {
    name: "فاطمة حسن",
    role: "عميلة منتظمة",
    content: "متجر موثوق ومنتجات أصلية 100%. أنصح به للجميع!",
    rating: 5,
    verified: true,
    dir: 'rtl'
  },
  {
    name: "Ahmed Hassan",
    role: "Regular Customer",
    content: "Excellent shopping experience! High quality products at reasonable prices. Customer service is quick and helpful.",
    rating: 5,
    verified: true,
    dir: 'ltr'
  },
  {
    name: "John Smith",
    role: "New Customer",
    content: "First time ordering from this store and I'm impressed with the fast delivery and secure packaging of products.",
    rating: 5,
    verified: true,
    dir: 'ltr'
  },
  {
    name: "Emily Davis",
    role: "Regular Customer",
    content: "Reliable store with 100% authentic products. I recommend it to everyone!",
    rating: 5,
    verified: true,
    dir: 'ltr'
  }
]

export function TestimonialsSection({ className = '', dir = 'ltr' }: TestimonialsSectionProps) {
  const { t } = useI18nStore()

  const TestimonialCard = ({ testimonial, index }: { testimonial: TestimonialProps; index: number }) => {
    return (
      <Card className={cn(
        "relative bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2",
        "backdrop-blur-sm bg-white/95 dark:bg-slate-800/95"
      )}>
        <CardContent className="p-6">
          {/* Quote Icon */}
          <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < testimonial.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>

          {/* Content */}
          <p className={cn(
            "text-slate-700 dark:text-slate-300 mb-6 leading-relaxed",
            dir === 'rtl' ? "text-right" : "text-left"
          )}>
            "{testimonial.content}"
          </p>

          {/* Author */}
          <div className={cn(
            "flex items-center gap-4",
            dir === 'rtl' ? "flex-row-reverse" : "flex-row"
          )}>
            <Avatar className="w-12 h-12">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {testimonial.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className={cn(dir === 'rtl' ? "text-right" : "text-left")}>
              <div className="font-semibold text-slate-900 dark:text-white">
                {testimonial.name}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {testimonial.role}
              </div>
            </div>

            {testimonial.verified && (
              <div className={cn(
                "mr-auto",
                dir === 'rtl' && "ml-auto mr-0"
              )}>
                <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  {dir === 'rtl' ? "موثق" : "Verified"}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className={cn(
      "py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800",
      className
    )}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={cn(
          "text-center mb-16",
          dir === 'rtl' && "text-center"
        )}>
          <h2 className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold mb-6",
            "bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
          )}>
            {dir === 'rtl' ? "آراء عملائنا" : "What Our Customers Say"}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {dir === 'rtl'
              ? "نفتخر بخدمة آلاف العملاء السعداء. إليك ما يقولونه عن تجربتهم معنا."
              : "We pride ourselves on serving thousands of happy customers. Here's what they say about their experience with us."
            }
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials
            .filter(testimonial => testimonial.dir === dir)
            .map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}`}
                testimonial={testimonial}
                index={index}
              />
            ))
          }
        </div>

        {/* Stats Section */}
        <div className={cn(
          "mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto",
          dir === 'rtl' && "grid-cols-2 md:grid-cols-4"
        )}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
            <div className="text-slate-600 dark:text-slate-400">
              {dir === 'rtl' ? "عميل سعيد" : "Happy Customers"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.9★</div>
            <div className="text-slate-600 dark:text-slate-400">
              {dir === 'rtl' ? "متوسط التقييم" : "Average Rating"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99%</div>
            <div className="text-slate-600 dark:text-slate-400">
              {dir === 'rtl' ? "رضا العملاء" : "Satisfaction"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-slate-600 dark:text-slate-400">
              {dir === 'rtl' ? "دعم فني" : "Support"}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
