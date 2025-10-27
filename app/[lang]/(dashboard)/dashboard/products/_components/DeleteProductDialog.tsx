"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcnUI/alert-dialog"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface DeleteProductDialogProps {
  isOpen: boolean
  isDeleting: boolean
  dictionary: any
  onClose: () => void
  onConfirm: () => void
}

export function DeleteProductDialog({
  isOpen,
  isDeleting,
  dictionary,
  onClose,
  onConfirm,
}: DeleteProductDialogProps) {
  const { t } = useI18nStore()

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("products.confirmDeleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("products.confirmDelete")} {t("products.deleteWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {dictionary.common.cancel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? dictionary.common.loading : dictionary.common.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
