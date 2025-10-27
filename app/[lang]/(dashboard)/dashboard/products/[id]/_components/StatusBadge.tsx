"use client"

import { Badge } from "@/components/shadcnUI/badge"

interface StatusBadgeProps {
  status: string
  t: (key: string) => string
}

export function StatusBadge({ status, t }: StatusBadgeProps) {
  const variants = {
    new: "default",
    sold: "secondary",
    coming_soon: "outline",
  } as const

  const statusMap: Record<string, string> = {
    new: "statusNew",
    sold: "statusNormal",
    coming_soon: "statusComingSoon",
  }

  const statusKey = statusMap[status] || "statusNormal"
  return (
    <Badge variant={variants[status as keyof typeof variants]}>
      {t(`products.${statusKey}`)}
    </Badge>
  )
}
