
"use client"
import React, { useEffect, useState } from 'react'
import { Badge } from '../../shadcnUI/badge'
import { Button } from '../../shadcnUI/button'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Separator } from '../../shadcnUI/separator'
import { cn } from '@/lib/utils'
import { removeCartItem, updateCartItem } from '@/lib/actions/cart'
import { useCartStore } from '@/lib/stores'
import { CartItem } from "@/lib/stores/cart-store"
import CartQuantity from './CartQuantity'

type CartItemProps = {
    user: { id: number } | null
    dir: string
    cart: { success: boolean; data: { items: CartItem[] } } | any
    dictionary?: any
}

const CartItems = ({ user, dir, cart, dictionary }: CartItemProps) => {

    const [isUpdating, setIsUpdating] = useState<number | null>(null)
    const {items, removeItem, setItems } = useCartStore()

    const handleRemoveItem = async (cartItemId: number) => {
        setIsUpdating(cartItemId)
        try {
            // Remove from server
            const result = await removeCartItem(cartItemId)
            if (result.success) {
                // Remove from local store
                removeItem(cartItemId)
            }
        } catch (error) {
            console.error('Error removing item:', error)
        } finally {
            setIsUpdating(null)
        }
    }



    useEffect(() => {
        if (cart?.success && Array.isArray(cart?.data?.items)) {
            const mapped: CartItem[] = (cart.data?.items ?? []).map((item: any): CartItem => ({
                id: Number(item.id),
                productId: Number(item.productId),
                quantity: Number(item.quantity),
                product: {
                    id: Number(item.product?.id),
                    nameEn: String(item.product?.nameEn ?? ""),
                    nameAr: String(item.product?.nameAr ?? ""),
                    price: item.product?.price != null ? String(item.product.price) : null,
                    images: Array.isArray(item.product?.images) ? item.product.images : [],
                    quantityInStock: Number(item.product?.quantityInStock ?? 0),
                    discountType: (item.product?.discountType as 'fixed' | 'percentage' | 'none') ?? 'none',
                    discountValue: item.product?.discountValue != null ? String(item.product.discountValue) : null,
                },
                coupon: item.coupon,
            }))
            setItems(mapped)
        } else {
            // No server cart; ensure local store is cleared to avoid stale items
            setItems([])
        }
    }, [user?.id, cart?.success, cart?.data?.items, setItems])


    return (
        <>
            {items.map((item : CartItem, index : number) => {
                const itemPrice = Number(item.product.price)
                const discountValue = Number(item.product.discountValue || 0)
                let finalPrice = itemPrice

                // Apply discount
                if (item.product.discountType === 'percentage') {
                    finalPrice = itemPrice - (itemPrice * discountValue) / 100
                } else if (item.product.discountType === 'fixed') {
                    finalPrice = itemPrice - discountValue
                } 

                const isOutOfStock = item.product.quantityInStock <= 0
                const isUpdatingThis = isUpdating === item.id

                return (
                    <div key={item.id}>
                        <div className={cn("flex items-center space-x-4", dir === "rtl" && "space-x-reverse")}>
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                {item.product.images?.[0] ? (
                                    <img
                                        src={item.product.images[0]}
                                        alt={dir === "rtl" ? item.product.nameAr : item.product.nameEn}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">
                                    {dir === "rtl" ? item.product.nameAr : item.product.nameEn}
                                </h3>
                                <div className={cn("flex items-center space-x-2 mt-1", dir === "rtl" && "space-x-reverse")}>
                                    <span className="font-bold text-primary">${finalPrice.toFixed(2)}</span>
                                    {item.product.discountType !== 'none' && discountValue > 0 && (
                                        <span className="text-sm text-gray-500 line-through">${itemPrice.toFixed(2)}</span>
                                    )}
                                    {isOutOfStock && (
                                        <Badge variant="destructive">{dictionary?.cart?.outOfStock || "Out of Stock"}</Badge>
                                    )}
                                </div>
                            </div>
                            <CartQuantity
                                item={item}
                                dir={dir}
                            />
                            <div className="text-right">
                                <p className="font-bold">${(finalPrice * item.quantity).toFixed(2)}</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={isUpdatingThis}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        {index < cart.data.items.length - 1 && <Separator className="mt-4" />}
                    </div>
                )
            })}
        </>
    )
}

export default CartItems