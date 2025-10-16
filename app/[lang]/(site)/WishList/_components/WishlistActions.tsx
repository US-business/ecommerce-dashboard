"use client"

import { useState } from "react"
import { Button } from "@/components/shadcnUI/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcnUI/alert-dialog"
import { ShoppingCart, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { clearWishlist, moveWishlistToCart } from "@/lib/actions/wishlist"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import type { Dictionary } from "@/lib/i18n/dictionary-types"

interface WishlistActionsProps {
  userId: number
  itemCount: number
  dir: "ltr" | "rtl"
  dictionary: Dictionary
}

export default function WishlistActions({ userId, itemCount, dir, dictionary }: WishlistActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)

  const handleMoveAllToCart = async () => {
    setLoading(true)
    try {
      const result = await moveWishlistToCart(userId)
      if (result.success) {
        toast({
          title: dir === "rtl" ? "نجحت العملية" : "Success",
          description: dictionary.wishlist.itemsMovedToCart,
        })
        router.push("/cart")
      } else {
        toast({
          title: dir === "rtl" ? "خطأ" : "Error",
          description: result.error || (dir === "rtl" ? "فشلت العملية" : "Operation failed"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: dir === "rtl" ? "خطأ" : "Error",
        description: dir === "rtl" ? "حدث خطأ غير متوقع" : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClearWishlist = async () => {
    setLoading(true)
    try {
      const result = await clearWishlist(userId)
      if (result.success) {
        toast({
          title: dir === "rtl" ? "تم المسح" : "Cleared",
          description: dir === "rtl" ? "تم مسح قائمة الأمنيات" : "Wishlist cleared successfully",
        })
        router.refresh()
      } else {
        toast({
          title: dir === "rtl" ? "خطأ" : "Error",
          description: result.error || (dir === "rtl" ? "فشل مسح القائمة" : "Failed to clear wishlist"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: dir === "rtl" ? "خطأ" : "Error",
        description: dir === "rtl" ? "حدث خطأ غير متوقع" : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowClearDialog(false)
    }
  }

  if (itemCount === 0) return null

  return (
    <>
      <div className={cn("flex flex-col sm:flex-row gap-3", dir === "rtl" && "sm:flex-row-reverse")}>
        <Button
          onClick={handleMoveAllToCart}
          disabled={loading}
          className="flex-1"
        >
          <ShoppingCart className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {dictionary.wishlist.addAllToCart}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowClearDialog(true)}
          disabled={loading}
          className="flex-1"
        >
          <Trash2 className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {dictionary.wishlist.clearWishlist}
        </Button>
      </div>

      {/* Clear Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={cn(dir === "rtl" && "text-right")}>
              {dir === "rtl" ? "تأكيد المسح" : "Confirm Clear"}
            </AlertDialogTitle>
            <AlertDialogDescription className={cn(dir === "rtl" && "text-right")}>
              {dictionary.wishlist.confirmClear}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={cn(dir === "rtl" && "flex-row-reverse")}>
            <AlertDialogCancel>{dictionary.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearWishlist}>
              {dictionary.wishlist.clearWishlist}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
