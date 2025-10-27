type Props = {
  dir: "ltr" | "rtl"
}

export function LoadingState({ dir }: Props) {
  return (
    <div className="p-4 md:p-6 text-center">
      <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary mx-auto"></div>
      <p className="text-xs md:text-sm text-muted-foreground mt-2">
        {dir === "rtl" ? "جاري البحث..." : "Searching..."}
      </p>
    </div>
  )
}
