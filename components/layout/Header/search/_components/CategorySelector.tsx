"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { cn } from "@/lib/utils"

type Category = {
  id: number
  nameEn: string
  nameAr: string
}

type Props = {
  categories: Category[] | undefined
  selectedCategory: string | null
  onCategorySelect: (id: number) => void
  dir: "ltr" | "rtl"
  t: (key: string) => string
}

export function CategorySelector({
  categories,
  selectedCategory,
  onCategorySelect,
  dir,
  t,
}: Props) {
  return (
    <Select
      value={selectedCategory ?? undefined}
      onValueChange={(v) => onCategorySelect(Number(v))}
      dir={dir}
    >
      <SelectTrigger className={cn("min-w-[70px] md:min-w-[100px]",
      "border-0 rounded-none focus:ring-0 focus:border-0 outline-none shadow-none cursor-pointer",
        "bg-amber-600 text-white [&>span]:text-white [&_svg]:!text-white [&_svg]:!opacity-100 placeholder:text-white")}>
        <SelectValue placeholder={dir === "rtl" ? "الكل" : "All"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"0"} id={"0"}> 
          {t("search.all")} 
        </SelectItem>
        {categories?.map((category) => (
          <SelectItem key={category.id} value={category.id.toString()} >
            {dir === "rtl" ? category.nameAr : category.nameEn}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
