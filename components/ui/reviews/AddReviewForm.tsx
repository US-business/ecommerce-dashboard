"use client"

import { useState } from "react"
import { StarRating } from "./StarRating"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Textarea } from "@/components/shadcnUI/textarea"
import { Label } from "@/components/shadcnUI/label"
import { addReview } from "@/lib/actions/reviews"
import { toast } from "sonner"

interface AddReviewFormProps {
  productId: number
  dir: "rtl" | "ltr"
  onReviewAdded?: () => void
}

export function AddReviewForm({ productId, dir, onReviewAdded }: AddReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error(dir === "rtl" ? "الرجاء تحديد التقييم" : "Please select a rating")
      return
    }

    setIsLoading(true)
    try {
      const result = await addReview(productId, rating, comment)
      
      if (result.success) {
        toast.success(dir === "rtl" ? "تم إضافة التقييم بنجاح" : "Review added successfully")
        setRating(0)
        setComment("")
        onReviewAdded?.()
      } else {
        toast.error(result.error || (dir === "rtl" ? "فشل إضافة التقييم" : "Failed to add review"))
      }
    } catch (error) {
      toast.error(dir === "rtl" ? "حدث خطأ" : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {dir === "rtl" ? "أضف تقييمك" : "Add Your Review"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>
              {dir === "rtl" ? "التقييم" : "Rating"}
              <span className="text-red-500 ms-1">*</span>
            </Label>
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRatingChange={setRating}
            />
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {dir === "rtl" ? `لقد اخترت ${rating} نجوم` : `You selected ${rating} stars`}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">
              {dir === "rtl" ? "تعليقك (اختياري)" : "Your Comment (Optional)"}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                dir === "rtl"
                  ? "شارك تجربتك مع هذا المنتج..."
                  : "Share your experience with this product..."
              }
              className="min-h-[120px]"
              dir={dir}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || rating === 0}
            className="w-full"
          >
            {isLoading
              ? dir === "rtl"
                ? "جاري الإضافة..."
                : "Adding..."
              : dir === "rtl"
              ? "إضافة التقييم"
              : "Add Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
