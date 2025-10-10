"use client"
import { useEffect } from "react"
import { useAppStore } from "@/lib/stores"

export function AppProvider({ children, initialProducts, initialCategories, initialFeaturedProducts }: any) {
    const { setFeaturedProductsList, setCategories, setProducts } = useAppStore()

    useEffect(() => {
        setFeaturedProductsList(initialFeaturedProducts)
        setCategories(initialCategories)
        setProducts(initialProducts)
    }, [initialProducts, initialCategories, initialFeaturedProducts, setFeaturedProductsList, setCategories, setProducts])

    return <>{children}</>
}