import { DashboardTableSkeleton } from "@/components/ui/skeletons"

export default function Loading() {
  return (
    <div className="p-6">
      <DashboardTableSkeleton rows={10} />
    </div>
  )
}
