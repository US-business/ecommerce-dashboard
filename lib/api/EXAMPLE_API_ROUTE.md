# 📘 API Route Examples

هذا الملف يحتوي على أمثلة لاستخدام النظام الجديد في API routes.

## مثال 1: API Route بسيط مع Error Handling

```typescript
// app/api/products/route.ts
import { withErrorHandler } from "@/lib/errors"
import { apiSuccess, apiNotFound } from "@/lib/api"
import { getProducts } from "@/lib/actions/products"

export const GET = withErrorHandler(async (request: Request) => {
  const products = await getProducts()
  
  if (!products || products.length === 0) {
    throw new NotFoundError("Products")
  }
  
  return apiSuccess(products)
})
```

## مثال 2: API Route مع Rate Limiting

```typescript
// app/api/auth/login/route.ts
import { withRateLimit, RATE_LIMITS } from "@/lib/api"
import { apiSuccess, apiUnauthorized } from "@/lib/api"
import { validateCredentials } from "@/lib/auth"

export const POST = withRateLimit(
  async (request: Request) => {
    const body = await request.json()
    
    const user = await validateCredentials(body.email, body.password)
    
    if (!user) {
      return apiUnauthorized("Invalid credentials")
    }
    
    return apiSuccess({ user, token: "..." })
  },
  RATE_LIMITS.AUTH // 5 requests per 15 minutes
)
```

## مثال 3: API Route مع كل شيء (Rate Limiting + Error Handling)

```typescript
// app/api/products/[id]/route.ts
import { withRateLimit, RATE_LIMITS, apiSuccess } from "@/lib/api"
import { withErrorHandler, NotFoundError } from "@/lib/errors"
import { logger } from "@/lib/utils"
import { getProduct, updateProduct } from "@/lib/actions/products"

// GET with rate limiting and error handling
export const GET = withRateLimit(
  withErrorHandler(async (request: Request, { params }: { params: { id: string } }) => {
    logger.info("Fetching product", { id: params.id })
    
    const product = await getProduct(parseInt(params.id))
    
    if (!product) {
      throw new NotFoundError("Product")
    }
    
    return apiSuccess(product)
  }),
  RATE_LIMITS.READ // 120 requests per minute
)

// PUT with stricter rate limiting
export const PUT = withRateLimit(
  withErrorHandler(async (request: Request, { params }: { params: { id: string } }) => {
    const body = await request.json()
    
    logger.info("Updating product", { id: params.id, body })
    
    const product = await updateProduct(parseInt(params.id), body)
    
    if (!product) {
      throw new NotFoundError("Product")
    }
    
    return apiSuccess(product, "Product updated successfully")
  }),
  RATE_LIMITS.WRITE // 20 requests per minute
)
```

## مثال 4: استخدام Custom Rate Limit

```typescript
// app/api/upload/route.ts
import { withRateLimit, apiSuccess } from "@/lib/api"
import { withErrorHandler, ValidationError } from "@/lib/errors"

export const POST = withRateLimit(
  withErrorHandler(async (request: Request) => {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      throw new ValidationError("File is required")
    }
    
    // Upload logic here
    const url = await uploadToCloudinary(file)
    
    return apiSuccess({ url }, "File uploaded successfully")
  }),
  {
    uniqueTokenPerInterval: "api-upload-custom",
    interval: 10 * 60 * 1000, // 10 minutes
    limit: 5, // 5 uploads per 10 minutes
  }
)
```

## مثال 5: Server Action مع Error Handling

```typescript
// lib/actions/products.ts
"use server"

import { logger } from "@/lib/utils"
import { handleDatabaseError, NotFoundError } from "@/lib/errors"
import { db } from "@/lib/db"

export async function deleteProduct(id: number) {
  try {
    logger.info("Deleting product", { id })
    
    const product = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.id, id),
    })
    
    if (!product) {
      throw new NotFoundError("Product")
    }
    
    await db.delete(products).where(eq(products.id, id))
    
    logger.info("Product deleted successfully", { id })
    
    return { success: true, message: "Product deleted" }
  } catch (error) {
    logger.error("Failed to delete product", error)
    
    // Convert database errors to AppError
    if (error instanceof Error && error.message.includes("foreign key")) {
      throw handleDatabaseError(error)
    }
    
    throw error
  }
}
```

## مثال 6: Validation مع Zod

```typescript
// app/api/products/route.ts
import { z } from "zod"
import { withRateLimit, RATE_LIMITS, apiSuccess } from "@/lib/api"
import { withErrorHandler, ValidationError } from "@/lib/errors"

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.number().positive("Price must be positive"),
  description: z.string().optional(),
})

export const POST = withRateLimit(
  withErrorHandler(async (request: Request) => {
    const body = await request.json()
    
    // Zod validation - throws ZodError automatically handled by withErrorHandler
    const validatedData = productSchema.parse(body)
    
    const product = await createProduct(validatedData)
    
    return apiSuccess(product, "Product created successfully", 201)
  }),
  RATE_LIMITS.WRITE
)
```

## استخدام Response Helpers

```typescript
import {
  apiSuccess,
  apiError,
  apiUnauthorized,
  apiForbidden,
  apiNotFound,
  apiValidationError,
  apiInternalError,
} from "@/lib/api"

// Success (200)
return apiSuccess({ user })

// Success with custom status (201)
return apiSuccess({ product }, "Created successfully", 201)

// Bad Request (400)
return apiError("Invalid request")

// Unauthorized (401)
return apiUnauthorized()
return apiUnauthorized("Custom message")

// Forbidden (403)
return apiForbidden()

// Not Found (404)
return apiNotFound()
return apiNotFound("Product not found")

// Validation Error (422)
return apiValidationError({ field: "email", message: "Invalid email" })

// Internal Server Error (500)
return apiInternalError()
return apiInternalError("Database connection failed")
```

## استخدام Logger

```typescript
import { logger } from "@/lib/utils"

// Info (يظهر فقط في development)
logger.info("User logged in", { userId: 123 })

// Debug (يظهر فقط في development)
logger.debug("Processing data", { data })

// Warning (يظهر دائماً)
logger.warn("Deprecated API used", { endpoint: "/old-api" })

// Error (يظهر دائماً)
logger.error("Database connection failed", error)

// API Request/Response
logger.apiRequest("POST", "/api/products", body)
logger.apiResponse("POST", "/api/products", 201, result)

// Performance Timing
const endTimer = logger.startTimer("Database Query")
await db.query()
endTimer() // Logs: "Performance: Database Query - 45ms"

// Authentication Events
logger.auth("login", userId, { provider: "google" })
```

## Rate Limit Presets

```typescript
import { RATE_LIMITS } from "@/lib/api"

// AUTH: 5 requests per 15 minutes (للـ login/register)
RATE_LIMITS.AUTH

// API: 60 requests per minute (standard API)
RATE_LIMITS.API

// READ: 120 requests per minute (للـ GET requests)
RATE_LIMITS.READ

// WRITE: 20 requests per minute (للـ POST/PUT/DELETE)
RATE_LIMITS.WRITE

// UPLOAD: 10 requests per 5 minutes (للـ file uploads)
RATE_LIMITS.UPLOAD

// SENSITIVE: 3 requests per hour (للعمليات الحساسة)
RATE_LIMITS.SENSITIVE
```

## Error Classes المتاحة

```typescript
import {
  AuthenticationError,    // 401
  AuthorizationError,     // 403
  ValidationError,        // 422
  NotFoundError,          // 404
  ConflictError,          // 409
  DatabaseError,          // 500
  ExternalServiceError,   // 503
  RateLimitError,         // 429
  BadRequestError,        // 400
} from "@/lib/errors"

// استخدام
throw new NotFoundError("Product")
throw new ValidationError("Invalid email", { field: "email" })
throw new AuthenticationError("Invalid token")
```

## Best Practices

### ✅ افعل:
- استخدم `withErrorHandler` لجميع API routes
- استخدم `withRateLimit` للحماية من spam
- استخدم `logger` بدلاً من `console.log`
- ارمي `AppError` classes للأخطاء المتوقعة
- استخدم Zod للـ validation

### ❌ لا تفعل:
- لا تستخدم `console.log` في production code
- لا ترمي `Error` عادي، استخدم `AppError`
- لا تنسَ rate limiting للـ endpoints الحساسة
- لا تعرض معلومات حساسة في error messages
- لا تستخدم `process.env` مباشرة، استخدم `env`
