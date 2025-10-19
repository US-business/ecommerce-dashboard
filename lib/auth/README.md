# نظام المصادقة - Authentication System

## البنية المعمارية

```
lib/auth/
├── auth.config.ts          # تكوين NextAuth (Providers, Callbacks)
├── actions.ts              # Server Actions للمصادقة
├── get-unified-user.ts     # Wrapper للتوافق مع الإصدارات القديمة
└── README.md              # هذا الملف
```

## المكونات الرئيسية

### 1. NextAuth Configuration (`auth.config.ts`)

يحتوي على:
- **Providers:**
  - Google OAuth
  - Credentials (Email/Password)
  
- **Callbacks:**
  - `jwt` - إدارة JWT tokens
  - `session` - إدارة session data
  - `signIn` - معالجة تسجيل الدخول
  - `redirect` - معالجة التوجيه بعد المصادقة

- **Session Strategy:** JWT (بدون database sessions)

### 2. Server Actions (`actions.ts`)

#### دوال المصادقة الأساسية

##### `getCurrentUser()`
الحصول على المستخدم الحالي من NextAuth session
```typescript
const user = await getCurrentUser()
// Returns: { id, username, email, role, createdAt, image, provider } | null
```

##### `isAuthenticated()`
التحقق من وجود session نشط
```typescript
const authenticated = await isAuthenticated()
// Returns: boolean
```

##### `isSuperAdmin()`
التحقق من صلاحيات المدير
```typescript
const isAdmin = await isSuperAdmin()
// Returns: boolean
```

#### دوال إدارة المستخدمين

##### `getUserByEmail(email: string)`
البحث عن مستخدم بالبريد الإلكتروني
```typescript
const user = await getUserByEmail("user@example.com")
```

##### `updateUserProfile(data)`
تحديث بيانات المستخدم الحالي
```typescript
await updateUserProfile({
  username: "newname",
  address: "123 Street",
  phoneNumber: "+1234567890"
})
```

##### `verifyCredentials(email, password)`
التحقق من بيانات الدخول (للاستخدام في API routes)
```typescript
const result = await verifyCredentials(email, password)
// Returns: { success: boolean, error?: string, data?: User }
```

#### دوال المدير فقط

##### `createUserAccount(userData)`
إنشاء حساب مستخدم جديد (يتطلب super_admin)
```typescript
const result = await createUserAccount({
  username: "john",
  email: "john@example.com",
  password: "secure123",
  role: "viewer",
  address: "Optional",
  phoneNumber: "Optional"
})
```

##### `deleteUserAccount(userId)`
حذف حساب مستخدم (يتطلب super_admin)
```typescript
const result = await deleteUserAccount(123)
```

## استخدام المصادقة

### في Server Components

```typescript
import { getCurrentUser, isSuperAdmin } from "@/lib/auth/actions"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/signin")
  }
  
  const isAdmin = await isSuperAdmin()
  
  return (
    <div>
      <h1>Welcome {user.username}</h1>
      {isAdmin && <AdminPanel />}
    </div>
  )
}
```

### في Client Components

```typescript
"use client"
import { useAuth } from "@/lib/stores"
import { signIn, signOut } from "next-auth/react"

export default function UserMenu() {
  const { user, isAuthenticated, isSuperAdmin } = useAuth()
  
  if (!isAuthenticated) {
    return <button onClick={() => signIn()}>Sign In</button>
  }
  
  return (
    <div>
      <p>Hello {user?.username}</p>
      {isSuperAdmin && <Link href="/dashboard">Dashboard</Link>}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}
```

### في API Routes

```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import { isSuperAdmin } from "@/lib/auth/actions"

export async function POST(request: Request) {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  // Check admin role
  const isAdmin = await isSuperAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    )
  }
  
  // Your logic here
  return NextResponse.json({ success: true })
}
```

### في Middleware

```typescript
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }
  
  if (token.role !== "super_admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }
  
  return NextResponse.next()
}
```

## تدفق المصادقة

