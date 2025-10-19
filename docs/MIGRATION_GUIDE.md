# 🔄 دليل الانتقال - Migration Guide

## استبدال console.log بـ Logger

### **الخطوة 1: استيراد Logger**

```typescript
// أضف في بداية الملف
import { logger } from '@/lib/utils'
```

### **الخطوة 2: استبدال الأنماط الشائعة**

#### **Pattern 1: Info Logging**
```typescript
// ❌ قديم
console.log('User logged in', userId)
console.log('Product created:', product)

// ✅ جديد
logger.info('User logged in', { userId })
logger.info('Product created', { product })
```

#### **Pattern 2: Error Logging**
```typescript
// ❌ قديم
console.error('Error:', error)
console.log('Failed to save:', error.message)

// ✅ جديد
logger.error('Failed to save user', error)
logger.error('Database error', error)
```

#### **Pattern 3: Debug Logging**
```typescript
// ❌ قديم
console.log('Debug:', data)
if (process.env.NODE_ENV === 'development') {
  console.log('Dev info:', info)
}

// ✅ جديد
logger.debug('Processing data', { data })
logger.debug('Development info', { info })
// يعرض فقط في development تلقائياً
```

#### **Pattern 4: Warning Logging**
```typescript
// ❌ قديم
console.warn('Warning:', message)

// ✅ جديد
logger.warn('Validation warning', { message })
```

### **الخطوة 3: حالات خاصة**

#### **API Requests:**
```typescript
// ❌ قديم
console.log('API Request:', method, path, data)

// ✅ جديد
logger.apiRequest(method, path, data)
```

#### **API Responses:**
```typescript
// ❌ قديم
console.log('API Response:', status, data)

// ✅ جديد
logger.apiResponse(method, path, status, data)
```

#### **Database Queries:**
```typescript
// ❌ قديم
console.log('Query:', query, params)

// ✅ جديد
logger.dbQuery(query, params)
```

#### **Authentication Events:**
```typescript
// ❌ قديم
console.log('User login:', userId, provider)

// ✅ جديد
logger.auth('login', userId, { provider })
```

#### **Performance Timing:**
```typescript
// ❌ قديم
const start = Date.now()
await someOperation()
console.log('Duration:', Date.now() - start)

// ✅ جديد
const endTimer = logger.startTimer('Operation Name')
await someOperation()
endTimer() // يسجل المدة تلقائياً
```

---

## استبدال process.env بـ env

### **الخطوة 1: استيراد env**

```typescript
// أضف في بداية الملف
import { env } from '@/lib/utils'
```

### **الخطوة 2: استبدال المتغيرات**

```typescript
// ❌ قديم
const dbUrl = process.env.DATABASE_URL
const secret = process.env.NEXTAUTH_SECRET
const cloudName = process.env.CLOUDINARY_CLOUD_NAME

// ✅ جديد
const dbUrl = env.DATABASE_URL
const secret = env.NEXTAUTH_SECRET
const cloudName = env.CLOUDINARY_CLOUD_NAME
```

### **الخطوة 3: التحقق من البيئة**

```typescript
// ❌ قديم
if (process.env.NODE_ENV === 'production') {
  // ...
}

if (process.env.NODE_ENV === 'development') {
  // ...
}

// ✅ جديد
import { isProduction, isDevelopment } from '@/lib/utils'

if (isProduction) {
  // ...
}

if (isDevelopment) {
  // ...
}
```

---

## استبدال الثوابت الصلبة بـ Constants

### **قبل:**
```typescript
// في ملفات متعددة
const MIN_PASSWORD_LENGTH = 8
const DEFAULT_PAGE_SIZE = 10
const MAX_FILE_SIZE = 10 * 1024 * 1024
```

### **بعد:**
```typescript
import { AUTH_CONFIG, PAGINATION, IMAGE_CONFIG } from '@/lib/config/constants'

const minLength = AUTH_CONFIG.PASSWORD_MIN_LENGTH
const pageSize = PAGINATION.DEFAULT_PAGE_SIZE
const maxSize = IMAGE_CONFIG.MAX_FILE_SIZE
```

---

## أمثلة كاملة للملفات

### **مثال 1: Server Action**

#### **قبل:**
```typescript
"use server"

export async function createProduct(data: any) {
  try {
    console.log('Creating product:', data)
    
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    
    const result = await db.insert(products).values(data)
    
    console.log('Product created:', result.id)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'حدث خطأ' }
  }
}
```

