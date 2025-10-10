// Structured Data (JSON-LD) helpers for better SEO

export interface ProductStructuredData {
  name: string
  description: string
  image: string[]
  price: string
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  brand?: string
  sku?: string
  rating?: {
    value: number
    count: number
  }
}

export interface OrganizationStructuredData {
  name: string
  url: string
  logo?: string
  description?: string
  contactPoint?: {
    telephone: string
    contactType: string
  }
}

/**
 * Generate Product Schema for better Google Shopping integration
 */
export function generateProductSchema(product: ProductStructuredData) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku || '',
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand,
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      url: baseUrl,
      priceCurrency: product.currency || 'USD',
      price: product.price,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: 'E-Commerce Store',
      },
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating.value,
          reviewCount: product.rating.count,
        }
      : undefined,
  }
}

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema(org: OrganizationStructuredData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo,
    description: org.description,
    contactPoint: org.contactPoint
      ? {
          '@type': 'ContactPoint',
          telephone: org.contactPoint.telephone,
          contactType: org.contactPoint.contactType,
        }
      : undefined,
  }
}

/**
 * Generate Website Schema
 */
export function generateWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'E-Commerce Store',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/ar/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Helper to inject structured data into page
 * Use this in your page component like:
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
 */
export function getStructuredDataScript(data: any): string {
  return JSON.stringify(data)
}
