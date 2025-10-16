"use client"

import type { FC } from "react"
import { Button } from "@/components/shadcnUI/button"
import { Label } from "@/components/shadcnUI/label"
import { cn } from "@/lib/utils"

interface AdditionalImagesGridProps {
  images: string[]
  onRemove: (image: string) => void
  dir: "ltr" | "rtl"
}

const AdditionalImagesGrid: FC<AdditionalImagesGridProps> = ({ images, onRemove, dir }) => {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="space-y-2 w-full">
      <Label className={cn(dir === "rtl" && "text-right block")}>
        {dir === "rtl" ? "معاينة الصور الإضافية" : "Additional Images Preview"}
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div key={index + image + 21} className="relative group">
            <img
              src={image}
              alt={`Additional image ${index + 1}`}
              className="w-full aspect-square object-cover rounded-lg border transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className={cn(
                "absolute h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                dir === "rtl" ? "-top-2 -left-2" : "-top-2 -right-2"
              )}
              onClick={() => onRemove(image)}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdditionalImagesGrid