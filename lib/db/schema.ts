import { not, relations } from "drizzle-orm"
import { pgTable, serial, varchar, text, decimal, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core"

// Enums
export const userRoleEnum = pgEnum("user_role", ["super_admin", "viewer"])
export const discountTypeEnum = pgEnum("discount_type", ["fixed", "percentage", "none"])
export const productStatusEnum = pgEnum("product_status", ["best_seller", "new", "coming_soon"])
export const localesNamesEnum = pgEnum("locales_names", ["English", "العربية"])


// جدول اللغات
export const locales = pgTable("locales", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 5 }).notNull().default("ar"), // en, ar
  name: localesNamesEnum("name").notNull().default("العربية"), // English, العربية
  dir: varchar("dir", { length: 3 }).notNull().default("rtl"), // ltr or rtl
});


// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  address: text("address"),
  phoneNumber: varchar("phone_number", { length: 20 }),
  role: userRoleEnum("role").notNull().default("viewer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 100 }).notNull(),
  nameAr: varchar("name_ar", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  image: varchar("image", { length: 255 }),
  localeId: serial("locale_id").references(() => locales.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Products table
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    nameEn: varchar("name_en", { length: 200 }).notNull(),
    nameAr: varchar("name_ar", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    sku: varchar("sku", { length: 50 }).notNull(),
    descriptionEn: text("description_en"),
    descriptionAr: text("description_ar"),
    image: varchar("image", { length: 255 }).notNull(),
    imageName: text("image_name"),
    images: text("images").array().notNull(),
    price: decimal("price", { precision: 10, scale: 2 }),
    isPriceActive: boolean("is_price_active").default(false),
    discountType: discountTypeEnum("discount_type").notNull().default("none"),
    discountValue: decimal("discount_value", { precision: 10, scale: 2 }),
    quantityInStock: integer("quantity_in_stock").default(0),
    brand: varchar("brand", { length: 100 }),
    isFeatured: boolean("is_featured").default(false),
    size: varchar("size", { length: 50 }),
    material: varchar("material", { length: 100 }),
    materialAr: varchar("material_ar", { length: 100 }),
    badge: varchar("badge", { length: 50 }),
    badgeAr: varchar("badge_ar", { length: 50 }),
    capacity: varchar("capacity", { length: 50 }),
    weight: decimal("weight", { precision: 8, scale: 2 }),
    color: text("color"),
    dimensions: varchar("dimensions", { length: 100 }),
    status: productStatusEnum("status").default("new"),
    localeId: serial("locale_id").references(() => locales.id),
    categoryId: integer("category_id").references(() => categories.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  }
)

// Product Relations (for related products)
export const productRelations = pgTable("product_relations", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  relatedProductId: integer("related_product_id")
    .references(() => products.id)
    .notNull(),
})


// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Coupons table
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  isActive: boolean("is_active").default(true),
  discountType: discountTypeEnum("discount_type").notNull().default("none"),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Cart table
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  quantity: integer("quantity").notNull().default(1),
  couponId: integer("coupon_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Cart Items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .references(() => cart.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull().default(1),
})

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Order Items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  cart: many(cart),
  orders: many(orders),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))



export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  relatedProducts: many(productRelations, { relationName: "product" }),
  relatedTo: many(productRelations, { relationName: "relatedProduct" }),
}))

export const productRelationsRelations = relations(productRelations, ({ one }) => ({
  product: one(products, {
    fields: [productRelations.productId],
    references: [products.id],
    relationName: "product",
  }),
  relatedProduct: one(products, {
    fields: [productRelations.relatedProductId],
    references: [products.id],
    relationName: "relatedProduct",
  }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}))

export const cartRelations = relations(cart, ({ one, many }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

// Gallery Images table
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  titleEn: varchar("title_en", { length: 200 }),
  titleAr: varchar("title_ar", { length: 200 }),
  altTextEn: varchar("alt_text_en", { length: 200 }),
  altTextAr: varchar("alt_text_ar", { length: 200 }),
  url: varchar("url", { length: 500 }).notNull(),
  publicId: varchar("public_id", { length: 200 }).notNull().unique(),
  fileName: varchar("file_name", { length: 200 }).notNull(),
  fileSize: integer("file_size").notNull(),
  width: integer("width"),
  height: integer("height"),
  format: varchar("format", { length: 10 }),
  tags: text("tags").array(),
  isFeatured: boolean("is_featured").default(false),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const galleryImagesRelations = relations(galleryImages, ({ many }) => ({
  // Can be extended for relationships with products, categories, etc.
}))
