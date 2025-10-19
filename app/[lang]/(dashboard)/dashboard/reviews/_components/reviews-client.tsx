"use client"

import { useState, useEffect, useTransition } from "react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { getAllReviews, deleteReviewAdmin } from "@/lib/actions/reviews"
import { ReviewsHeader } from "./reviews-header"
import { ReviewsSearch } from "./reviews-search"
import { ReviewsTable } from "./reviews-table"
import { DeleteReviewDialog } from "./delete-review-dialog"

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

interface ReviewsClientProps {
  initialReviews: Review[]
}

export function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const { t, dir } = useI18nStore()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()

  const loadReviews = async () => {
    setLoading(true)
    try {
      const result = await getAllReviews(search)
      if (result.success && result.data) {
        setReviews(result.data)
      } else {
        console.error("Failed to load reviews:", result.error)
        setReviews([])
      }
    } catch (error) {
      console.error("Failed to load reviews:", error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [search])

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const result = await deleteReviewAdmin(deleteId)
      if (result.success) {
        setReviews(reviews.filter(review => review.id !== deleteId))
        setDeleteId(null)
      } else {
        console.error("Failed to delete review:", result.error)
        alert(result.error || "Failed to delete review")
      }
    } catch (error) {
      console.error("Failed to delete review:", error)
      alert("Failed to delete review")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <ReviewsHeader
        title={t("navigation.reviews")}
        description={dir === "rtl" ? "إدارة تقييمات المنتجات" : "Manage product reviews"}
        dir={dir}
      />

      <ReviewsSearch
        search={search}
        onSearchChange={setSearch}
        placeholder={dir === "rtl" ? "البحث في التقييمات..." : "Search reviews..."}
        title={t("common.search")}
        dir={dir}
      />

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ReviewsTable
              reviews={reviews}
              dir={dir}
              isPending={isPending}
              onDeleteClick={setDeleteId}
              translations={{
                product: dir === "rtl" ? "المنتج" : "Product",
                user: dir === "rtl" ? "المستخدم" : "User",
                rating: dir === "rtl" ? "التقييم" : "Rating",
                comment: dir === "rtl" ? "التعليق" : "Comment",
                createdAt: dir === "rtl" ? "تاريخ الإنشاء" : "Created At",
                actions: t("common.actions"),
                noReviews: dir === "rtl" ? "لا توجد تقييمات" : "No reviews found",
                productNotFound: dir === "rtl" ? "منتج غير محدد" : "Product not found",
                deletedUser: dir === "rtl" ? "مستخدم محذوف" : "Deleted user",
                noComment: dir === "rtl" ? "لا يوجد تعليق" : "No comment"
              }}
            />
          )}
        </CardContent>
      </Card>

      <DeleteReviewDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        deleting={deleting}
        dir={dir}
        translations={{
          title: dir === "rtl" ? "هل أنت متأكد من حذف هذا التقييم؟" : "Are you sure you want to delete this review?",
          description: dir === "rtl" 
            ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف التقييم نهائيًا."
            : "This action cannot be undone. The review will be permanently deleted.",
          cancel: t("common.cancel"),
          delete: t("common.delete"),
          deleting: dir === "rtl" ? "جاري الحذف..." : "Deleting..."
        }}
      />
    </div>
  )
}
