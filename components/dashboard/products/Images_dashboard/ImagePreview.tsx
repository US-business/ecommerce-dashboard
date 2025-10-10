"use client"

import type { FC } from "react"
import { Button } from "@/components/shadcnUI/button"
import { ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  imageUrl?: string
  onRemove: () => void
  dir: "ltr" | "rtl"
}

const ImagePreview: FC<ImagePreviewProps> = ({ imageUrl, onRemove, dir }) => {
  if (!imageUrl) {
    return (
      <div className="text-center">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          {dir === "rtl" ? "لا توجد صورة" : "No image selected"}
        </p>
      </div>
    )
  }

  return (
    <>
      <img
        src={imageUrl}
        alt="Category preview"
        className="w-full h-full object-contain"
        onError={(e) => {
          e.currentTarget.style.display = "none"
        }}
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className={cn(
          "absolute top-2 h-6 w-6",
          dir === "rtl" ? "left-2" : "right-2"
        )}
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </>
  )
}

export default ImagePreview