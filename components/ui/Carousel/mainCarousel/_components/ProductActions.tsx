"use client"

import Link from 'next/link';
import { Button } from "@/components/shadcnUI/button";
import { Eye, ShoppingCart, Heart } from 'lucide-react';

interface ProductActionsProps {
    id: number | string | undefined;
    quantityInStock?: number;
    dir?: 'ltr' | 'rtl';
}

export function ProductActions({ id, quantityInStock, dir = 'ltr' }: ProductActionsProps) {
    return (
        <div className="flex items-center gap-3 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-1300">
            <Button
                asChild
                size="lg"
                className="flex-1 text-amber-800 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber/90 hover:to-amber/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
                <Link href={`/product/${id}`} className="flex items-center gap-2">
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
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-2 hover:bg-red-50 hover:border-red-300 transition-all duration-300 hover:scale-105"
                    >
                        <Heart className="w-5 h-5 text-red-500" />
                    </Button>
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