"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, X, Grid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useAppStore, useI18nStore } from "@/lib/stores"

// Import the server action
import { searchProductsAction } from "@/lib/actions/products" // <-- السيرفر أكشن
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FilterSidebar } from "./FilterSidebar"



interface Product {
    id: number
    nameEn: string
    nameAr: string
    slug: string
    sku: string
    price: string
    image?: string
    brand?: string
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
    const { t, locale } = useI18nStore()
    const router = useRouter()

    const [query, setQuery] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const { isLoadingPage, setIsLoadingPage } = useAppStore()

    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)

    const [category, setCategory] = useState("all")
    const [brand, setBrand] = useState("all")
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [sortBy, setSortBy] = useState("newest")
    const [numberOfProducts, setNumberOfProducts] = useState("12")




    const [searchQuery, setSearchQuery] = useState("");

    const [filteredProducts, setFilteredProducts] = useState();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);






    const debounceRef = useRef<NodeJS.Timeout>(null)

    // Live search with debounce
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => handleSearch(), 300)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
        
    }, [query, page, category, brand, priceRange, sortBy, numberOfProducts])

    const handleSearch = async () => {
        setIsLoadingPage(true)

        try {
            const res = await searchProductsAction({
                query,
                page,
                limit: numberOfProducts === "all" ? total : Number(numberOfProducts),

                sortBy: sortBy as "newest" | "oldest" | "priceLowHigh" | "priceHighLow",
                category: category !== "all" ? category : undefined,
                brand: brand !== "all" ? brand : undefined,
                minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
                maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
            })

            if (res.success) {
                setProducts(res.data as Product[])
                setTotal(res.total)

            }
        } catch (error) {
            console.error("Search error:", error)
        } finally {
            setIsLoadingPage(false)
        }
    }

    const getProductName = (product: Product) => locale === "ar" ? product.nameAr : product.nameEn
    const getCategoryName = (category: any) => locale === "ar" ? category.nameAr : category.nameEn

    const clearFilters = () => {
        setCategory("all")
        setBrand("all")
        setPriceRange([0, 1000])
        setSortBy("newest")
    }

    


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">ProductHub</h1>
                        </div>

                        {/* Mobile filter button */}
                        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="md:hidden">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 p-0">
                                <SheetHeader>
                                    <SheetTitle>Filter Products</SheetTitle>
                                </SheetHeader>
                                <FilterSidebar
                                    filters={filters}
                                    onFiltersChange={setFilters}
                                    onClearAll={clearAllFilters}
                                    isMobile={true}
                                />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-80 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16">
                    <FilterSidebar
                        filters={filters}
                        onFiltersChange={setFilters}
                        onClearAll={clearAllFilters}
                    />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search products..."
                        />
                    </div>

                    {/* Results Summary */}
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                        </p>

                        {/* Active filters indicator */}
                        {(searchQuery || filters.categories.length > 0 || filters.brands.length > 0 ||
                            filters.minRating > 0 || filters.inStockOnly || filters.onSaleOnly ||
                            filters.tags.length > 0) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Clear all filters
                                </Button>
                            )}
                    </div>

                    {/* Product Grid */}
                    <ProductGrid products={filteredProducts} />
                </main>
            </div>
        </div>
    );
}
