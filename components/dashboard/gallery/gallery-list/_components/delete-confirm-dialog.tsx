"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/shadcnUI/dialog'
import { Button } from '@/components/shadcnUI/button'
import { GalleryImage } from "@/lib/stores/gallery-store"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface DeleteConfirmDialogProps {
    image: GalleryImage | null
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}

export function DeleteConfirmDialog({
    image,
    onClose,
    onConfirm,
    loading
}: DeleteConfirmDialogProps) {
    const { t } = useI18nStore()

    return (
        <Dialog open={!!image} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("dialogs.titles.warning")}</DialogTitle>
                    <DialogDescription>
                        {t("gallery.confirmDelete")}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {t("common.delete")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
