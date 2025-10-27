import { GalleryImage } from "@/lib/stores/gallery-store"

export interface GalleryEditFormProps {
    image: GalleryImage
    onSuccess: () => void
    onCancel: () => void
}
