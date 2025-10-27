"use client"

import { useState } from "react"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Badge } from "@/components/shadcnUI/badge"
import { Button } from "@/components/shadcnUI/button"
import { X } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface TagsManagerProps {
  tags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  disabled: boolean
}

export function TagsManager({ tags, onAddTag, onRemoveTag, disabled }: TagsManagerProps) {
  const { t } = useI18nStore()
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (!newTag.trim()) return
    onAddTag(newTag.trim())
    setNewTag("")
  }

  return (
    <div>
      <Label>{t('gallery.tags')}</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-2">
            {tag}
            <Button 
              variant="secondary" 
              className="ml-1" 
              onClick={() => onRemoveTag(tag)} 
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input 
          placeholder={t('gallery.addTag')} 
          value={newTag} 
          onChange={(e) => setNewTag(e.target.value)} 
          onKeyDown={(e) => { 
            if (e.key === "Enter") { 
              e.preventDefault()
              handleAddTag() 
            } 
          }} 
          disabled={disabled} 
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddTag} 
          disabled={disabled}
        >
          {t('gallery.addTagButton')}
        </Button>
      </div>
    </div>
  )
}
