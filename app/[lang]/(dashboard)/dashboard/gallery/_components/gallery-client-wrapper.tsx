"use client"

import { useState, useEffect } from "react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useGalleryStore, GalleryImage } from "@/lib/stores/gallery-store"
import { getGalleryImagesDB, getGalleryTags } from "@/lib/actions/gallery"
import { GalleryFilters } from "@/components/dashboard/gallery/gallery-filters/gallery-filters"
import { GalleryHeader } from "./gallery-header"
import { GalleryStats } from "./gallery-stats"
import { GalleryUploadCard } from "./gallery-upload-card"
import { GallerySearchControls } from "./gallery-search-controls"
import { GalleryActiveTags } from "./gallery-active-tags"
import { GalleryContent } from "./gallery-content"
import ReusablePagination from "@/components/ui/ReusablePagination"

interface GalleryClientWrapperProps {
    initialImages: GalleryImage[]
    initialTags: string[]
    initialTotal: number
    initialFeaturedCount: number
}

export function GalleryClientWrapper({
    initialImages,
    initialTags,
    initialTotal,
    initialFeaturedCount
}: GalleryClientWrapperProps) {
    const { t, dir } = useI18nStore()
    const { images, addImages } = useGalleryStore()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [availableTags, setAvailableTags] = useState<string[]>(initialTags)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalImages, setTotalImages] = useState(initialTotal)
    const [featuredCount, setFeaturedCount] = useState(initialFeaturedCount)
    const imagesPerPage = 12
    const [sortBy, setSortBy] = useState<string>('newest')
    const [showFilters, setShowFilters] = useState(false)

    // Initialize images from server
    useEffect(() => {
        addImages(initialImages, true)
        setFeaturedCount(initialImages.filter(img => img.isFeatured).length)
    }, [])

    // Load images from Database
    const loadImages = async () => {
        try {
            setLoading(true)
            setError("")

            const dbResponse = await getGalleryImagesDB(
                currentPage,
                imagesPerPage,
                searchQuery,
                selectedTags,
                sortBy
            )

            let dbImages: GalleryImage[] = []
            let totalCount = 0

            if (dbResponse.success && dbResponse.data) {
                dbImages = Array.isArray(dbResponse.data) ? dbResponse.data : [dbResponse.data]
                totalCount = dbResponse.total || dbImages.length
            } else {
                console.warn("Failed to load images from database:", dbResponse.error)
            }

            addImages(dbImages, true)
            setTotalImages(totalCount)
            setFeaturedCount(dbImages.filter(img => img.isFeatured).length)
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
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <GalleryHeader
                title={t("gallery.title")}
                subtitle={t("gallery.subtitle")}
            />

            {/* Stats */}
            <GalleryStats
                totalImages={totalImages}
                totalTags={availableTags.length}
                featuredCount={featuredCount}
                translations={{
                    totalImages: t("gallery.totalImages"),
                    availableTags: t("gallery.availableTags"),
                    featuredImages: t("gallery.featuredImages")
                }}
            />

            {/* Upload Card */}
            <GalleryUploadCard
                title={t("gallery.uploadImages")}
                onSuccess={handleUploadSuccess}
            />

            {/* Search and Controls */}
            <GallerySearchControls
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
                translations={{
                    filters: t("gallery.filters"),
                    searchPlaceholder: t("gallery.searchPlaceholder"),
                    newest: t("common.newest"),
                    oldest: t("common.oldest"),
                    name: t("account.general.name"),
                    size: t("common.size"),
                    grid: t("gallery.grid"),
                    list: t("gallery.list")
                }}
            />

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
            <GalleryActiveTags
                selectedTags={selectedTags}
                onRemoveTag={(tag) => setSelectedTags(prev => prev.filter(t => t !== tag))}
                onClearAll={() => setSelectedTags([])}
                translations={{
                    activeTags: t("gallery.activeTags"),
                    clearAll: t("gallery.clearAll")
                }}
            />

            {/* Content */}
            <GalleryContent
                loading={loading}
                error={error}
                viewMode={viewMode}
                images={images}
                onImageUpdate={handleImageUpdate}
            />

            {/* Pagination */}
            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                previousLabel={t("gallery.previous")}
                nextLabel={t("gallery.next")}
                dir={dir}
                showScrollToTop={true}
            />
        </div>
    )
}