### 1. تسجيل الدخول بـ Google

```mermaid
User → Click "Sign in with Google"
  → NextAuth redirects to Google
  → User authorizes
  → Google redirects back with code
  → NextAuth exchanges code for tokens
  → signIn callback checks/creates user in DB
  → jwt callback adds user data to token
  → session callback adds data to session
  → User redirected to dashboard
```

### 2. تسجيل الدخول بـ Credentials

```mermaid
User → Submit email/password
  → NextAuth calls authorize()
  → Verify credentials in DB
  → Return user data
  → jwt callback adds user data to token
  → session callback adds data to session
  → User redirected to dashboard
```

### 3. التحقق من الصلاحيات

```mermaid
Request → Middleware checks token
  → If no token → Redirect to signin
  → If token exists → Check role
  → If admin route & not admin → Redirect to home
  → Otherwise → Allow access
```

## الأدوار والصلاحيات

### Roles

| Role | الوصف | الصلاحيات |
|------|--------|-----------|
| `super_admin` | مدير النظام | الوصول الكامل لجميع الميزات |
| `viewer` | مستخدم عادي | عرض المنتجات والشراء فقط |

### Protected Routes

| Route | Required Role | الوصف |
|-------|--------------|--------|
| `/dashboard` | Any authenticated | لوحة التحكم الأساسية |
| `/dashboard/products` | `super_admin` | إدارة المنتجات |
| `/dashboard/categories` | `super_admin` | إدارة الفئات |
| `/dashboard/coupons` | `super_admin` | إدارة الكوبونات |
| `/dashboard/orders` | `super_admin` | إدارة الطلبات |
| `/dashboard/gallery` | `super_admin` | إدارة المعرض |

## الأمان

### Password Hashing
- استخدام `bcrypt` مع salt rounds = 10
- كلمات المرور لا تُخزن أبداً بشكل نصي

### Session Management
- JWT tokens مع HttpOnly cookies
- Session expiry: 30 يوم
- Auto-refresh عند الاستخدام

### CSRF Protection
- NextAuth يوفر CSRF protection تلقائياً
- استخدام SameSite cookies

### Rate Limiting
⚠️ **TODO:** يجب إضافة rate limiting للـ signin endpoint

## متغيرات البيئة

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-min-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Optional: JWT Secret (fallback)
JWT_SECRET=your-jwt-secret
```

## استكشاف الأخطاء

### المشكلة: "Invalid credentials"
- تحقق من أن البريد الإلكتروني وكلمة المرور صحيحة
- تحقق من أن المستخدم موجود في قاعدة البيانات
- تحقق من أن كلمة المرور مشفرة بشكل صحيح

### المشكلة: "Unauthorized" في API routes
- تحقق من وجود session صحيح
- تحقق من أن `NEXTAUTH_SECRET` مطابق في جميع البيئات
- تحقق من أن cookies تُرسل بشكل صحيح

### المشكلة: Redirect loop
- تحقق من middleware configuration
- تحقق من أن signin page غير محمية
- تحقق من callbackUrl صحيح

### المشكلة: Google OAuth لا يعمل
- تحقق من `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET`
- تحقق من Authorized redirect URIs في Google Console
- تحقق من أن `NEXTAUTH_URL` صحيح

## الاختبار

### اختبار تسجيل الدخول
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### اختبار الحصول على المستخدم الحالي
```typescript
// في Server Component
const user = await getCurrentUser()
console.log(user)
```

### اختبار الصلاحيات
```typescript
const isAdmin = await isSuperAdmin()
console.log("Is admin:", isAdmin)
```

## الخطوات التالية

- [ ] إضافة Email Verification
- [ ] إضافة Password Reset Flow
- [ ] إضافة Rate Limiting
- [ ] إضافة 2FA (Two-Factor Authentication)
- [ ] إضافة Account Lockout بعد محاولات فاشلة
- [ ] إضافة Audit Logging
- [ ] إضافة Session Management Dashboard

## المراجع

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
