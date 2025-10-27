"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Upload } from "lucide-react"
import { GalleryForm } from "@/components/dashboard/gallery/gallery-form/gallery-form"

interface GalleryUploadCardProps {
  title: string
  onSuccess: () => void
}

export function GalleryUploadCard({ title, onSuccess }: GalleryUploadCardProps) {
  return (
    <Card className="w-full gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="sm:max-w-full">
        <GalleryForm
          onSuccess={onSuccess}
          onCancel={() => {}}
        />
      </CardContent>
    </Card>
  )
}
