/**
 * Utility functions for Products components
 */

import React from "react"
import { Badge } from "@/components/shadcnUI/badge"

/**
 * Get status badge variant and label for a product status
 */
export function getStatusBadge(status: string, t: (key: string) => string) {
  const variants = {
    new: "default",
    on_sale: "secondary",
    best_seller: "destructive",
    normal: "default",
    coming_soon: "outline",
  } as const

  const statusMap: Record<string, string> = {
    new: "statusNew",
    on_sale: "statusOnSale",
    best_seller: "statusBestSeller",
    coming_soon: "statusComingSoon",
    normal: "statusNormal",
  }

  const statusKey = statusMap[status] || "statusNormal"
  return React.createElement(
    Badge,
    { 
      variant: variants[status as keyof typeof variants],
      className: `${ variants[status as keyof typeof variants] === 'destructive' ? 'text-white' : '' }`
    },
    t(`products.${statusKey}`)
  )
}

/**
 * Get product name based on locale direction
 */
export function getProductName(product: { nameEn: string; nameAr: string }, dir: "ltr" | "rtl") {
  return dir === "rtl" ? product.nameAr : product.nameEn
}

/**
 * Get category name based on locale direction
 */
export function getCategoryName(
  category: { nameEn: string; nameAr?: string } | undefined,
  dir: "ltr" | "rtl"
) {
  if (!category) return "-"
  return dir === "rtl" ? (category.nameAr || category.nameEn) : category.nameEn
}
