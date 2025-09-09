
export type CloudinaryUploadResult = {
   asset_id: string
   public_id: string
   version: number
   version_id: string
   signature: string
   width: number
   height: number
   format: string
   resource_type: string
   created_at: string
   tags: string[]
   bytes: number
   type: string
   etag: string
   placeholder: boolean
   url: string
   secure_url: string
   original_filename: string
   folder?: string
}

type UploadOptions = {
   folder?: string // default: "gallery"
   onProgress?: (pct: number) => void
}




export const getSignature = async (paramsToSign: { folder: string }) => {
   console.log("Client: Requesting signature for params:", paramsToSign)

   const res = await fetch("/api/sign-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paramsToSign), // ✨ ابعت folder مباشرة
   })

   if (!res.ok) throw new Error("Failed to get signature")

   const { signature, timestamp } = await res.json()
   console.log("Client: Received signature:", signature, "timestamp:", timestamp)

   return { signature, timestamp } as { signature: string; timestamp: number }
}





// Main upload function with better error handling
export async function uploadWithSignature(
   file: File,
   opts: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
   // Validate inputs
   if (!file) {
      throw new Error('File is required');
   }

   const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

   if (!apiKey || !cloudName) {
      throw new Error('Cloudinary public configuration missing. Check NEXT_PUBLIC_CLOUDINARY_API_KEY and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
   }

   const folder = opts.folder ?? "gallery";

   try {
      ///// Get signature from backend


      const { signature, timestamp } = await getSignature({ folder });

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("api_key", apiKey);

      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      // Create XMLHttpRequest with better error handling
      const xhr = new XMLHttpRequest();

      const promise = new Promise<CloudinaryUploadResult>((resolve, reject) => {
         xhr.open("POST", url);

         xhr.onload = () => {
            try {
               const data = JSON.parse(xhr.responseText);

               if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(data);
               } else {
                  console.error("Cloudinary upload error:", {
                     status: xhr.status,
                     statusText: xhr.statusText,
                     response: data
                  });

                  const errorMessage = data.error?.message ||
                     data.message ||
                     `Upload failed with status ${xhr.status}`;
                  reject(new Error(errorMessage));
               }
            } catch (parseError) {
               console.error("Failed to parse Cloudinary response:", {
                  status: xhr.status,
                  responseText: xhr.responseText,
                  parseError
               });
               reject(new Error(`Invalid response from Cloudinary (Status: ${xhr.status})`));
            }
         };

         xhr.onerror = () => {
            console.error("Network error during upload");
            reject(new Error("Network error occurred during upload"));
         };

         xhr.ontimeout = () => {
            console.error("Upload timeout");
            reject(new Error("Upload request timed out"));
         };

         // Set timeout (30 seconds)
         xhr.timeout = 30000;

         // Progress tracking
         if (xhr.upload && typeof opts.onProgress === "function") {
            xhr.upload.onprogress = (e) => {
               if (e.lengthComputable) {
                  const percentage = Math.round((e.loaded / e.total) * 100);
                  opts.onProgress!(percentage);
               }
            };
         }

         xhr.send(formData);
      });

      return promise;

   } catch (error) {
      console.error('Upload failed:', error);
      throw error instanceof Error ? error : new Error('Unknown upload error');
   }
}









export async function uploadToCloudinary(
   file: File,
   opts: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
   const folder = opts.folder ?? "gallery"

   // Use server-side upload to avoid signature issues
   const formData = new FormData()
   formData.append("file", file)
   formData.append("folder", folder)

   const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
   })

   if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Upload failed with status ${response.status}`)
   }

   const result = await response.json()

   // Simulate progress for UI
   if (opts.onProgress) {
      opts.onProgress(100)
   }

   return result
}




// export async function uploadWithSignatureFetch(file: File, opts: UploadOptions = {}): Promise<CloudinaryUploadResult> {
//     const folder = opts.folder ?? "gallery"
//     // لازم توقّع نفس البراميترز اللي هتبعتها في الفورم 
//     const { signature, timestamp } = await getSignature({ folder });
//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("timestamp", String(timestamp))
//     formData.append("folder", folder)
//     formData.append("signature", signature)
//     formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
//     // XHR عشان progress 
//     const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
//     const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
//     const xhr = new XMLHttpRequest()
//     const promise = new Promise<CloudinaryUploadResult>((resolve, reject) => {
//         xhr.open("POST", url)
//         xhr.onload = () => {
//             try {
//                 const data = JSON.parse(xhr.responseText)
//                 if (xhr.status >= 200 && xhr.status < 300) resolve(data)
//                 else reject(new Error(data.error?.message || "Upload failed"))
//             } catch (e) { reject(new Error("Invalid Cloudinary response")) }
//         }
//         xhr.onerror = () => reject(new Error("Network error"))
//         if (xhr.upload && typeof opts.onProgress === "function") {
//             xhr.upload.onprogress = (e) => {
//                 if (e.lengthComputable) {
//                     const pct = Math.round((e.loaded / e.total) * 100)
//                     opts.onProgress!(pct)
//                 }
//             }
//         } xhr.send(formData)
//     })
//     return promise
// }



// Alternative using fetch API (more modern approach)
// export async function uploadToCloudinary(
//    file: File,
//    opts: UploadOptions = {}
// ): Promise<CloudinaryUploadResult> {
//    // Validate inputs
//    if (!file) {
//       throw new Error('File is required');
//    }

//    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
//    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

//    if (!apiKey || !cloudName) {
//       throw new Error('Cloudinary configuration missing');
//    }

//    const folder = opts.folder ?? "gallery";
//    const timestamp = Math.round(Date.now() / 1000);

//    const paramsToSign = {
//       folder,
//       timestamp
//    };

//    try {
//       const signature = await getSignature(paramsToSign);

//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("timestamp", String(timestamp));
//       formData.append("folder", folder);
//       formData.append("signature", signature as any);
//       formData.append("api_key", apiKey);

//       const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

//       const response = await fetch(url, {
//          method: 'POST',
//          body: formData
//       });

//       const data = await response.json();

//       if (!response.ok) {
//          console.error("Cloudinary upload error:", data);
//          throw new Error(data.error?.message || `Upload failed with status ${response.status}`);
//       }

//       return data;

//    } catch (error) {
//       console.error('Upload failed:', error);
//       throw error instanceof Error ? error : new Error('Unknown upload error');
//    }
// }


