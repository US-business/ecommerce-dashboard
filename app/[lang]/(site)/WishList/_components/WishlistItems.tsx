"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Trash2, X } from "lucide-react"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
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
import { cn } from "@/lib/utils"
import { removeFromWishlist } from "@/lib/actions/wishlist"
import { addToCartAction } from "@/lib/actions/cart"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import type { Dictionary } from "@/lib/i18n/dictionary-types"

interface WishlistItem {
  id: number
  productId: number
  product: {
    id: number
    nameEn: string
    nameAr: string
    slug: string
    price: string | null
    isPriceActive: boolean | null
    images: string[]
    quantityInStock: number | null
    discountType: "fixed" | "percentage" | "none"
    discountValue: string | null
    status: string | null
    category?: {
      nameEn: string
      nameAr: string
    } | null
  }
}

interface WishlistItemsProps {
  items: WishlistItem[]
  userId: number
  dir: "ltr" | "rtl"
  dictionary: Dictionary
}

export default function WishlistItems({ items, userId, dir, dictionary }: WishlistItemsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<number | null>(null)
  const [removing, setRemoving] = useState<number | null>(null)
  const [itemToRemove, setItemToRemove] = useState<number | null>(null)

  const calculateFinalPrice = (product: WishlistItem["product"]) => {
    if (!product.isPriceActive || !product.price) return null

    const basePrice = parseFloat(product.price)
    if (product.discountType === "none" || !product.discountValue) return basePrice

    const discountValue = parseFloat(product.discountValue)
    if (product.discountType === "fixed") {
      return Math.max(0, basePrice - discountValue)
    } else if (product.discountType === "percentage") {
      return basePrice * (1 - discountValue / 100)
    }
    return basePrice
  }

  const handleMoveToCart = async (productId: number) => {
    setLoading(productId)
    try {
      const result = await addToCartAction(userId, productId, 1)
      if (result.success) {
        // Remove from wishlist after adding to cart
        await removeFromWishlist(userId, productId)
        toast({
          title: dir === "rtl" ? "تمت الإضافة" : "Success",
          description: dir === "rtl" ? "تم نقل المنتج إلى السلة" : "Product moved to cart",
        })
        router.refresh()
      } else {
        toast({
          title: dir === "rtl" ? "خطأ" : "Error",
          description: result.error || (dir === "rtl" ? "فشل نقل المنتج" : "Failed to move product"),
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
      setLoading(null)
    }
  }

  const handleRemove = async (productId: number) => {
    setRemoving(productId)
    try {
      const result = await removeFromWishlist(userId, productId)
      if (result.success) {
        toast({
          title: dir === "rtl" ? "تم الحذف" : "Removed",
          description: dictionary.wishlist.productRemoved,
        })
        router.refresh()
      } else {
        toast({
          title: dir === "rtl" ? "خطأ" : "Error",
          description: result.error || (dir === "rtl" ? "فشل حذف المنتج" : "Failed to remove product"),
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
      setRemoving(null)
      setItemToRemove(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: dir === "rtl" ? "جديد" : "New", variant: "default" as const },
      best_seller: { label: dir === "rtl" ? "الأكثر مبيعاً" : "Best Seller", variant: "secondary" as const },
      on_sale: { label: dir === "rtl" ? "تخفيض" : "On Sale", variant: "destructive" as const },
      coming_soon: { label: dir === "rtl" ? "قريباً" : "Coming Soon", variant: "outline" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || null
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((item) => {
          const finalPrice = calculateFinalPrice(item.product)
          const hasDiscount = item.product.discountType !== "none" && item.product.discountValue
          const statusBadge = item.product.status ? getStatusBadge(item.product.status) : null
          const isOutOfStock = (item.product.quantityInStock ?? 0) <= 0

          return (
            <Card key={item.id} className={cn("overflow-hidden transition-all hover:shadow-md", isOutOfStock && "opacity-60")}>
              <CardContent className="p-0">
                <div className={cn("flex flex-col sm:flex-row gap-4 p-4", dir === "rtl" && "sm:flex-row-reverse")}>
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.product.images && item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={dir === "rtl" ? item.product.nameAr : item.product.nameEn}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 128px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {statusBadge && (
                      <Badge className="absolute top-2 left-2" variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className={cn("font-semibold text-base sm:text-lg mb-1 break-words", dir === "rtl" && "text-right")}>
                          {dir === "rtl" ? item.product.nameAr : item.product.nameEn}
                        </h3>
                        
                        {item.product.category && (
                          <p className={cn("text-sm text-muted-foreground mb-2", dir === "rtl" && "text-right")}>
                            {dir === "rtl" ? item.product.category.nameAr : item.product.category.nameEn}
                          </p>
                        )}

                        {/* Price */}
                        {item.product.isPriceActive && finalPrice !== null && (
                          <div className={cn("flex items-center gap-2 mb-3", dir === "rtl" && "flex-row-reverse justify-end")}>
                            <span className="text-xl font-bold text-primary">
                              ${finalPrice.toFixed(2)}
                            </span>
                            {hasDiscount && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${parseFloat(item.product.price!).toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Stock Status */}
                        {isOutOfStock && (
                          <Badge variant="destructive" className="mb-2">
                            {dictionary.cart.outOfStock}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className={cn("flex flex-wrap gap-2 mt-auto", dir === "rtl" && "flex-row-reverse")}>
                        <Button
                          onClick={() => handleMoveToCart(item.productId)}
                          disabled={loading === item.productId || isOutOfStock}
                          className="flex-1 sm:flex-none"
                          size="sm"
                        >
                          <ShoppingCart className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                          {loading === item.productId
                            ? (dir === "rtl" ? "جاري الإضافة..." : "Adding...")
                            : dictionary.wishlist.moveToCart}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setItemToRemove(item.productId)}
                          disabled={removing === item.productId}
                          className="flex-1 sm:flex-none"
                        >
                          <Trash2 className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                          {removing === item.productId
                            ? (dir === "rtl" ? "جاري الحذف..." : "Removing...")
                            : dictionary.common.delete}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={itemToRemove !== null} onOpenChange={() => setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={cn(dir === "rtl" && "text-right")}>
              {dir === "rtl" ? "تأكيد الحذف" : "Confirm Remove"}
            </AlertDialogTitle>
            <AlertDialogDescription className={cn(dir === "rtl" && "text-right")}>
              {dir === "rtl"
                ? "هل أنت متأكد من حذف هذا المنتج من قائمة الأمنيات؟"
                : "Are you sure you want to remove this product from your wishlist?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={cn(dir === "rtl" && "flex-row-reverse")}>
            <AlertDialogCancel>{dictionary.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={() => itemToRemove && handleRemove(itemToRemove)}>
              {dictionary.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
