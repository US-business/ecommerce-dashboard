import { FormSkeleton } from "@/components/ui/skeletons"

export default function Loading() {
  return (
    <div className="p-6">
      <FormSkeleton fields={8} />
    </div>
  )
}
