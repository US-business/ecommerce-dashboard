"use client"

import { LucideIcon, Truck, Shield, RotateCcw, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"

type FeaturesProps = {
    icon: LucideIcon
    title: string
    description: string
    delay?: number
}

interface FeaturesSectionProps {
    dir: string
    lang?: string
    className?: string
}

export function FeaturesSection({ dir, lang = 'en', className = '' }: FeaturesSectionProps) {

    const features: FeaturesProps[] = [
        {
            icon: Truck,
            title: dir === 'rtl' ? "شحن سريع" : "Fast Shipping",
            description: dir === 'rtl' ? "توصيل في 1-3 أيام" : "Delivery in 1-3 days",
            delay: 0
        },
        {
            icon: Shield,
            title: dir === 'rtl' ? "دفع آمن 100%" : "100% Secure Payment",
            description: dir === 'rtl' ? "حماية SSL متقدمة" : "Advanced SSL protection",
            delay: 100
        },
        {
            icon: RotateCcw,
            title: dir === 'rtl' ? "إرجاع سهل" : "Easy Returns",
            description: dir === 'rtl' ? "تواصل مع خدمة العملاء" : "Contact customer support",
            delay: 200
        },
        {
            icon: Headphones,
            title: dir === 'rtl' ? "دعم 24/7" : "24/7 Support",
            description: dir === 'rtl' ? "فريق متخصص متاح دائماً" : "Expert team always available",
            delay: 300
        }
    ]

    return (
        <div className={cn("relative border-b border-border bg-muted/20", className)}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={cn(
                                "group flex items-center gap-4 p-5 bg-card rounded-lg border-2 border-sky-300 hover:border-green-500 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5",
                            )}
                            style={{
                                animationDelay: `${feature.delay}ms`
                            }}
                        >
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-sky-300/10 hover:text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-300/20 transition-colors duration-300">
                                    <feature.icon className="w-6 h-6 text-sky-600 group-hover:text-green-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold group-hover:text-green-800 text-sky-600  mb-0.5 text-sm">
                                    {feature.title}
                                </h3>
                                <p className="group-hover:text-green-600 text-sky-600 hover:text-green-600  text-xs leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FeaturesSection