import { useState } from "react"
import { Input } from "@/components/shadcnUI/input"
import { Button } from "@/components/shadcnUI/button"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/stores"

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
      if (!newDetail.title || !newDetail.description) return
      addProductDetails(newDetail, type)
      setNewDetail({ title: "", description: "" })
   }
   return (
      <div className="space-y-4">
         <h3 className="font-semibold">{type === "detailsEn" ? "Product Details (EN)" : "تفاصيل المنتج (AR)"}</h3>

         <ul className="space-y-2">
            {details?.map((detail, index) => (
               <li key={index} className="flex items-center gap-2">
                  {editingIndex === index ? (
                     <>
                        <Input
                           value={form.title ?? ""}
                           onChange={(e) => setForm({ ...form, title: e.target.value })}
                           className={cn(dir === "rtl" && "text-right")}
                           placeholder="Title"
                        />
                        <Input
                           value={form.description ?? ""}
                           onChange={(e) => setForm({ ...form, description: e.target.value })}
                           className={cn(dir === "rtl" && "text-right")}
                           placeholder="Description"
                        />
                        <Button type="button" size="sm" onClick={() => saveEdit(index)}>
                           Save
                        </Button>
                     </>
                  ) : (
                     <>
                        {details && details.length > 0 && (
                           <>
                              <span
                                 className="flex-1 cursor-pointer"
                                 onClick={() => startEdit(index, detail)}
                              >
                                 {detail.title} — {detail.description}
                              </span>
                              <Button
                                 type="button"
                                 variant="destructive"
                                 size="sm"
                                 onClick={() => removeProductDetails(index, type)}
                              >
                                 Remove
                              </Button>
                           </>
                        )}
                     </>
                  )}
               </li>
            ))}
         </ul>


         <div className="flex gap-2">
            <Input
               value={newDetail.title}
               onChange={(e) => setNewDetail({ ...newDetail, title: e.target.value })}
               placeholder="New Title"
               className={cn(dir === "rtl" && "text-right")}
            />
            <Input
               value={newDetail.description}
               onChange={(e) => setNewDetail({ ...newDetail, description: e.target.value })}
               placeholder="New Description"
               className={cn(dir === "rtl" && "text-right")}
            />
            <Button type="button" onClick={addDetail}>Add</Button>
         </div>
      </div>
   )
}
