# دليل معالجة الأخطاء - Error Handling Guide

## نظرة عامة

تم إنشاء نظام موحد ومتناسق لمعالجة الأخطاء في جميع أنحاء تطبيق المصادقة. هذا النظام يوفر:

- ✅ **أكواد أخطاء موحدة** (Error Codes)
- ✅ **رسائل خطأ ثنائية اللغة** (EN/AR)
- ✅ **تسجيل أخطاء متناسق** (Consistent Logging)
- ✅ **معالجة أخطاء مركزية** (Centralized Error Handling)
- ✅ **تحقق من الصحة** (Validation)

---

## البنية المعمارية

```
lib/auth/
├── errors.ts              # نظام معالجة الأخطاء الموحد
├── actions.ts             # يستخدم النظام الموحد
├── auth.config.ts         # يستخدم النظام الموحد
└── README.md

app/api/auth/
├── change-password/
│   └── route.ts          # يستخدم النظام الموحد
└── register/
    └── route.ts          # يستخدم النظام الموحد
```

---

## أكواد الأخطاء (Error Codes)

### Authentication Errors

| Code | الوصف | Status Code |
|------|--------|-------------|
| `UNAUTHORIZED` | غير مصرح | 401 |
| `INVALID_CREDENTIALS` | بيانات دخول خاطئة | 401 |
| `SESSION_EXPIRED` | انتهت صلاحية الجلسة | 401 |
| `NO_SESSION` | لا توجد جلسة نشطة | 401 |

### Authorization Errors

| Code | الوصف | Status Code |
|------|--------|-------------|
| `FORBIDDEN` | ممنوع | 403 |
| `INSUFFICIENT_PERMISSIONS` | صلاحيات غير كافية | 403 |

### User Errors

| Code | الوصف | Status Code |
|------|--------|-------------|
| `USER_NOT_FOUND` | المستخدم غير موجود | 404 |
| `USER_ALREADY_EXISTS` | المستخدم موجود بالفعل | 409 |
| `INVALID_EMAIL` | بريد إلكتروني غير صالح | 400 |
| `INVALID_PASSWORD` | كلمة مرور غير صالحة | 400 |

### Database Errors

| Code | الوصف | Status Code |
|------|--------|-------------|
| `DATABASE_ERROR` | خطأ في قاعدة البيانات | 500 |
| `DATABASE_CONNECTION_FAILED` | فشل الاتصال بقاعدة البيانات | 503 |

### Validation Errors

| Code | الوصف | Status Code |
|------|--------|-------------|
| `VALIDATION_ERROR` | خطأ في التحقق | 400 |
| `MISSING_FIELDS` | حقول مفقودة | 400 |

### Server Errors

| Code | الوصف | Status Code |
|------|--------|-------------|
| `INTERNAL_ERROR` | خطأ داخلي | 500 |
| `UNKNOWN_ERROR` | خطأ غير معروف | 500 |

---

## الاستخدام

### 1. إنشاء أخطاء مخصصة

```typescript
import { createAuthError } from "@/lib/auth/errors"

// مثال: مستخدم غير موجود
throw createAuthError.userNotFound({ userId: 123 })

// مثال: بيانات دخول خاطئة
throw createAuthError.invalidCredentials()

// مثال: صلاحيات غير كافية
throw createAuthError.insufficientPermissions()

// مثال: حقول مفقودة
throw createAuthError.missingFields(["email", "password"])

// مثال: خطأ تحقق مخصص
throw createAuthError.validationError("Custom validation message")
```

### 2. تسجيل الأخطاء

```typescript
import { logAuthError } from "@/lib/auth/errors"

try {
  // Your code here
} catch (error) {
  logAuthError("Context/Function Name", error, {
    additionalInfo: "any relevant data",
    userId: 123
  })
}
```

**مثال على الـ Log Output:**

```json
{
  "timestamp": "2025-10-18T13:00:00.000Z",
  "context": "getCurrentUser",
  "error": {
    "name": "AuthError",
    "message": "User not found",
    "code": "USER_NOT_FOUND",
    "statusCode": 404,
    "details": { "email": "user@example.com" }
  },
  "additionalInfo": { "hasSession": true }
}
```

### 3. معالجة الأخطاء في Server Actions

