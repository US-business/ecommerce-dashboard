"use client"

import { Button } from "@/components/shadcnUI/button"

interface GalleryPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  translations: {
    previous: string
    next: string
    pageInfo: string
  }
}

export function GalleryPagination({
  currentPage,
  totalPages,
  onPageChange,
  translations
}: GalleryPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        {translations.previous}
      </Button>

      <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
        {translations.pageInfo} {`Page ${currentPage} of ${totalPages}`}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        {translations.next}
      </Button>
    </div>
  )
}
