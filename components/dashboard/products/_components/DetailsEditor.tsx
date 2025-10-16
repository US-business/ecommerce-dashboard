import { useState } from "react"
import { Input } from "@/components/shadcnUI/input"
import { Button } from "@/components/shadcnUI/button"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/stores"
import { Edit, Trash2, Plus, Save, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcnUI/alert-dialog"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"

type ProductDetail = {
   title: string
   description: string
}

interface DetailsEditorProps {
   type: "detailsEn" | "detailsAr"
   dir?: "ltr" | "rtl"
}

export function DetailsEditor({ type, dir = "ltr" }: DetailsEditorProps) {
   const { productState, removeProductDetails, addProductDetails, updateProductDetails } = useAppStore();

   const { detailsAr, detailsEn } = productState;

   const details = type === "detailsEn" ? detailsEn : detailsAr



   const [newDetail, setNewDetail] = useState<ProductDetail>({ title: "", description: "" })
   const [editingIndex, setEditingIndex] = useState<number | null>(null)
   const [form, setForm] = useState<Partial<ProductDetail>>({})
   const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
   const [validationError, setValidationError] = useState<string>("")

   const startEdit = (index: number, detail: ProductDetail) => {
      setEditingIndex(index)
      setForm(detail)
   }

   const saveEdit = (index: number) => {
      updateProductDetails(form, index, type)
      setEditingIndex(null)
      setForm({})
   }

   const addDetail = () => {
      if (!newDetail.title.trim() || !newDetail.description.trim()) {
         setValidationError(type === "detailsEn" ? "Both title and description are required" : "العنوان والوصف مطلوبان")
         return
      }
      addProductDetails(newDetail, type)
      setNewDetail({ title: "", description: "" })
      setValidationError("")
   }

   const confirmDelete = () => {
      if (deleteIndex !== null) {
         removeProductDetails(deleteIndex, type)
         setDeleteIndex(null)
      }
   }

   const cancelEdit = () => {
      setEditingIndex(null)
      setForm({})
   }
   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base sm:text-lg">{type === "detailsEn" ? "Product Details (EN)" : "تفاصيل المنتج (AR)"}</h3>
            <span className="text-sm text-muted-foreground">
               {details?.length || 0} {type === "detailsEn" ? "items" : "عناصر"}
            </span>
         </div>

         {validationError && (
            <Alert variant="destructive" className="py-2">
               <AlertDescription className="text-sm">{validationError}</AlertDescription>
            </Alert>
         )}

         <ul className="space-y-2">
            {details?.map((detail, index) => (
               <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  {editingIndex === index ? (
                     <>
                        <div className="flex-1 w-full space-y-2 sm:space-y-0 sm:flex sm:gap-2">
                           <Input
                              value={form.title ?? ""}
                              onChange={(e) => setForm({ ...form, title: e.target.value })}
                              className={cn("text-sm", dir === "rtl" && "text-right")}
                              placeholder={type === "detailsEn" ? "Title" : "العنوان"}
                           />
                           <Input
                              value={form.description ?? ""}
                              onChange={(e) => setForm({ ...form, description: e.target.value })}
                              className={cn("text-sm", dir === "rtl" && "text-right")}
                              placeholder={type === "detailsEn" ? "Description" : "الوصف"}
                           />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                           <Button type="button" size="sm" onClick={() => saveEdit(index)} className="flex-1 sm:flex-none">
                              <Save className="h-4 w-4 mr-1" />
                              {type === "detailsEn" ? "Save" : "حفظ"}
                           </Button>
                           <Button type="button" size="sm" variant="outline" onClick={cancelEdit} className="flex-1 sm:flex-none">
                              <X className="h-4 w-4 mr-1" />
                              {type === "detailsEn" ? "Cancel" : "إلغاء"}
                           </Button>
                        </div>
                     </>
                  ) : (
                     <>
                        {details && details.length > 0 && (
                           <>
                              <div
                                 className="flex-1 cursor-pointer group w-full"
                                 onClick={() => startEdit(index, detail)}
                              >
                                 <div className="flex items-start gap-2">
                                    <Edit className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                       <p className="font-medium text-sm break-words">{detail.title}</p>
                                       <p className="text-sm text-muted-foreground break-words">{detail.description}</p>
                                    </div>
                                 </div>
                              </div>
                              <Button
                                 type="button"
                                 variant="destructive"
                                 size="sm"
                                 onClick={() => setDeleteIndex(index)}
                                 className="w-full sm:w-auto"
                              >
                                 <Trash2 className="h-4 w-4 sm:mr-1" />
                                 <span className="sm:inline">{type === "detailsEn" ? "Delete" : "حذف"}</span>
                              </Button>
                           </>
                        )}
                     </>
                  )}
               </li>
            ))}
         </ul>


         <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
            <Input
               value={newDetail.title}
               onChange={(e) => {
                  setNewDetail({ ...newDetail, title: e.target.value })
                  setValidationError("")
               }}
               placeholder={type === "detailsEn" ? "New Title" : "عنوان جديد"}
               className={cn("text-sm", dir === "rtl" && "text-right")}
            />
            <Input
               value={newDetail.description}
               onChange={(e) => {
                  setNewDetail({ ...newDetail, description: e.target.value })
                  setValidationError("")
               }}
               placeholder={type === "detailsEn" ? "New Description" : "وصف جديد"}
               className={cn("text-sm", dir === "rtl" && "text-right")}
            />
            <Button type="button" onClick={addDetail} className="w-full sm:w-auto">
               <Plus className="h-4 w-4 mr-1" />
               {type === "detailsEn" ? "Add" : "إضافة"}
            </Button>
         </div>

         {/* Delete Confirmation Dialog */}
         <AlertDialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>
                     {type === "detailsEn" ? "Confirm Delete" : "تأكيد الحذف"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                     {type === "detailsEn" 
                        ? "Are you sure you want to delete this detail? This action cannot be undone."
                        : "هل أنت متأكد من حذف هذا التفصيل؟ لا يمكن التراجع عن هذا الإجراء."}
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>{type === "detailsEn" ? "Cancel" : "إلغاء"}</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete}>
                     {type === "detailsEn" ? "Delete" : "حذف"}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   )
}
