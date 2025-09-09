import { create } from 'zustand'
// import { ProductFormData } from "@/lib/actions/products"
import { ProductProps } from "@/types/product"

interface AppState {
  // UI State
  isLoadingPage: boolean
  message: string
  showMessage: boolean
  
  // Images
  images: { id: string; url: string }[]
  
  // Featured Products
  featuredProductsList: any[]
  featuredHomeGoodsList: any[]
  featuredElectronicsList: any[]
  
  // Wishlist
  isWishlist: boolean
  
  // Cart
  productsInCart: any[]
  openCart: boolean
  subtotal: number
  
  // Product Form State
  products: ProductProps[]
  productState: ProductProps
  showSaveButtonProduct: boolean

  // Categories
  categories: any[]
  
  // Actions
  setProducts: (products: ProductProps[]) => void
  setFeaturedProductsList: (products: ProductProps[]) => void
  setFeaturedElectronicsList: (products: ProductProps[]) => void
  setCategories: (categories: any[]) => void
  setIsLoadingPage: (loading: boolean) => void
  setMessage: (message: string) => void
  setImages: (images: { id: string; url: string }[]) => void
  setIsWishlist: (isWishlist: boolean) => void
  setProductsInCart: (products: any[]) => void
  setOpenCart: (open: boolean) => void
  setSubtotal: (subtotal: number) => void
  updateProductQuantity: (productId: string, newQuantity: number) => void
  setShowSaveButtonProduct: (show: boolean) => void

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
  materialAr: "",
  badge: "",
  badgeAr: "",
  weight: 0,
  dimensions: "",
  status: "new",
  color: "",
  capacity: "",
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
  message: '',
  showMessage: false,
  isWishlist: false,
  productsInCart: [],
  openCart: false,
  subtotal: 0,
  productState: {...initialProductState},
  categories: [],
  showSaveButtonProduct: false,
  products: [],

  
  setProducts: (products: ProductProps[]) => set({ products: products }),
  setFeaturedProductsList: (products: ProductProps[]) => set({ featuredProductsList: products }),
  setFeaturedElectronicsList: (products: ProductProps[]) => set({ featuredElectronicsList: products }),
  setCategories: (categories: any[]) => set({ categories: [...categories] }),
  
  // UI Actions
  setProductForm: (data : ProductProps) => set({ productState: { ...data } }),
  setIsLoadingPage: (loading) => set({ isLoadingPage: loading }),
  setMessage: (message) => set({ message }),
  setImages: (images) => set({ images: [...images] }),
  setIsWishlist: (isWishlist) => set({ isWishlist }),
  setProductsInCart: (products) => set({ productsInCart: [...products] }),
  setOpenCart: (open) => set({ openCart: open }),
  setSubtotal: (subtotal) => set({ subtotal }),
  setShowSaveButtonProduct: (show) => set({ showSaveButtonProduct: show }),

  
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
