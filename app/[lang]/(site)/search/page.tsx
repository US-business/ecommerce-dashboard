"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, X, Grid, List, RotateCcw } from "lucide-react"
import { Input } from "@/components/shadcnUI/input"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { useAppStore, useI18nStore } from "@/lib/stores"
import { getAllBrands, getAllProductsActions, searchProductsAction } from "@/lib/actions/products"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { getCategories } from "@/lib/actions/categories"
import { useSearchStore } from "@/lib/stores/search-store" // <- store اللي عملناه
import ReusablePagination from "@/components/ui/ReusablePagination"
import SearchFilters from "@/components/layout/SearchFilters"
import ProductCard from "@/components/ui/ProductCard/ProductCard"

interface Product {
    id: number
    nameEn: string
    nameAr: string
    slug: string
    sku: string
    price: string
    image?: string
    brand: string[]
    status: string
    isFeatured: boolean
    quantityInStock: number
    category?: {
        id: number
        nameEn: string
        nameAr: string
    }
}

export default function SearchPage() {
    const { t, locale, dir } = useI18nStore()
    const router = useRouter()
    const searchParams = useSearchParams()
    const q = searchParams.get("q") || ""
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    const { isLoadingPage, setIsLoadingPage } = useAppStore()
    const debounceRef = useRef<NodeJS.Timeout>(null)

    const searchStore = useSearchStore(state => state)

    const {
        query, setQuery,
        categoryId, setCategoryId,
        selectedBrands, toggleBrand,
        priceRange, setPriceRange,
        sortBy, setSortBy,
        numberOfProducts, setNumberOfProducts,
        inStockOnly, setInStockOnly,
        outOfStockOnly, setOutOfStockOnly,
        onSaleOnly, setOnSaleOnly,
        page, setPage,
        total, setTotal,
        clearFilters
    } = searchStore

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [brands, setBrands] = useState<string[]>([])


    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllProductsActions(
                1,
                20,
                q, // ممكن تكون فاضية ""
                false,
                categoryId || undefined
            )
            if (result.total && result.success && result.data) {
                setProducts(result.data as any[])
                setTotal(result.total)
            }
        }
        fetchData()
    }, [q, categoryId])


    // fetch brands and categories
    const fetchBrandsAndCategories = async () => {
        const resultBrands = await getAllBrands()
        if (resultBrands?.success && resultBrands.data) setBrands(resultBrands.data)

        const resultCategories = await getCategories()
        if (resultCategories?.success && resultCategories.data) setCategories(resultCategories.data)
    }

    useEffect(() => { fetchBrandsAndCategories() }, [])

    const handleSearch = async () => {
        setIsLoadingPage(true)
        try {
            const res = await searchProductsAction({
                query,
                page,
                limit: numberOfProducts === "all" ? total : Number(numberOfProducts),
                sortBy: sortBy as "newest" | "oldest" | "priceLowHigh" | "priceHighLow",
                category: categoryId !== 0 ? categoryId : undefined,
                brand: selectedBrands.length > 0 ? selectedBrands : undefined,
                minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
                maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
                inStockOnly,
                outOfStockOnly,
                onSaleOnly,
            })
            if (res.success && res.data) {
                setProducts(res.data as any[])
                setTotal(res.total)
            }
        } catch (error) {
            console.error("Search error:", error)
        } finally {
            setIsLoadingPage(false)
        }
    }

    // Live search debounce
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => handleSearch(), 300)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [query, page, categoryId, selectedBrands, priceRange, sortBy, numberOfProducts, inStockOnly, outOfStockOnly, onSaleOnly])

    // Initialize query from searchParams
    useEffect(() => { if (q) setQuery(q) }, [q])

    const getProductName = (product: Product) => locale === "ar" ? product.nameAr : product.nameEn
    const getCategoryName = (category: any) => locale === "ar" ? category.nameAr : category.nameEn




    // derive pageSize and totalPages
    const pageSize = numberOfProducts === "all" ? total : Number(numberOfProducts || 12);
    const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));
    const showPagination = numberOfProducts !== "all" && total > pageSize;





    return (
        <div className="min-h-screen bg-background pt-12">
            <div className="container mx-auto px-4 flex">
                {/* Sidebar Filters */}
                <SearchFilters
                    classNames='hidden lg:flex'
                    t={t}
                    locale={locale}
                    categories={categories}
                    brands={brands}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    selectedBrands={selectedBrands}
                    toggleBrand={toggleBrand}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    inStockOnly={inStockOnly}
                    setInStockOnly={setInStockOnly}
                    outOfStockOnly={outOfStockOnly}
                    setOutOfStockOnly={setOutOfStockOnly}
                    onSaleOnly={onSaleOnly}
                    setOnSaleOnly={setOnSaleOnly}
                    clearFilters={clearFilters}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {/* Search Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-4">{t("search.title")}</h1>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder={t("search.placeholder")}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </form>

                        {/* Results Info */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-blue-900 px-5 py-1 rounded-md bg-blue-100 border border-blue-300">{t("search.productsFound")} : {total}</p>


                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium ">{t("search.show")}</label>
                                    <Select value={numberOfProducts} onValueChange={setNumberOfProducts}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("common.numberOfProducts")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="12">12</SelectItem>
                                            <SelectItem value="24">24</SelectItem>
                                            <SelectItem value="36">36</SelectItem>
                                            <SelectItem value="48">48</SelectItem>
                                            <SelectItem value="60">60</SelectItem>
                                            <SelectItem value="all">{t("search.all")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid/List */}
                    {isLoadingPage ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <div className="aspect-square bg-muted rounded-t-lg" />
                                    <CardContent className="p-4">
                                        <div className="h-4 bg-muted rounded mb-2" />
                                        <div className="h-4 bg-muted rounded w-2/3" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div
                            className={
                                viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-4"
                            }
                        >
                            {products?.map((product : any ) => (
                                    <ProductCard product={product} dir={dir}  />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{t("search.noResults")}</h3>
                            <p className="text-muted-foreground">{t("search.tryDifferent")}</p>
                        </div>
                    )}


                    {/* Pagination */}
                    {showPagination && (
                        <ReusablePagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            nextLabel={t("common.next")}
                            previousLabel={t("common.previous")}
                            dir={dir}
                        />
                    )}




                </main>
            </div>
        </div>
    )
}





