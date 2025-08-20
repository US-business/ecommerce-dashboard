"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { createProduct, updateProduct, getCategories, uploadImageAction } from "@/lib/actions/products"
import UploadImage from "./__upload-image";
import { Separator } from "@/components/ui/separator";
import { AlertCircleIcon, ImageIcon, Link, X } from "lucide-react";
import { useAppStore } from "@/lib/stores/app-store";
import { z } from "zod"
import AddImageByUrl from "./__AddImageByUrl"
import Gallery from "./__Gallery"
import { ProductProps } from "@/types/product"

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


  const { productState, updateProductField, updateProductImages } = useAppStore();
  const { image, imageName, images } = productState;



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



  // Unified image upload function to API  /  cloudinary رفع مباشر الى 
  const getSignature = async () => {
    const response = await fetch('/api/sign-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paramsToSign: {
          timestamp: Math.round(new Date().getTime() / 1000),
        },
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to get signature');
    }
    const { signature } = await response.json();
    return signature;
  };

  async function uploadImage(file: File) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await getSignature();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  }

  // Unified image upload function to API  /  cloudinary رفع مباشر الى 
  // اسرع عند رفع الصور بدون التقيد بمساحة الملف
  const handleImageUpload_use_API = async (file: File, isMainImage: boolean = true) => {
    try {
      setUploading(true);

      const imageUrl = await uploadImage(file);
      console.log("Uploaded image URL:", imageUrl);

      if (isMainImage) {
        handleFormChange("image", imageUrl);
      } else {
        handleFormImages(imageUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };


  //  NextJS عن طريق سيرفر   cloudinary  رفع غير مباشر الى 
  //  Unified image upload function to server Action
  const handleImageUpload_use_server_action = async (file: File, isMainImage: boolean = true) => {

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const uploadResult = await uploadImageAction(formDataUpload);

      if (uploadResult.success && uploadResult.url) {
        if (isMainImage) {
          handleFormChange("image", uploadResult.url);
        } else {
          handleFormImages(uploadResult.url);
        }
      } else {
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };



  // Function to add image URL manually
  const addImageByUrl = (imageUrl: string, isMainImage: boolean = true) => {
    if (isMainImage) {
      handleFormChange("image", imageUrl);
    } else {
      handleFormImages(imageUrl);
    }
  }

  // Function to remove an image
  const removeImage = (index: number) => {
    updateProductImages(product?.images?.[index] || "")
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
                <AddImageByUrl addUrlManually={(url) => addImageByUrl(url)} />
                <Separator className="my-6 border-1 " />
                <UploadImage
                  id="mainImage"
                  name="image"
                  accept="image/*"
                  onChange={(file: any) => handleImageUpload_use_API(file)}
                  disabled={uploading}
                  title={t("products.imageMainUpload")}
                  className={cn(dir === "rtl" && "text-right")}
                />
                <Separator className="my-6 border-1 " />
                <div className="space-y-2">

                  <Gallery addUrlChosenManually={(url) => addImageByUrl(url)} />
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
                    value={imageName}
                    onChange={(e) => handleFormChange("imageName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 w-full">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 h-full flex items-center justify-center bg-gray-50">
                  {image ? (
                    <>
                      <img
                        src={image || "/placeholder.svg"}
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
                          addImageByUrl("")
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 
          <Card className={cn(dir === "rtl" && "flex-row-reverse", " w-full gap-4")}>

          </Card> */}
        {/* </div> */}



        {/* {images && images?.length > 0 && (
                <Card>
                  <CardTitle className={cn(dir === "rtl" && "text-right", "block mx-6 ")}>
                    {dir === "rtl" ? "معاينة الصور" : "Images Preview"}
                  </CardTitle>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {images.map((image: string, index: any) => (
                          <>
                            <img
                              key={index + image}
                              src={image || "/placeholder.svg"}
                              alt={`Category preview ${index}`}
                              className="w-32 h-32 object-cover rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                              }}
                            />
                            <div key={index} className="relative">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )} */}
        {/* </CardContent>
          </Card>
           */}



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
                <Button type="button" onClick={() => addImageByUrl(imageField, false)} disabled={!imageField.trim()}>
                  {t("common.add")}
                </Button>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className={cn(dir === "rtl" && "text-right")}>
                      {dir === "rtl" ? "رفع الصورة الرئيسية" : "Upload main Image"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>

                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Upload Additional Image */}
            <div className="space-y-2">
              <Label className={cn(dir === "rtl" && "text-right block")}>
                {dir === "rtl" ? "أو ارفع صورة إضافية" : "Or Upload Additional Image"}
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload_use_API(file, false)
                }}
                disabled={uploading}
              />
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
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent >

      {uploading && (
        <div className="text-center">
          <p className={cn(dir === "rtl" && "text-right")}>
            {dir === "rtl" ? "جاري الرفع..." : "Uploading..."}
          </p>
        </div>
      )
      }
    </>
  )
}

export default ImagesDashboard