import { ProductsPageSkeleton } from "@/components/ui/skeletons/ProductsPageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        <ProductsPageSkeleton />
      </div>
    </div>
  );
}