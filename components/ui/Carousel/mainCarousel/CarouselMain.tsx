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

    // Auto-play functionality
    React.useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [api, autoPlayInterval]);

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

        if (!product.discountType || product.discountType === 'none' || !discountValue) {
            return { originalPrice, finalPrice: originalPrice, hasDiscount: false };
        }

        let finalPrice = originalPrice;
        if (product.discountType === 'percentage') {
            finalPrice = originalPrice - (originalPrice * discountValue / 100);
        } else if (product.discountType === 'fixed') {
            finalPrice = originalPrice - discountValue;
        }

        return {
            originalPrice,
            finalPrice: Math.max(0, finalPrice),
            hasDiscount: true,
            discountPercentage: product.discountType === 'percentage' ? discountValue : Math.round((discountValue / originalPrice) * 100)
        };
    };

    return (
        <div className={`w-full h-full rounded-2xl overflow-hidden bg-white ${className}`}>
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
                                <Card className="relative w-full h-full min-h-[300px] md:h-[400px] border-0 overflow-hidden ">
                                    <CardContent className="p-0 h-full">
                                        <article className="relative flex md:flex-row flex-col w-full h-full">
                                            {/* Product Image Section - Enhanced */}
                                            <div className="relative w-full md:w-1/2 h-64 md:h-full">
                                                <ProductImage
                                                    imageUrl={product.images?.[0] || "/placeholder.jpg"}
                                                    alt={dir === "rtl" ? product.nameAr : product.nameEn}
                                                    status={product.status}
                                                    discountPercentage={priceInfo.discountPercentage}
                                                    dir={dir}
                                                />
                                            </div>

                                            {/* Product Content Section - Enhanced */}
                                            <div className="relative w-full md:w-1/2 flex flex-col justify-center p-6 md:p-10 lg:p-12 space-y-4">
                                                {/* Decorative Element */}
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -z-10" />
                                                
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
                <CarouselPrevious className="absolute top-1/2 left-4 w-14 h-14 -translate-y-1/2 z-50 bg-white/95 backdrop-blur-md border-2 border-gray-200 hover:bg-white hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 hover:border-primary" />
                <CarouselNext className="absolute top-1/2 right-4 w-14 h-14 -translate-y-1/2 z-50 bg-white/95 backdrop-blur-md border-2 border-gray-200 hover:bg-white hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 hover:border-primary" />

                {/* Enhanced Dots Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2 z-50 bg-black/20 backdrop-blur-md rounded-full px-5 py-1 shadow-lg">
                    {items?.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`rounded-full cursor-pointer transition-all duration-300 hover:scale-125 ${
                                index === current
                                    ? 'w-10 h-2 bg-white shadow-lg'
                                    : 'w-3 h-2 bg-white/50 hover:bg-white/80'
                            }`}
                            onClick={() => api?.scrollTo(index)}
                            aria-label={`${dir === 'rtl' ? 'انتقل إلى الشريحة' : 'Go to slide'} ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-[90deg,white,transparent_5%,transparent_95%,white] z-0 pointer-events-none" /> 
            </Carousel>
        </div>
    );
};

export default CarouselMain;