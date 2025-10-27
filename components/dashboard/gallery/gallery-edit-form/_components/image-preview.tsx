"use client"

import Image from "next/image"

interface ImagePreviewProps {
  url: string
  fileName: string
}

export function ImagePreview({ url, fileName }: ImagePreviewProps) {
  return (
    <div className="flex justify-center">
      <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
        <Image 
          src={url || "/placeholder.jpg"} 
          alt={fileName} 
          width={192} 
          height={192} 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>
  )
}
