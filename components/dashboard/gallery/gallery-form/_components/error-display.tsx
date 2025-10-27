"use client"

import { Button } from "@/components/shadcnUI/button"
import { AlertCircle, X } from "lucide-react"

interface ErrorDisplayProps {
   error: string | null
   onDismiss: () => void
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
   if (!error) return null

   return (
      <div className="mt-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm flex items-center gap-2">
         <AlertCircle className="h-4 w-4 shrink-0" />
         <span>{error}</span>
         <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="ml-auto"
         >
            <X className="h-3 w-3" />
         </Button>
      </div>
   )
}
