"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Button } from "@/components/ui/button"
import { ProductProps } from "@/types/product"
import { getAllProductsActions } from "@/lib/actions/products"
import { Search, X, Package } from "lucide-react"

export function SearchBar({ dir }: { dir: "rtl" | "ltr" }) {
   const router = useRouter()
   const [products, setProducts] = useState<ProductProps[]>([])
   const [search, setSearch] = useState("")
   const [isSearching, setIsSearching] = useState(false)
   const searchInputRef = useRef<HTMLInputElement>(null)
   const debounceRef = useRef<NodeJS.Timeout>(null)

   const loadProducts = async (searchTerm: string) => {
      if (!searchTerm.trim()) {
         setProducts([])
         return
      }
      setIsSearching(true)
      try {
         const result = await getAllProductsActions(1, 10, searchTerm, true)
         if (result.success && result.data) setProducts(result.data)
      } catch {
         setProducts([])
      } finally {
         setIsSearching(false)
      }
   }

   useEffect(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => loadProducts(search), 300)
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
   }, [search])

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`)
   }

   const handleProductClick = (productId: string) => {
      router.push(`/products/${productId}`)
      setSearch("")
      setProducts([])
      searchInputRef.current?.focus()
   }

   return (
      <div className="relative w-full max-w-md">
         <form onSubmit={handleSearchSubmit} className="relative">
            <Input
               ref={searchInputRef}
               type="text"
               placeholder={dir === "rtl" ? "البحث عن المنتجات..." : "Search products..."}
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pr-10 pl-4"
               dir={dir}
            />
            <Button
               type="submit"
               variant="ghost"
               size="icon"
               className={`absolute ${dir === "rtl" ? "left-2" : "right-2"} top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-accent`}
            >
               <Search className="h-4 w-4" />
            </Button>
            {search && (
               <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                     setSearch("")
                     setProducts([])
                     searchInputRef.current?.focus()
                  }}
                  className={`absolute ${dir === "rtl" ? "left-10" : "right-10"}  top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-accent`}
               >
                  <X className="h-3 w-3" />
               </Button>
            )}
         </form>

         {/* نتائج البحث */}
         {search.trim() && (
            <div className="absolute z-50 w-full bg-background border mt-1 rounded-md max-h-96 overflow-y-auto shadow-md">
               {isSearching ? (
                  <div className="p-4 text-center">
                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                     <p className="text-sm text-muted-foreground mt-2">{dir === "rtl" ? "جاري البحث..." : "Searching..."}</p>
                  </div>
               ) : products.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                     {dir === "rtl" ? "لا توجد منتجات" : "No products found"}
                  </div>
               ) : (
                  products.map((product: any) => (
                     <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                     >
                        <div className="flex-shrink-0">
                           {product.image ? (
                              <img src={product.image} alt={dir === "rtl" ? product.nameAr : product.nameEn} className="w-12 h-12 rounded object-cover" />
                           ) : (
                              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                 <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                           )}
                        </div>
                        <div className={cn("flex-1", dir === "rtl" && "text-right")}>
                           <div className="font-medium text-sm line-clamp-1">{dir === "rtl" ? product.nameAr : product.nameEn}</div>
                           {product.brand && <div className="text-xs text-muted-foreground line-clamp-1">{product.brand}</div>}
                           {product.price && <div className="text-xs font-semibold text-primary">${product.price}</div>}
                        </div>
                     </div>
                  ))
               )}
            </div>
         )}
      </div>
   )
}
