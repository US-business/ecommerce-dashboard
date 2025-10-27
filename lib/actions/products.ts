"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/guards"
import { mockProductsService } from "@/lib/services/products-mock"
import cloudinary from "../cloudinary/cloudinary"
import { ProductProps } from "@/types/product"

export interface ProductsResponse {
  success: boolean
  data?: any[]
  error?: string
  total?: number
}

export interface ProductResponse {
  success: boolean
  data?: any
  error?: string
}

export interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}

// Check if database is available
async function isDatabaseAvailable() {
  try {
    await import("@/lib/db")
    await import("@/lib/db/schema")
    return true
  } catch (error) {
    console.warn("Database not available, using mock service")
    return false
  }
}



export async function getAllProductsActions(
  page = 1,
  limit = 10,
  search?: string,
  searchFirstName = false,
  categoryId?: number,
  featuredProducts?: boolean
): Promise<ProductsResponse> {
  try {
    // await requireAuth()

    const dbAvailable = await isDatabaseAvailable()
    if (!dbAvailable) {
      return await mockProductsService.getProducts(page, limit, search, categoryId)
    }

    try {
      const { db } = await import("@/lib/db")
      const { products, categories } = await import("@/lib/db/schema")
      const { eq, like, or, and, desc, count } = await import("drizzle-orm")

      const offset = (page - 1) * limit

      // Build search condition
      const searchCondition = search
        ? searchFirstName
          ? or(
            like(products.nameEn, `${search}%`),
            like(products.nameAr, `${search}%`),
            like(products.slug, `${search}%`),
            like(products.brand, `${search}%`)
          )
          : or(
            like(products.nameEn, `%${search}%`),
            like(products.nameAr, `%${search}%`),
            like(products.slug, `%${search}%`),
            like(products.brand, `%${search}%`)
          )
        : undefined

      // Build category condition
      const whereConditions: any[] = []
      if (categoryId) whereConditions.push(eq(products.categoryId, categoryId))
      // get featured products
      if (featuredProducts) whereConditions.push(eq(products.isFeatured, true))

      // Combine search + category
      if (searchCondition) whereConditions.push(searchCondition)

      // Base query
      const baseQuery = db
        .select({
          id: products.id,
          nameEn: products.nameEn,
          nameAr: products.nameAr,
          descriptionEn: products.descriptionEn,
          descriptionAr: products.descriptionAr,
          slug: products.slug,
          sku: products.sku,
          price: products.price,
          discountType: products.discountType,
          discountValue: products.discountValue,
          isPriceActive: products.isPriceActive,
          quantityInStock: products.quantityInStock,
          status: products.status,
          color: products.color,
          isFeatured: products.isFeatured,
          brand: products.brand,
          images: products.images,
          imageAlt: products.imageAlt,
          warrantyEn: products.warrantyEn,
          warrantyAr: products.warrantyAr,

          createdAt: products.createdAt,
          category: {
            id: categories.id,
            nameEn: categories.nameEn,
            nameAr: categories.nameAr,
            slug: categories.slug,
          },
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))

      // Apply where, order, limit, offset
      const query = whereConditions.length > 0
        ? baseQuery.where(and(...whereConditions)).orderBy(desc(products.createdAt)).limit(limit).offset(offset)
        : baseQuery.orderBy(desc(products.createdAt)).limit(limit).offset(offset)

      const result = await query

      // Total count for pagination
      let totalQuery = db.select({ count: count() }).from(products)
      if (whereConditions.length > 0) totalQuery = totalQuery.where(and(...whereConditions)) as any
      const totalResult = await totalQuery
      const total = totalResult[0].count

      return {
        success: true,
        data: result,
        total,
      }
    } catch (dbError) {
      console.warn("Database query failed, falling back to mock service", dbError)
      return await mockProductsService.getProducts(page, limit, search)
    }
  } catch (error) {
    console.error("Get products error:", error)
    return {
      success: false,
      error: "Failed to fetch products",
    }
  }
}


