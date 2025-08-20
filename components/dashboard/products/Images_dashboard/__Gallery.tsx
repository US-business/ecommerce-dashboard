'use client';

import { useEffect, useState } from 'react';
import { getAllImagesAction } from '@/lib/actions/products';
import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';
import { useAppStore } from '@/lib/stores/app-store';
import z from 'zod';
import { cn } from '@/lib/utils';
import { useI18nStore } from '@/lib/stores/i18n-store';


type GalleryProps = {
   addUrlChosenManually: (url: string) => void;
}

export default function Gallery({ addUrlChosenManually }: GalleryProps) {

   const [imageURLChosen, setImageURLChosen] = useState('')
   const [message, setMessage] = useState('')
   const [error, setError] = useState(false)
     const { t, dir } = useI18nStore()

   const { images, setImages } = useAppStore();

   useEffect(() => {
      getAllImagesAction().then(res => setImages(res));
   }, [setImages]);

   if (!images && images?.length === 0) {
      setMessage('Your gallery currently has no Images')
      setMessage('المعرض لا يحتوي على أي صور حاليا.')
   }

   const handleAddUrl = () => {
      if (!imageURLChosen.trim()) {
         setMessage("❌ Image URL is required");
         setError(true);
         return;
      }

      try {
         addUrlChosenManually(imageURLChosen);
         setMessage("✔ Image URL added successfully!");
         setError(false);
         setImageURLChosen("");
      } catch (err) {
         console.error("Error adding image URL:", err);
      }

   };

   return (
      <Dialog>
         <DialogTrigger asChild>
            <h5  className={cn(dir === "rtl" && "text-right block")}>
               {dir === "rtl" ? "أختر من المعرض" : "Choose from Gallery"}
            </h5>
         </DialogTrigger>
         <DialogTrigger asChild>
            {message && (
               <p className={cn("text-sm", error ? "text-red-800" : "text-green-800")}>
                  {message}
               </p>
            )}
         </DialogTrigger>
         <DialogTrigger asChild>
            <Button className="w-full" variant="outline">View Gallery</Button>
         </DialogTrigger>
         <DialogContent className="max-w-[425px] lg:max-w-[60%]">
            <DialogHeader>
               <DialogTitle>Edit profile</DialogTitle>
               <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
               </DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap h-60 gap-4 overflow-y-scroll">
               {images.map((img: { id: string; url: string }) => (
                  <div
                     key={img.id}
                     className={`${imageURLChosen === img.url ? "border-5 border-blue-400" : "border-1 border-neutral-300"} space-y-2 relative w-60 lg:w-44 h-33  overflow-hidden  rounded-lg cursor-pointer `}
                  >
                     <Image onClick={() => setImageURLChosen(img.url)} loading="lazy" key={img.id} src={img.url} fill className="object-contain" sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' alt={img.id} />
                  </div>
               ))}
            </div>
            <DialogFooter>
               <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
               </DialogClose>

               {images && images.length > 0 ? (
                  <DialogClose asChild>
                     <Button type="button" onClick={handleAddUrl}>
                        Save changes
                     </Button>
                  </DialogClose>
               ) : (
                  <p className="text-amber-600 text-sm">{message}</p>
               )}
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
