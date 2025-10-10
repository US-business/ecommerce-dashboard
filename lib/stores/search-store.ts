import { create } from "zustand"

interface SearchStore {
    query: string
    categoryId: number
    selectedBrands: string[]
    priceRange: [number, number]
    sortBy: "newest" | "oldest" | "priceLowHigh" | "priceHighLow"
    numberOfProducts: string
    inStockOnly: boolean
    outOfStockOnly: boolean
    onSaleOnly: boolean
    page: number
    total: number
    setQuery: (q: string) => void
    setCategoryId: (id: number) => void
    toggleBrand: (brand: string) => void
    setPriceRange: (range: [number, number]) => void
    setSortBy: (sort: "newest" | "oldest" | "priceLowHigh" | "priceHighLow") => void
    setNumberOfProducts: (num: string) => void
    setInStockOnly: (value: boolean) => void
    setOutOfStockOnly: (value: boolean) => void
    setOnSaleOnly: (value: boolean) => void
    setPage: (p: number) => void
    setTotal: (t: number) => void
    clearFilters: () => void
}

export const useSearchStore = create<SearchStore>((set, get) => ({
    query: "",
    categoryId: 0,
    selectedBrands: [],
    priceRange: [0, 1000000],
    sortBy: "newest",
    numberOfProducts: "12",
    inStockOnly: false,
    outOfStockOnly: false,
    onSaleOnly: false,
    page: 1,
    total: 0,

    setQuery: (q) => set({ query: q, page: 1 }),
    setCategoryId: (id) => set({ categoryId: id, page: 1 }),
    toggleBrand: (brand) => set((state) => ({
        selectedBrands: state.selectedBrands.includes(brand)
            ? state.selectedBrands.filter((b) => b !== brand)
            : [...state.selectedBrands, brand],
        page: 1
    })),
    setPriceRange: (range) => set({ priceRange: range, page: 1 }),
    setSortBy: (sort) => set({ sortBy: sort, page: 1 }),
    setNumberOfProducts: (num) => set({ numberOfProducts: num, page: 1 }),
    setInStockOnly: (value) => set({ inStockOnly: value, outOfStockOnly: value ? false : get().outOfStockOnly, page: 1 }),
    setOutOfStockOnly: (value) => set({ outOfStockOnly: value, inStockOnly: value ? false : get().inStockOnly, page: 1 }),
    setOnSaleOnly: (value) => set({ onSaleOnly: value, page: 1 }),
    setPage: (p) => set({ page: p }),
    setTotal: (t) => set({ total: t }),
    clearFilters: () => set({
        query: "",
        categoryId: 0,
        selectedBrands: [],
        priceRange: [0, 1000000],
        sortBy: "newest",
        numberOfProducts: "12",
        inStockOnly: false,
        outOfStockOnly: false,
        onSaleOnly: false,
        page: 1,
        total: 0,
    })
}))
