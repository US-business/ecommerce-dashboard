"use client"

import Link from 'next/link';
import { Button } from "@/components/shadcnUI/button";
import { Eye, ShoppingCart } from 'lucide-react';
import WishlistButton from '@/components/ui/WishlistButton';

interface ProductActionsProps {
    id: number | string | undefined;
    quantityInStock?: number;
    dir?: 'ltr' | 'rtl';
    lang?: string;
}

export function ProductActions({ id, quantityInStock, dir = 'ltr', lang = 'en' }: ProductActionsProps) {
    return (
        <div className="flex items-center gap-2 sm:gap-3 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-1300">
            <Button
                asChild
                size="default"
                className="flex-1 text-xs sm:text-sm text-amber-800 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-9 sm:h-10 md:h-11"
                aria-label={dir === 'rtl' ? 'عرض تفاصيل المنتج' : 'View product details'}
            >
                <Link href={`/products/${id}`} className="flex items-center gap-1.5 sm:gap-2"> 
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold">
                        {dir === 'rtl' ? 'عرض المنتج' : 'View Details'}
                    </span>
                </Link>
            </Button>

            {quantityInStock && quantityInStock > 0 ? (
                <>
                    <Button
                        size="default"
                        className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-2 border-amber-300 hover:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 p-0"
                        aria-label={dir === 'rtl' ? 'أضف إلى السلة' : 'Add to cart'}
                    >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                    <WishlistButton
                        productId={Number(id)}
                        dir={dir}
                        lang={lang}
                        className="border-2 transition-all duration-300 hover:scale-105 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11"
                    />
                </>
            ) : (
                <Button
                    disabled
                    size="default"
                    className="bg-gray-300 text-gray-500 shadow-lg cursor-not-allowed opacity-60 h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                    aria-label={dir === 'rtl' ? 'غير متوفر' : 'Out of stock'}
                >
                    {dir === 'rtl' ? 'غير متوفر' : 'Out of stock'}
                </Button>
            )}
        </div>
    );
}