// Get single product by ID
export async function getProduct(id: number): Promise<ProductResponse> {
  try {
    // await requireAuth();

    const dbAvailable = await isDatabaseAvailable();
    if (!dbAvailable) {
      return await mockProductsService.getProduct(id);
    }

    try {
      const { db } = await import("@/lib/db");
      const { products, categories, productRelations } = await import("@/lib/db/schema");
      const { eq } = await import("drizzle-orm");

      // المنتج نفسه
      const result = await db
        .select({
          id: products.id,
          nameEn: products.nameEn,
          nameAr: products.nameAr,
          slug: products.slug,
          sku: products.sku,
          descriptionEn: products.descriptionEn,
          descriptionAr: products.descriptionAr,
          images: products.images,
          imageAlt: products.imageAlt,
          detailsEn: products.detailsEn,
          detailsAr: products.detailsAr,
          offerEn: products.offerEn,
          offerAr: products.offerAr,
          price: products.price,
          isPriceActive: products.isPriceActive,
          discountType: products.discountType,
          discountValue: products.discountValue,
          quantityInStock: products.quantityInStock,
          brand: products.brand,
          isFeatured: products.isFeatured,
          status: products.status,
          color: products.color,
          warrantyEn: products.warrantyEn,
          warrantyAr: products.warrantyAr,
          categoryId: products.categoryId,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          category: {
            id: categories.id,
            nameEn: categories.nameEn,
            nameAr: categories.nameAr,
            slug: categories.slug,
          },
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.id, id))
        .limit(1);

      if (result.length === 0) {
        return {
          success: false,
          error: "Product not found",
        };
      }

      const product = result[0];

      // المنتجات المرتبطة (بيانات كاملة)
      const relatedProducts = await db
        .select({
          id: products.id,
          nameEn: products.nameEn,
          nameAr: products.nameAr,
          sku: products.sku,
          price: products.price,
          images: products.images,
          brand: products.brand,
          status: products.status,
        })
        .from(productRelations)
        .innerJoin(products, eq(products.id, productRelations.relatedProductId))
        .where(eq(productRelations.productId, id));

      // المنتجات المرتبطة (IDs فقط)
      const relatedProductIds = await db
        .select({
          relatedProductId: productRelations.relatedProductId
        })
        .from(productRelations)
        .where(eq(productRelations.productId, id));

      return {
        success: true,
        data: {
          ...product,
          relatedProducts, // بيانات كاملة
          relatedProductIds: relatedProductIds.map(r => r.relatedProductId) // IDs فقط
        },


      };
    } catch (dbError) {
      console.warn("Database query failed, falling back to mock service", dbError);
      return await mockProductsService.getProduct(id);
    }
  } catch (error) {
    console.error("Get product error:", error);
    return {
      success: false,
      error: "Failed to fetch product",
    };
  }
}

// ///////////////////////////////////////////////////
// 📌 إزاي تستخدمه في الـ Frontend:

// بعد ما تنادي getProduct وتجيب relatedProducts (IDs)، تعمل استدعاء جديد لـ getProductsByIds وتعرضهم.

// كده تبقى بتحمل بيانات المنتج الأساسية مرة واحدة، وبعدين بيانات المنتجات المرتبطة في استعلام خفيف منفصل.

