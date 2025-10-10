"use client"
import React from 'react'
import { cn } from "@/lib/utils"
import Image from 'next/image'
type ItemProps = {
   nameEn: string,
   nameAr: string,
   image: string,
   images: string[],
   price: number,
   discount: number,
   descriptionEn: string,
   descriptionAr: string,
   category: string,
   subCategory: string,
   brand: string,
   tags: string[],
   rating: number,
   reviews: number,
   stock: number,
   status: string,
}
const ImageItem = ({ product, dir }: { product: ItemProps, dir: string }) => {

   const [selectedImage, setSelectedImage] = React.useState(0);


   const productImages = product.images;
   if (!productImages) return null;

   const handleClickImage = (index: number) => {
      setSelectedImage(index);
   }

   return (
      <>
         {/* Product Images */}
         <div className="space-y-4 border flex flex-col sm:flex-row h-[50dvh]">
            {productImages.length > 1 && (
               <div className="flex flex-row sm:flex-col items-center gap-2 p-4 ">
                  {productImages.map((image, index) => (
                     <button
                        title='Click to select this image'
                        key={index}
                        onClick={() => handleClickImage(index)}
                        className={cn(
                           "relative aspect-square w-13 h-13 overflow-hidden rounded-lg border-2 transition-colors cursor-pointer",
                           selectedImage === index ? "border-primary" : "border-gray-200",
                        )}
                     >

                        <Image
                           src={image || "/placeholder.svg"}
                           alt={`${dir === "rtl" ? product.nameAr : product.nameEn} ${index + 1}`}
                           className="object-contain transition-transform group-hover:scale-105"
                           fill
                           sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                           loading="lazy"
                        />
                     </button>
                  ))}
               </div>
            )}
            <div className="aspect-square w-full h-full overflow-hidden rounded-lg bg-white">
               <Image
                  src={productImages[selectedImage] || "/placeholder.svg?height=600&width=600&text=Product"}
                  alt={dir === "rtl" ? product.nameAr : product.nameEn}
                  className="w-full h-full object-contain"
                  width={600}
                  height={600}
                  loading="lazy"
               />
            </div>
         </div>
      </>
   )
}

export default ImageItem