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
        <div className="flex items-center gap-3 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-1300">
            <Button
                asChild
                size="lg"
                className="flex-1 text-amber-800 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber/90 hover:to-amber/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
                <Link href={`/products/${id}`} className="flex items-center gap-2"> 
                    <Eye className="w-5 h-5" />
                    <span className="font-semibold">
                        {dir === 'rtl' ? 'عرض المنتج' : 'View Details'}
                    </span>
                </Link>
            </Button>

            {quantityInStock && quantityInStock > 0 ? (
                <>
                    <Button
                        size="lg"
                        className=" bg-gray-50 hover:bg-amber-50  text-amber-700 border border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </Button>
                    <WishlistButton
                        productId={Number(id)}
                        dir={dir}
                        lang={lang}
                        className="border-2 transition-all duration-300 hover:scale-105 h-11 w-11"
                    />
                </>
            ) : (
                <Button
                    disabled
                    size="lg"
                    className="bg-gray-300 text-gray-500 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    {"out of stock"}
                </Button>
            )}
        </div>
    );
}