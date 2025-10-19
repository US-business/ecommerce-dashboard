"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
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
import { cn } from "@/lib/utils"

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  deleting: boolean
}

export function DeleteUserDialog({ open, onOpenChange, onConfirm, deleting }: DeleteUserDialogProps) {
  const { t, dir } = useI18nStore()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn(dir === "rtl" && "text-right")}>
            {dir === "rtl" ? "تأكيد الحذف" : "Confirm Delete"}
          </AlertDialogTitle>
          <AlertDialogDescription className={cn(dir === "rtl" && "text-right")}>
            {dir === "rtl"
              ? "هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء."
              : "Are you sure you want to delete this user? This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={cn(dir === "rtl" && "flex-row-reverse")}>
          <AlertDialogCancel disabled={deleting}>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={deleting}>
            {deleting ? t("common.loading") : t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
