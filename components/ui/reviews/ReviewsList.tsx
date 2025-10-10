"use client"

import { useEffect, useState } from "react"
import { ReviewItem } from "./ReviewItem"
import { AddReviewForm } from "./AddReviewForm"
import { StarRating } from "./StarRating"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Separator } from "@/components/shadcnUI/separator"
import { Button } from "@/components/shadcnUI/button"
import { AlertCircle, MessageSquare } from "lucide-react"
import { getProductReviews, hasUserReviewedProduct } from "@/lib/actions/reviews"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"

interface ReviewsListProps {
  productId: number
  currentUserId?: number
  dir: "rtl" | "ltr"
}

export function ReviewsList({ productId, currentUserId, dir }: ReviewsListProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [userReview, setUserReview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const result = await getProductReviews(productId)
      if (result.success) {
        setReviews(result.data || [])
        setAverageRating(result.averageRating || 0)
        setTotalReviews(result.totalReviews || 0)
      }

      // Check if current user has reviewed
      if (currentUserId) {
        const reviewStatus = await hasUserReviewedProduct(productId)
        if (reviewStatus.success && reviewStatus.data) {
          setHasReviewed(reviewStatus.data.hasReviewed)
          setUserReview(reviewStatus.data.review)
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId, currentUserId])

  const handleReviewChange = () => {
    fetchReviews()
    setShowAddForm(false)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {dir === "rtl" ? "تقييمات العملاء" : "Customer Reviews"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Average Rating */}
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div>
                <StarRating rating={averageRating} size="md" />
                <p className="text-sm text-gray-600 mt-1">
                  {dir === "rtl"
                    ? `${totalReviews} تقييم`
                    : `${totalReviews} ${totalReviews === 1 ? "review" : "reviews"}`}
                </p>
              </div>
            </div>

            {/* Rating Distribution (optional - can be enhanced later) */}
            {totalReviews > 0 && (
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {dir === "rtl"
                    ? "شكراً لجميع العملاء على تقييماتهم"
                    : "Thank you to all customers for their reviews"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Review Form */}
      {currentUserId && !hasReviewed && (
        <div>
          {!showAddForm ? (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full"
              variant="outline"
            >
              {dir === "rtl" ? "اكتب تقييمك" : "Write a Review"}
            </Button>
          ) : (
            <AddReviewForm
              productId={productId}
              dir={dir}
              onReviewAdded={handleReviewChange}
            />
          )}
        </div>
      )}

      {/* Already Reviewed Message */}
      {currentUserId && hasReviewed && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {dir === "rtl"
              ? "لقد قمت بتقييم هذا المنتج بالفعل. يمكنك تعديل أو حذف تقييمك أدناه."
              : "You have already reviewed this product. You can edit or delete your review below."}
          </AlertDescription>
        </Alert>
      )}

      {/* Login Required Message */}
      {!currentUserId && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {dir === "rtl" ? (
              <>
                يجب{" "}
                <a href={`/${dir}/signin`} className="font-medium underline">
                  تسجيل الدخول
                </a>{" "}
                لإضافة تقييم
              </>
            ) : (
              <>
                Please{" "}
                <a href={`/${dir}/signin`} className="font-medium underline">
                  sign in
                </a>{" "}
                to add a review
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {dir === "rtl" ? "جميع التقييمات" : "All Reviews"}
          </h3>
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                currentUserId={currentUserId}
                dir={dir}
                onReviewUpdated={handleReviewChange}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-lg font-medium">
                {dir === "rtl" ? "لا توجد تقييمات بعد" : "No reviews yet"}
              </p>
              <p className="text-sm mt-2">
                {dir === "rtl"
                  ? "كن أول من يقيم هذا المنتج"
                  : "Be the first to review this product"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
