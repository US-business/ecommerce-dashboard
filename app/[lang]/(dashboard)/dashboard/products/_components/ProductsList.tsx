"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { deleteProduct } from "@/lib/actions/products"
import { ProductsHeader } from "./ProductsHeader"
import { ProductsSearch } from "./ProductsSearch"
import { ProductsTable } from "./ProductsTable"
import { DeleteProductDialog } from "./DeleteProductDialog"

interface Product {
  id: number
  nameEn: string
  nameAr: string
  slug: string
  sku: string
  price: string
  quantityInStock: number
  status: "normal" | "new" | "coming_soon" | "on_sale" | "best_seller"
  color?: string
  isFeatured: boolean
  brand?: string
  images: string[]
  descriptionEn: string
  descriptionAr: string
  tags?: string
  createdAt: Date
  category?: {
    id: number
    nameEn: string
    nameAr: string
  }
}

interface ProductsListProps {
  initialProducts: Product[]
  dictionary: any
  currentPage: number
  totalPages: number
  totalProducts: number
  limit: number
  sortBy: string
  sortOrder: string
}

export function ProductsList({
  initialProducts,
  dictionary,
  currentPage,
  totalPages,
  totalProducts,
  limit,
  sortBy,
  sortOrder
}: ProductsListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  // Update products when initialProducts change
  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search)
      if (search) {
        searchParams.set("search", search)
        searchParams.set("page", "1")
      } else {
        searchParams.delete("search")
      }
      setIsNavigating(true)
      router.push(`${pathname}?${searchParams.toString()}`)
    }, 500)

    return () => clearTimeout(handler)
  }, [search, router, pathname])

  const handleAddProduct = () => {
    router.push("/dashboard/products/create")
  }

  const updateSearchParams = (key: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set(key, value)
    setIsNavigating(true)
    router.push(`${pathname}?${searchParams.toString()}`)
  }

  const handlePageChange = (page: number) => {
    updateSearchParams("page", page.toString())
  }

  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc'
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set("sortBy", column)
    searchParams.set("sortOrder", newSortOrder)
    setIsNavigating(true)
    router.push(`${pathname}?${searchParams.toString()}`)
  }

  const handleView = (id: number) => {
    router.push(`/dashboard/products/${id}`)
  }

  const handleEdit = (id: number) => {
    router.push(`/dashboard/products/${id}/edit`)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const result = await deleteProduct(deleteId)
      if (result.success) {
        setProducts(products.filter(p => p.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <ProductsHeader
          dictionary={dictionary}
          onAddProduct={handleAddProduct}
        />

        <ProductsSearch
          dictionary={dictionary}
          search={search}
          isNavigating={isNavigating}
          onSearchChange={setSearch}
        />

        <ProductsTable
          products={products}
          dictionary={dictionary}
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={totalProducts}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={setDeleteId}
          onSort={handleSort}
          onPageChange={handlePageChange}
        />
      </div>

      <DeleteProductDialog
        isOpen={!!deleteId}
        isDeleting={deleting}
        dictionary={dictionary}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}
