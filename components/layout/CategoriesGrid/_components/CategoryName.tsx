import React from 'react'
import { cn } from '@/lib/utils'
import type { CategoryNameProps } from './types'

const CategoryName: React.FC<CategoryNameProps> = ({ name }) => {
    return (
        <div className="p-1 sm:p-1.5 md:p-2">
            <h3 className={cn(
                'text-xs sm:text-sm md:text-base font-semibold',
                'text-gray-800 dark:text-gray-100',
                'group-hover:text-amber-600 dark:group-hover:text-amber-400',
                'transition-colors duration-300',
                'text-center',
                'line-clamp-1 sm:line-clamp-2'
            )}>
                {name}
            </h3>

            {/* Decorative underline */}
            <div className={cn(
                'mt-1 sm:mt-1.5 md:mt-2 mx-auto h-0.5 w-0',
                'bg-gradient-to-r from-transparent via-amber-500 to-transparent',
                'group-hover:w-12 sm:group-hover:w-16',
                'transition-all duration-300'
            )} />
        </div>
    )
}

export default CategoryName
