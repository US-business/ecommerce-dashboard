"use client"

import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { GalleryImage } from "@/lib/stores/gallery-store"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface InputFieldsProps {
  editingImage: GalleryImage | undefined
  onUpdate: (updates: Partial<GalleryImage>) => void
  disabled: boolean
}

export function InputFields({ editingImage, onUpdate, disabled }: InputFieldsProps) {
  const { t } = useI18nStore()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>{t('gallery.titleEnglish')}</Label>
        <Input 
          placeholder={t('gallery.titleEnglish')} 
          value={editingImage?.titleEn || ""} 
          onChange={(e) => onUpdate({ titleEn: e.target.value })} 
          disabled={disabled} 
        />
      </div>
      <div>
        <Label>{t('gallery.titleArabic')}</Label>
        <Input 
          placeholder={t('gallery.titleArabic')} 
          value={editingImage?.titleAr || ""} 
          onChange={(e) => onUpdate({ titleAr: e.target.value })} 
          dir="rtl" 
          disabled={disabled} 
        />
      </div>

      <div>
        <Label>{t('gallery.altTextEnglish')}</Label>
        <Input 
          placeholder={t('gallery.altTextEnglish')} 
          value={editingImage?.altTextEn || ""} 
          onChange={(e) => onUpdate({ altTextEn: e.target.value })} 
          disabled={disabled} 
        />
      </div>
      <div>
        <Label>{t('gallery.altTextArabic')}</Label>
        <Input 
          placeholder={t('gallery.altTextArabic')} 
          value={editingImage?.altTextAr || ""} 
          onChange={(e) => onUpdate({ altTextAr: e.target.value })} 
          dir="rtl" 
          disabled={disabled} 
        />
      </div>
    </div>
  )
}