export async function getProductsByIds(ids: number[]) {
  try {
    if (!ids || ids.length === 0) {
      return { success: true, data: [] };
    }

    const { db } = await import("@/lib/db");
    const { products } = await import("@/lib/db/schema");
    const { inArray } = await import("drizzle-orm");

    const result = await db
      .select({
        id: products.id,
        nameEn: products.nameEn,
        nameAr: products.nameAr,
        images: products.images,
        price: products.price,
        sku: products.sku,
        brand: products.brand,
        discountType: products.discountType,
        discountValue: products.discountValue,
        quantityInStock: products.quantityInStock,
        status: products.status
      })
      .from(products)
      .where(inArray(products.id, ids));

    return { success: true, data: result };
  } catch (error) {
    console.error("Get products by IDs error:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

// //////////////////////////////////////////////////////////////////////////////////////////

// Validation function
function validateProductData(data: ProductProps): string | null {
  if (!data.nameEn?.trim()) return "English name is required"
  if (!data.nameAr?.trim()) return "Arabic name is required"
  if (!data.slug?.trim()) return "Slug is required"
  if (!data.sku?.trim()) return "SKU is required"
  if (data.isPriceActive === true && data.price <= 0) return "Price must be greater than 0"
  if (data.status !== "coming_soon" && (data.quantityInStock && data.quantityInStock <= 0)) return "Quantity cannot be negative"

  return null
}

// Create new product
export async function createProduct(data: ProductProps & { relatedProducts?: number[] }): Promise<ProductResponse> {
  try {
    await requireAuth()

    // Validate data
    const validationError = validateProductData(data)
    if (validationError) {
      return {
        success: false,
        error: validationError
      }
    }

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      const result = await mockProductsService.createProduct(data)
      revalidatePath("/dashboard/products")
      return result
    }

    try {
      const { db } = await import("@/lib/db")
      const { products, productRelations } = await import("@/lib/db/schema")

      const result = await db
        .insert(products)
        .values({
          ...(data.nameEn && { nameEn: data.nameEn }),
          ...(data.nameAr && { nameAr: data.nameAr }),
          ...(data.slug && { slug: data.slug }),
          ...(data.sku && { sku: data.sku }),
          ...(data.descriptionEn && { descriptionEn: data.descriptionEn }),
          ...(data.descriptionAr && { descriptionAr: data.descriptionAr }),
          ...(data.images && { images: data.images }),
          ...(data.imageAlt && { imageAlt: data.imageAlt }),
          ...(data.price && { price: data.price?.toString() }),
          ...(data.isPriceActive && { isPriceActive: data.isPriceActive }),
          ...(data.discountType && { discountType: data.discountType }),
          ...(data.discountValue && { discountValue: data.discountValue?.toString() }),
          ...(data.quantityInStock && { quantityInStock: data.quantityInStock }),
          ...(data.brand && { brand: data.brand }),
          ...(data.offerEn && { offerEn: data.offerEn }),
          ...(data.offerAr && { offerAr: data.offerAr }),
          ...(data.detailsEn && { detailsEn: data.detailsEn }),
          ...(data.detailsAr && { detailsAr: data.detailsAr }),
          ...(data.isFeatured && { isFeatured: data.isFeatured }),
          ...(data.status && { status: data.status }),
          ...(data.color && { color: data.color }),
          ...(data.warrantyEn && { warranty: data.warrantyEn }),
          ...(data.warrantyAr && { warranty: data.warrantyAr }),
          ...(data.categoryId && { categoryId: data.categoryId }),
        })
        .returning()


      const productId = result[0].id;

      // 📌 لو فيه related products نضيفهم
      if (data.relatedProducts?.length) {
        const relations = data.relatedProducts
          .filter(id => id !== productId) // منع ربط المنتج بنفسه
          .map(id => ({
            productId,
            relatedProductId: id,
          }));

        if (relations.length) {
          await db.insert(productRelations).values(relations);
        }
      }


      // Handle related products
      if (data.relatedProducts && data.relatedProducts.length > 0) {
        const relatedProductsData = data.relatedProducts.map((relatedId) => ({
          productId: result[0].id,
          relatedProductId: relatedId,
        }))

        await db.insert(productRelations).values(relatedProductsData)
      }

      revalidatePath("/dashboard/products")

      return {
        success: true,
        data: result[0],
      }
    } catch (dbError) {
      console.warn("Database insert failed, falling back to mock service", dbError)
      const result = await mockProductsService.createProduct(data)
      revalidatePath("/dashboard/products")
      return result
    }
  } catch (error) {
    console.error("Create product error:", error)
    return {
      success: false,
      error: "Failed to create product",
    }
  }
}

export async function updateProduct(id: number, data: ProductProps & { relatedProducts?: number[] }): Promise<ProductResponse> {
  try {
    await requireAuth()

    const validationError = validateProductData(data)
    if (validationError) {
      return { success: false, error: validationError }
    }

    const dbAvailable = await isDatabaseAvailable()
    if (!dbAvailable) {
      const result = await mockProductsService.updateProduct(id, data)
      revalidatePath("/dashboard/products")
      return result
    }

    try {
      const { db } = await import("@/lib/db")
      const { products, productRelations } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      const result = await db
        .update(products)
        .set({
          nameEn: data.nameEn,
          nameAr: data.nameAr,
          slug: data.slug,
          sku: data.sku,
          descriptionEn: data.descriptionEn || null,
          descriptionAr: data.descriptionAr || null,
          images: data.images,
          imageAlt: data.imageAlt || null,
          detailsEn: data.detailsEn || null,
          detailsAr: data.detailsAr || null,
          offerEn: data.offerEn || null,
          offerAr: data.offerAr || null,
          price: data.price ? data.price.toString() : "0",
          isPriceActive: data.isPriceActive ?? false,
          discountType: data.discountType,
          discountValue: data.discountValue ? data.discountValue.toString() : null,
          quantityInStock: data.quantityInStock || 0,
          brand: data.brand || null,
          isFeatured: data.isFeatured ?? false,
          status: data.status || "new",
          color: data.color || null,
          warrantyEn: data.warrantyEn || null,
          warrantyAr: data.warrantyAr || null,
          categoryId: data.categoryId || null,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning()

      if (result.length === 0) {
        return { success: false, error: "Product not found or update failed" }
      }

      // إصلاح: حذف العلاقات القديمة باستخدام id وليس result[0].id
      await db.delete(productRelations).where(eq(productRelations.productId, id))

      // إضافة العلاقات الجديدة
      if (data.relatedProducts?.length) {
        const relations = data.relatedProducts
          .filter(pid => pid !== id) // منع الربط بنفس المنتج
          .map(pid => ({
            productId: id,
            relatedProductId: pid,
          }));

        if (relations.length) {
          await db.insert(productRelations).values(relations);
        }
      }

      revalidatePath("/dashboard/products")
      return { success: true, data: result[0] }

    } catch (dbError) {
      console.warn("Database update failed, falling back to mock service", dbError)
      const result = await mockProductsService.updateProduct(id, data)
      revalidatePath("/dashboard/products")
      return result
    }
  } catch (error) {
    console.error("Update product error:", error)
    return { success: false, error: "Failed to update product" }
  }
}

// Delete product
export async function deleteProduct(id: number): Promise<ProductResponse> {
  try {
    await requireAuth()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      const result = await mockProductsService.deleteProduct(id)
      revalidatePath("/dashboard/products")
      return result
    }

    try {
      const { db } = await import("@/lib/db")
      const { products } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      const result = await db.delete(products).where(eq(products.id, id)).returning()

      if (result.length === 0) {
        return {
          success: false,
          error: "Product not found",
        }
      }

      revalidatePath("/dashboard/products")

      return {
        success: true,
        data: result[0],
      }
    } catch (dbError) {
      console.warn("Database delete failed, falling back to mock service", dbError)
      const result = await mockProductsService.deleteProduct(id)
      revalidatePath("/dashboard/products")
      return result
    }
  } catch (error) {
    console.error("Delete product error:", error)
    return {
      success: false,
      error: "Failed to delete product",
    }
  }
}


export async function getProductsByCategorySlug(
  slug: string,
  page = 1,
  limit = 12
): Promise<ProductsResponse> {
  try {
    const dbAvailable = await isDatabaseAvailable();
    if (!dbAvailable) {
      // لو مفيش DB نرجع من الموك سيرفيس
      return await mockProductsService.getProducts(page, limit, undefined, undefined);
    }

    const { db } = await import("@/lib/db");
    const { products, categories } = await import("@/lib/db/schema");
    const { eq, desc, count } = await import("drizzle-orm");

    const offset = (page - 1) * limit;

    // الكويري الرئيسية
    const query = db
      .select({
        id: products.id,
        nameEn: products.nameEn,
        nameAr: products.nameAr,
        slug: products.slug,
        sku: products.sku,
        price: products.price,
        images: products.images,
        brand: products.brand,
        discountType: products.discountType,
        discountValue: products.discountValue,
        status: products.status,
        quantityInStock: products.quantityInStock,
        isFeatured: products.isFeatured,
        warrantyEn: products.warrantyEn,
        warrantyAr: products.warrantyAr,
        createdAt: products.createdAt,
        category: {
          id: categories.id,
          nameEn: categories.nameEn,
          nameAr: categories.nameAr,
          slug: categories.slug,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(categories.slug, slug))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    const result = await query;

    // الإجمالي (لل pagination)
    let totalQuery = db
      .select({ count: count() })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(categories.slug, slug)) as any;

    const totalResult = await totalQuery;
    const total = totalResult[0].count;

    return {
      success: true,
      data: result,
      total,
    };
  } catch (error) {
    console.error("Get products by category slug error:", error);
    return {
      success: false,
      error: "Failed to fetch products by category slug",
    };
  }
}






// ////////////// Search products
// ////////////// Search products
// ////////////// Search products
// ////////////// Search products
// ////////////// Search products



export async function searchProductsAction({
  query = "",
  page = 1,
  limit = 12,
  category,
  minPrice,
  maxPrice,
  inStockOnly,
  outOfStockOnly,
  onSaleOnly,
  brand,
  sortBy = "newest", // default

}: {
  query?: string
  page?: number
  limit?: number
  category?: number
  minPrice?: number
  maxPrice?: number
  brand?: string[]
  inStockOnly?: boolean
  outOfStockOnly?: boolean
  onSaleOnly?: boolean
  sortBy?: "newest" | "oldest" | "priceLowHigh" | "priceHighLow"
}): Promise<{
  success: boolean
  data: ProductProps[]
  total: number
  page: number
  limit: number
  sortBy: "newest" | "oldest" | "priceLowHigh" | "priceHighLow"
}> {
  const offset = (page - 1) * limit
  const dbAvailable = await isDatabaseAvailable()

  if (!dbAvailable) {
    return {
      success: false,
      data: [],
      total: 0,
      page: 0,
      limit,
      sortBy,
    }
  }

  try {
    const { db } = await import("@/lib/db")
    const { products, categories } = await import("@/lib/db/schema")
    const { eq, like, or, and, gte, lte, desc, count } = await import("drizzle-orm") as any

    const whereConditions: any[] = []

    // البحث من أول الكلمة
    if (query) {
      whereConditions.push(
        or(
          like(products.nameEn, `${query}%`),
          like(products.nameAr, `${query}%`),
          like(products.brand, `${query}%`),
          like(products.slug, `${query}%`)
        )
      )
    }

    // فلترة حسب الفئة
    if (category) whereConditions.push(eq(products.categoryId, category))
    // فلترة حسب السعر
    if (minPrice !== undefined) whereConditions.push(gte(products.price, minPrice))
    if (maxPrice !== undefined) whereConditions.push(lte(products.price, maxPrice))

    // فلترة حسب البراند //
    // if (brand) whereConditions.push(eq(products.brand, brand)) // فلترة البحث عن أختيار براند واحد فقط

    if (brand && Array.isArray(brand) && brand.length > 0) { // فلترة البحث عن عدة براند
      whereConditions.push(or(...brand.map((b) => eq(products.brand, b))))
    }

    if (inStockOnly === true) whereConditions.push(gte(products.quantityInStock, 1))
    if (outOfStockOnly === true) whereConditions.push(eq(products.quantityInStock, 0))
    if (onSaleOnly) {
      whereConditions.push(
        or(
          eq(products.discountType, "fixed"),
          eq(products.discountType, "percentage")
        )
      )
    }



    // إنشاء query أساسي
    let dbQuery = db
      .select({
        id: products.id,
        nameEn: products.nameEn,
        nameAr: products.nameAr,
        slug: products.slug,
        sku: products.sku,
        price: products.price,
        images: products.images,
        brand: products.brand,
        status: products.status,
        isFeatured: products.isFeatured,
        quantityInStock: products.quantityInStock,
        warrantyEn: products.warrantyEn,
        warrantyAr: products.warrantyAr,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          nameEn: categories.nameEn,
          nameAr: categories.nameAr,
          slug: categories.slug,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .limit(limit)
      .offset(offset)

    // تطبيق where مرة واحدة
    if (whereConditions.length > 0) {
      dbQuery = dbQuery.where(and(...whereConditions)) as any
    }

    // ترتيب النتائج
    switch (sortBy) {
      case "newest":
        dbQuery = dbQuery.orderBy(desc(products.createdAt)) as any
        break
      case "oldest":
        dbQuery = dbQuery.orderBy(products.createdAt) as any
        break
      case "priceLowHigh":
        dbQuery = dbQuery.orderBy(products.price) as any
        break
      case "priceHighLow":
        dbQuery = dbQuery.orderBy(desc(products.price)) as any
        break
      default:
        dbQuery = dbQuery.orderBy(desc(products.createdAt)) as any
    }


    const result = await dbQuery

    // الحصول على العدد الكلي
    let totalQuery = db.select({ total: count() }).from(products) as any
    if (whereConditions.length > 0) totalQuery = totalQuery.where(and(...whereConditions)) as any
    const totalResult = await totalQuery
    const total = totalResult[0]?.total || 0

    return {
      success: true,
      data: result as any,
      total,
      page,
      limit,
      sortBy,
    }
  } catch (error) {
    console.error("Search products error:", error)
    return {
      success: false,
      data: [],
      total: 0,
      page: 0,
      limit,
      sortBy,
    }
  }
}

// Get only discounted products
export async function getDiscountedProductsActions(
  page = 1,
  limit = 10
): Promise<ProductsResponse> {
  try {
    const dbAvailable = await isDatabaseAvailable()
    if (!dbAvailable) {
      return await mockProductsService.getProducts(page, limit)
    }

    try {
      const { db } = await import("@/lib/db")
      const { products, categories } = await import("@/lib/db/schema")
      const { eq, or, and, desc, count, gte } = await import("drizzle-orm")

      const offset = (page - 1) * limit

      // Build condition for discounted products only
      const discountCondition = and(
        or(
          eq(products.discountType, "fixed"),
          eq(products.discountType, "percentage")
        ),
        gte(products.discountValue, "1") // Only products with discount value > 0
      )

      // Base query
      const baseQuery = db
        .select({
          id: products.id,
          nameEn: products.nameEn,
          nameAr: products.nameAr,
          descriptionEn: products.descriptionEn,
          descriptionAr: products.descriptionAr,
          slug: products.slug,
          sku: products.sku,
          price: products.price,
          discountType: products.discountType,
          discountValue: products.discountValue,
          isPriceActive: products.isPriceActive,
          quantityInStock: products.quantityInStock,
          status: products.status,
          color: products.color,
          isFeatured: products.isFeatured,
          brand: products.brand,
          images: products.images,
          imageAlt: products.imageAlt,
          warrantyEn: products.warrantyEn,
          warrantyAr: products.warrantyAr,
          createdAt: products.createdAt,
          category: {
            id: categories.id,
            nameEn: categories.nameEn,
            nameAr: categories.nameAr,
            slug: categories.slug,
          },
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(discountCondition)
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset)

      const result = await baseQuery

      // Total count for pagination
      const totalResult = await db
        .select({ count: count() })
        .from(products)
        .where(discountCondition)
      
      const total = totalResult[0].count

      return {
        success: true,
        data: result,
        total,
      }
    } catch (dbError) {
      console.warn("Database query failed, falling back to mock service", dbError)
      return await mockProductsService.getProducts(page, limit)
    }
  } catch (error) {
    console.error("Get discounted products error:", error)
    return {
      success: false,
      error: "Failed to fetch discounted products",
    }
  }
}

export async function getAllBrands(): Promise<ProductsResponse> {
  try {
    const { db } = await import("@/lib/db")
    const { products } = await import("@/lib/db/schema")
    // const { notEq } = await import("drizzle-orm") as any

    const result = await db
      .select({ brand: products.brand })
      .from(products)
      // .where(products.brand.notEq(null) as any)
      .where(products.brand.notNull as any) // أو حسب نوع العمود
      .groupBy(products.brand)
      .orderBy(products.brand)

    return {
      success: true,
      data: result.map((r) => r.brand) as string[],
      total: result.length,
    }
  } catch (error) {
    console.error("Error fetching brands:", error)
    return {
      success: false,
      data: [],
      total: 0,
    }
  }
}

// Get categories for dropdown
export async function getCategories(): Promise<ProductsResponse> {
  try {
    // await requireAuth()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      return await mockProductsService.getCategories()
    }

    try {
      const { db } = await import("@/lib/db")
      const { categories } = await import("@/lib/db/schema")
      const { asc } = await import("drizzle-orm")

      const result = await db
        .select({
          id: categories.id,
          nameEn: categories.nameEn,
          nameAr: categories.nameAr,
        })
        .from(categories)
        .orderBy(asc(categories.nameEn))

      return {
        success: true,
        data: result,
      }
    } catch (dbError) {
      console.warn("Database query failed, falling back to mock service", dbError)
      return await mockProductsService.getCategories()
    }
  } catch (error) {
    console.error("Get categories error:", error)
    return {
      success: false,
      data: [],
      error: "Failed to fetch categories"
    }
  }
}

// Unified image upload function
export async function uploadImageAction(formData: FormData): Promise<UploadResponse> {
  try {
    await requireAuth()

    const file = formData.get('file') as File

    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      }
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      }
    }

    try {
      const { v2: cloudinary } = await import('cloudinary')

      // Configure Cloudinary with environment variables
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            resource_type: 'image',
            // public_id: file.name,
            // overwrite : true ,
            // filename_override : "",
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { format: 'auto' },
            ]
          },
          (error, uploadResult) => {
            if (error) {
              console.error('Cloudinary upload error:', error)
              reject(error)
            } else {
              resolve(uploadResult)
            }
          }
        )

        uploadStream.end(buffer)
      })

      revalidatePath('/dashboard/products')

      return {
        success: true,
        url: result.secure_url
      }
    } catch (error) {
      console.error('Cloudinary setup/upload error:', error)
      return {
        success: false,
        error: 'Image upload service configuration error'
      }
    }

  } catch (error) {
    console.error("Upload image error:", error)
    return {
      success: false,
      error: "فشل رفع الصورة - " + (error as Error).message
    }
  }
}







