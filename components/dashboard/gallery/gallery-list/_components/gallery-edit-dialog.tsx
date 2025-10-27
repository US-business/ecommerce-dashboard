"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/shadcnUI/dialog'
import { GalleryImage } from "@/lib/stores/gallery-store"
import { GalleryEditForm } from '../../gallery-edit-form/gallery-edit-form'
import { useI18nStore } from "@/lib/stores/i18n-store"

interface GalleryEditDialogProps {
    image: GalleryImage | undefined
    onClose: () => void
    onSuccess: () => void
}

export function GalleryEditDialog({
    image,
    onClose,
    onSuccess
}: GalleryEditDialogProps) {
    const { t } = useI18nStore()

    return (
        <Dialog open={!!image} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{t("gallery.editImage")}</DialogTitle>
                    <DialogDescription>
                        {t("gallery.subtitle")}
                    </DialogDescription>
                </DialogHeader>
                <GalleryEditForm
                    image={image!}
                    onSuccess={() => {
                        onClose()
                        onSuccess()
                    }}
                    onCancel={onClose}
                />
            </DialogContent>
        </Dialog>
    )
}
