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
import { createProduct, updateProduct, getCategories, uploadImageAction } from "@/lib/actions/products"
import UploadImage from "./__upload-image";
import { Separator } from "@/components/shadcnUI/separator";
import { AlertCircleIcon, ImageIcon, Link, X } from "lucide-react";
import { useAppStore } from "@/lib/stores/app-store";
import { z } from "zod"
import AddImageByUrl from "./__AddImageByUrl"
import Gallery from "./__Gallery"
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [imageField, setImageField] = useState<string>('')
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");




  const [uploading, setUploading] = useState(false)


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

  useEffect(() => {
    console.log(selectedImage)
    console.log(imageAlt);

  }, [selectedImage, imageAlt])


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
    <>
      <TabsContent value="images" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className={cn(dir === "rtl" && "text-right")}>
              {dir === "rtl" ? "الصور الرئيسية" : "Main Images"}
            </CardTitle>

            <Separator className="my-6 border-1 " />
          </CardHeader>

          {/* Image Upload Manually */}
          <CardContent className="space-y-4 h-fit">
            <div className={cn(dir === "rtl" && "flex-row-reverse", "lg:h-[600px] h-auto flex flex-wrap lg:flex-nowrap w-full gap-4")}>
              <div className="space-y-2 w-full lg:w-[50%]">
                <AddImageByUrl addUrlManually={(url) => addChosenImage({ url } as GalleryImage)} />
                <Separator className="my-6 border-1 " />
                <div className="space-y-2">
                  <Gallery addImageChosenManually={(image) => addChosenImage(image)} />
                </div>
                <Separator className="my-6 border-1 " />
                <div className="space-y-2">
                  <Label htmlFor="imageAlt" className={cn(dir === "rtl" && "text-right block")}>
                    {dir === "rtl" ? "النص البديل (Alt Text)" : "Alt Text"}
                  </Label>
                  <p className="text-sm text-gray-700" >example: tv-smart-samsung | shoes-blue-sports  </p>
                  <Input
                    id="imageAlt"
                    placeholder={dir === "rtl" ? "عنوان وصف الصورة" : "Image description title"}
                    className={cn(dir === "rtl" && "text-right")}
                    value={imageAlt || selectedImage?.altTextEn}
                    onChange={(e) => handleFormChange("imageAlt", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 w-full flex flex-col justify-center items-center lg:w-[50%]">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 h-full flex items-center justify-center bg-gray-50">
                  {images ? (
                    <>
                      <img
                        src={images[0] && images[0] || "/placeholder.svg"}
                        alt="Category preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => {
                          removeImage(images[0])
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          {dir === "rtl" ? "لا توجد صورة" : "No image selected"}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Images Preview */}
                {images && images.length > 0 && (
                  <div className="space-y-2">
                    <Label className={cn(dir === "rtl" && "text-right block")}>
                      {dir === "rtl" ? "معاينة الصور الإضافية" : "Additional Images Preview"}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {images.map((image: any, index: any) => (
                        <div key={index + image + 21} className="relative">
                          <img
                            src={image}
                            alt={`Additional image ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeImage(image)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </CardContent>
        </Card>



        <h1>Welcome</h1>


        {/* Additional Images Section */}
        <Card>
          <CardHeader>
            <CardTitle className={cn(dir === "rtl" && "text-right")}>
              {dir === "rtl" ? "صور إضافية" : "Additional Images"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add by URL */}
            <div className="space-y-2">
              <Label className={cn(dir === "rtl" && "text-right block")}>
                {dir === "rtl" ? "إضافة رابط الصورة" : "Add Image URL"}
              </Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={imageField}
                  onChange={(e) => setImageField(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={cn(dir === "rtl" && "text-right")}
                />
                <Button type="button" onClick={() => addChosenImage({ url: imageField } as GalleryImage)} disabled={!imageField.trim()}>
                  {t("common.add")}
                </Button>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className={cn(dir === "rtl" && "text-right")}>
                      {dir === "rtl" ? "معرض الصور" : "Gallery"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Gallery addImageChosenManually={(image) => addChosenImage(image)} />
                  </CardContent>
                </Card>
              </div>
            </div>


          </CardContent>
        </Card>
      </TabsContent >

    </>
  )
}

export default ImagesDashboard