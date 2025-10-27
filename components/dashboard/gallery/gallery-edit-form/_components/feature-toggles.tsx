"use client"

import { Switch } from "@/components/shadcnUI/switch"
import { Label } from "@/components/shadcnUI/label"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface FeatureTogglesProps {
  isFeatured: boolean
  isDefault: boolean
  onFeaturedChange: (checked: boolean) => void
  onDefaultChange: (checked: boolean) => void
  disabled: boolean
}

export function FeatureToggles({
  isFeatured,
  isDefault,
  onFeaturedChange,
  onDefaultChange,
  disabled
}: FeatureTogglesProps) {
  const { t, dir } = useI18nStore()
  
  return (
    <div className="flex gap-6">
      <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-2`}>
        <Switch 
          id="featured" 
          checked={isFeatured} 
          onCheckedChange={onFeaturedChange} 
          disabled={disabled} 
        />
        <Label htmlFor="featured">{t('gallery.featured')}</Label>
      </div>
      <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-2`}>
        <Switch 
          id="default" 
          checked={isDefault} 
          onCheckedChange={onDefaultChange} 
          disabled={disabled} 
        />
        <Label htmlFor="default">{t('gallery.default')}</Label>
      </div>
    </div>
  )
}
