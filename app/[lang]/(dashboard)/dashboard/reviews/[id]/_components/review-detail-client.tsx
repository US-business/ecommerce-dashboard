"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { ReviewDetailHeader } from "./review-detail-header"
import { ReviewRatingCard } from "./review-rating-card"
import { ReviewProductInfo } from "./review-product-info"
import { ReviewCommentCard } from "./review-comment-card"
import { ReviewUserInfo } from "./review-user-info"
import { ReviewTimeline } from "./review-timeline"

interface Review {
  id: number
  productId: number
  userId: number
  rating: number
  comment?: string
  createdAt: Date
  product?: {
    nameEn: string
    nameAr: string
  }
  user?: {
    username: string
    email: string
  }
}

interface ReviewDetailClientProps {
  review: Review
}

export function ReviewDetailClient({ review }: ReviewDetailClientProps) {
  const { dir } = useI18nStore()

  const productName = dir === "rtl" ? review.product?.nameAr : review.product?.nameEn

  return (
    <div className="space-y-6">
      <ReviewDetailHeader
        reviewId={review.id}
        createdAt={review.createdAt}
        dir={dir}
        translations={{
          back: dir === "rtl" ? "العودة إلى التقييمات" : "Back to Reviews",
          reviewNumber: dir === "rtl" ? "تقييم رقم" : "Review",
          createdOn: dir === "rtl" ? "تم إنشاؤه في" : "Created on"
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <ReviewRatingCard
            rating={review.rating}
            title={dir === "rtl" ? "التقييم" : "Rating"}
            dir={dir}
          />

          <ReviewProductInfo
            productName={productName || ""}
            productId={review.productId}
            dir={dir}
            translations={{
              title: dir === "rtl" ? "معلومات المنتج" : "Product Information",
              productName: dir === "rtl" ? "اسم المنتج" : "Product Name",
              productId: dir === "rtl" ? "معرف المنتج" : "Product ID"
            }}
          />

          <ReviewCommentCard
            comment={review.comment || ""}
            title={dir === "rtl" ? "التعليق" : "Comment"}
            dir={dir}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ReviewUserInfo
            username={review.user?.username || ""}
            email={review.user?.email || ""}
            userId={review.userId}
            dir={dir}
            translations={{
              title: dir === "rtl" ? "معلومات المستخدم" : "User Information",
              username: dir === "rtl" ? "اسم المستخدم" : "Username",
              email: dir === "rtl" ? "البريد الإلكتروني" : "Email",
              userId: dir === "rtl" ? "معرف المستخدم" : "User ID"
            }}
          />

          <ReviewTimeline
            createdAt={review.createdAt}
            dir={dir}
            translations={{
              title: dir === "rtl" ? "التاريخ" : "Timeline",
              reviewCreated: dir === "rtl" ? "تم إنشاء التقييم" : "Review Created"
            }}
          />
        </div>
      </div>
    </div>
  )
}
