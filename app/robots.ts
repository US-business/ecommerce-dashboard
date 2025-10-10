import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/ar/', '/en/', '/api/auth/'],
                disallow: [
                    '/dashboard/',
                    '/api/',
                    '/_next/',
                    '/admin/',
                    '/private/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: ['/ar/', '/en/', '/ar/products/', '/en/products/'],
                disallow: ['/dashboard/', '/api/', '/admin/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
