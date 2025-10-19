import { getAllReviews } from "@/lib/actions/reviews"
import { ReviewsClient } from "./_components"

export default async function ReviewsPage() {
    // Fetch initial reviews data
    const result = await getAllReviews()
    const initialReviews = result.success && result.data ? result.data : []

    return <ReviewsClient initialReviews={initialReviews} />
}