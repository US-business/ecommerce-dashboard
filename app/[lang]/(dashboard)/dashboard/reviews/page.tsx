"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcnUI/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/shadcnUI/alert-dialog"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Star, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {  useAuthStore } from "@/lib/stores"
import Link from "next/link"
import { getAllReviews, deleteReviewAdmin } from "@/lib/actions/reviews"

// Review interface based on the database schema
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

// Real reviews data will be fetched from database

// Real functions using server actions

export default function ReviewsPage() {
      const { t, dir } = useI18nStore()
  const { isSuperAdmin } = useAuthStore()
    const router = useRouter()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
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
                // Remove the deleted review from the state
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
        // <ProtectedRoute requiredRole="super_admin">
                <div className="space-y-6">
                    {/* Header */}
                    <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                        <div className={cn(dir === "rtl" && "text-right")}>
                            <h1 className="text-3xl font-bold">{t("navigation.reviews")}</h1>
                            <p className="text-muted-foreground">
                                {dir === "rtl" ? "إدارة تقييمات المنتجات" : "Manage product reviews"}
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <Card>
                        <CardHeader>
                            <CardTitle className={cn(dir === "rtl" && "text-right")}>{t("common.search")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Search
                                    className={cn("absolute top-2.5 h-4 w-4 text-muted-foreground", dir === "rtl" ? "right-3" : "left-3")}
                                />
                                <Input
                                    placeholder={dir === "rtl" ? "البحث في التقييمات..." : "Search reviews..."}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className={cn(dir === "rtl" ? "pr-10 text-right" : "pl-10")}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className={cn(dir === "rtl" && "text-right")}>
                                {dir === "rtl" ? "قائمة التقييمات" : "Reviews List"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className={cn(dir === "rtl" && "text-right")}>
                                                    {dir === "rtl" ? "المنتج" : "Product"}
                                                </TableHead>
                                                <TableHead className={cn(dir === "rtl" && "text-right")}>
                                                    {dir === "rtl" ? "المستخدم" : "User"}
                                                </TableHead>
                                                <TableHead className={cn(dir === "rtl" && "text-right")}>
                                                    {dir === "rtl" ? "التقييم" : "Rating"}
                                                </TableHead>
                                                <TableHead className={cn(dir === "rtl" && "text-right")}>
                                                    {dir === "rtl" ? "التعليق" : "Comment"}
                                                </TableHead>
                                                <TableHead className={cn(dir === "rtl" && "text-right")}>
                                                    {dir === "rtl" ? "تاريخ الإنشاء" : "Created At"}
                                                </TableHead>
                                                <TableHead className={cn(dir === "rtl" && "text-right")}>{t("common.actions")}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reviews.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8">
                                                        {dir === "rtl" ? "لا توجد تقييمات" : "No reviews found"}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                reviews.map((review) => (
                                                    <TableRow key={review.id}>
                                                        <TableCell className={cn(dir === "rtl" && "text-right" , "line-clamp-1")}>
                                                            {dir === "rtl" 
                                                                ? (review.product?.nameAr || "منتج غير محدد")
                                                                : (review.product?.nameEn || "Product not found")
                                                            }
                                                        </TableCell>
                                                        <TableCell className={cn(dir === "rtl" && "text-right")}>
                                                            <div>
                                                                <div>{review.user?.username || "مستخدم محذوف"}</div>
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
                                                                {review.comment || (dir === "rtl" ? "لا يوجد تعليق" : "No comment")}
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
                                                                    onClick={() => setDeleteId(review.id)}
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
                            )}
                        </CardContent>
                    </Card>

                    {/* Delete Confirmation Dialog */}
                    <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {dir === "rtl" ? "هل أنت متأكد من حذف هذا التقييم؟" : "Are you sure you want to delete this review?"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {dir === "rtl"
                                        ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف التقييم نهائيًا."
                                        : "This action cannot be undone. The review will be permanently deleted."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                    disabled={deleting}
                                >
                                    {deleting ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            {dir === "rtl" ? "جاري الحذف..." : "Deleting..."}
                                        </>
                                    ) : (
                                        t("common.delete")
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
        // </ProtectedRoute>
    )
}