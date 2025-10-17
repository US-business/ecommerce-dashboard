"use client"
import { Button } from '@/components/shadcnUI/button'
import { useI18nStore } from '@/lib/stores'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const CartListLink = () => {

   const router = useRouter()
   const { t, dir } = useI18nStore()

   const handleCartClick = () => {
      router.push("/cart")
   }

   return (
      <>
         <Button
            variant="ghost"
            size="icon"
            onClick={handleCartClick}
            className="hover:bg-accent transition-colors relative"
            title={dir === "rtl" ? "سلة التسوق" : "Shopping Cart"}
         >
            <ShoppingCart className="h-5 w-5" />
            {/* Optional: Add cart item count badge */}
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
               3
            </span>
         </Button>
      </>
   )
}

export default CartListLink