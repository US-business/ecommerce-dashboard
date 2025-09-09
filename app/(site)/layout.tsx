import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { StoreInitializer } from "@/components/providers/store-initializer"
import { getAllProductsActions, searchProductsAction } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import { AppProvider } from "@/components/providers/app-provider"
import { cn } from "@/lib/utils"
import Header from "@/components/layout/Header"
import { Navbar } from "@/components/layout/Header/Navbar"


export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Multilingual e-commerce",
  generator: ''
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {


  // جلب المنتجات والكاتيجوري من السيرفر
  const [productsRes, categoriesRes, featuredProductsRes] = await Promise.all([
    getAllProductsActions(1, 20), // ممكن تختار المنتجات المميزة
    getCategories(),
    getAllProductsActions(1, 20, undefined, false, undefined, true)
  ])

  const products = productsRes.success ? productsRes.data : []
  const categories = categoriesRes.success ? categoriesRes.data : []
  const featuredProducts = featuredProductsRes.success ? featuredProductsRes.data : []




  return (
          <AppProvider initialProducts={products} initialCategories={categories} initialFeaturedProducts={featuredProducts}>
            {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange`
          > */}
              <Navbar />
              <Header />
                {children}
            {/* </ThemeProvider> */}
          </AppProvider>
  )
}
