"use client"

import Image from 'next/image';
import { Badge } from "@/components/shadcnUI/badge";
import { Crown, Zap, Clock, Percent } from 'lucide-react';

interface ProductImageProps {
    imageUrl: string;
    alt: string;
    status?: string;
    discountPercentage?: number;
    dir?: 'ltr' | 'rtl';
}

export function ProductImage({ 
    imageUrl, 
    alt, 
    status, 
    discountPercentage,
    dir = 'ltr' 
}: ProductImageProps) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            best_seller: {
                icon: Crown,
                label: dir === 'rtl' ? 'الأكثر مبيعاً' : 'Best Seller',
                className: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 shadow-lg'
            },
            new: {
                icon: Zap,
                label: dir === 'rtl' ? 'جديد' : 'New',
                className: 'bg-gradient-to-r from-emerald-400 to-teal-600 text-white border-0 shadow-lg'
            },
            on_sale: {
                icon: Percent,
                label: dir === 'rtl' ? 'تخفيض' : 'On Sale',
                className: 'bg-gradient-to-r from-red-400 to-rose-600 text-white border-0 shadow-lg'
            },
            coming_soon: {
                icon: Clock,
                label: dir === 'rtl' ? 'قريباً' : 'Coming Soon',
                className: 'bg-gradient-to-r from-violet-400 to-purple-600 text-white border-0 shadow-lg'
            },
            normal: null
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        if (!config) return null;

        const IconComponent = config.icon;
        return (
            <Badge className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold ${config.className}`}>
                <IconComponent className="w-3.5 h-3.5" />
                {config.label}
            </Badge>
        );
    };

    return (
        <div className="relative w-full h-full group">
            {/* Image Container with Hover Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl ">
                <Image
                    src={imageUrl}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={alt}
                    className="object-contain p-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                    loading="lazy"
                    quality={85}
                />
                
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Status Badge */}
            {status && status !== 'normal' && (
                <div className="absolute top-4 left-4 z-10 animate-in fade-in slide-in-from-left-4 duration-500">
                    {getStatusBadge(status)}
                </div>
            )}

            {/* Discount Badge */}
            {discountPercentage && (
                <div className="absolute top-4 right-4 z-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg px-3 py-1.5 text-base font-bold">
                        -{discountPercentage}%
                    </Badge>
                </div>
            )}
        </div>
    );
}