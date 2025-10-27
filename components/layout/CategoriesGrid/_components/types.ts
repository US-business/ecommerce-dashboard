import type { Category } from '@/types/category'
import type { Locale } from '@/lib/i18n/i18n-config'

export type CategoriesGridProps = {
    categories: Category[]
    dictionary?: Record<string, any>
    dir: string
    lang?: Locale
    className?: string
    title?: string
    showTitle?: boolean
    columns?: 2 | 3 | 4 | 5 | 6
    maxCategories?: number
}

export type SectionHeaderProps = {
    title: string
    dir: string
}

export type CategoryCardProps = {
    category: Category
    categoryName: string
    hasImage: boolean
    lang: Locale
    dir: string
    index: number
}

export type CategoryGridItemProps = {
    category: Category
    categoryName: string
    hasImage: boolean
    lang: Locale
    dir: string
    index: number
}

export type CategoryImageProps = {
    hasImage: boolean
    imageUrl: string
    categoryName: string
    borderRadius: string
    dir: string
}

export type CategoryNameProps = {
    name: string
}

export type ViewAllButtonProps = {
    lang: Locale
    dir: string
}
