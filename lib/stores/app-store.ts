import { create } from 'zustand'
// import { ProductFormData } from "@/lib/actions/products"
import { ProductDetail, ProductProps  } from "@/types/product"

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
  setShowSaveButtonProduct: (show: boolean) => void
  
  // Product Form Actions
  updateProductField: (field: keyof ProductProps, value: any) => void
  updateProductImages: (image: string) => void
  removeProductImage: (image: string) => void
  resetProductForm: () => void
  setProductForm: (product: ProductProps) => void
  updateProductDetails: (updatedDetail: Partial<ProductDetail> , index: number, type: "detailsEn" | "detailsAr") => void
  addProductDetails: (newDetail: { title: string, description: string } , type: "detailsEn" | "detailsAr") => void
  removeProductDetails: ( idex : number, type: "detailsEn" | "detailsAr") => void

}

const initialProductState: ProductProps = {
  nameEn: "",
  nameAr: "",
  slug: "",
  sku: "",
  descriptionEn: "",
  descriptionAr: "",
  images: [],
  imageAlt: "",
  detailsEn: [],
  detailsAr: [],
  offerEn: "",
  offerAr: "",
  price: 0,
  isPriceActive: false,
  discountType: "none",
  discountValue: 0,
  quantityInStock: 0,
  brand: "",
  isFeatured: false,
  status: "normal",
  color: "",
  warrantyEn: "",
  warrantyAr: "",
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
  productState: { ...initialProductState },
  categories: [],
  showSaveButtonProduct: false,
  products: [],
  quantityToCart: 1,


  setProducts: (products: ProductProps[]) => set({ products: products }),
  setFeaturedProductsList: (products: ProductProps[]) => set({ featuredProductsList: products }),
  setFeaturedElectronicsList: (products: ProductProps[]) => set({ featuredElectronicsList: products }),
  setCategories: (categories: any[]) => set({ categories: [...categories] }),

  // UI Actions
  setProductForm: (data: ProductProps) => set({ productState: { ...data } }),
  setIsLoadingPage: (loading) => set({ isLoadingPage: loading }),
  setMessage: (message) => set({ message }),
  setImages: (images) => set({ images: [...images] }),
  setIsWishlist: (isWishlist) => set({ isWishlist }),
  setShowSaveButtonProduct: (show) => set({ showSaveButtonProduct: show }),

  // Product Form Actions
  updateProductField: (field, value) => {
    const { productState } = get()
    set({ productState: { ...productState, [field]: value } })
  },
  addProductDetails: (newDetail, type) => {
    const { productState } = get()
    if (type === "detailsAr") {
      set({
        productState: {
          ...productState,
          detailsAr: [
            ...(productState.detailsAr ?? []), // لو فاضي يبدأ Array جديد
            newDetail, // object جديد { title, description }
          ],
        }
      })
    }

    else if (type === "detailsEn") {
      set({
        productState: {
          ...productState,
          detailsEn: [
            ...(productState.detailsEn ?? []), // لو فاضي يبدأ Array جديد
            newDetail, // object جديد { title, description }
          ],
        }
      })
    }
  },
  updateProductDetails: (updatedDetail, index, type) => {
    const { productState } = get()
    if (type === "detailsAr") {
      set({
        productState: {
          ...productState,
          detailsAr: productState.detailsAr?.map((d, i) =>
            i === index ? { ...d, ...updatedDetail } : d
          )
        }
      })
    }
    else if (type === "detailsEn") {
      set({
        productState: {
          ...productState,
          detailsEn: productState.detailsEn?.map((d, i) =>
            i === index ? { ...d, ...updatedDetail } : d
          )
        }
      })
    }
  },
  removeProductDetails: (index: number , type: "detailsEn" | "detailsAr") => {
    const { productState } = get()
    if (type === "detailsAr") {
      set({
        productState: {
          ...productState,
          detailsAr: productState.detailsAr?.filter((_, i) => i !== index),
        }
      })
    }
    else if (type === "detailsEn") {
      set({
        productState: {
          ...productState,
          detailsEn: productState.detailsEn?.filter((_, i) => i !== index),
        }
      })
    }
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
        images: productState.images?.filter((img) =>{
          if (img === "") {
            return false
          }
          return img !== image
        })
      }
    })
  },

  resetProductForm: () => set({ productState: initialProductState }),
}))
