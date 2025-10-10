// app/store/couponsStore.ts
import { create } from "zustand"

export type Coupon = {
   id: number
   code: string
   isActive: boolean | null
   discountType: "fixed" | "percentage" | "none"
   discountValue: string | null
   createdAt?: Date | null
   updatedAt?: Date | null
}

type CouponsState = {
   coupons: Coupon[]
   loading: boolean
   error: string | null
   addCoupon: (coupon: Coupon) => void
   updateCoupon: (id: number, updated: Partial<Coupon>) => void
   removeCoupon: (id: number) => void
}

export const useCouponsStore = create<CouponsState>((set, get) => ({
   coupons: [],
   loading: false,
   error: null,

   addCoupon: (coupon) => {
      set({ coupons: [...get().coupons, coupon] })
   },

   updateCoupon: (id, updated) => {
      set({
         coupons: get().coupons.map((c) =>
            c.id === id ? { ...c, ...updated } : c
         ),
      })
   },

   removeCoupon: (id) => {
      set({
         coupons: get().coupons.filter((c) => c.id !== id),
      })
   },
}))
