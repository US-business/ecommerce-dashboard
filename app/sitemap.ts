import { MetadataRoute } from 'next'

// Helper function to get all products from database
async function getAllProducts() {
    try {
        const { db } = await import('@/lib/db')
        const { products } = await import('@/lib/db/schema')
        const { desc } = await import('drizzle-orm')

        const result = await db
            .select({
                slug: products.slug,
                updatedAt: products.updatedAt,
            })
            .from(products)
            .orderBy(desc(products.updatedAt))
            .limit(1000) // Limit for performance

        return result
    } catch (error) {
        console.error('Failed to fetch products for sitemap:', error)
        return []
    }
}

// Helper function to get all categories
async function getAllCategories() {
    try {
        const { db } = await import('@/lib/db')
        const { categories } = await import('@/lib/db/schema')

        const result = await db
            .select({
                slug: categories.slug,
                updatedAt: categories.updatedAt,
            })
            .from(categories)

        return result
    } catch (error) {
        console.error('Failed to fetch categories for sitemap:', error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const currentDate = new Date()

    // Fetch dynamic data
    const products = await getAllProducts()
    const categories = await getAllCategories()

    // Static pages (Arabic & English)
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/ar`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/en`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/ar/products`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/en/products`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/ar/cart`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/en/cart`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/ar/signin`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/en/signin`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/ar/signup`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/en/signup`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    // Dynamic product pages
    const productPages: MetadataRoute.Sitemap = products.flatMap(product => [
        {
            url: `${baseUrl}/ar/product?slug=${product.slug}`,
            lastModified: product.updatedAt || currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/en/product?slug=${product.slug}`,
            lastModified: product.updatedAt || currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
    ])

    // Dynamic category pages
    const categoryPages: MetadataRoute.Sitemap = categories.flatMap(category => [
        {
            url: `${baseUrl}/ar/products?category=${category.slug}`,
            lastModified: category.updatedAt || currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/en/products?category=${category.slug}`,
            lastModified: category.updatedAt || currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
    ])

    return [...staticPages, ...productPages, ...categoryPages]
}
