
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { TabsContent } from "@/components/shadcnUI/tabs"
import { Checkbox } from "@/components/shadcnUI/checkbox"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useAppStore, useI18nStore } from "@/lib/stores"
import { getAllProductsActions, getProduct } from "@/lib/actions/products"




type RelatedProductsProps = {
   product?: any
   isEdit?: boolean
}




function RelatedProducts({ product, isEdit = false }: RelatedProductsProps) {



   const { t, dir } = useI18nStore()
   const [relatedProductsSearch, setRelatedProductsSearch ] = useState("");
   const { productState, updateProductField, updateProductImages, removeProductImage, resetProductForm, setProductForm,setShowSaveButtonProduct } = useAppStore();

   const {
      availableProducts, selectedRelatedProducts, filteredProducts, relatedProducts
   } = productState;


   useEffect( () => {
      setShowSaveButtonProduct(true);
   } , [])

   const loadData = useCallback(async () => {
      if (isEdit && product?.id) {
         try {
            // First load the product data
            // Then load available products
            const result = await getAllProductsActions();
            if (result?.success && result?.data) {
               const filteredProductsDB = result.data.filter((p: any) => p.id !== product.id);
               updateProductField("availableProducts", filteredProductsDB);
               updateProductField("filteredProducts", filteredProductsDB);

               // Now set the related products after both product data and available products are loaded
               if (product?.relatedProducts) {
                  const relatedIds = product.relatedProducts.map((rp: any) => rp.id);
                  updateProductField("selectedRelatedProducts", relatedIds);
                  updateProductField("relatedProducts", relatedIds);
               }
            }
         } catch (error) {
            console.error("Error loading product data:", error);
         }
      } else {
         // For new product, just load available products
         const result = await getAllProductsActions();
         if (result?.success && result?.data) {
            updateProductField("availableProducts", result.data);
            updateProductField("filteredProducts", result.data);
         }
      }
   }, [isEdit, product?.id]);

   useEffect(() => {
      // for related Products
      loadData();
   }, []);

   // useEffect(() => {
   //    const init = async () => {
   //       loadAvailableProducts();
   //       if (isEdit && product?.relatedProducts) {
   //          updateProductField("selectedRelatedProducts", product.relatedProducts.map((rp: any) => rp.id));
   //          updateProductField("relatedProducts", product.relatedProducts.map((rp: any) => rp.id));
   //          console.log("go0000og");
   //       }
   //    };

   //    init();

   // }, [isEdit, product?.id]);







   const handleRelatedProductToggle = (productId: number) => {
      const updatedSelectedProducts = selectedRelatedProducts?.includes(productId)
         ? selectedRelatedProducts?.filter((id: any) => id !== productId)
         : [...selectedRelatedProducts ?? [], productId];
      updateProductField("selectedRelatedProducts", updatedSelectedProducts)
      updateProductField("relatedProducts", updatedSelectedProducts)
      console.log(filteredProducts);
   };






   const handleRelatedProductsSearch = (searchTerm: string) => {
      setRelatedProductsSearch(searchTerm)

      if (!searchTerm.trim()) {
         updateProductField("filteredProducts", availableProducts)
         return
      }

      const filtered = availableProducts?.filter((product: any) => {
         const nameEn = product.nameEn?.toLowerCase() || ""
         const nameAr = product.nameAr?.toLowerCase() || ""
         const sku = product.sku?.toLowerCase() || ""
         const brand = product.brand?.toLowerCase() || ""
         const search = searchTerm.toLowerCase()

         return nameEn.includes(search) || nameAr.includes(search) || sku.includes(search) || brand.includes(search)
      })
      updateProductField("filteredProducts", filtered)
   }




   return (
      <>

         <TabsContent value="related" className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle className={cn(dir === "rtl" && "text-right")}>
                     {dir === "rtl" ? "المنتجات ذات الصلة" : "Related Products"}
                  </CardTitle>
                  <p className={cn("text-sm text-muted-foreground", dir === "rtl" && "text-right")}>
                     {dir === "rtl"
                        ? "اختر المنتجات التي تريد عرضها كمنتجات ذات صلة مع هذا المنتج"
                        : "Select products to display as related to this product"}
                  </p>
               </CardHeader>



               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="relatedSearch" className={cn(dir === "rtl" && "text-right block")}>
                        {dir === "rtl" ? "البحث في المنتجات" : "Search Products"}
                     </Label>
                     <Input
                        id="relatedSearch"
                        type="text"
                        placeholder={
                           dir === "rtl"
                              ? "ابحث بالاسم أو رمز المنتج أو العلامة التجارية..."
                              : "Search by name, SKU, or brand..."
                        }
                        value={relatedProductsSearch}
                        onChange={(e) => handleRelatedProductsSearch(e.target.value)}
                        className={cn(dir === "rtl" && "text-right")}
                     />
                  </div>

                  {relatedProductsSearch && (
                     <div className={cn("text-sm text-muted-foreground", dir === "rtl" && "text-right")}>
                        {dir === "rtl"
                           ? `تم العثور على ${filteredProducts?.length} منتج`
                           : `Found ${filteredProducts?.length} products`}
                     </div>
                  )}

                  {filteredProducts && filteredProducts?.length > 0 ? (
                     <div className="grid gap-4 max-h-96 overflow-y-auto">
                        {filteredProducts && filteredProducts.map((availableProduct: any) => (
                           <div
                              key={availableProduct.id}
                              className={cn(
                                 "flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50",
                                 dir === "rtl" && "flex-row-reverse space-x-reverse",
                              )}
                           >
                              <Checkbox
                                 id={`product-${availableProduct.id}`}
                                 checked={selectedRelatedProducts && selectedRelatedProducts?.includes(availableProduct?.id)}
                                 onCheckedChange={() => handleRelatedProductToggle(availableProduct?.id)}
                              />
                              <p>{availableProduct?.id}</p>
                              <div className="flex items-center space-x-3 flex-1">
                                 {availableProduct.images && (
                                    <Image
                                       src={availableProduct.images[0] || "/placeholder.svg"}
                                       alt={dir === "rtl" ? availableProduct.nameAr : availableProduct.nameEn}
                                       width={48}
                                       height={48}
                                       className="w-12 h-12 object-cover rounded border"
                                       onError={(e) => {
                                          e.currentTarget.src = "/placeholder.svg?height=48&width=48&text=No+Image"
                                       }}
                                    />
                                 )}

                                 <div className={cn("flex-1", dir === "rtl" && "text-right")}>
                                    <Label htmlFor={`product-${availableProduct.id}`} className="font-medium cursor-pointer">
                                       {dir === "rtl" ? availableProduct.nameAr : availableProduct.nameEn}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                       {dir === "rtl" ? `رمز المنتج: ${availableProduct.sku}` : `SKU: ${availableProduct.sku}`}
                                    </p>
                                    {availableProduct.brand && (
                                       <p className="text-sm text-muted-foreground">
                                          {dir === "rtl"
                                             ? `العلامة التجارية: ${availableProduct.brand}`
                                             : `Brand: ${availableProduct.brand}`}
                                       </p>
                                    )}
                                    <p className="text-sm font-medium text-green-600">${availableProduct.price}</p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="text-center py-8">
                        <p className={cn("text-muted-foreground", dir === "rtl" && "text-right")}>
                           {relatedProductsSearch
                              ? dir === "rtl"
                                 ? "لم يتم العثور على منتجات تطابق البحث"
                                 : "No products found matching your search"
                              : dir === "rtl"
                                 ? "لا توجد منتجات متاحة للاختيار"
                                 : "No products available to select"}
                        </p>
                     </div>
                  )}

                  {selectedRelatedProducts && selectedRelatedProducts.length > 0 && (
                     <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className={cn("text-sm font-medium text-blue-900", dir === "rtl" && "text-right")}>
                           {dir === "rtl"
                              ? `تم اختيار ${selectedRelatedProducts.length} منتج كمنتجات ذات صلة`
                              : `${selectedRelatedProducts.length} products selected as related`}
                        </p>
                     </div>
                  )}
               </CardContent>
            </Card>
         </TabsContent>
      </>
   )
}

export default RelatedProducts

















