"use client"

import { useState } from "react"
import { StarRating } from "./StarRating"
import { Button } from "@/components/shadcnUI/button"
import { Card } from "@/components/shadcnUI/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar"
import { Trash2, Edit2, Check, X } from "lucide-react"
import { Textarea } from "@/components/shadcnUI/textarea"
import { updateReview, deleteReview } from "@/lib/actions/reviews"
import { toast } from "sonner"

interface ReviewItemProps {
  review: {
    id: number
    rating: number
    comment: string | null
    createdAt: Date | null
    user: {
      id: number
      username: string | null
      email: string
      image: string | null
    } | null
  }
  currentUserId?: number
  dir: "rtl" | "ltr"
  onReviewUpdated?: () => void
}

export function ReviewItem({
  review,
  currentUserId,
  dir,
  onReviewUpdated,
}: ReviewItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editRating, setEditRating] = useState(review.rating)
  const [editComment, setEditComment] = useState(review.comment || "")
  const [isLoading, setIsLoading] = useState(false)

  const isOwnReview = currentUserId === review.user?.id
  const userName = review.user?.username || review.user?.email.split("@")[0] || "User"
  const userInitial = userName.charAt(0).toUpperCase()

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString(dir === "rtl" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      const result = await updateReview(review.id, editRating, editComment)
      if (result.success) {
        toast.success(dir === "rtl" ? "تم تحديث التقييم بنجاح" : "Review updated successfully")
        setIsEditing(false)
        onReviewUpdated?.()
      } else {
        toast.error(result.error || (dir === "rtl" ? "فشل تحديث التقييم" : "Failed to update review"))
      }
    } catch (error) {
      toast.error(dir === "rtl" ? "حدث خطأ" : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(dir === "rtl" ? "هل أنت متأكد من حذف التقييم؟" : "Are you sure you want to delete this review?")) {
      return
    }

    setIsLoading(true)
    try {
      const result = await deleteReview(review.id)
      if (result.success) {
        toast.success(dir === "rtl" ? "تم حذف التقييم بنجاح" : "Review deleted successfully")
        onReviewUpdated?.()
      } else {
        toast.error(result.error || (dir === "rtl" ? "فشل حذف التقييم" : "Failed to delete review"))
      }
    } catch (error) {
      toast.error(dir === "rtl" ? "حدث خطأ" : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditRating(review.rating)
    setEditComment(review.comment || "")
  }

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* User Avatar */}
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={review.user?.image || undefined} alt={userName} />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>

        {/* Review Content */}
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
            </div>

            {isOwnReview && !isEditing && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )}
          </div>

          {/* Rating */}
          {!isEditing ? (
            <StarRating rating={review.rating} size="sm" />
          ) : (
            <div className="space-y-2">
              <StarRating
                rating={editRating}
                size="md"
                interactive
                onRatingChange={setEditRating}
              />
            </div>
          )}

          {/* Comment */}
          {!isEditing ? (
            review.comment && (
              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            )
          ) : (
            <div className="space-y-2">
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                placeholder={dir === "rtl" ? "تعليقك..." : "Your comment..."}
                className="min-h-[80px]"
                dir={dir}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 me-1" />
                  {dir === "rtl" ? "حفظ" : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 me-1" />
                  {dir === "rtl" ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
