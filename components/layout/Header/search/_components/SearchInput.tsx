"use client"

import { Button } from "@/components/shadcnUI/button"
import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"
import { RefObject } from "react"

type Props = {
  search: string
  setSearch: (value: string) => void
  setProducts: (products: any[]) => void
  searchInputRef: RefObject<HTMLInputElement | null>
  dir: "ltr" | "rtl"
  onSubmit: (e: React.FormEvent) => void
}

export function SearchInput({
  search,
  setSearch,
  setProducts,
  searchInputRef,
  dir,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="relative flex items-center flex-1">
      <input
        ref={searchInputRef}
        type="text"
        placeholder={dir === "rtl" ? "البحث عن المنتجات..." : "Search products..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={cn("w-full h-9 pr-10 pl-4 border-0 focus:ring-0 focus:border-0 outline-none text-sm md:text-base",
          "bg-amber-50"
        )}
        dir={dir}
      />

      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className={cn(`absolute ${dir === "rtl" ? "left-2" : "right-2"}`,
          " top-1/2 transform -translate-y-1/2 h-6 w-6 cursor-pointer",
          " text-white hover:text-white bg-amber-600 hover:bg-amber-700"
        )}
      >
        <Search className="h-3 w-3 md:h-4 md:w-4" />
      </Button>

      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            setSearch("")
            setProducts([])
            searchInputRef.current?.focus()
          }}
          className={`absolute ${dir === "rtl" ? "left-10" : "right-10"} top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-accent`}
        >
          <X className="h-3 w-3 md:h-3.5 md:w-3.5" />
        </Button>
      )}
    </form>
  )
}
