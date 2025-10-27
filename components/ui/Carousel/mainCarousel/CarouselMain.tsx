"use client"

import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from "@/components/shadcnUI/carousel";
import { Card, CardContent } from "@/components/shadcnUI/card";
import type { ProductProps } from "@/types/product";
import { ProductImage } from './_components/ProductImage';
import { ProductInfo } from './_components/ProductInfo';
import { ProductActions } from './_components/ProductActions';
import { cn } from '@/lib/utils';

interface CarouselComponentProps {
    items: ProductProps[] | undefined;
    autoPlayInterval?: number;
    className?: string;
    dir?: 'ltr' | 'rtl';
    lang?: string;
}

const CarouselMain = ({
    items,
    autoPlayInterval = 5000,
    className = '',
    dir = 'ltr',
    lang = 'en'
}: CarouselComponentProps) => {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    // Auto-play functionality with pause on hover
    React.useEffect(() => {
        if (!api || isHovered) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [api, autoPlayInterval, isHovered]);

    // Track current slide
    React.useEffect(() => {
        if (!api) return;

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    // Helper function to calculate discounted price
    const calculatePrice = (product: ProductProps) => {
        const originalPrice = Number(product.price) || 0;
        const discountValue = Number(product.discountValue) || 0;

        // Debug logging
        console.log('Product:', product.nameEn || product.nameAr, {
            discountType: product.discountType,
            discountValue: product.discountValue,
            originalPrice
        });

        if (!product.discountType || product.discountType === 'none' || !discountValue) {
            return { 
                originalPrice, 
                finalPrice: originalPrice, 
                hasDiscount: false,
                discountPercentage: undefined
            };
        }

        let finalPrice = originalPrice;
        let discountPercentage = 0;
        
        if (product.discountType === 'percentage') {
            finalPrice = originalPrice - (originalPrice * discountValue / 100);
            discountPercentage = discountValue;
        } else if (product.discountType === 'fixed') {
            finalPrice = originalPrice - discountValue;
            discountPercentage = originalPrice > 0 ? Math.round((discountValue / originalPrice) * 100) : 0;
        }

        console.log('Calculated discount:', discountPercentage);

        return {
            originalPrice,
            finalPrice: Math.max(0, finalPrice),
            hasDiscount: true,
            discountPercentage: discountPercentage > 0 ? discountPercentage : undefined
        };
    };

    return (
        <div
            className={cn("relative z-10 w-full h-full rounded-2xl overflow-hidden",
                "bg-slate-100",
                ` ${className}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="region"
            aria-label={dir === 'rtl' ? 'عرض المنتجات' : 'Product showcase'}
        >
            <Carousel
                setApi={setApi}
                className="w-full h-full relative"
                opts={{
                    align: "start",
                    loop: true,
                    dragFree: true,
                    direction: dir === "rtl" ? "rtl" : "ltr",
                }}
            >
                <CarouselContent>
                    {items?.map((product, index) => {
                        const priceInfo = calculatePrice(product);

                        return (
                            <CarouselItem key={product.id || index}>
                                <Card className="relative w-full h-full border-0 overflow-hidden bg-transparent">
                                    <CardContent className="p-0 h-full">
                                        <article className="relative flex flex-col md:flex-row w-full h-full">
                                            {/* Product Image Section - Enhanced */}
                                            <div className="relative w-full md:w-1/2 h-[40vh] sm:h-[45vh] md:h-full">
                                                <ProductImage
                                                    imageUrl={product.images?.[0] || "/placeholder.jpg"}
                                                    alt={dir === "rtl" ? product.nameAr : product.nameEn}
                                                    status={product.status}
                                                    discountPercentage={priceInfo.discountPercentage}
                                                    dir={dir}
                                                />
                                            </div>

                                            {/* Product Content Section - Enhanced */}
                                            <div className="relative w-full md:w-1/2 flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-10 space-y-3 md:space-y-4">
                                                {/* Decorative Element */}
                                                <div className={cn("absolute top-0 right-0 w-64 h-64 ",
                                                    // " bg-gradient-to-br from-primary/5 to-transparent ",
                                                    " rounded-full blur-3xl -z-10" )}/>

                                                <ProductInfo
                                                    product={product}
                                                    priceInfo={priceInfo}
                                                    dir={dir}
                                                />

                                                <ProductActions
                                                    id={product.id}
                                                    quantityInStock={product.quantityInStock}
                                                    dir={dir}
                                                    lang={lang}
                                                />
                                            </div>
                                        </article>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>

                {/* Enhanced Navigation Buttons */}
                <CarouselPrevious
                    className="absolute top-1/2 left-2 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 -translate-y-1/2 z-50 bg-white/95 backdrop-blur-md border-2 border-gray-200 hover:bg-white hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 hover:border-primary"
                    aria-label={dir === 'rtl' ? 'المنتج السابق' : 'Previous product'}
                />
                <CarouselNext
                    className="absolute top-1/2 right-2 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 -translate-y-1/2 z-50 bg-white/95 backdrop-blur-md border-2 border-gray-200 hover:bg-white hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 hover:border-primary"
                    aria-label={dir === 'rtl' ? 'المنتج التالي' : 'Next product'}
                />

                {/* Enhanced Dots Navigation */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-1.5 sm:gap-2 z-50 bg-black/20 backdrop-blur-md rounded-full px-3 sm:px-5 py-1 shadow-lg">
                    {items?.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`rounded-full cursor-pointer transition-all duration-300 hover:scale-125 ${index === current
                                    ? 'w-6 sm:w-8 md:w-10 h-1.5 sm:h-2 bg-white shadow-lg'
                                    : 'w-2 sm:w-2.5 md:w-3 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'
                                }`}
                            onClick={() => api?.scrollTo(index)}
                            aria-label={`${dir === 'rtl' ? 'انتقل إلى الشريحة' : 'Go to slide'} ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,theme(colors.slate.100),transparent_5%,transparent_95%,theme(colors.slate.100))] z-0 pointer-events-none" />
                {/* <div className="absolute inset-0 bg-linear-[90deg,white,transparent_5%,transparent_95%,white] z-0 pointer-events-none" /> */}
            </Carousel>
        </div>
    );
};

export default CarouselMain;