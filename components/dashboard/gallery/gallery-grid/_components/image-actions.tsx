"use client"

import { Button } from "@/components/shadcnUI/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/shadcnUI/dropdown-menu"
import { MoreVertical, Edit, Copy, Download, Trash2 } from "lucide-react"
import { GalleryImage } from "@/lib/stores/gallery-store"

interface ImageActionsProps {
  image: GalleryImage
  onEdit: () => void
  onCopyUrl: () => void
  onDelete: () => void
}

export function ImageActions({
  image,
  onEdit,
  onCopyUrl,
  onDelete,
}: ImageActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="secondary">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopyUrl}>
          <Copy className="h-4 w-4 mr-2" />
          Copy URL
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={image.url} download target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            Download
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
