"use client"

import { Button } from "@/components/shadcnUI/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/shadcnUI/dialog"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  loading?: boolean
  title?: string
  description?: string
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  title,
  description,
}: DeleteConfirmationDialogProps) {
  const { t } = useI18nStore()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || t("dialogs.titles.warning")}</DialogTitle>
          <DialogDescription>
            {description || t("gallery.confirmDelete")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t("common.deleting") : t("common.delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
