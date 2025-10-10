"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "../shadcnUI/input"
import { Button } from "@/components/shadcnUI/button"
import { ProductProps } from "@/types/product"
import { getAllProductsActions } from "@/lib/actions/products"
import { Search, X, Package } from "lucide-react"
import { useAppStore, useI18nStore, useSearchStore } from "@/lib/stores"
import { getCategories } from "@/lib/actions/categories"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"

type Props = {
  categories: any[] | undefined
}

export function SearchBar({ categories }: Props) {
  const router = useRouter()
  const { t, dir } = useI18nStore()

  const [products, setProducts] = useState<ProductProps[]>([])
  const [search, setSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>(null)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  // const [categories, setCategories] = useState<{ id: number; nameEn: string; nameAr: string }[]>([])

  const { setCategoryId, query, setTotal } = useSearchStore()

  // جلب المنتجات حسب البحث والكاتجوري
  const fetchProducts = async (searchTerm: string, categoryId?: number) => {
    if (!searchTerm.trim() && !categoryId) {
      setProducts([])
      return
    }

    setIsSearching(true)
    try {
      const res = await getAllProductsActions(
        1,
        20,
        searchTerm,
        false,
        categoryId
      )

      if (res.success && res.data && res.total) {
        setProducts(res.data)
        setTotal(res.total)
      }
    } catch {
      setProducts([])
    } finally {
      setIsSearching(false)
    }
  }

  // عند اختيار الكاتجوري
  const handleCategorySelect = (id: number) => {
    setSelectedCategory(id.toString())
    setCategoryId(id)
    fetchProducts(search, id)
  }

  // useEffect لجلب الكاتجوري
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await getCategories()
  //       if (res?.success) setCategories(res.data as any[])
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }
  //   fetchCategories()
  // }, [])

  // Escape لإغلاق البحث
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearch("")
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])


  // useEffect للبحث مع debounce + تغيير الكاتجوري
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchProducts(search, selectedCategory ? Number(selectedCategory) : undefined), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search, selectedCategory])

  // عند الضغط على زر البحث
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const queryParams = new URLSearchParams()
    if (search.trim()) queryParams.set("q", search.trim())
    if (selectedCategory) queryParams.set("category", selectedCategory)

    router.push(`/search?${queryParams.toString()}`)
    setProducts([])
    setSearch("")
  }

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
    setSearch("")
    setProducts([])
    searchInputRef.current?.focus()
  }

  return (
    <div className="relative flex items-center w-full max-w-none xl:min-w-[500px] border rounded-md">
      {/* قائمة الكاتجوري */}
      <Select
        value={selectedCategory ?? undefined}
        onValueChange={(v) => handleCategorySelect(Number(v))}
        dir={dir}
      >
        <SelectTrigger className="min-w-[70px] border-0 border-r rounded-none focus:ring-0 focus:border-0 outline-none shadow-none">
          <SelectValue placeholder={dir === "rtl" ? "الكل" : "All"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"0"} id={"0"}>
            {t("search.all")}
          </SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {dir === "rtl" ? category.nameAr : category.nameEn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* حقل البحث */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center flex-1">
        <input
          ref={searchInputRef}
          type="text"
          placeholder={dir === "rtl" ? "البحث عن المنتجات..." : "Search products..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pr-10 pl-4 border-0 focus:ring-0 focus:border-0 outline-none"
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
            className={`absolute ${dir === "rtl" ? "left-10" : "right-10"} top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-accent`}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </form>

      {/* نتائج البحث */}
      {search.trim() && (
        <div className="absolute top-full z-50 w-full bg-background border mt-1 rounded-md max-h-96 overflow-y-auto shadow-md">
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
































