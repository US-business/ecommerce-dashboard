import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import CategoryImage from './CategoryImage'
import CategoryName from './CategoryName'
import { RADIUS_SHAPES } from './constants'
import type { CategoryCardProps } from './types'

const CategoryCard: React.FC<CategoryCardProps> = ({
    category,
    categoryName,
    hasImage,
    lang,
    dir,
    index
}) => {
    const borderRadius = RADIUS_SHAPES[index % RADIUS_SHAPES.length]

    return (
        <Link
            href={`/${lang}/category/${category.slug}`}
            className="group"
        >
            <div className={cn(
                'relative bg-slate-300 p-1.5 sm:p-2',
                'rounded-md sm:rounded-lg border border-gray-100 dark:border-gray-700',
                'shadow-sm hover:shadow-xl sm:shadow-md sm:hover:shadow-2xl',
                'transition-all duration-300 ease-out',
                'hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5 sm:hover:-translate-y-1',
                'hover:border-amber-400 dark:hover:border-amber-500'
            )}>
                <CategoryImage
                    hasImage={hasImage}
                    imageUrl={category.image || ''}
                    categoryName={categoryName}
                    borderRadius={borderRadius}
                    dir={dir}
                />
                <CategoryName name={categoryName} />
            </div>
        </Link>
    )
}

export default CategoryCard
