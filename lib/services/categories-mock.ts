// Mock categories service for demo mode
export interface Category {
  id: number
  nameEn: string
  nameAr: string
  slug: string
  image?: string
  createdAt: Date
}

// Mock data
const mockCategories: Category[] = [
  {
    id: 1,
    nameEn: "Electronics",
    nameAr: "إلكترونيات",
    slug: "electronics",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(),
  },
  {
    id: 2,
    nameEn: "Clothing",
    nameAr: "ملابس",
    slug: "clothing",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(),
  },
  {
    id: 3,
    nameEn: "Home & Kitchen",
    nameAr: "المنزل والمطبخ",
    slug: "home-kitchen",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(),
  },
  {
    id: 4,
    nameEn: "Books",
    nameAr: "كتب",
    slug: "books",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(),
  },
  {
    id: 5,
    nameEn: "Sports & Outdoors",
    nameAr: "رياضة وأنشطة خارجية",
    slug: "sports-outdoors",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(),
  },
]

let nextId = 6

export const mockCategoriesService = {
  async getCategories(page = 1, limit = 10, search?: string) {
    let filteredCategories = mockCategories

    if (search) {
      const searchLower = search.toLowerCase()
      filteredCategories = mockCategories.filter(
        (category) =>
          category.nameEn.toLowerCase().includes(searchLower) ||
          category.nameAr.includes(search) ||
          category.slug.toLowerCase().includes(searchLower),
      )
    }

    const offset = (page - 1) * limit
    const paginatedCategories = filteredCategories.slice(offset, offset + limit)

    return {
      success: true,
      data: paginatedCategories,
      total: filteredCategories.length,
    }
  },

  async getCategory(id: number) {
    const category = mockCategories.find((c) => c.id === id)
    if (!category) {
      return {
        success: false,
        error: "Category not found",
      }
    }

    return {
      success: true,
      data: category,
    }
  },

  async createCategory(data: any) {
    const newCategory: Category = {
      id: nextId++,
      nameEn: data.nameEn,
      nameAr: data.nameAr,
      slug: data.slug,
      image: data.image,
      createdAt: new Date(),
    }

    mockCategories.unshift(newCategory)

    return {
      success: true,
      data: newCategory,
    }
  },

  async updateCategory(id: number, data: any) {
    const index = mockCategories.findIndex((c) => c.id === id)
    if (index === -1) {
      return {
        success: false,
        error: "Category not found",
      }
    }

    const updatedCategory: Category = {
      ...mockCategories[index],
      nameEn: data.nameEn,
      nameAr: data.nameAr,
      slug: data.slug,
      image: data.image,
    }

    mockCategories[index] = updatedCategory

    return {
      success: true,
      data: updatedCategory,
    }
  },

  async deleteCategory(id: number) {
    const index = mockCategories.findIndex((c) => c.id === id)
    if (index === -1) {
      return {
        success: false,
        error: "Category not found",
      }
    }

    mockCategories.splice(index, 1)

    return {
      success: true,
    }
  },
}
