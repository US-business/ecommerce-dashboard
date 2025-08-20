import { create } from 'zustand'
// import { ProductFormData } from "@/lib/actions/products"
import { ProductProps } from "@/types/product"

interface AppState {
  // UI State
  isLoadingPage: boolean
  message: string
  showMessage: boolean
  
  // Images
  images: string[]
  
  // Featured Products
  featuredProductsList: any[]
  featuredHomeGoodsList: any[]
  featuredElectronicsList: any[]
  homeGoodsList: any[]
  
  // Wishlist
  isWishlist: boolean
  
  // Cart
  productsInCart: any[]
  openCart: boolean
  subtotal: number
  
  // Product Form State
  productState: ProductProps
  
  // Actions
  setIsLoadingPage: (loading: boolean) => void
  setMessage: (message: string) => void
  setImages: (images: string[]) => void
  setIsWishlist: (isWishlist: boolean) => void
  setProductsInCart: (products: any[]) => void
  setOpenCart: (open: boolean) => void
  setSubtotal: (subtotal: number) => void
  updateProductQuantity: (productId: string, newQuantity: number) => void
  
  // Product Form Actions
  updateProductField: (field: keyof ProductProps, value: any) => void
  updateProductImages: (image: string) => void
  removeProductImage: (image: string) => void
  resetProductForm: () => void
  setProductForm:(product : ProductProps) => void
}

const initialProductState: ProductProps = {
  nameEn: "",
  nameAr: "",
  slug: "",
  sku: "",
  descriptionEn: "",
  descriptionAr: "",
  image: "",
  imageName: "",
  images: [],
  price: 0,
  isPriceActive: false,
  discountType: "none",
  discountValue: 0,
  quantityInStock: 0,
  brand: "",
  isFeatured: false,
  size: "",
  material: "",
  badge: "",
  weight: 0,
  dimensions: "",
  status: "new",
  color: "",
  categoryId: 0,
  relatedProducts: [],
  availableProducts: [],
  filteredProducts: [],
  selectedRelatedProducts: [],
  createdAt: new Date()
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  isLoadingPage: false,
  images: [],
  featuredProductsList: [],
  featuredHomeGoodsList: [],
  featuredElectronicsList: [],
  homeGoodsList: [],
  message: '',
  showMessage: false,
  isWishlist: false,
  productsInCart: [],
  openCart: false,
  subtotal: 0,
  productState: {...initialProductState},
  
  
  // UI Actions
  setProductForm: (data : ProductProps) => set({ productState: { ...data } }),
  setIsLoadingPage: (loading) => set({ isLoadingPage: loading }),
  setMessage: (message) => set({ message }),
  setImages: (images) => set({ images: [...images] }),
  setIsWishlist: (isWishlist) => set({ isWishlist }),
  setProductsInCart: (products) => set({ productsInCart: [...products] }),
  setOpenCart: (open) => set({ openCart: open }),
  setSubtotal: (subtotal) => set({ subtotal }),
  
  updateProductQuantity: (productId, newQuantity) => {
    const { productsInCart } = get()
    set({
      productsInCart: productsInCart.map((item: any) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    })
  },

  // Product Form Actions
  updateProductField: (field, value) => {
    const { productState } = get()
    set({ productState: { ...productState, [field]: value } })
  },

  updateProductImages: (image) => {
    const { productState } = get()
    set({ 
      productState: { 
        ...productState, 
        images: [...(productState.images ?? []), image] 
      } 
    })
  },

  removeProductImage: (image) => {
    const { productState } = get()
    set({ 
      productState: { 
        ...productState, 
        images: productState.images?.filter((img) => img !== "" ? img !== image : null) 
      } 
    })
  },

  resetProductForm: () => set({ productState: initialProductState }),
}))
