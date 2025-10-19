"use client"

interface SignInDividerProps {
  dir: "ltr" | "rtl"
}

export function SignInDivider({ dir }: SignInDividerProps) {
  return (
    <div className="relative mt-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-4 text-gray-500">
          {dir === "rtl" ? "أو" : "Or"}
        </span>
      </div>
    </div>
  )
}
