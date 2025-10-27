import React from 'react'
import { ShoppingBag } from 'lucide-react'
import type { SectionHeaderProps } from './types'

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, dir }) => {
    return (
        <div className="mb-2 sm:mb-4 md:mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-md sm:rounded-lg shadow-md sm:shadow-lg">
                        <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                </div>
                {dir === "rtl" ? (
                    <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-transparent to-slate-800 mx-4 max-w-xs" />
                ) : (
                    <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent mx-4 max-w-xs" />
                )}
            </div>
        </div>
    )
}

export default SectionHeader
