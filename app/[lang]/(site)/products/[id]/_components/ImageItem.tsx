"use client"
import React from 'react'
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { ProductProps } from '@/types/product'

const ImageItem = ({ product, dir }: { product: ProductProps, dir: string }) => {

   const [selectedImage, setSelectedImage] = React.useState(0);

   const productImages = product.images;
   if (!productImages || productImages.length === 0) return null;

   const handleClickImage = (index: number) => {
      setSelectedImage(index);
   }

   return (
      <>
         {/* Product Images */}
         <div className="space-y-4 flex flex-col sm:flex-row h-[55dvh]">
            {productImages.length > 1 && (
               <div className="flex flex-row sm:flex-col items-start gap-3 p-2 overflow-x-auto sm:overflow-y-auto">
                  {productImages.map((image, index) => (
                     <button 
                        title='Click to select this image'
                        key={index}
                        onClick={() => handleClickImage(index)}
                        className={cn(
                           "relative flex-shrink-0 aspect-square w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-lg border-2 transition-all hover:border-primary/50 cursor-pointer hover:scale-105",
                           selectedImage === index ? "border-primary ring-2 ring-primary/30" : "border-gray-200",
                        )}
                     >
                        <Image
                           src={image || "/placeholder.svg"}
                           alt={`${dir === "rtl" ? product.nameAr : product.nameEn} ${index + 1}`}
                           className="object-cover transition-transform"
                           fill
                           sizes='100px'
                           loading="lazy"
                        />
                     </button>
                  ))}
               </div>
            )}
            <div className="flex-1 aspect-square w-full h-full overflow-hidden rounded-lg bg-gray-50 border border-gray-200">
               <Image
                  src={productImages[selectedImage] || "/placeholder.svg?height=600&width=600&text=Product"}
                  alt={dir === "rtl" ? product.nameAr : product.nameEn}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  width={600}
                  height={600}
                  priority={selectedImage === 0}
                  loading={selectedImage === 0 ? "eager" : "lazy"}
               />
            </div>
         </div>
      </>
   )
}

export default ImageItem