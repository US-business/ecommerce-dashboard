"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, X, Grid, List, ChevronsUpDown, Check, RotateCcw } from "lucide-react"
import { Input } from "@/components/shadcnUI/input"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import Image from "next/image"
import Link from "next/link"
import { useAppStore, useI18nStore } from "@/lib/stores"

// Import the server action
import { getAllBrands, getAllProductsActions, searchProductsAction } from "@/lib/actions/products" // <-- السيرفر أكشن
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { Slider } from "@/components/shadcnUI/slider"
import ChooseCategory from "./_ChooseCategory."
import { getCategories } from "@/lib/actions/categories"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcnUI/sheet"
import AsideBar from "@/components/layout/AsideBar"
import { Collapsible } from "@/components/ui/Collapsible"
import {
    //   Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/shadcnUI/collapsible"
import ChooseBrand from "./_ChooseBrand"
import { Switch } from "@/components/shadcnUI/switch"
import { Label } from "@/components/shadcnUI/label"
import SwitchButton from "@/components/ui/SwitchButton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcnUI/popover"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/shadcnUI/command"
import { cn } from "@/lib/utils"
import { Jersey_20_Charted, Just_Me_Again_Down_Here } from "next/font/google"
import { relDuration } from "drizzle-orm/gel-core"


export interface Filters {
    categories: string[];
    brand: string[];
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
    brand: string[];
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
    const searchParams = useSearchParams()
    const q = searchParams.get("q") || ""
    const [query, setQuery] = useState(q)
    const [products, setProducts] = useState<Product[]>([])



    const { isLoadingPage, setIsLoadingPage } = useAppStore()

    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)

    const [categoryId, setCategoryId] = useState<number>(0)

    const [brand, setBrand] = useState("all")
    const [priceRange, setPriceRange] = useState([0, 10000])
    const [sortBy, setSortBy] = useState("newest")
    const [numberOfProducts, setNumberOfProducts] = useState("12")
    const [categories, setCategories] = useState([])

    const debounceRef = useRef<NodeJS.Timeout>(null)
    const [brands, setBrands] = useState<string[]>([])

    const [selectedBrands, setSelectedBrands] = useState<string[]>([])

    const [inStockOnly, setInStockOnly] = useState(false)
    const [outOfStockOnly, setOutOfStockOnly] = useState(false)
    const [onSaleOnly, setOnSaleOnly] = useState(false)



    const handleBrandToggle = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        )
    }


    useEffect(() => {
        if (!q.trim()) return
        const fetchData = async () => {
            const result = await searchProductsAction({
                query: q,
                page: 1,
                limit: 20,
                category: categoryId !== 0 ? categoryId : undefined,
                brand: selectedBrands.length > 0 ? selectedBrands : undefined,
                minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
                maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
                inStockOnly,
                outOfStockOnly,
                onSaleOnly,
                sortBy: sortBy as "newest" | "oldest" | "priceLowHigh" | "priceHighLow",
            })
            if (result.success) {
                setProducts(result.data as any[])
                setTotal(result.total)
            }
        }
        fetchData()
    }, [q])

    // Live search with debounce
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => handleSearch(), 300)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [query, page, categoryId, selectedBrands, brands, priceRange, sortBy, numberOfProducts, inStockOnly, outOfStockOnly, onSaleOnly])


    const fetchBrandsAndCategories = async () => {
        const resultBrands = await getAllBrands()
        if (resultBrands?.success && resultBrands?.data) {
            setBrands(resultBrands.data)
            console.log("brands", brands);
        }
        const resultCategories = await getCategories()
        if (resultCategories?.success && resultCategories?.data) {
            setCategories(resultCategories?.data as any)
            console.log(categories);
        }
    }
    useEffect(() => {
        fetchBrandsAndCategories()
    }, [])
    const handleSearch = async () => {
        setIsLoadingPage(true)
        try {
            const res = await searchProductsAction({
                query,
                page,
                limit: numberOfProducts === "all" ? total : Number(numberOfProducts),
                sortBy: sortBy as "newest" | "oldest" | "priceLowHigh" | "priceHighLow",
                category: categoryId !== 0 ? categoryId : undefined,
                brand: selectedBrands.length > 0 ? selectedBrands : undefined,  // ← array بدل string
                minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
                maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
                inStockOnly,
                outOfStockOnly,
                onSaleOnly,
            })
            if (res.success) {
                setProducts(res.data as any[])
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

    const clearFilters = async () => {
        setCategoryId(0)
        setBrand("all")
        setPriceRange([0, 10000])
        setSortBy("newest")
        setSelectedBrands([])
        setInStockOnly(false)
        setOutOfStockOnly(false)
        setOnSaleOnly(false)
        setQuery("")
        setPage(1)
        setTotal(0)
        setProducts([])
    }


    return (
        <div className="min-h-screen bg-background pt-12">
            <div className="container mx-auto px-4 flex">

                <AsideBar title={t("search.filter")} iconLeft={<Filter className="h-4 w-4 " />}>

                    <Button variant="outline" size="sm"
                        onClick={clearFilters}
                        className="text-sm flex items-center group"
                    >
                        <RotateCcw className="h-3 w-3 mr-1 group-hover:animate-spin " />
                        Clear All
                    </Button>

                    {/* Sort By */}
                    <Collapsible title={t("search.sortBy")}>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("search.sortBy")} />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectItem value="newest">{t("search.newest")}</SelectItem>
                                <SelectItem value="oldest">{t("search.oldest")}</SelectItem>
                                <SelectItem value="priceLowHigh">{t("search.priceLowHigh")}</SelectItem>
                                <SelectItem value="priceHighLow">{t("search.priceHighLow")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </Collapsible>

                    <Collapsible title={t("categories.title")}>
                        <ChooseCategory
                            locale={locale}
                            defaultValue={t("search.all")}
                            value={categoryId.toString()}
                            categories={categories}
                            onChange={(value) => setCategoryId(parseInt(value))} />
                    </Collapsible>
                    <Collapsible title={t("products.brand")}>
                        <ChooseBrand
                            brands={brands}
                            selectedBrands={selectedBrands}
                            onChange={handleBrandToggle}
                        />
                    </Collapsible>
                    {/* Price Range */}
                    <Collapsible title={t("products.price")}>
                        <div className="px-2 my-4 flex flex-col gap-2">
                            <Slider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                max={10000}
                                min={0}
                                step={10}
                                className="mb-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground ">
                                <span>{priceRange[0]} LE</span>
                                <span>{priceRange[1]} LE</span>
                            </div>
                            <div className="flex justify-between">
                                <Input
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                    className="w-20"
                                />
                                <Input
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="w-20"
                                />
                            </div>
                        </div>
                    </Collapsible>

                    <Collapsible title={t("search.availability")}>
                        <div className="flex flex-col items-center gap-6 mb-4">
                            {/* On Sale Switch */}
                            <div className="flex items-center justify-between w-full">
                                <Label htmlFor="onSaleOnly">{t("search.onSale")}</Label>
                                <Switch id="onSaleOnly"
                                    checked={onSaleOnly}
                                    onCheckedChange={(checked) => {
                                        setOnSaleOnly(checked)
                                        if (!checked) setInStockOnly(false) // لمنع التداخل
                                    }}
                                />
                            </div>

                            {/* In Stock Switch */}
                            <div className="flex items-center justify-between w-full">
                                <Label htmlFor="inStockOnly">{t("search.inStock")}</Label>
                                <Switch id="inStockOnly"
                                    checked={inStockOnly}
                                    onCheckedChange={(checked) => {
                                        setInStockOnly(checked)
                                        if (!checked) setOutOfStockOnly(false) // لمنع التداخل
                                    }}
                                />
                            </div>

                            {/* Out Of Stock Switch */}
                            <div className="flex items-center justify-between w-full">
                                <Label htmlFor="outOfStockOnly">{t("search.outOfStock")}</Label>
                                <Switch id="outOfStockOnly"
                                    checked={outOfStockOnly}
                                    onCheckedChange={(checked) => {
                                        setOutOfStockOnly(checked)
                                        if (!checked) setInStockOnly(false) // لمنع التداخل
                                    }}
                                />
                            </div>
                        </div>
                    </Collapsible>


                </AsideBar>





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

