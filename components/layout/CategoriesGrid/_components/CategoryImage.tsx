import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import type { CategoryImageProps } from './types'

const CategoryImage: React.FC<CategoryImageProps> = ({
    hasImage,
    imageUrl,
    categoryName,
    borderRadius,
    dir
}) => {
    return (
        <div
            className={cn(
                "relative aspect-square w-full ",
                "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800"
            )}
            style={{ borderRadius }}
        >
            {hasImage ? (
                <>
                    <Image
                        src={imageUrl}
                        alt={categoryName}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className={cn(
                            'object-contain',
                            'transition-transform duration-500 ease-out',
                            'group-hover:scale-110'
                        )}
                        quality={85}
                        style={{ borderRadius }}
                    />
                    {/* Overlay Gradient */}
                    {/* <div className={cn(
                        'absolute inset-0',
                        'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
                        'opacity-0 group-hover:opacity-100',
                        'transition-opacity duration-300'
                    )} /> */}
                </>
            ) : (
                // Fallback for categories without images
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn(
                        'p-4 sm:p-6 md:p-8 rounded-full',
                        'bg-gradient-to-br from-amber-100 to-amber-200',
                        'dark:from-amber-800 dark:to-amber-900',
                        'group-hover:scale-110 transition-transform duration-300'
                    )}>
                        <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-amber-600 dark:text-amber-300" />
                    </div>
                </div>
            )}

            {/* Hover Arrow Icon */}
            {/* <div className={cn(
                'absolute top-3 left-3',
                dir === 'rtl' ? 'left-auto right-3' : '',
                'p-2 rounded-full',
                'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm',
                'shadow-lg',
                'opacity-0 group-hover:opacity-100',
                'transform translate-y-2 group-hover:translate-y-0',
                'transition-all duration-300'
            )}>
                <ArrowRight className={cn(
                    'w-4 h-4 text-amber-600 dark:text-amber-400',
                    dir === 'rtl' && 'rotate-180'
                )} />
            </div> */}
        </div>
    )
}

export default CategoryImage
