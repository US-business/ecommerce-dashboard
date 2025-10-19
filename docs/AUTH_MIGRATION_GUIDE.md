# دليل توحيد نظام المصادقة

## نظرة عامة
تم توحيد نظام المصادقة في المشروع لاستخدام **NextAuth فقط** بدلاً من وجود نظامين منفصلين (Custom Auth + NextAuth).

## التغييرات الرئيسية

### 1. ملف `lib/auth/actions.ts`
**قبل:** كان يحتوي على دوال مصادقة مخصصة تستخدم JWT sessions
**بعد:** تم تحويله لاستخدام NextAuth بالكامل مع دوال مساعدة

#### الدوال الجديدة:
- `getCurrentUser()` - الحصول على المستخدم الحالي من NextAuth session
- `isAuthenticated()` - التحقق من وجود session
- `isSuperAdmin()` - التحقق من صلاحيات المدير
- `getUserByEmail(email)` - البحث عن مستخدم بالبريد الإلكتروني
- `updateUserProfile(data)` - تحديث بيانات المستخدم
- `verifyCredentials(email, password)` - التحقق من بيانات الدخول (للـ API)
- `createUserAccount(userData)` - إنشاء حساب جديد (للمدير فقط)
- `deleteUserAccount(userId)` - حذف حساب (للمدير فقط)

#### الدوال المحذوفة:
- ❌ `login()` - استخدم NextAuth signIn بدلاً منها
- ❌ `logout()` - استخدم NextAuth signOut بدلاً منها
- ❌ `register()` - استخدم API route `/api/auth/register`
- ❌ `changePassword()` - استخدم API route `/api/auth/change-password`
- ❌ `resetPassword()` - سيتم تطويره لاحقاً
- ❌ `requireAuth()` - استخدم middleware أو getServerSession
- ❌ `requireSuperAdmin()` - استخدم middleware أو isSuperAdmin()

### 2. ملف `lib/auth/get-unified-user.ts`
**قبل:** كان يحاول الجمع بين NextAuth و Custom Auth
**بعد:** أصبح wrapper بسيط حول `getCurrentUser()`

```typescript
// استخدام جديد (موصى به)
import { getCurrentUser } from "@/lib/auth/actions"
const user = await getCurrentUser()

// استخدام قديم (لا يزال يعمل)
import { getUnifiedUser } from "@/lib/auth/get-unified-user"
const user = await getUnifiedUser()
```

### 3. ملف `middleware.ts`
**قبل:** لم يكن يحمي أي routes
**بعد:** يحمي dashboard routes ويتحقق من الصلاحيات

#### Routes المحمية:
- `/dashboard/*` - يتطلب authentication
- `/dashboard/products/*` - يتطلب super_admin
- `/dashboard/categories/*` - يتطلب super_admin
- `/dashboard/coupons/*` - يتطلب super_admin
- `/dashboard/orders/*` - يتطلب super_admin
- `/dashboard/gallery/*` - يتطلب super_admin

### 4. ملفات محذوفة
- ❌ `lib/auth/session.ts` - لم يعد مستخدماً (كان للـ Custom Auth)
- ❌ `lib/stores/auth-store.ts` - تم استبداله بـ `unified-auth-store.ts`

### 5. ملفات لم تتغير
- ✅ `lib/auth/auth.config.ts` - تكوين NextAuth (بدون تغيير)
- ✅ `lib/stores/unified-auth-store.ts` - Store الرئيسي (بدون تغيير)
- ✅ `components/auth/*` - مكونات المصادقة (بدون تغيير)

## كيفية الاستخدام

### في Server Components
```typescript
import { getCurrentUser, isSuperAdmin } from "@/lib/auth/actions"

export default async function Page() {
  const user = await getCurrentUser()
  const isAdmin = await isSuperAdmin()
  
  if (!user) {
    redirect("/signin")
  }
  
  return <div>Welcome {user.username}</div>
}
```

### في Client Components
```typescript
"use client"
import { useAuth } from "@/lib/stores"
import { signIn, signOut } from "next-auth/react"

export default function Component() {
  const { user, isAuthenticated, isSuperAdmin } = useAuth()
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={() => signOut()}>Logout</button>
      ) : (
        <button onClick={() => signIn()}>Login</button>
      )}
    </div>
  )
}
```

### في API Routes
```typescript
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }
  
  // Your logic here
}
```

## الفوائد

1. ✅ **نظام موحد** - لا يوجد ازدواجية أو تضارب
2. ✅ **أمان أفضل** - حماية Routes في middleware
3. ✅ **كود أنظف** - إزالة التعقيد غير الضروري
4. ✅ **صيانة أسهل** - نقطة واحدة للمصادقة
5. ✅ **توافق أفضل** - استخدام معايير NextAuth

## ملاحظات مهمة

### متغيرات البيئة المطلوبة
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=your-database-url
```

### الترحيل من Custom Auth
إذا كان لديك كود يستخدم Custom Auth القديم:

```typescript
// ❌ قديم
import { login, logout } from "@/lib/auth/actions"
await login(formData)
await logout()

// ✅ جديد
import { signIn, signOut } from "next-auth/react"
await signIn("credentials", { email, password })
await signOut()
```

## الخطوات التالية

1. ✅ توحيد نظام المصادقة
2. ⏳ إضافة Email Verification
3. ⏳ إضافة Password Reset
4. ⏳ إضافة Rate Limiting
5. ⏳ إضافة 2FA (Two-Factor Authentication)

## الدعم

إذا واجهت أي مشاكل بعد التحديث، تحقق من:
1. متغيرات البيئة صحيحة
2. Database schema محدث
3. NextAuth callbacks تعمل بشكل صحيح
4. Session cookies تُحفظ بشكل صحيح

---

**تاريخ التحديث:** أكتوبر 2025  
**الإصدار:** 2.0.0
