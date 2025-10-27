'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { 
    SectionHeader, 
    CategoryCard, 
    ViewAllButton,
    GRID_COLS,
    type CategoriesGridProps 
} from './_components'

const CategoriesGrid: React.FC<CategoriesGridProps> = ({
    categories,
    dictionary,
    dir,
    lang = 'ar',
    className,
    title,
    showTitle = true,
    columns = 4,
    maxCategories
}) => {
    if (!categories || categories.length === 0) return null

    // عنوان القسم
    const displayTitle = title ||
        (typeof dictionary?.categories?.title === 'object'
            ? dictionary.categories.title[dir] || dictionary.categories.title
            : dictionary?.categories?.title || (dir === 'rtl' ? 'تسوق حسب الفئة' : 'Shop by Category'))

    // تحديد عدد الفئات المراد عرضها
    const displayedCategories = maxCategories 
        ? categories.slice(0, maxCategories) 
        : categories

    return (
        <section className={cn('w-full', className)}>
            <div className="container mx-auto p-2 sm:p-3 md:p-4 bg-background/60 backdrop-blur-md rounded-lg">
                {/* Section Header */}
                {showTitle && <SectionHeader title={displayTitle} dir={dir} />}

                {/* Categories Grid */}
                <div className={cn(
                    'grid gap-2 sm:gap-3 md:gap-4 lg:gap-5 bg-amber-100 p-1.5 sm:p-2',
                    GRID_COLS[columns]
                )}>
                    {displayedCategories.map((category, i) => {
                        const categoryName = dir === 'rtl' ? category.nameAr : category.nameEn
                        const hasImage: boolean = !!(category.image && category.image.trim() !== '')

                        return (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                categoryName={categoryName}
                                hasImage={hasImage}
                                lang={lang}
                                dir={dir}
                                index={i}
                            />
                        )
                    }).reverse()}
                </div>

                {/* View All Link - Optional */}
                {categories.length > 8 && <ViewAllButton lang={lang} dir={dir} />}
            </div>
        </section>
    )
}

export default CategoriesGrid
