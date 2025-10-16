import React, { useContext, useState } from 'react'
import { Minus, Plus } from 'lucide-react';
import { ProductProps } from '@/types/product'
import { useCartStore } from '@/lib/stores';
import { cn } from '@/lib/utils';


type ProductControlsProps = {
    dir: string;
    productData: ProductProps;
}

const Quantity = ({ dir, productData }: ProductControlsProps) => {

    const { setQuantityToCart, quantityToCart } = useCartStore();
    const availableStock = Number(productData.quantityInStock ?? 0)

    const handleQuantityChange = (amount: number) => {
        const newQuantity = quantityToCart + amount;
        if (newQuantity > 0 && newQuantity <= availableStock) {
            setQuantityToCart(newQuantity);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">

            <div className={cn("w-full sm:w-44 flex items-center justify-between border-2 border-gray-300 rounded-lg overflow-hidden hover:border-primary transition-colors")}>
                <button 
                    type='button'
                    className={cn(
                        "outline-none focus:outline-none border-0 transition-all duration-200 w-9 sm:w-10 h-9 flex items-center justify-center border-solid border-r border-gray-300 cursor-pointer hover:bg-gray-100 flex-shrink-0",
                        quantityToCart <= 1 && "opacity-40 cursor-not-allowed hover:bg-transparent",
                        dir === "rtl" && "border-l border-r-0"
                    )}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantityToCart <= 1}
                    aria-label="Decrease quantity"
                >
                    <Minus className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600' />
                </button>
                <span className="flex-1 h-9 flex items-center justify-center font-semibold text-gray-900 text-center text-sm sm:text-base min-w-0">
                    {quantityToCart}
                </span>
                <button 
                    type='button'
                    className={cn(
                        "outline-none focus:outline-none border-0 transition-all duration-200 w-9 sm:w-10 h-9 flex items-center justify-center border-solid border-l border-gray-300 cursor-pointer hover:bg-gray-100 flex-shrink-0",
                        quantityToCart >= availableStock && "opacity-40 cursor-not-allowed hover:bg-transparent",
                        dir === "rtl" && "border-r border-l-0"
                    )}
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantityToCart >= availableStock}
                    aria-label="Increase quantity"
                >
                    <Plus className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600' />
                </button>
            </div>
            {quantityToCart >= availableStock && (
                <p className="text-xs text-orange-600">
                    {dir === "rtl" ? "الحد الأقصى المتاح" : "Maximum available reached"}
                </p>
            )}
        </div>
    )
}

export default Quantity