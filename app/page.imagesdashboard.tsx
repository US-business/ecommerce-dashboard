"use client"

import ImagesDashboard from "@/components/dashboard/products/Images_dashboard"
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcnUI/tabs"

export default function ImagesDashboardPreview() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Images Dashboard Preview</h1>
        <p className="text-muted-foreground">
          Responsive image management interface for products
        </p>
      </div>

      <Tabs defaultValue="images" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="other" disabled>Other Tabs</TabsTrigger>
        </TabsList>
        
        <ImagesDashboard />
      </Tabs>
    </div>
  )
}