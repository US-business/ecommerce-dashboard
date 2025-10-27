"use client"

interface FormErrorDisplayProps {
  error: string | null
}

export function FormErrorDisplay({ error }: FormErrorDisplayProps) {
  if (!error) return null

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-600 text-sm">{error}</p>
    </div>
  )
}
