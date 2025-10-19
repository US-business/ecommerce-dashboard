"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcnUI/table"
import { Button } from "@/components/shadcnUI/button"
import { Eye, Trash2, Loader2, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Review {
  id: number
  productId: number
  userId: number
  rating: number
  comment?: string | null
  createdAt: Date
  product?: {
    nameEn: string | null
    nameAr: string | null
  } | null
  user?: {
    username: string | null
    email: string | null
    image?: string | null
  } | null
}

interface ReviewsTableProps {
  reviews: Review[]
  dir: "ltr" | "rtl"
  isPending: boolean
  onDeleteClick: (id: number) => void
  translations: {
    product: string
    user: string
    rating: string
    comment: string
    createdAt: string
    actions: string
    noReviews: string
    productNotFound: string
    deletedUser: string
    noComment: string
  }
}

export function ReviewsTable({
  reviews,
  dir,
  isPending,
  onDeleteClick,
  translations
}: ReviewsTableProps) {
  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}/5</span>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={cn(dir === "rtl" && "text-right")}>
              {translations.product}
            </TableHead>
            <TableHead className={cn(dir === "rtl" && "text-right")}>
              {translations.user}
            </TableHead>
            <TableHead className={cn(dir === "rtl" && "text-right")}>
              {translations.rating}
            </TableHead>
            <TableHead className={cn(dir === "rtl" && "text-right")}>
              {translations.comment}
            </TableHead>
            <TableHead className={cn(dir === "rtl" && "text-right")}>
              {translations.createdAt}
            </TableHead>
            <TableHead className={cn(dir === "rtl" && "text-right")}>
              {translations.actions}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                {translations.noReviews}
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className={cn(dir === "rtl" && "text-right", "line-clamp-1")}>
                  {dir === "rtl"
                    ? (review.product?.nameAr || translations.productNotFound)
                    : (review.product?.nameEn || translations.productNotFound)
                  }
                </TableCell>
                <TableCell className={cn(dir === "rtl" && "text-right")}>
                  <div>
                    <div>{review.user?.username || translations.deletedUser}</div>
                    <div className="text-sm text-muted-foreground">
                      {review.user?.email || ""}
                    </div>
                  </div>
                </TableCell>
                <TableCell className={cn(dir === "rtl" && "text-right")}>
                  {getRatingStars(review.rating)}
                </TableCell>
                <TableCell className={cn(dir === "rtl" && "text-right")}>
                  <div className="max-w-xs truncate">
                    {review.comment || translations.noComment}
                  </div>
                </TableCell>
                <TableCell className={cn(dir === "rtl" && "text-right")}>
                  {new Date(review.createdAt).toLocaleDateString(
                    dir === "rtl" ? "ar-SA" : "en-US"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/reviews/${review.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteClick(review.id)}
                      disabled={isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
