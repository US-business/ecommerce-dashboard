"use client"
import { Button } from '@/components/shadcnUI/button'
import { useI18nStore } from '@/lib/stores'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const WishListLink = () => {

   const router = useRouter()
   const { t, dir } = useI18nStore()

   const handleWishlistClick = () => {
      router.push("/WishList")
   }

   return (
      <>
         <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlistClick}
            className="hover:bg-accent transition-colors"
            title={dir === "rtl" ? "قائمة الأمنيات" : "Wishlist"}
         >
            <Heart className="h-5 w-5" />
         </Button>
      </>
   )
}

export default WishListLink