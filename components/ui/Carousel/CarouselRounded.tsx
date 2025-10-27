

import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/shadcnUI/carousel"
import { Badge } from "@/components/shadcnUI/badge"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/types/category'

type SliderRoundedProps = {
   items: Category[] | undefined;
   dir: string;
   lang: string;
   className?: string;
}


const CarouselRounded = ({ items, dir, lang, className }: SliderRoundedProps) => {
   return (
      <>
         <div className={`flex sm:max-w-6xl max-w-full basis-1/3 ${className}`}>
            <Carousel
               opts={{
                  breakpoints: {
                     768: { slidesToScroll: 2 },
                     1024: { slidesToScroll: 3 },
                     1280: { slidesToScroll: 4 },
                     1536: { slidesToScroll: 5 },
                  },
                  align: "start",
                  loop: true,
                  slidesToScroll: 1, // 👈 ده اللي بيحدد يتحرك بكام عنصر

                  direction: dir === "rtl" ? "rtl" : "ltr",
               }}

               className="w-full"
            >
               <CarouselContent className="my-10 gap-2 sm:gap-1 md:gap-2 lg:gap-6 px-9">
                  {items?.map((item) => {
                     const categoryName = dir === 'rtl' ? item.nameAr : item.nameEn;
                     
                     return (
                        <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                           <Link
                              href={`/${lang}/category/${item.slug}`}
                              className="block"
                           >
                              <Card className="group transition-all duration-300 bg-transparent border-0 p-0 hover:scale-105 cursor-pointer">
                                 <CardContent className="p-0 gap-2 flex flex-col justify-between select-none">

                                 <div className="relative mx-auto w-20 h-20 rounded-full sm:w-20 sm:h-20 lg:w-30 lg:h-30 bg-gradient-to-b from-amber-200 to-gray-100">
                                    <div
                                       className="relative w-full h-full z-20  transition-all duration-300  group-hover:scale-110 group-active:scale-95  p-4"
                                       style={{
                                          background: item.image ? `url(${item.image})` : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                       }}
                                    >
                                       <Image
                                          src={item.image || "/placeholder.svg"}
                                          alt={categoryName}
                                          fill
                                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                                          className="relative w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                                       />

                                       {/* Hover overlay */}
                                       <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                                       {/* Shine effect */}
                                       <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" >
                                          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse" />
                                       </div>
                                    </div> 
                                 </div>
                                    <div className="relative text-center flex items-center justify-center">
                                       <Badge className={cn("text-[1rem] font-medium text-center text-amber-900 relative bg-amber-100 group-hover:bg-amber-200 transition-colors")}>
                                          {categoryName}
                                       </Badge>
                                    </div>
                                 </CardContent>
                              </Card>
                           </Link>
                        </CarouselItem>
                     )
                  })}
               </CarouselContent>
               {/* <div className="absolute top-0 left-0 pointer-events-none bg-linear-[90deg,#ffff,transparent_20%,transparent_75%,#ffff] w-full h-full" /> */}
               <CarouselPrevious className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-white" />
               <CarouselNext className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-white" />
            </Carousel>
         </div >
      </>
   )
}

export default CarouselRounded

















