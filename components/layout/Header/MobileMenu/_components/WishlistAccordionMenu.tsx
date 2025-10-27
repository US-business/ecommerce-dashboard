"use client";
import React, { useEffect } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/shadcnUI/button";
import { Badge } from "@/components/shadcnUI/badge";
import { Separator } from "@/components/shadcnUI/separator";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shadcnUI/accordion";
import { useWishlistStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { WishlistItem } from "@/lib/stores/wishlist-store";
import { removeFromWishlist } from "@/lib/actions/wishlist";
import { Trash2 } from "lucide-react";

interface WishlistAccordionMenuProps {
   user: { id: number } | null;
   wishlist: { success: boolean; data: { items: WishlistItem[] } } | any;
   dictionary: any;
   dir: "rtl" | "ltr";
}

const WishlistAccordionMenu = ({ user, wishlist, dictionary, dir }: WishlistAccordionMenuProps) => {
   const router = useRouter();
   const { items, getTotalItems, setItems, removeItem } = useWishlistStore();
   const totalItems = getTotalItems();

   useEffect(() => {
      if (user && wishlist?.success && Array.isArray(wishlist?.data?.items)) {
         const mapped: WishlistItem[] = (wishlist.data?.items ?? []).map((item: any): WishlistItem => ({
            id: Number(item.id),
            productId: Number(item.productId),
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
         }))
         setItems(mapped)
      } else if (!user) {
         setItems([])
      }
   }, [user?.id, wishlist?.success, wishlist?.data?.items, setItems, user])

   const handleViewWishlist = () => {
      if (!user) {
         router.push('/signin')
         return
      }
      router.push('/wishList')
   }

   const handleRemoveItem = async (wishlistItemId: number) => {
      if (!user) return
      
      try {
         await removeFromWishlist(user.id, wishlistItemId)
         removeItem(wishlistItemId)
      } catch (error) {
         console.error("Error removing item from wishlist:", error)
      }
   }

   const handleProductClick = (productId: number) => {
      router.push(`/products/${productId}`)
   }

   return (
      <Accordion type="single" collapsible className="w-full">
         <AccordionItem value="wishlist-menu" className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <AccordionTrigger className={cn(
               "flex items-center hover:bg-slate-50 transition-colors",
               dir === "rtl" && "flex-row-reverse"
            )}>
               <div className={cn(
                  "flex items-center justify-center flex-1 gap-2",
                  dir === "rtl" && "flex-row-reverse"
               )}>
                  <Heart className="h-5 w-5 text-rose-500" />
                  <span className="font-semibold text-slate-700">
                     {dir === "rtl" ? "قائمة الأمنيات" : "Wishlist"}
                  </span>
                  {totalItems > 0 && (
                     <Badge
                        className="h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] font-bold bg-gradient-to-r from-rose-500 to-pink-600 text-white border-0 animate-in fade-in zoom-in"
                     >
                        {totalItems}
                     </Badge>
                  )}
               </div>
            </AccordionTrigger>
            <AccordionContent className="bg-gradient-to-b from-slate-50/50 to-white">
               <div className="p-3">
                  <h3 className={cn(
                     "font-bold text-base mb-3 flex items-center gap-2",
                     dir === "rtl" && "flex-row-reverse"
                  )}>
                     <span>{dir === "rtl" ? "قائمة الأمنيات" : "Wishlist"}</span>
                     {totalItems > 0 && (
                        <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                           {totalItems} {dir === "rtl" ? "منتج" : "items"}
                        </span>
                     )}
                  </h3>
                  {!user ? (
                     <div className="text-center py-8 px-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-50 to-pink-100 mb-4">
                           <Heart className="h-8 w-8 text-rose-500" />
                        </div>
                        <p className="text-slate-600 mb-4 text-sm">
                           {dir === "rtl" ? "سجل دخولك لرؤية قائمة الأمنيات" : "Sign in to view your wishlist"}
                        </p>
                        <Button
                           size="sm"
                           onClick={() => router.push('/signin')}
                           className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all"
                        >
                           {dictionary.common.signIn}
                        </Button>
                     </div>
                  ) : items.length === 0 ? (
                     <div className="text-center py-8 px-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 mb-4">
                           <Heart className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-sm">
                           {dir === "rtl" ? "قائمة الأمنيات فارغة" : "Your wishlist is empty"}
                        </p>
                     </div>
                  ) : (
                     <div>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                           {items.map((item) => (
                              <div key={item.id} className={cn(
                                 "flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group",
                                 dir === "rtl" && "flex-row-reverse"
                              )}>
                                 <div 
                                    className="relative w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden shadow-sm cursor-pointer transition-transform hover:scale-105"
                                    onClick={() => handleProductClick(item.product.id)}
                                 >
                                    {item.product.images?.[0] ? (
                                       <Image
                                          src={item.product.images[0]}
                                          alt={dir === "rtl" ? item.product.nameAr : item.product.nameEn}
                                          fill
                                          className="object-cover"
                                       />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center">
                                          <ShoppingBag className="h-7 w-7 text-slate-300" />
                                       </div>
                                    )}
                                 </div>
                                 <div 
                                    className={cn(
                                       "flex-1 min-w-0 cursor-pointer",
                                       dir === "rtl" && "text-right"
                                    )}
                                    onClick={() => handleProductClick(item.product.id)}
                                 >
                                    <h4 className="text-sm font-semibold truncate text-slate-700 group-hover:text-rose-600 transition-colors">
                                       {dir === "rtl" ? item.product.nameAr : item.product.nameEn}
                                    </h4>
                                    <p className="text-xs font-medium text-rose-600">
                                       {Number(item.product.price).toFixed(2)} EGP
                                    </p>
                                 </div>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                    title={dir === "rtl" ? "حذف" : "Remove"}
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
                  <Separator className="my-4" />
                  <div className="space-y-3">
                     {user && items.length > 0 && (
                        <div className={cn(
                           "flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100",
                           dir === "rtl" && "flex-row-reverse"
                        )}>
                           <span className="text-sm font-semibold text-slate-700">{dir === "rtl" ? "إجمالي المنتجات" : "Total Items"}</span>
                           <span className="font-bold text-rose-600">{totalItems}</span>
                        </div>
                     )}
                     {user && (
                        <Button
                           variant="default"
                           size="sm"
                           onClick={handleViewWishlist}
                           className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all shadow-sm"
                        >
                           {dir === "rtl" ? "عرض قائمة الأمنيات" : "View Wishlist"}
                        </Button>
                     )}
                  </div>
               </div>
            </AccordionContent>
         </AccordionItem>
      </Accordion>
   );
};

export default WishlistAccordionMenu;
