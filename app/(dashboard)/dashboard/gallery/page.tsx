"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Search, Upload, Grid, List, Filter, Plus, X } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { getCloudinaryImagesAction, getGalleryImagesDB, getGalleryTags } from "@/lib/actions/gallery"
import { GalleryGrid } from "@/components/dashboard/gallery/gallery-grid"
import { GalleryList } from "@/components/dashboard/gallery/gallery-list"
import { GalleryFilters } from "@/components/dashboard/gallery/gallery-filters"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useGalleryStore } from "@/lib/stores/gallery-store"
import { GalleryImage } from "@/lib/stores/gallery-store"
import { GalleryForm } from "@/components/dashboard/gallery/gallery-form"
// import { GalleryForm } from "@/components/dashboard/gallery/gallery-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcnUI/dialog"

export default function GalleryPage() {
    const { t, dir } = useI18nStore()
    const { images, addImages } = useGalleryStore()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [availableTags, setAvailableTags] = useState<string[]>([])
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalImages, setTotalImages] = useState(0)
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest')
    const [isFormOpen, setIsFormOpen] = useState(false)

    const imagesPerPage = 20


    // Load images
    const loadImages = async () => {
        try {
            setLoading(true)
            setError("")

            // 1. Fetch images from the database
            const dbResponse = await getGalleryImagesDB(
                currentPage,
                imagesPerPage,
                searchQuery,
                selectedTags
            )

            let dbImages: GalleryImage[] = []
            if (dbResponse.success && dbResponse.data) {
                dbImages = Array.isArray(dbResponse.data) ? dbResponse.data : [dbResponse.data]
            } else {
                console.warn("Failed to load images from database:", dbResponse.error)
                // Do not set error yet, Cloudinary might work
            }
            console.log("dbImages", dbImages);

            // 2. Fetch images from Cloudinary
            // let cloudinaryImages: GalleryImage[] = []
            // try {
            //     const cloudinaryApiResponse = await getCloudinaryImagesAction(currentPage, imagesPerPage, searchQuery)
            //     if (cloudinaryApiResponse?.data && Array.isArray(cloudinaryApiResponse?.data)) {
            //         cloudinaryImages = cloudinaryApiResponse?.data?.map((img: any) => ({
            //             id: img.id, // Temporary ID for non-DB images
            //             url: img.url,
            //             publicId: img.publicId,
            //             fileName: img.fileName,
            //             fileSize: img.fileSize,
            //             width: img.width,
            //             height: img.height,
            //             format: img.format,
            //         }))
            //         console.log("cloudinaryImages", cloudinaryImages);
            //     }
            // } catch (cloudinaryError) {
            //     console.warn("Failed to load images from Cloudinary:", cloudinaryError)
            //     if (dbImages.length === 0) {
            //         setError("Failed to load images from both database and Cloudinary.")
            //     }
            // }

            // 3. Merge the two lists
            // const combinedImages = new Map<string, GalleryImage>()

            // Add database images first to prioritize their metadata
            // for (const img of dbImages) {
            //     if (img.publicId) {
            //         combinedImages.set(img.publicId, img)
            //     }
            // }

            // Add Cloudinary images that are not already in the map
            // for (const img of cloudinaryImages) {
            //     if (img.publicId && !combinedImages.has(img.publicId)) {
            //         combinedImages.set(img.publicId, img)
            //     }
            // }

            // const finalList = Array.from(combinedImages.values())

            addImages(dbImages)
            setTotalImages(dbImages.length) // Update total based on the merged list
            console.log("finalList", dbImages);
        } catch (err) {
            setError("An unexpected error occurred while loading images.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Load available tags
    const loadTags = async () => {
        try {
            const response = await getGalleryTags()
            if (response.success && response.data) {
                setAvailableTags(Array.isArray(response.data) ? response.data as unknown as string[] : [])
            }
        } catch (err) {
            console.error("Failed to load tags:", err)
        }
    }

    useEffect(() => {
        loadImages()
    }, [currentPage, searchQuery, selectedTags, sortBy])

    useEffect(() => {
        loadTags()
    }, [])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handleTagFilter = (tags: string[]) => {
        setSelectedTags(tags)
        setCurrentPage(1)
    }

    const handleUploadSuccess = () => {
        loadImages()
        loadTags()
    }

    const handleImageUpdate = () => {
        loadImages()
        loadTags()
    }

    const totalPages = Math.ceil(totalImages / imagesPerPage)

    return (
        // <DashboardLayout>
            <div className="container mx-auto  p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col justify-between items-start  gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Gallery
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage and organize your images
                        </p>
                    </div>
                </div>


                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">{totalImages}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Total Images
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">{availableTags.length}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Available Tags
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600">
                                {images.filter(img => img.isFeatured).length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Featured Images
                            </div>
                        </CardContent>
                    </Card>
                </div>



                <Card className="w-full gap-2">
                    <CardHeader >
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Images
                        </CardTitle>
                    </CardHeader >
                    <CardContent className="sm:max-w-full">
                        <GalleryForm
                            onSuccess={() => {
                                handleUploadSuccess()
                                setIsFormOpen(false)
                            }}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </CardContent>
                </Card>


                {/* Search and Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={t("gallery.searchPlaceholder")}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-2 items-center">
                        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="size">Size</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex border rounded-md">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className="rounded-r-none"
                            >
                                <Grid className="h-4 w-4" />
                                Grid
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="rounded-l-none"
                            >
                                <List className="h-4 w-4" />
                                List
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <GalleryFilters
                        availableTags={availableTags}
                        selectedTags={selectedTags}
                        onTagsChange={handleTagFilter}
                        onClose={() => setShowFilters(false)}
                    />
                )}

                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t("gallery.activeTags")}
                        </span>
                        {selectedTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                                />
                            </Badge>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTags([])}
                            className="text-xs"
                        >
                            {t("gallery.clearAll")}
                        </Button>
                    </div>
                )}

                {/* Content */}
                {error && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                        <CardContent className="p-4">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <GalleryGrid
                                images={images}
                                onImageUpdate={handleImageUpdate}
                            />
                        ) : (
                            <GalleryList
                                images={images}
                                onImageUpdate={handleImageUpdate}
                            />
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    {t("gallery.previous")}
                                </Button>

                                <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
                                    {t("gallery.pageInfo")} {`Page ${currentPage} of ${totalPages}`}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    {t("gallery.next")}
                                </Button>
                            </div>
                        )}
                    </>
                )}

            </div>
        // </DashboardLayout>
    )
}