// Mock products service for demo mode
export interface Product {
  id: number
  nameEn: string
  nameAr: string
  slug: string
  sku: string
  descriptionEn?: string
  descriptionAr?: string
  image?: string
  price: string
  discountType?: "fixed" | "percentage"
  discountValue?: string
  quantityInStock: number
  brand?: string
  isFeatured: boolean
  size?: string
  material?: string
  badge?: string
  weight?: string
  dimensions?: string
  status: "sold" | "new" | "coming_soon"
  categoryId?: number
  createdAt: Date
  category?: {
    id: number
    nameEn: string
    nameAr: string
  }
}

export interface Category {
  id: number
  nameEn: string
  nameAr: string
  slug: string
  image?: string
}

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    nameEn: "Wireless Headphones",
    nameAr: "سماعات لاسلكية",
    slug: "wireless-headphones",
    sku: "WH-001",
    descriptionEn: "High-quality wireless headphones with noise cancellation",
    descriptionAr: "سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء",
    image: "/placeholder.svg?height=200&width=200",
    price: "99.99",
    quantityInStock: 50,
    brand: "TechBrand",
    isFeatured: true,
    status: "new",
    createdAt: new Date(),
    category: {
      id: 1,
      nameEn: "Electronics",
      nameAr: "إلكترونيات",
    },
  },
  {
    id: 2,
    nameEn: "Cotton T-Shirt",
    nameAr: "قميص قطني",
    slug: "cotton-t-shirt",
    sku: "TS-002",
    descriptionEn: "Comfortable cotton t-shirt in various colors",
    descriptionAr: "قميص قطني مريح بألوان متنوعة",
    image: "/placeholder.svg?height=200&width=200",
    price: "19.99",
    quantityInStock: 100,
    brand: "FashionCo",
    isFeatured: false,
    size: "M",
    material: "Cotton",
    status: "new",
    createdAt: new Date(),
    category: {
      id: 2,
      nameEn: "Clothing",
      nameAr: "ملابس",
    },
  },
  {
    id: 3,
    nameEn: "Coffee Mug",
    nameAr: "كوب قهوة",
    slug: "coffee-mug",
    sku: "MG-003",
    descriptionEn: "Ceramic coffee mug with beautiful design",
    descriptionAr: "كوب قهوة من السيراميك بتصميم جميل",
    image: "/placeholder.svg?height=200&width=200",
    price: "12.99",
    quantityInStock: 25,
    brand: "HomeGoods",
    isFeatured: false,
    status: "new",
    createdAt: new Date(),
    category: {
      id: 3,
      nameEn: "Home & Kitchen",
      nameAr: "المنزل والمطبخ",
    },
  },
]

const mockCategories: Category[] = [
  {
    id: 1,
    nameEn: "Electronics",
    nameAr: "إلكترونيات",
    slug: "electronics",
  },
  {
    id: 2,
    nameEn: "Clothing",
    nameAr: "ملابس",
    slug: "clothing",
  },
  {
    id: 3,
    nameEn: "Home & Kitchen",
    nameAr: "المنزل والمطبخ",
    slug: "home-kitchen",
  },
]

let nextId = 4

export const mockProductsService = {
  async getProducts(page = 1, limit = 10, search?: string, categoryId?: number) {
    let filteredProducts = mockProducts

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.nameEn.toLowerCase().includes(searchLower) ||
          product.nameAr.includes(search) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.brand?.toLowerCase().includes(searchLower),
      )
    }

    if (categoryId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category?.id === categoryId
      )
    }

    const offset = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(offset, offset + limit)

    return {
      success: true,
      data: paginatedProducts,
      total: filteredProducts.length,
    }
  },

  async getProduct(id: number) {
    const product = mockProducts.find((p) => p.id === id)
    if (!product) {
      return {
        success: false,
        error: "Product not found",
      }
    }

    return {
      success: true,
      data: product,
    }
  },

  async createProduct(data: any) {
    const newProduct: Product = {
      id: nextId++,
      nameEn: data.nameEn,
      nameAr: data.nameAr,
      slug: data.slug,
      sku: data.sku,
      descriptionEn: data.descriptionEn,
      descriptionAr: data.descriptionAr,
      image: data.image,
      price: data.price.toString(),
      discountType: data.discountType,
      discountValue: data.discountValue?.toString(),
      quantityInStock: data.quantityInStock,
      brand: data.brand,
      isFeatured: data.isFeatured,
      size: data.size,
      material: data.material,
      badge: data.badge,
      weight: data.weight?.toString(),
      dimensions: data.dimensions,
      status: data.status,
      categoryId: data.categoryId,
      createdAt: new Date(),
      category: data.categoryId ? mockCategories.find((c) => c.id === data.categoryId) : undefined,
    }

    mockProducts.unshift(newProduct)

    return {
      success: true,
      data: newProduct,
    }
  },

  async updateProduct(id: number, data: any) {
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) {
      return {
        success: false,
        error: "Product not found",
      }
    }

    const updatedProduct: Product = {
      ...mockProducts[index],
      nameEn: data.nameEn,
      nameAr: data.nameAr,
      slug: data.slug,
      sku: data.sku,
      descriptionEn: data.descriptionEn,
      descriptionAr: data.descriptionAr,
      image: data.image,
      price: data.price.toString(),
      discountType: data.discountType,
      discountValue: data.discountValue?.toString(),
      quantityInStock: data.quantityInStock,
      brand: data.brand,
      isFeatured: data.isFeatured,
      size: data.size,
      material: data.material,
      badge: data.badge,
      weight: data.weight?.toString(),
      dimensions: data.dimensions,
      status: data.status,
      categoryId: data.categoryId,
      category: data.categoryId ? mockCategories.find((c) => c.id === data.categoryId) : undefined,
    }

    mockProducts[index] = updatedProduct

    return {
      success: true,
      data: updatedProduct,
    }
  },

  async deleteProduct(id: number) {
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) {
      return {
        success: false,
        error: "Product not found",
      }
    }

    mockProducts.splice(index, 1)

    return {
      success: true,
    }
  },

  async getCategories() {
    return {
      success: true,
      data: mockCategories,
    }
  },
}
