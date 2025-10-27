"use client"

import { Button } from "@/components/shadcnUI/button"
import { Save } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface FormActionsProps {
  onCancel: () => void
  onSave: () => void
  saving: boolean
  disabled: boolean
}

export function FormActions({ onCancel, onSave, saving, disabled }: FormActionsProps) {
  const { t, dir } = useI18nStore()
  
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <Button variant="outline" onClick={onCancel} disabled={saving}>
        {t('common.cancel')}
      </Button>
      <Button 
        onClick={onSave} 
        disabled={saving || disabled} 
        className="flex items-center gap-2"
      >
        {saving ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <Save className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
        )}
        {t('gallery.saveChanges')}
      </Button>
    </div>
  )
}
