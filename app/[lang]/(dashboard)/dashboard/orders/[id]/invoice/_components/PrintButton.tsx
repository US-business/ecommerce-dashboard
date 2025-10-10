'use client'

import { Button } from "@/components/shadcnUI/button"
import { Printer } from "lucide-react"

export default function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="absolute top-4 right-4 no-print">
      <Printer className="h-4 w-4 mr-2" />
      Print Invoice
    </Button>
  )
}