```typescript
import { handleServerActionError } from "@/lib/auth/errors"

export async function myServerAction(): Promise<ActionResult> {
  try {
    // Validate input
    if (!email) {
      throw createAuthError.invalidEmail()
    }

    // Your logic here
    
    return { success: true }
  } catch (error) {
    return handleServerActionError("myServerAction", error)
  }
}
```

### 4. معالجة الأخطاء في API Routes

```typescript
import { AuthError, logAuthError } from "@/lib/auth/errors"

export async function POST(request: Request) {
  try {
    // Your logic here
    
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AuthError) {
      logAuthError("POST /api/my-route", error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message, 
          code: error.code 
        },
        { status: error.statusCode }
      )
    }

    logAuthError("POST /api/my-route", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### 5. التحقق من الصحة (Validation)

```typescript
import { 
  validateRequiredFields,
  isValidEmail,
  isValidPassword 
} from "@/lib/auth/errors"

// التحقق من الحقول المطلوبة
validateRequiredFields(data, ["email", "password", "username"])
// يرمي خطأ إذا كانت الحقول مفقودة

// التحقق من البريد الإلكتروني
if (!isValidEmail(email)) {
  throw createAuthError.invalidEmail({ email })
}

// التحقق من كلمة المرور
if (!isValidPassword(password)) {
  throw createAuthError.invalidPassword()
}
```

---

## أمثلة عملية

### مثال 1: Server Action مع معالجة أخطاء كاملة

```typescript
import { 
  createAuthError, 
  handleServerActionError,
  validateRequiredFields,
  isValidEmail 
} from "@/lib/auth/errors"

export async function updateUserEmail(
  userId: number, 
  newEmail: string
): Promise<ActionResult> {
  try {
    // 1. التحقق من المدخلات
    validateRequiredFields({ userId, newEmail }, ["userId", "newEmail"])
    
    if (!isValidEmail(newEmail)) {
      throw createAuthError.invalidEmail({ email: newEmail })
    }

    // 2. التحقق من الصلاحيات
    const isAdmin = await isSuperAdmin()
    if (!isAdmin) {
      throw createAuthError.insufficientPermissions()
    }

    // 3. التحقق من وجود المستخدم
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .then(rows => rows[0])
    
    if (!user) {
      throw createAuthError.userNotFound({ userId })
    }

    // 4. التحقق من عدم وجود البريد الإلكتروني
    const existingUser = await getUserByEmail(newEmail)
    if (existingUser && existingUser.id !== userId) {
      throw createAuthError.userAlreadyExists({ email: newEmail })
    }

    // 5. تحديث البريد الإلكتروني
    await db.update(users)
      .set({ email: newEmail, updatedAt: new Date() })
      .where(eq(users.id, userId))

    return { success: true }
  } catch (error) {
    return handleServerActionError("updateUserEmail", error)
  }
}
```

### مثال 2: API Route مع معالجة أخطاء كاملة

```typescript
import { NextResponse } from "next/server"
import { 
  createAuthError,
  logAuthError,
  validateRequiredFields,
  isValidEmail,
  AuthError
} from "@/lib/auth/errors"

