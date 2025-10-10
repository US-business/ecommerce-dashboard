// Mock coupons service for demo mode
export interface Coupon {
  id: number
  code: string
  isActive: boolean
  discountType: "fixed" | "percentage"
  discountValue: string
  createdAt: Date
  updatedAt: Date
}

// Mock data
const mockCoupons: Coupon[] = [
  {
    id: 1,
    code: "WELCOME10",
    isActive: true,
    discountType: "percentage",
    discountValue: "10.00",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    code: "SAVE20",
    isActive: true,
    discountType: "fixed",
    discountValue: "20.00",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: 3,
    code: "SUMMER25",
    isActive: false,
    discountType: "percentage",
    discountValue: "25.00",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
  {
    id: 4,
    code: "FREESHIP",
    isActive: true,
    discountType: "fixed",
    discountValue: "5.00",
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
  },
  {
    id: 5,
    code: "EXPIRED50",
    isActive: false,
    discountType: "percentage",
    discountValue: "50.00",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
]

let nextId = 6

export const mockCouponsService = {
  async getCoupons(page = 1, limit = 10, search?: string) {
    let filteredCoupons = mockCoupons

    if (search) {
      const searchLower = search.toLowerCase()
      filteredCoupons = mockCoupons.filter(
        (coupon) =>
          coupon.code.toLowerCase().includes(searchLower) || coupon.discountType.toLowerCase().includes(searchLower),
      )
    }

    const offset = (page - 1) * limit
    const paginatedCoupons = filteredCoupons.slice(offset, offset + limit)

    return {
      success: true,
      data: paginatedCoupons,
      total: filteredCoupons.length,
    }
  },

  async getCoupon(id: number) {
    const coupon = mockCoupons.find((c) => c.id === id)
    if (!coupon) {
      return {
        success: false,
        error: "Coupon not found",
      }
    }

    return {
      success: true,
      data: coupon,
    }
  },

  async createCoupon(data: any) {
    // Check if code already exists
    const existingCoupon = mockCoupons.find((c) => c.code.toUpperCase() === data.code.toUpperCase())
    if (existingCoupon) {
      return {
        success: false,
        error: "Coupon code already exists",
      }
    }

    const newCoupon: Coupon = {
      id: nextId++,
      code: data.code.toUpperCase(),
      isActive: data.isActive,
      discountType: data.discountType,
      discountValue: data.discountValue.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockCoupons.unshift(newCoupon)

    return {
      success: true,
      data: newCoupon,
    }
  },

  async updateCoupon(id: number, data: any) {
    const index = mockCoupons.findIndex((c) => c.id === id)
    if (index === -1) {
      return {
        success: false,
        error: "Coupon not found",
      }
    }

    // Check if code already exists (excluding current coupon)
    const existingCoupon = mockCoupons.find((c) => c.code.toUpperCase() === data.code.toUpperCase() && c.id !== id)
    if (existingCoupon) {
      return {
        success: false,
        error: "Coupon code already exists",
      }
    }

    const updatedCoupon: Coupon = {
      ...mockCoupons[index],
      code: data.code.toUpperCase(),
      isActive: data.isActive,
      discountType: data.discountType,
      discountValue: data.discountValue.toString(),
      updatedAt: new Date(),
    }

    mockCoupons[index] = updatedCoupon

    return {
      success: true,
      data: updatedCoupon,
    }
  },

  async deleteCoupon(id: number) {
    const index = mockCoupons.findIndex((c) => c.id === id)
    if (index === -1) {
      return {
        success: false,
        error: "Coupon not found",
      }
    }

    mockCoupons.splice(index, 1)

    return {
      success: true,
    }
  },
}
