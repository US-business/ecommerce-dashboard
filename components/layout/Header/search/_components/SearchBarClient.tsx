"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ProductProps } from "@/types/product"
import { getAllProductsActions } from "@/lib/actions/products"
import { useI18nStore, useSearchStore } from "@/lib/stores"
import { CategorySelector } from "./CategorySelector"
import { SearchInput } from "./SearchInput"
import { SearchResults } from "./SearchResults"
import { cn } from "@/lib/utils"

type Category = {
  id: number
  nameEn: string
  nameAr: string
}

type Props = {
  categories: Category[] | undefined
}

export function SearchBarClient({ categories }: Props) {
  const router = useRouter()
  const { t, dir } = useI18nStore()

  const [products, setProducts] = useState<ProductProps[]>([])
  const [search, setSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>(null)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { setCategoryId, setTotal } = useSearchStore()

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

  // Escape لإغلاق البحث
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearch("")
        setProducts([])
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // useEffect للبحث مع debounce + تغيير الكاتجوري
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(
      () =>
        fetchProducts(
          search,
          selectedCategory ? Number(selectedCategory) : undefined
        ),
      300
    )
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
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
    <div className={cn("relative overflow-hidden flex items-center w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl border-0 rounded-md shadow-sm")}>
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        dir={dir}
        t={t}
      />

      <SearchInput
        search={search}
        setSearch={setSearch}
        setProducts={setProducts}
        searchInputRef={searchInputRef}
        dir={dir}
        onSubmit={handleSearchSubmit}
      />

      <SearchResults
        search={search}
        isSearching={isSearching}
        products={products}
        dir={dir}
        onProductClick={handleProductClick}
      />
    </div>
  )
}
