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
import ChooseCategory from "./_ChooseCategory."
import { getCategories } from "@/lib/actions/categories"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import AsideBar from "@/components/layout/AsideBar"
import { Collapsible } from "@/components/layout/Collapsible"
import {
    //   Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible"


export interface Filters {
    categories: string[];
    brands: string[];
    priceRange: [number, number];
    inStockOnly: boolean;
    onSaleOnly: boolean;
    tags: string[];
    sortBy: string;
}

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

    const [filteredProducts, setFilteredProducts] = useState();


    const { isLoadingPage, setIsLoadingPage } = useAppStore()

    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)

    const [categoryId, setCategoryId] = useState<number>(0)

    const [brand, setBrand] = useState("all")
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [sortBy, setSortBy] = useState("newest")
    const [numberOfProducts, setNumberOfProducts] = useState("12")
    const [categories, setCategories] = useState([])







    const debounceRef = useRef<NodeJS.Timeout>(null)

    // Live search with debounce
    useEffect(() => {

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => handleSearch(), 300)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [query, page, categoryId, brand, priceRange, sortBy, numberOfProducts])

    const handleSearch = async () => {
        setIsLoadingPage(true)

        try {
            const result = await getCategories()
            if (result.success && result?.data) {
                setCategories(result?.data as any)
                console.log(categories);
            }


            const res = await searchProductsAction({
                query,
                page,
                limit: numberOfProducts === "all" ? total : Number(numberOfProducts),

                sortBy: sortBy as "newest" | "oldest" | "priceLowHigh" | "priceHighLow",
                category: categoryId !== 0 ? categoryId : undefined,
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
        setCategoryId(0)

        setBrand("all")
        setPriceRange([0, 1000])
        setSortBy("newest")
    }


    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 flex">
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
                        <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="h-4 w-4 mr-2" />
                            {t("search.filters")}
                        </Button>
                    </form>

                    {/* Results Info */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-blue-900 px-5 py-1 rounded-md bg-blue-100 border border-blue-300">{t("search.results")} : {total}</p>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium ">{t("common.show")}</label>
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
                                        <SelectItem value="all">{t("common.all")}</SelectItem>
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

                {/* Filters Panel */}
                {showFilters && (
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">{t("search.filters")}</h3>
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    <X className="h-4 w-4 mr-2" />
                                    {t("search.clear")}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Category Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t("categories.category")}</label>
                                    <Select value={categoryId.toString()} onValueChange={(value) => setCategoryId(parseInt(value))}>

                                        <SelectTrigger>
                                            <SelectValue placeholder={t("categories.allCategories")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t("categories.allCategories")}</SelectItem>
                                            <SelectItem value="1">Electronics</SelectItem>
                                            <SelectItem value="2">Clothing</SelectItem>
                                            <SelectItem value="3">Home & Garden</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Brand Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t("products.brand")}</label>
                                    <Select value={brand} onValueChange={setBrand}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("products.allBrands")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t("products.allBrands")}</SelectItem>
                                            <SelectItem value="Apple">Apple</SelectItem>
                                            <SelectItem value="Samsung">Samsung</SelectItem>
                                            <SelectItem value="Nike">Nike</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t("common.priceRange")}</label>
                                    <div className="px-2">
                                        <Slider
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                            max={1000}
                                            min={0}
                                            step={10}
                                            className="mb-2"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t("common.sortBy")}</label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("common.sortBy")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">{t("common.newest")}</SelectItem>
                                            <SelectItem value="oldest">{t("common.oldest")}</SelectItem>
                                            <SelectItem value="priceLowHigh">{t("common.priceLowHigh")}</SelectItem>
                                            <SelectItem value="priceHighLow">{t("common.priceHighLow")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}



                <AsideBar title={t("common.search")}>
                    <Collapsible title={t("categories.title")}>
                        <ChooseCategory
                            locale={locale}
                            categoryId={categoryId}
                            categories={categories}
                            onChange={(value) => setCategoryId(parseInt(value))} />
                    </Collapsible>
                </AsideBar>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
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
                                viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
                            }
                        >
                            {products.map((product) => (
                                <Card key={product.id} className={viewMode === "list" ? "flex" : ""}>
                                    <Link href={`/products/${product.id}`} className="block">
                                        <div className={viewMode === "list" ? "flex" : ""}>
                                            <div className={viewMode === "list" ? "w-48 h-48" : "aspect-square"}>
                                                <Image
                                                    src={product.image || `/placeholder.svg?height=300&width=300&query=${getProductName(product)}`}
                                                    alt={getProductName(product)}
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-full object-cover rounded-t-lg"
                                                />
                                            </div>
                                            <CardContent className={viewMode === "list" ? "flex-1 p-4" : "p-4"}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold line-clamp-2">{getProductName(product)}</h3>
                                                    {product.isFeatured && (
                                                        <Badge variant="secondary" className="ml-2">
                                                            {t("common.featured")}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {product.brand && <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>}

                                                {product.category && (
                                                    <p className="text-xs text-muted-foreground mb-2">{getCategoryName(product.category)}</p>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold">${product.price}</span>
                                                    <Badge variant={product.quantityInStock > 0 ? "default" : "destructive"}>
                                                        {product.quantityInStock > 0
                                                            ? t("common.inStock")
                                                            : t("common.outOfStock")}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Link>
                                </Card>
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
                    {total > 12 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex gap-2">
                                <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                                    {t("common.previous")}
                                </Button>
                                <span className="flex items-center px-4">
                                    {t("common.pageOf")} {page} - {t("common.total")} {Math.ceil(total / 12)}
                                </span>
                                <Button variant="outline" disabled={page >= Math.ceil(total / 12)} onClick={() => setPage(page + 1)}>
                                    {t("common.next")}
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

