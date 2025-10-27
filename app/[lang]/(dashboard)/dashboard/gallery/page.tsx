import { cookies } from "next/headers"
import { Metadata } from "next"
import { getGalleryImagesDB, getGalleryTags } from "@/lib/actions/gallery"
import { GalleryImage } from "@/lib/stores/gallery-store"
import { GalleryClientWrapper } from "./_components"
import en from "@/lib/i18n/translations/en.json"
import ar from "@/lib/i18n/translations/ar.json"

const translations = { en, ar } as const

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const resolvedParams = await params
    const lang = resolvedParams?.lang || 'ar'

    const cookieStore = await cookies()
    const locale = (cookieStore.get("preferred-locale")?.value || "ar") as 'ar' | 'en'
    const dir = locale === "ar" ? "rtl" : "ltr"
    const t = translations[locale]

    const title = dir === 'rtl'
        ? `${t.gallery.title} | لوحة التحكم - Dubai Trading`
        : `${t.gallery.title} | Dashboard - Dubai Trading`

    const description = t.gallery.subtitle

    return {
        title,
        description,
    }
}

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params
    const lang = resolvedParams?.lang || 'ar'

    const cookieStore = await cookies()
    const locale = cookieStore.get("preferred-locale")?.value || "ar"
    const dir = locale === "ar" ? "rtl" : "ltr"

    // Fetch initial data on the server
    const imagesPerPage = 12
    const initialPage = 1

    let initialImages: GalleryImage[] = []
    let initialTotal = 0
    let initialTags: string[] = []
    let initialFeaturedCount = 0

    try {
        // Fetch images from database
        const dbResponse = await getGalleryImagesDB(
            initialPage,
            imagesPerPage,
            "",
            [],
            'newest'
        )

        if (dbResponse.success && dbResponse.data) {
            initialImages = Array.isArray(dbResponse.data) ? dbResponse.data : [dbResponse.data]
            initialTotal = dbResponse.total || initialImages.length
            initialFeaturedCount = initialImages.filter(img => img.isFeatured).length
        }

        // Fetch tags
        const tagsResponse = await getGalleryTags()
        if (tagsResponse.success && tagsResponse.data) {
            initialTags = Array.isArray(tagsResponse.data) ? tagsResponse.data as unknown as string[] : []
        }
    } catch (error) {
        console.error("Error fetching gallery data:", error)
    }

    return (
        <GalleryClientWrapper
            initialImages={initialImages}
            initialTags={initialTags}
            initialTotal={initialTotal}
            initialFeaturedCount={initialFeaturedCount}
        />
    )
}