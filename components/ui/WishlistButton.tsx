"use client"

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/shadcnUI/button'
import { cn } from '@/lib/utils'
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/lib/actions/wishlist'
import { useAuth, useWishlistStore } from '@/lib/stores'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface WishlistButtonProps {
  productId: number | string
  dir: string
  lang?: string
  className?: string
  iconClassName?: string
  onClick?: (e: React.MouseEvent) => void
}

/**
 * Reusable Wishlist Button Component
 * Handles adding/removing products from wishlist with visual feedback
 */
const WishlistButton = ({ 
  productId, 
  dir, 
  lang = 'en',
  className,
  iconClassName,
  onClick
}: WishlistButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { isInWishlist: isInWishlistStore } = useWishlistStore()
  
  // Check if product is in wishlist using store
  const isInWishlistState = isInWishlistStore(Number(productId))

  // Also verify with server on mount to ensure sync
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !productId) return
      
      try {
        const result = await isInWishlist(user.id, Number(productId))
        if (result.success && result.data !== isInWishlistState) {
          // If server state differs, we'll trust server and reload will sync
          console.log('Wishlist state mismatch, will sync on next load')
        }
      } catch (error) {
        console.error('Error checking wishlist:', error)
      }
    }

    checkWishlist()
  }, [user, productId, isInWishlistState])

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Call custom onClick if provided
    if (onClick) {
      onClick(e)
    }

    // Check if user is logged in
    if (!user) {
      router.push(`/${lang}/signin`)
      toast({
        title: dir === 'rtl' ? 'يجب تسجيل الدخول' : 'Login Required',
        description: dir === 'rtl'
          ? 'يرجى تسجيل الدخول لإضافة المنتجات إلى المفضلة'
          : 'Please login to add items to wishlist',
        variant: "destructive"
      })
      return
    }

    if (!productId) return

    setIsLoading(true)
    try {
      if (isInWishlistState) {
        // Remove from wishlist
        const result = await removeFromWishlist(user.id, Number(productId))
        if (result.success) {
          // Store will be updated on next page load/refresh
          toast({
            title: dir === 'rtl' ? "تمت الإزالة" : "Removed",
            description: dir === 'rtl'
              ? 'تمت إزالة المنتج من المفضلة'
              : 'Product removed from wishlist',
            variant: "default"
          })
          // Trigger page refresh to sync with server
          window.location.reload()
        } else {
          throw new Error(result.error)
        }
      } else {
        // Add to wishlist
        const result = await addToWishlist(user.id, Number(productId))
        if (result.success) {
          // Store will be updated on next page load/refresh
          toast({
            title: dir === 'rtl' ? "تمت الإضافة" : "Added",
            description: dir === 'rtl'
              ? 'تمت إضافة المنتج إلى المفضلة'
              : 'Product added to wishlist',
            variant: "default"
          })
          // Trigger page refresh to sync with server
          window.location.reload()
        } else {
          throw new Error(result.error)
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      toast({
        title: dir === 'rtl' ? "خطأ" : "Error",
        description: dir === 'rtl'
          ? 'فشل في تحديث المفضلة'
          : 'Failed to update wishlist',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleWishlist}
      disabled={isLoading}
      title={dir === "rtl" 
        ? (isInWishlistState ? "إزالة من المفضلة" : "أضف للمفضلة") 
        : (isInWishlistState ? "Remove from Wishlist" : "Add to Wishlist")
      }
      className={cn(
        "transition-all duration-200",
        isInWishlistState 
          ? "bg-rose-50 border-rose-300 hover:bg-rose-100 shadow-lg" 
          : "hover:bg-red-50 hover:border-red-300",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-all duration-200",
          isInWishlistState ? "fill-rose-500 text-rose-500 " : "text-gray-600",
          iconClassName
        )} 
      />
    </Button>
  )
}

export default WishlistButton
