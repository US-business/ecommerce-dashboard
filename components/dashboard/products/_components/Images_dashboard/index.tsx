"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Textarea } from "@/components/shadcnUI/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { Switch } from "@/components/shadcnUI/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcnUI/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcnUI/tabs"
import { cn } from "@/lib/utils"
import { uploadImageAction } from "@/lib/actions/products"
import UploadImage from "./__upload-image";
import { Separator } from "@/components/shadcnUI/separator";
import { AlertCircleIcon, ImageIcon, Link, X } from "lucide-react";
import { useAppStore } from "@/lib/stores/app-store";
import { z } from "zod"
import AddImageByUrl from "./__AddImageByUrl"
import Gallery from "./__Gallery"
import ImagePreview from "./ImagePreview"
import AdditionalImagesGrid from "./AdditionalImagesGrid"
import { ProductProps } from "@/types/product"
import { useGalleryStore } from "@/lib/stores"
import { GalleryImage } from "@/lib/stores/gallery-store"

interface ProductFormProps {
  product?: any
  isEdit?: boolean
}

const ImagesDashboard = ({ product, isEdit = false }: ProductFormProps) => {

  const { t, dir } = useI18nStore()
  const router = useRouter()
  // Removed unused state variables for cleaner code






  const { setSelectedImage, selectedImage } = useGalleryStore();
  const { productState, updateProductField, updateProductImages , removeProductImage} = useAppStore();
  const { imageAlt, images } = productState;



  const handleFormChange = (field: keyof ProductProps, value: any) => {
    updateProductField(field, value);
    if (field === "discountType" && value === "none") {
      updateProductField("discountValue", undefined);
      return
    }
  };


  const handleFormImages = (value: string) => {
    updateProductImages(value);
  };

  // Image state is managed through global store


  // Function to add image URL manually
  const addChosenImage = (image: GalleryImage) => {
    setSelectedImage(image)
    updateProductImages(image?.url || "");
  }

  // Function to remove an image
  const removeImage = (image: string) => {
    removeProductImage(image)
  }

  return (
    <TabsContent value="images" className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={cn(dir === "rtl" && "text-right")}>
            {dir === "rtl" ? "الصور الرئيسية" : "Main Images"}
          </CardTitle>
          <Separator className="my-4 md:my-6" />
        </CardHeader>

        <CardContent className="space-y-4 p-4 md:p-6">
          <div className={cn(
            "flex flex-col gap-4 md:gap-6",
            dir === "rtl" ? "lg:flex-row-reverse" : "lg:flex-row"
          )}>
            {/* Left Panel - Controls */}
            <div className="space-y-4 w-full lg:w-1/2 order-2 lg:order-1">
              {/* Add Image by URL */}
              <div className="space-y-2">
                <AddImageByUrl addUrlManually={(url) => addChosenImage({ url } as GalleryImage)} />
              </div>

              <Separator className="my-4" />

              {/* Gallery Selection */}
              <div className="space-y-2">
                <Gallery addImageChosenManually={(image) => addChosenImage(image)} />
              </div>

              <Separator className="my-4" />

              {/* Alt Text Input */}
              <div className="space-y-2">
                <Label htmlFor="imageAlt" className={cn(dir === "rtl" && "text-right block")}>
                  {dir === "rtl" ? "النص البديل (Alt Text)" : "Alt Text"}
                </Label>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {dir === "rtl" 
                    ? "مثال: تلفزيون-ذكي-سامسونج | حذاء-أزرق-رياضي" 
                    : "example: tv-smart-samsung | shoes-blue-sports"}
                </p>
                <Input
                  id="imageAlt"
                  placeholder={dir === "rtl" ? "عنوان وصف الصورة" : "Image description title"}
                  className={cn(dir === "rtl" && "text-right")}
                  value={imageAlt || selectedImage?.altTextEn}
                  onChange={(e) => handleFormChange("imageAlt", e.target.value)}
                />
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="space-y-4 w-full lg:w-1/2 order-1 lg:order-2">
              {/* Main Image Preview */}
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 w-full min-h-[250px] md:min-h-[350px] lg:min-h-[400px] flex items-center justify-center bg-gray-50">
                <ImagePreview
                  imageUrl={images?.[0]}
                  onRemove={() => removeImage(images?.[0] || "")}
                  dir={dir}
                />
              </div>

              {/* Additional Images Grid */}
              <AdditionalImagesGrid
                images={images || []}
                onRemove={removeImage}
                dir={dir}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default ImagesDashboard