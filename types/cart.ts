export type CartItem = {
   id: number
   productId: number
   quantity: number
   product: {
      id: number
      nameEn: string
      nameAr: string
      price: string | null
      images: string[]
      quantityInStock: number
      discountType: 'fixed' | 'percentage' | 'none'
      discountValue: string | null
   }
}