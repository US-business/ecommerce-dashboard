# 📁 Configuration Folder

هذا المجلد يحتوي على جميع إعدادات التطبيق المركزية.

## 📄 الملفات

### **`env.ts`** - Environment Variables Validation

نظام التحقق من صحة متغيرات البيئة باستخدام Zod.

**الاستخدام:**
```typescript
import { env, isProduction, isDevelopment } from '@/lib/config/env'

// Type-safe environment variables
const dbUrl = env.DATABASE_URL
const secret = env.NEXTAUTH_SECRET

// Environment checks
if (isProduction) {
  // production code
}
```

**الميزات:**
- ✅ Validation تلقائي عند بدء التطبيق
- ✅ Type safety كامل
- ✅ رسائل خطأ واضحة
- ✅ يمنع التشغيل إذا كانت المتغيرات غير صحيحة

---

### **`constants.ts`** - Application Constants

جميع ثوابت التطبيق في مكان واحد.

**الاستخدام:**
```typescript
import { 
  AUTH_CONFIG,
  PAGINATION,
  IMAGE_CONFIG,
  PRODUCT_CONFIG,
  ORDER_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from '@/lib/config/constants'

// Authentication
const minPasswordLength = AUTH_CONFIG.PASSWORD_MIN_LENGTH
const sessionMaxAge = AUTH_CONFIG.SESSION_MAX_AGE

// Pagination
const pageSize = PAGINATION.DEFAULT_PAGE_SIZE

// Images
const maxFileSize = IMAGE_CONFIG.MAX_FILE_SIZE

// Messages
const errorMsg = ERROR_MESSAGES.UNAUTHORIZED
const successMsg = SUCCESS_MESSAGES.CREATED
```

**المحتويات:**
- ✅ Locales (ar, en)
- ✅ Authentication config
- ✅ Pagination settings
- ✅ Image upload limits
- ✅ Product configuration
- ✅ Order configuration
- ✅ API routes
- ✅ Cache settings
- ✅ SEO defaults
- ✅ Error/Success messages

---

## 🎯 لماذا هذا المجلد؟

### **المشاكل القديمة:**
- ❌ متغيرات البيئة غير آمنة (`process.env`)
- ❌ ثوابت مكررة في ملفات متعددة
- ❌ لا يوجد validation للإعدادات
- ❌ صعوبة تغيير الإعدادات

### **الحل:**
- ✅ Environment validation مركزي
- ✅ Constants في مكان واحد
- ✅ Type safety كامل
- ✅ سهولة التعديل والصيانة

---

## 📝 إضافة إعدادات جديدة

### **إضافة متغير بيئة جديد:**

1. أضف في `env.ts`:
```typescript
const envSchema = z.object({
  // ... existing fields
  NEW_API_KEY: z.string().min(1, "NEW_API_KEY is required"),
})
```

2. استخدمه:
```typescript
import { env } from '@/lib/config/env'
const apiKey = env.NEW_API_KEY
```

### **إضافة ثابت جديد:**

1. أضف في `constants.ts`:
```typescript
export const FEATURE_CONFIG = {
  MAX_ITEMS: 100,
  TIMEOUT: 5000,
} as const
```

2. استخدمه:
```typescript
import { FEATURE_CONFIG } from '@/lib/config/constants'
const maxItems = FEATURE_CONFIG.MAX_ITEMS
```

---

## ⚠️ ملاحظات مهمة

### **Environment Variables:**
- ✅ استخدم دائماً `env` من هذا الملف
- ❌ لا تستخدم `process.env` مباشرة في الكود
- ✅ أضف validation لكل متغير جديد
- ❌ لا تضع قيم افتراضية للأسرار

### **Constants:**
- ✅ استخدم `as const` للـ type safety
- ✅ نظم الثوابت في مجموعات منطقية
- ✅ أضف تعليقات للثوابت المعقدة
- ❌ لا تضع قيم متغيرة هنا

---

## 🔗 الملفات ذات العلاقة

- `lib/utils.ts` - يعيد تصدير `env` و `logger`
- `lib/utils/logger.ts` - يستخدم `env` للـ environment checks
- `docs/MIGRATION_GUIDE.md` - دليل الانتقال للإعدادات الجديدة

---

**تم إنشاؤه:** 2025-10-17  
**الحالة:** ✅ Active
