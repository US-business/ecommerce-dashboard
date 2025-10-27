import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
    id: number
    productId: number
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

export interface WishlistState {
    items: WishlistItem[]
    isLoading: boolean
    error: string | null
    // Actions
    addItem: (item: Omit<WishlistItem, 'id'>) => void
    removeItem: (wishlistItemId: number) => void
    clearWishlist: () => void
    setItems: (items: WishlistItem[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Computed values
    getTotalItems: () => number
    getItemById: (wishlistItemId: number) => WishlistItem | undefined
    isInWishlist: (productId: number) => boolean
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            error: null,

            addItem: (newItem) => {
                const items = get().items
                const existingItem = items.find(item => item.productId === newItem.productId)

                if (!existingItem) {
                    // Add new item with temporary ID (will be replaced with server ID)
                    const tempId = Date.now() + Math.random()
                    set({
                        items: [...items, { ...newItem, id: Number(tempId) }]
                    })
                }
            },

            removeItem: (wishlistItemId) => {
                set({
                    items: get().items.filter(item => item.id !== wishlistItemId)
                })
            },

            clearWishlist: () => {
                set({ items: [], error: null })
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
                return get().items.length
            },

            getItemById: (wishlistItemId) => {
                return get().items.find(item => item.id === wishlistItemId)
            },

            isInWishlist: (productId) => {
                return get().items.some(item => item.productId === productId)
            }
        }),
        {
            name: 'wishlist-storage',
            partialize: (state) => ({ items: state.items })
        }
    )
)
