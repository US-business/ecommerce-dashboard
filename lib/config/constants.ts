/**
 * Application Constants
 * Centralized configuration values used across the application
 */

/**
 * Supported locales for internationalization
 */
export const LOCALES = ["ar", "en"] as const
export type Locale = (typeof LOCALES)[number]

/**
 * Default locale for the application
 */
export const DEFAULT_LOCALE: Locale = "ar"

/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  /**
   * Session duration in seconds (30 days)
   */
  SESSION_MAX_AGE: 60 * 60 * 24 * 30,

  /**
   * JWT token expiration (30 days)
   */
  JWT_MAX_AGE: 60 * 60 * 24 * 30,

  /**
   * Password minimum length
   */
  PASSWORD_MIN_LENGTH: 8,

  /**
   * Password maximum length
   */
  PASSWORD_MAX_LENGTH: 128,

  /**
   * Bcrypt salt rounds
   */
  BCRYPT_ROUNDS: 10,
} as const

/**
 * Pagination configuration
 */
export const PAGINATION = {
  /**
   * Default page size for lists
   */
  DEFAULT_PAGE_SIZE: 10,

  /**
   * Maximum page size allowed
   */
  MAX_PAGE_SIZE: 100,

  /**
   * Page sizes for user selection
   */
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
} as const

/**
 * Image upload configuration
 */
export const IMAGE_CONFIG = {
  /**
   * Maximum file size in bytes (10MB)
   */
  MAX_FILE_SIZE: 10 * 1024 * 1024,

  /**
   * Allowed image formats
   */
  ALLOWED_FORMATS: ["image/jpeg", "image/png", "image/webp", "image/avif"] as const,

  /**
   * Maximum number of images per product
   */
  MAX_IMAGES_PER_PRODUCT: 10,
} as const

/**
 * Product configuration
 */
export const PRODUCT_CONFIG = {
  /**
   * Product status options
   */
  STATUSES: ["best_seller", "new", "coming_soon", "on_sale", "normal"] as const,

  /**
   * Discount types
   */
  DISCOUNT_TYPES: ["fixed", "percentage", "none"] as const,

  /**
   * SKU prefix
   */
  SKU_PREFIX: "PRD",

  /**
   * Minimum price
   */
  MIN_PRICE: 0,

  /**
   * Maximum price
   */
  MAX_PRICE: 999999.99,
} as const

/**
 * Order configuration
 */
export const ORDER_CONFIG = {
  /**
   * Order statuses
   */
  STATUSES: ["pending", "processing", "shipped", "delivered", "cancelled"] as const,

  /**
   * Payment types
   */
  PAYMENT_TYPES: ["cash_on_delivery", "credit_card", "bank_transfer"] as const,

  /**
   * Payment statuses
   */
  PAYMENT_STATUSES: ["pending", "paid", "failed", "refunded"] as const,

  /**
   * Shipping methods
   */
  SHIPPING_METHODS: ["standard", "express", "same_day"] as const,
} as const

/**
 * User roles
 */
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  VIEWER: "viewer",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

/**
 * API route prefixes
 */
export const API_ROUTES = {
  AUTH: "/api/auth",
  PRODUCTS: "/api/products",
  CATEGORIES: "/api/categories",
  ORDERS: "/api/orders",
  USERS: "/api/users",
  CART: "/api/cart",
  WISHLIST: "/api/wishlist",
} as const

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  /**
   * Revalidation time for products (5 minutes)
   */
  PRODUCTS_REVALIDATE: 60 * 5,

  /**
   * Revalidation time for categories (10 minutes)
   */
  CATEGORIES_REVALIDATE: 60 * 10,

  /**
   * Revalidation time for static pages (1 hour)
   */
  STATIC_REVALIDATE: 60 * 60,
} as const

/**
 * SEO configuration
 */
export const SEO_CONFIG = {
  /**
   * Default site name
   */
  SITE_NAME: "E-Commerce Store | متجر إلكتروني",

  /**
   * Default description
   */
  DEFAULT_DESCRIPTION:
    "Modern e-commerce platform with multilingual support (Arabic & English). Shop the best products with secure checkout and fast delivery. متجر إلكتروني حديث يدعم العربية والإنجليزية.",

  /**
   * Default keywords
   */
  DEFAULT_KEYWORDS: [
    "e-commerce",
    "online store",
    "shopping",
    "متجر إلكتروني",
    "تسوق أونلاين",
    "products",
    "منتجات",
  ],

  /**
   * Twitter handle
   */
  TWITTER_HANDLE: "@ecommerce_store",

  /**
   * OG image dimensions
   */
  OG_IMAGE: {
    WIDTH: 1200,
    HEIGHT: 630,
  },
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
  UNAUTHORIZED: "غير مصرح لك بالوصول إلى هذا المورد.",
  FORBIDDEN: "ليس لديك صلاحية للقيام بهذا الإجراء.",
  NOT_FOUND: "المورد المطلوب غير موجود.",
  INVALID_INPUT: "البيانات المدخلة غير صحيحة.",
  DATABASE_ERROR: "حدث خطأ في قاعدة البيانات.",
  NETWORK_ERROR: "حدث خطأ في الاتصال بالشبكة.",
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  CREATED: "تم الإنشاء بنجاح.",
  UPDATED: "تم التحديث بنجاح.",
  DELETED: "تم الحذف بنجاح.",
  SAVED: "تم الحفظ بنجاح.",
} as const
