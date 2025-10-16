import { Button } from '@/components/shadcnUI/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { CartItem } from '@/types/cart'
import { useCartStore } from '@/lib/stores'
import { removeCartItem, updateCartItem } from '@/lib/actions/cart'
type QuantityCartProps = {
   item: CartItem
   dir?: string
   showDelete?: boolean
}

const CartQuantity = ({ item, dir, showDelete = false }: QuantityCartProps) => {

   const { updateQuantity, removeItem } = useCartStore()
   const [isUpdating, setIsUpdating] = useState<number | null>(null)

   const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
      const result = await updateCartItem(cartItemId, newQuantity)
      if (!result.success) {
         updateQuantity(cartItemId, newQuantity)
      }
      if (newQuantity === 0) {
         handleRemoveItem(cartItemId)
      } 
      setIsUpdating(cartItemId)
   }
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

   return (
      <>
         <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
               <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
               >
                  <Minus className="h-3 w-3" />
               </Button>
               <span className="w-8 text-center text-sm">{item.quantity}</span> 
               <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.quantityInStock}
               >
                  <Plus className="h-3 w-3" />
               </Button>
            </div>
            {showDelete ? (
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => handleRemoveItem(item.id)}
               >
                  <Trash2 className="h-3 w-3" />
               </Button>
            ) : null}
         </div>
      </>
   )
}

export default CartQuantity