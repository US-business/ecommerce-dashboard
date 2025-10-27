"use client"

interface GalleryHeaderProps {
  title: string
  subtitle: string
}

export function GalleryHeader({ title, subtitle }: GalleryHeaderProps) {
  return (
    <div className="flex flex-col justify-between items-start gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
