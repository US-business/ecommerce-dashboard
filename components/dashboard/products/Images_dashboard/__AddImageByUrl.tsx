import React from 'react'
import { useState } from 'react'
import { Label } from '@/components/shadcnUI/label'
import { useI18nStore } from '@/lib/stores/i18n-store'
import { Link } from 'lucide-react'
import { Input } from '@/components/shadcnUI/input'
import z from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/shadcnUI/button'

type AddImageByUrlProps = {
   addUrlManually: (e: string) => void
}

const AddImageByUrl = ({ addUrlManually }: AddImageByUrlProps) => {
   const { t, dir } = useI18nStore()
   const [imageField, setImageField] = useState("")
   const [message, setMessage] = useState("")
   const [error, setError] = useState(false)



   const handleAddUrl = () => {
      if (!imageField.trim()) {
         setMessage("❌ Image URL is required");
         setError(true);
         return;
      }

      if (!z.string().url().safeParse(imageField).success) {
         setMessage("❌ Invalid URL format for main image");
         setError(true);
         return;
      }

      try {
         addUrlManually(imageField);
         setMessage("✔ Image URL added successfully!");
         setError(false);
         setImageField("");
      } catch (err) {
         console.error("Error adding image URL:", err);
      }

   };


   return (
      <>
         <Label htmlFor="addImageByUrl" className={cn(dir === "rtl" && "text-right", "flex gap-2")}>
            <Link className=" w-4 " /> <p>{t("info.addImageUrl")}</p>
         </Label>
         {message && (
            <p className={cn("text-sm", error ? "text-red-800" : "text-green-800")}>
               {message}
            </p>
         )}
         <Input
            // ref={inputRef}
            id="addImageByUrl"
            type="url"
            value={imageField}
            onChange={(e) => setImageField(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={cn(dir === "rtl" && "text-right")}
         />

         <Button type="button" onClick={handleAddUrl}
            className="w-full cursor-pointer"
            disabled={!imageField.trim()}
         >
            {t("common.add")}
         </Button>
      </>
   )
}

export default AddImageByUrl