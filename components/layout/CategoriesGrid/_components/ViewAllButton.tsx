import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { ViewAllButtonProps } from './types'

const ViewAllButton: React.FC<ViewAllButtonProps> = ({ lang, dir }) => {
    return (
        <div className="mt-8 sm:mt-10 text-center">
            <Link
                href={`/${lang}/categories`}
                className={cn(
                    'inline-flex items-center gap-2',
                    'px-6 py-3 rounded-xl',
                    'bg-gradient-to-r from-amber-500 to-amber-600',
                    'hover:from-amber-600 hover:to-amber-700',
                    'text-white font-semibold',
                    'shadow-lg hover:shadow-xl',
                    'transition-all duration-300',
                    'hover:scale-105'
                )}
            >
                <span>{dir === 'rtl' ? 'عرض جميع الفئات' : 'View All Categories'}</span>
                <ArrowRight className={cn(
                    'w-5 h-5',
                    dir === 'rtl' && 'rotate-180'
                )} />
            </Link>
        </div>
    )
}

export default ViewAllButton
