type Props = {
  dir: "ltr" | "rtl"
}

export function EmptyState({ dir }: Props) {
  return (
    <div className="p-4 md:p-6 text-center text-xs md:text-sm text-muted-foreground">
      {dir === "rtl" ? "لا توجد منتجات" : "No products found"}
    </div>
  )
}
