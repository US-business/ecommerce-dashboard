"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { cn } from "@/lib/utils"
import { notFound } from "next/navigation"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { ArrowLeft, Star, User, Package, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"

// Review interface based on the database schema
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

// Mock reviews data for demo purposes (same as in the list page)
const mockReviews: Review[] = [
    {
        id: 1,
        productId: 1,
        userId: 3,
        rating: 5,
        comment: "Excellent product, very satisfied with the quality!",
        createdAt: new Date("2024-01-15"),
        product: {
            nameEn: "Wireless Headphones",
            nameAr: "سماعات لاسلكية",
        },
        user: {
            username: "john_doe",
            email: "john@example.com",
        },
    },
    {
        id: 2,
        productId: 2,
        userId: 2,
        rating: 4,
        comment: "Good product, comfortable to wear.",
        createdAt: new Date("2024-01-20"),
        product: {
            nameEn: "Cotton T-Shirt",
            nameAr: "قميص قطني",
        },
        user: {
            username: "viewer",
            email: "viewer@example.com",
        },
    },
    {
        id: 3,
        productId: 3,
        userId: 1,
        rating: 3,
        comment: "Average product, expected better quality.",
        createdAt: new Date("2024-01-25"),
        product: {
            nameEn: "Coffee Mug",
            nameAr: "كوب قهوة",
        },
        user: {
            username: "admin",
            email: "admin@example.com",
        },
    },
    {
        id: 4,
        productId: 1,
        userId: 4,
        rating: 5,
        comment: "Amazing sound quality, worth every penny!",
        createdAt: new Date("2024-02-01"),
        product: {
            nameEn: "Wireless Headphones",
            nameAr: "سماعات لاسلكية",
        },
        user: {
            username: "sarah_admin",
            email: "sarah@example.com",
        },
    },
    {
        id: 5,
        productId: 2,
        userId: 3,
        rating: 2,
        comment: "The size runs small, not as described.",
        createdAt: new Date("2024-02-05"),
        product: {
            nameEn: "Cotton T-Shirt",
            nameAr: "قميص قطني",
        },
        user: {
            username: "john_doe",
            email: "john@example.com",
        },
    },
]

// Mock function to get a review by ID
async function getReviewById(id: string): Promise<Review | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const reviewId = parseInt(id)
    const review = mockReviews.find(review => review.id === reviewId)
    
    return review || null
}

interface ReviewDetailPageProps {
    params: {
        id: string
    }
}

function ReviewDetailContent({ params }: ReviewDetailPageProps) {
    const { t, dir } = useI18nStore()
    const [review, setReview] = useState<Review | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadReview() {
            setLoading(true)
            try {
                const data = await getReviewById(params.id)
                if (!data) {
                    notFound()
                }
                setReview(data)
            } catch (error) {
                console.error("Failed to load review:", error)
            } finally {
                setLoading(false)
            }
        }

        loadReview()
    }, [params.id])

    const getRatingStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                        key={index}
                        className={`h-5 w-5 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                ))}
                <span className="ml-2 text-lg font-medium">{rating}/5</span>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!review) {
        return notFound()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={cn("flex items-center gap-4", dir === "rtl" && "flex-row-reverse")}>
                <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/reviews">
                        <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                        {dir === "rtl" ? "العودة إلى التقييمات" : "Back to Reviews"}
                    </Link>
                </Button>
                <div className={cn(dir === "rtl" && "text-right")}>
                    <h1 className="text-2xl font-bold">
                        {dir === "rtl" ? `تقييم رقم #${review.id}` : `Review #${review.id}`}
                    </h1>
                    <p className="text-muted-foreground">
                        {dir === "rtl" 
                            ? `تم إنشاؤه في ${review.createdAt.toLocaleDateString()}`
                            : `Created on ${review.createdAt.toLocaleDateString()}`
                        }
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Review Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Rating */}
                    <Card>
                        <CardHeader>
                            <CardTitle className={cn(dir === "rtl" && "text-right")}>
                                {dir === "rtl" ? "التقييم" : "Rating"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={cn("flex justify-center py-6", dir === "rtl" && "flex-row-reverse")}>
                            {getRatingStars(review.rating)}
                        </CardContent>
                    </Card>

                    {/* Product Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse text-right")}>
                                <Package className="h-5 w-5" />
                                {dir === "rtl" ? "معلومات المنتج" : "Product Information"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className={cn("grid grid-cols-1 gap-4", dir === "rtl" && "text-right")}>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {dir === "rtl" ? "اسم المنتج" : "Product Name"}
                                    </label>
                                    <p className="font-medium">
                                        {dir === "rtl" ? review.product?.nameAr : review.product?.nameEn}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {dir === "rtl" ? "معرف المنتج" : "Product ID"}
                                    </label>
                                    <p className="font-medium">{review.productId}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comment */}
                    {review.comment && (
                        <Card>
                            <CardHeader>
                                <CardTitle className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse text-right")}>
                                    <MessageSquare className="h-5 w-5" />
                                    {dir === "rtl" ? "التعليق" : "Comment"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={cn("p-4 bg-muted rounded-lg", dir === "rtl" && "text-right")}>
                                    <p className="italic">"{review.comment}"</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* User Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse text-right")}>
                                <User className="h-5 w-5" />
                                {dir === "rtl" ? "معلومات المستخدم" : "User Information"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className={cn("grid grid-cols-1 gap-4", dir === "rtl" && "text-right")}>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {dir === "rtl" ? "اسم المستخدم" : "Username"}
                                    </label>
                                    <p className="font-medium">{review.user?.username}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {dir === "rtl" ? "البريد الإلكتروني" : "Email"}
                                    </label>
                                    <p className="font-medium">{review.user?.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        {dir === "rtl" ? "معرف المستخدم" : "User ID"}
                                    </label>
                                    <p className="font-medium">{review.userId}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse text-right")}>
                                <Calendar className="h-5 w-5" />
                                {dir === "rtl" ? "التاريخ" : "Timeline"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={cn("space-y-4", dir === "rtl" && "text-right")}>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div>
                                        <p className="font-medium">
                                            {dir === "rtl" ? "تم إنشاء التقييم" : "Review Created"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {review.createdAt.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function ReviewDetailPage({ params }: ReviewDetailPageProps) {
    return (
            // <ProtectedRoute requiredRole="super_admin">
                <ReviewDetailContent params={params} />
            // </ProtectedRoute>
    )
}