export async function POST(request: Request) {
  try {
    // 1. التحقق من المصادقة
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw createAuthError.unauthorized()
    }

    // 2. تحليل البيانات
    const body = await request.json()
    const { email, name } = body

    // 3. التحقق من الحقول المطلوبة
    validateRequiredFields(body, ["email", "name"])

    // 4. التحقق من صحة البريد الإلكتروني
    if (!isValidEmail(email)) {
      throw createAuthError.invalidEmail({ email })
    }

    // 5. منطق العمل
    // ... your business logic

    return NextResponse.json({ success: true })
  } catch (error) {
    // معالجة الأخطاء المخصصة
    if (error instanceof AuthError) {
      logAuthError("POST /api/my-endpoint", error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          code: error.code 
        },
        { status: error.statusCode }
      )
    }

    // معالجة الأخطاء العامة
    logAuthError("POST /api/my-endpoint", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### مثال 3: معالجة الأخطاء في NextAuth Callbacks

```typescript
import { logAuthError } from "@/lib/auth/errors"

export const authOptions: AuthOptions = {
  callbacks: {
    async jwt({ token, user, account }) {
      try {
        // Your logic here
        
        return token
      } catch (error) {
        logAuthError("jwt callback", error, {
          hasUser: !!user,
          hasAccount: !!account,
          userEmail: user?.email
        })
        
        // Return fallback token
        return token
      }
    },
    
    async signIn({ user, account }) {
      try {
        // Your logic here
        
        return true
      } catch (error) {
        logAuthError("signIn callback", error, {
          userEmail: user.email,
          provider: account.provider
        })
        return false
      }
    }
  }
}
```

---

## الرسائل ثنائية اللغة

جميع رسائل الأخطاء متوفرة بالإنجليزية والعربية:

```typescript
import { AuthError } from "@/lib/auth/errors"

const error = createAuthError.userNotFound()

// الحصول على الرسالة بالإنجليزية (افتراضي)
console.log(error.message) // "User not found"

// الحصول على الرسالة بالعربية
console.log(error.getLocalizedMessage("ar")) // "المستخدم غير موجود"

// الحصول على الرسالة بالإنجليزية
console.log(error.getLocalizedMessage("en")) // "User not found"
```

---

## أفضل الممارسات

### 1. استخدم الأخطاء المخصصة دائماً

❌ **سيء:**
```typescript
throw new Error("User not found")
```

✅ **جيد:**
```typescript
throw createAuthError.userNotFound({ userId })
```

### 2. سجل الأخطاء مع السياق

❌ **سيء:**
```typescript
catch (error) {
  console.error(error)
}
```

✅ **جيد:**
```typescript
catch (error) {
  logAuthError("functionName", error, {
    relevantData: "value"
  })
}
```

### 3. تحقق من المدخلات أولاً

✅ **جيد:**
```typescript
export async function myAction(data: any) {
  try {
    // 1. التحقق من المدخلات أولاً
    validateRequiredFields(data, ["field1", "field2"])
    
    if (!isValidEmail(data.email)) {
      throw createAuthError.invalidEmail()
    }
    
    // 2. ثم منطق العمل
    // ...
  } catch (error) {
    return handleServerActionError("myAction", error)
  }
}
```

### 4. استخدم handleServerActionError في Server Actions

✅ **جيد:**
```typescript
export async function myServerAction() {
  try {
    // Your logic
    return { success: true }
  } catch (error) {
    return handleServerActionError("myServerAction", error)
  }
}
```

### 5. تحقق من نوع الخطأ في API Routes

✅ **جيد:**
```typescript
catch (error) {
  if (error instanceof AuthError) {
    // معالجة الأخطاء المخصصة
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }
  
  // معالجة الأخطاء العامة
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  )
}
```

---

## الفوائد

### قبل التحديث ❌

```typescript
// معالجة أخطاء غير متناسقة
catch (error) {
  console.error("Error:", error) // أحياناً
}

catch (error) {
  // لا يوجد logging
}

catch (error) {
  console.log("Something went wrong") // رسائل غير واضحة
}

return { success: false, error: "Error" } // رسائل عامة
```

### بعد التحديث ✅

```typescript
// معالجة أخطاء موحدة ومتناسقة
catch (error) {
  logAuthError("context", error, { additionalInfo })
  return handleServerActionError("context", error)
}

// رسائل خطأ واضحة ومحددة
throw createAuthError.userNotFound({ userId })

// أكواد خطأ موحدة
{ success: false, error: "User not found", code: "USER_NOT_FOUND" }

// تسجيل أخطاء منظم
{
  "timestamp": "...",
  "context": "...",
  "error": { "name": "...", "message": "...", "code": "..." }
}
```

---

## الملخص

| الميزة | قبل | بعد |
|--------|-----|-----|
| **أكواد الأخطاء** | ❌ غير موجودة | ✅ موحدة |
| **رسائل الأخطاء** | ❌ غير متناسقة | ✅ واضحة ومحددة |
| **اللغات** | ❌ إنجليزي فقط | ✅ EN + AR |
| **التسجيل** | ❌ غير منظم | ✅ منظم ومفصل |
| **المعالجة** | ❌ متفرقة | ✅ مركزية |
| **التحقق** | ❌ يدوي | ✅ دوال مساعدة |

---

## المراجع

- `lib/auth/errors.ts` - نظام معالجة الأخطاء الكامل
- `lib/auth/actions.ts` - أمثلة استخدام في Server Actions
- `lib/auth/auth.config.ts` - أمثلة استخدام في NextAuth
- `app/api/auth/*/route.ts` - أمثلة استخدام في API Routes

---

**تاريخ الإنشاء:** أكتوبر 2025  
**الإصدار:** 1.0.0  
**الحالة:** ✅ نشط ومستخدم في الإنتاج
