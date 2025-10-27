"use client"

import { ProductProps } from "@/types/product"
import { ProductItem } from "./ProductItem"
import { LoadingState } from "./LoadingState"
import { EmptyState } from "./EmptyState"

type Props = {
  search: string
  isSearching: boolean
  products: ProductProps[]
  dir: "ltr" | "rtl"
  onProductClick: (productId: string) => void
}

export function SearchResults({
  search,
  isSearching,
  products,
  dir,
  onProductClick,
}: Props) {
  if (!search.trim()) return null

  return (
    <div className="absolute top-full left-0 right-0 z-50 w-full bg-background border mt-1 rounded-md max-h-[300px] md:max-h-96 overflow-y-auto shadow-lg">
      {isSearching ? (
        <LoadingState dir={dir} />
      ) : products.length === 0 ? (
        <EmptyState dir={dir} />
      ) : (
        <div className="divide-y">
          {products.map((product) => (
            <ProductItem
              key={product.id ?? 0}
              product={product}
              dir={dir}
              onClick={onProductClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
