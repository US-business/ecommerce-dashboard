import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  productId: number
  quantity: number
  coupon?: {
    id: number
    code: string
    discountType: 'fixed' | 'percentage' | 'none'
    discountValue: string | null
  }
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

export interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  openCart: boolean
  subtotal: number
  quantityToCart: number
  // Actions
  setQuantityToCart: (quantity: number) => void
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (cartItemId: number) => void
  updateQuantity: (cartItemId: number, quantity: number) => void
  clearCart: () => void
  clearCartForUserSwitch: () => void
  setItems: (items: CartItem[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed values
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemById: (cartItemId: number) => CartItem | undefined
}

function toNumber(value: string | number | null | undefined): number {
    if (typeof value === "number") return value
    if (typeof value === "string") return parseFloat(value)
    return 0
}


export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      openCart: false,
      subtotal: 0,
      quantityToCart: 1,
      setQuantityToCart: (quantity: number) => {
        set({ quantityToCart: quantity })
      },
      addItem: (newItem) => {
        const items = get().items
        const existingItem = items.find(item => item.productId === newItem.productId)
        
        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map(item =>
              item.productId === newItem.productId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            )
          })
        } else {
          // Add new item with temporary ID (will be replaced with server ID)
          const tempId = Date.now() + Math.random() // Generate unique temporary ID
          set({
            items: [...items, { ...newItem, id: Number(tempId) }]
          })
        }
      },

      removeItem: (cartItemId) => { 
        set({
          items: get().items.filter(item => item.id !== cartItemId)
        })
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.id === cartItemId
              ? { ...item, quantity }
              : item
          )
        })
      },

      clearCart: () => {
        set({ items: [], error: null })
      },

      // Clear cart for user switching
      clearCartForUserSwitch: () => {
        console.log("🧹 Clearing cart for user switch")
        set({ items: [], error: null, isLoading: false })
      },

      setItems: (items) => {
        set({ items })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setError: (error) => {
        set({ error })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          let price = toNumber(item.product.price)
          const discountValue = toNumber(item.product.discountValue || 0)
          
          // Apply discount
          if (item.product.discountType === 'percentage') {
            price = price - (price * discountValue) / 100
          } else if (item.product.discountType === 'fixed') {
            price = price - discountValue
          }
          
          return total + (price * item.quantity)
        }, 0)
      },

      getItemById: (cartItemId) => {
        return get().items.find(item => item.id === cartItemId)
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
)