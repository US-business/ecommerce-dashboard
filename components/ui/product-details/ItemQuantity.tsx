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
        <>
            <div className={cn(`w-44 flex items-center justify-between border-2 border-color-text-100 rounded-md overflow-hidden`, dir === "rtl" && "flex-row-reverse")}>
                <button type='button'
                    className={cn(` ${quantityToCart <= 1 ? 'disabled' : ''}  outline-none focus:outline-none border-0 transition-opacity duration-300 ease-in-out w-8 h-8 flex items-center justify-center border-solid border-r border-color-text-100 cursor-pointer text-xl text-color-text-600`, dir === "rtl" && "text-left")}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantityToCart <= 1}
                    aria-label="Decrease quantity"
                >
                    <Minus className='w-4 h-4 text-color-600' />
                </button>
                <span
                    className={cn("w-12 h-8 flex items-center justify-center font-semibold text-color text-center text-base")}
                >
                    {quantityToCart}
                </span>
                <button type='button'
                    className={cn(` ${quantityToCart >= availableStock ? 'disabled' : ''} outline-none text-center focus:outline-none border-0 transition-opacity duration-300 ease-in-out w-8 h-8 flex items-center justify-center border-solid border-l border-color-text-100 cursor-pointer text-xl text-color-text-600`, dir === "rtl" && "text-left")}
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantityToCart >= availableStock}
                    aria-label="Increase quantity"
                >
                    <Plus className='w-4 h-4 text-color-600' />
                </button>
            </div>
        </>
    )
}

export default Quantity