// Utility functions for Order Detail components

export function getStatusColor(status: string): string {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    paid: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  } as const;

  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
}
