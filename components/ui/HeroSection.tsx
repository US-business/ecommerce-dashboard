"use client"

import React from 'react';
import { Button } from "@/components/shadcnUI/button"
import { Badge } from "@/components/shadcnUI/badge"
import { ArrowRight, Play, Star, Users, TrendingUp, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores"

interface HeroSectionProps {
    className?: string;
    dir?: 'ltr' | 'rtl';
}

export function HeroSection({ className = '', dir = 'ltr' }: HeroSectionProps) {
    const { t } = useI18nStore()

    const stats = [
        { icon: Users, value: "50K+", label: dir === 'rtl' ? "عميل سعيد" : "Happy Customers" },
        { icon: TrendingUp, value: "10K+", label: dir === 'rtl' ? "منتج مباع" : "Products Sold" },
        { icon: Award, value: "4.9★", label: dir === 'rtl' ? "متوسط التقييم" : "Average Rating" },
    ]

    return (
        <section className={cn(
            "relative min-h-[90dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
            className
        )}>
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className={cn(
                    "grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto",
                    dir === 'rtl' && "lg:grid-cols-2"
                )}>
                    {/* Content Section */}
                    <div className={cn(
                        "space-y-8 text-center lg:text-left",
                        dir === 'rtl' && "lg:text-right"
                    )}>
                        {/* Badge */}
                        <Badge
                            variant="secondary"
                            className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                            <Star className="w-4 h-4 mr-2" />
                            {dir === 'rtl' ? "أفضل متجر إلكتروني 2024" : "Best E-Commerce 2024"}
                        </Badge>

                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className={cn(
                                "text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight",
                                "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent"
                            )}>
                                {dir === 'rtl' ? (
                                    <>
                                        متجرك الإلكتروني
                                        <span className="block text-primary">الأول في الجودة</span>
                                    </>
                                ) : (
                                    <>
                                        Your First Choice
                                        <span className="block text-primary">E-Commerce Store</span>
                                    </>
                                )}
                            </h1>

                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                                {dir === 'rtl'
                                    ? "اكتشف أفضل المنتجات بأسعار تنافسية مع خدمة عملاء استثنائية. تسوق بثقة وأمان مع ضمان الجودة."
                                    : "Discover premium products at competitive prices with exceptional customer service. Shop with confidence and security with our quality guarantee."
                                }
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className={cn(
                            "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start",
                            dir === 'rtl' && "lg:justify-end"
                        )}>
                            <Button
                                size="lg"
                                className="px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                {dir === 'rtl' ? "ابدأ التسوق" : "Start Shopping"}
                                <ArrowRight className="w-5 h-5 mr-2" />
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-6 text-lg font-semibold border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                {dir === 'rtl' ? "شاهد الفيديو" : "Watch Video"}
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className={cn(
                            "grid grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-700",
                            dir === 'rtl' && "border-t"
                        )}>
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <stat.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="font-bold text-2xl md:text-3xl text-slate-900 dark:text-white">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Section */}
                    <div className={cn(
                        "relative lg:flex justify-center items-center hidden",
                        dir === 'rtl' && "lg:flex"
                    )}>
                        {/* Main Product Showcase */}
                        <div className="relative">
                            {/* Product Card Mockup */}
                            <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-6 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-primary/30 rounded-full flex items-center justify-center">
                                        <span className="text-4xl">🛍️</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-6 bg-primary/20 rounded w-16"></div>
                                        <div className="flex space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center animate-bounce">
                                <span className="text-2xl">✨</span>
                            </div>

                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                                <span className="text-xl">🔥</span>
                            </div>

                            {/* Background Circles */}
                            <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
                            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-accent/10 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
