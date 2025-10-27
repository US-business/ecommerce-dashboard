"use client"

import { Badge } from "@/components/shadcnUI/badge";
import { Tag, Package } from 'lucide-react';
import type { ProductProps } from "@/types/product";
import { ProductPrice } from './ProductPrice';

interface ProductInfoProps {
    product: ProductProps;
    priceInfo: {
        originalPrice: number;
        finalPrice: number;
        hasDiscount: boolean;
        discountPercentage?: number;
    };
    dir?: 'ltr' | 'rtl';
}

export function ProductInfo({ product, priceInfo, dir = 'ltr' }: ProductInfoProps) {
    return (
        <div className="flex flex-col gap-2">
            {/* Brand */}
            {product.brand && (
                <div className="flex items-center gap-1.5 sm:gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-1.5 sm:p-2 bg-slate-200 rounded-lg">
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider">
                        {product.brand}
                    </span>
                </div>
            )}

            {/* Product Name */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight line-clamp-1 sm:line-clamp-2 animate-in fade-in slide-in-from-bottom-3 duration-700">
                {dir === "rtl" ? product.nameAr : product.nameEn}
            </h2>

            {/* Description */}
            {(product.descriptionEn || product.descriptionAr) && (
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-1 sm:line-clamp-2 animate-in fade-in slide-in-from-bottom-4 duration-900">
                    {dir === "rtl" ? product.descriptionAr : product.descriptionEn}
                </p>
            )}

            {/* Price Section */}
            {product.isPriceActive && product.price && (
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000">
                    <ProductPrice
                        originalPrice={priceInfo.originalPrice}
                        finalPrice={priceInfo.finalPrice}
                        hasDiscount={priceInfo.hasDiscount}
                        dir={dir}
                    />
                </div>
            )}

            {/* Stock Status */}
            {product.quantityInStock !== undefined && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-6 duration-1100">
                    {product.quantityInStock > 0 ? (
                        <Badge className="bg-transparent text-green-600 hover:bg-transparent border border-green-300 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5">
                            <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="text-xs sm:text-sm font-semibold">
                                {dir === 'rtl' ? 'متوفر' : 'In Stock'} ({product.quantityInStock})
                            </span>
                        </Badge>
                    ) : (
                        <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold">
                            {dir === 'rtl' ? 'غير متوفر' : 'Out of Stock'}
                        </Badge>
                    )}
                </div>
            )}

            {/* Offer Text */}
            {(product.offerEn || product.offerAr) && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-sm animate-in fade-in slide-in-from-bottom-7 duration-1200">
                    <p className="text-xs sm:text-sm md:text-base text-amber-900 font-semibold flex items-center gap-1.5 sm:gap-2">
                        <span className="text-lg sm:text-xl md:text-2xl">🎉</span>
                        {dir === 'rtl' ? product.offerAr : product.offerEn}
                    </p>
                </div>
            )}
        </div>
    );
}