#### **بعد:**
```typescript
"use server"

import { logger, env } from '@/lib/utils'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/config/constants'

export async function createProduct(data: ProductData) {
  try {
    logger.info('Creating product', { data })
    
    const cloudName = env.CLOUDINARY_CLOUD_NAME
    
    const result = await db.insert(products).values(data)
    
    logger.info('Product created successfully', { id: result.id })
    return { success: true, data: result, message: SUCCESS_MESSAGES.CREATED }
  } catch (error) {
    logger.error('Failed to create product', error)
    return { success: false, error: ERROR_MESSAGES.DATABASE_ERROR }
  }
}
```

### **مثال 2: API Route**

#### **قبل:**
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Request:', body)
    
    const result = await createProduct(body)
    
    console.log('Response:', result)
    return Response.json(result)
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Error' }, { status: 500 })
  }
}
```

#### **بعد:**
```typescript
import { logger } from '@/lib/utils'

export async function POST(request: Request) {
  const endTimer = logger.startTimer('Create Product API')
  
  try {
    const body = await request.json()
    logger.apiRequest('POST', '/api/products', body)
    
    const result = await createProduct(body)
    
    logger.apiResponse('POST', '/api/products', 201, result)
    endTimer()
    
    return Response.json(result, { status: 201 })
  } catch (error) {
    logger.error('API Error', error)
    endTimer()
    return Response.json({ error: ERROR_MESSAGES.GENERIC }, { status: 500 })
  }
}
```

### **مثال 3: Database Connection**

#### **قبل:**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DATABASE_URL is required')
}

console.log('Connecting to database...')
const client = postgres(connectionString)
export const db = drizzle(client)
```

#### **بعد:**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '@/lib/utils'
import { logger } from '@/lib/utils'

// env.DATABASE_URL مضمون الوجود بفضل validation
logger.info('Initializing database connection')
const client = postgres(env.DATABASE_URL)
export const db = drizzle(client)
```

---

## Script للاستبدال الآلي

يمكنك استخدام Find & Replace في VS Code:

### **استبدال console.log:**
1. افتح Find (Ctrl+Shift+F)
2. ابحث عن: `console\.log\(`
3. استبدل بـ: `logger.info(`
4. راجع كل حالة قبل الاستبدال

### **استبدال console.error:**
1. ابحث عن: `console\.error\(`
2. استبدل بـ: `logger.error(`

### **استبدال process.env.NODE_ENV:**
1. ابحث عن: `process\.env\.NODE_ENV === ['"]production['"]`
2. استبدل بـ: `isProduction`
3. لا تنسَ إضافة: `import { isProduction } from '@/lib/utils'`

---

## Checklist للملف الواحد

عند تحديث ملف:

- [ ] استورد `logger` من `@/lib/utils`
- [ ] استبدل جميع `console.log` بـ `logger.info`
- [ ] استبدل جميع `console.error` بـ `logger.error`
- [ ] استبدل جميع `console.warn` بـ `logger.warn`
- [ ] استورد `env` من `@/lib/utils`
- [ ] استبدل جميع `process.env.VARIABLE` بـ `env.VARIABLE`
- [ ] استورد constants المطلوبة من `@/lib/config/constants`
- [ ] استبدل الثوابت الصلبة بالثوابت المركزية
- [ ] اختبر الملف

---

## أولويات الاستبدال

### **High Priority (الآن):**
1. ✅ ملفات config والـ database
2. ✅ API routes
3. ✅ Server actions الرئيسية

### **Medium Priority (قريباً):**
1. ⏳ باقي Server actions
2. ⏳ Utilities
3. ⏳ Stores

### **Low Priority (لاحقاً):**
1. ⏱️ Components (قليلة الاستخدام للـ console.log)
2. ⏱️ Pages (قليلة الاستخدام)

---

## ملاحظات مهمة

### **لا تستبدل:**
- ❌ `console.log` داخل try-catch في pages (قد تحتاجها للـ debugging)
- ❌ `process.env.NEXT_PUBLIC_*` في client components (استخدم process.env مباشرة)

### **استبدل دائماً:**
- ✅ `console.log` في Server Actions
- ✅ `console.log` في API Routes
- ✅ `console.error` في كل مكان
- ✅ `process.env` في server code
- ✅ الثوابت الصلبة

---

**نصيحة:** ابدأ بملف واحد، اختبره جيداً، ثم انتقل للتالي. التدرج أفضل من الاستبدال الجماعي.
