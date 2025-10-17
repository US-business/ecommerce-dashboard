import React from 'react'
import { z } from 'zod'

type Props = {
   id?: string;
   name?: string;
   accept?: string;
   onChange?: (file: File) => void;
   className?: string;
   disabled?: boolean;
   title?: string;
};


const UploadImage = ({
   id = "upload-image",
   name = "image",
   accept = "image/*",
   onChange,
   className = "",
   disabled,
   title = "Upload Image",
}: Props) => {
   const fileSchema = z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
         message: "Only image files are allowed",
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
         message: "File size must be less than 5MB",
      });

   const inputRef = React.useRef<HTMLInputElement | null>(null);
   const [dragging, setDragging] = React.useState(false);
   const [uploadMessage, setUploadMessage] = React.useState("");
   const [isError, setIsError] = React.useState(false);
   const [uploading, setUploading] = React.useState(false);

   const handleFileValidation = (file: File | null) => {
      if (!file) {
         setUploadMessage("❌ No file selected");
         setIsError(true);
         return false;
      }
      const result = fileSchema.safeParse(file);
      if (!result.success) {
         setUploadMessage(result.error.errors[0].message);
         setIsError(true);
         return false;
      }
      return true;
   };

   const handleFileUpload = (file: File) => {
      setUploading(true);
      setUploadMessage("Uploading...");
      setIsError(false);
      try {
         onChange?.(file);
         setUploadMessage("✔ Main image uploaded successfully!");
         setIsError(false);
      } catch (error) {
         setUploadMessage(
            "❌ Upload error: " +
            (error instanceof Error ? error.message : "Unknown error")
         );
         setIsError(true);
      } finally {
         setUploading(false);
      }
   };

   const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!handleFileValidation(file)) return;
      handleFileUpload(file as File);
   };

   const onDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0] ?? null;
      if (!handleFileValidation(file)) return;
      handleFileUpload(file as File);
   };

   const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(true);
   };

   const onDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
   };

   const onBrowseClick = () => inputRef.current?.click();

   return (
      <div className={`w-full  ${className}`}>
         {uploadMessage && (
            <p
               className={`text-sm mt-1 ${isError ? "text-red-600" : "text-green-600"
                  }`}
            >
               {uploadMessage}
            </p>
         )}
         <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={!uploading ? onBrowseClick : undefined}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 p-4 transition-shadow 
        ${dragging ? "border-blue-400 bg-blue-50 shadow-sm" : "border-dashed border-gray-300 bg-white"} 
        ${disabled || uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
         >
            <input
               ref={inputRef}
               id={id}
               name={name}
               type="file"
               accept={accept}
               className="hidden"
               onChange={onInputChange}
               disabled={disabled || uploading}
               title='Upload Image'
            />

            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-gray-400">
               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
               <polyline points="7 10 12 5 17 10" strokeLinecap="round" strokeLinejoin="round" />
               <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="text-center">
               <p className={`${disabled? "text-md" : "text-sm " } font-semibold text-gray-700`}>{!disabled ? title : "Uploading ..." }</p>
               <p className="mt-1 text-xs text-gray-500">
                  {!disabled ? "Click or drag & drop an image file here" : ""}
               </p>
            </div>
         </div>
      </div>
   );
};

export default UploadImage;




