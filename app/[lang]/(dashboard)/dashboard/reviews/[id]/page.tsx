import { notFound } from "next/navigation"
import { ReviewDetailClient } from "./_components"
import { getReviewById } from "@/lib/actions/reviews"

interface ReviewDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
    const resolvedParams = await params
    const reviewId = parseInt(resolvedParams.id)
    
    // Validate ID
    if (isNaN(reviewId)) {
        notFound()
    }
    
    const result = await getReviewById(reviewId)

    if (!result.success || !result.data) {
        notFound()
    }

    return <ReviewDetailClient review={result.data} />
}