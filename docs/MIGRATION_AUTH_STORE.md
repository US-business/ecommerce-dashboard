# دليل ترحيل متاجر المصادقة

## التغييرات المطلوبة

تم دمج جميع متاجر المصادقة في ملف واحد موحد: `unified-auth-store.ts`

### الملفات التي تم دمجها:
- ❌ `auth-store.ts` (يمكن حذفه)
- ❌ `enhanced-auth-store.ts` (يمكن حذفه)  
- ❌ `hybrid-auth-store.ts` (يمكن حذفه)
- ✅ `unified-auth-store.ts` (المتجر الجديد الموحد)

## كيفية التحديث في المكونات

### قبل:
```typescript
// استيراد متعدد
import { useAuthStore } from '@/lib/stores/auth-store'
import { useEnhancedAuthStore } from '@/lib/stores/enhanced-auth-store'
import { useHybridAuthStore } from '@/lib/stores/hybrid-auth-store'

// استخدام مختلف
const { user, loadUser } = useAuthStore()
const { setNextAuthUser } = useEnhancedAuthStore()
```

### بعد:
```typescript
// استيراد واحد موحد
import { useAuth, useAuthStore } from '@/lib/stores'

// استخدام موحد مع ميزات إضافية
const {
  user,
  isAuthenticated,
  isNextAuth,
  isCustomAuth,
  isSuperAdmin,
  loadUser,
  signOut,
  setNextAuthUser
} = useAuth()

// أو الاستخدام المباشر للمتجر
const authStore = useAuthStore()
```

## الميزات الجديدة

### 1. خصائص محسوبة مفيدة:
```typescript
const {
  isAuthenticated,    // !!user
  isNextAuth,        // authType === 'nextauth'
  isCustomAuth,      // authType === 'custom'
  userId,           // user?.id
  userEmail,        // user?.email
  userName,         // user?.name || user?.username
  userRole,         // user?.role
  userImage,        // user?.image
  userProvider      // user?.provider
} = useAuth()
```

### 2. دعم أفضل لـ NextAuth:
```typescript
// في مكون مع session
const { data: session } = useSession()
const { loadUser } = useAuth()

useEffect(() => {
  if (session?.user) {
    loadUser(session.user) // تمرير session مباشرة
  } else {
    loadUser() // fallback للنظام المخصص
  }
}, [session])
```

### 3. إدارة حالة محسنة:
```typescript
const { signOut, reset } = useAuth()

// تسجيل خروج ذكي
await signOut() // يحدد تلقائياً نوع المصادقة

// إعادة تعيين الحالة
reset() // لمسح البيانات فقط
```

## خطوات الترحيل

1. ✅ تم إنشاء `unified-auth-store.ts`
2. ✅ تم تحديث `lib/stores/index.ts`
3. 🔄 يجب تحديث المكونات لاستخدام `useAuth` أو `useAuthStore`
4. 🔄 يجب حذف الملفات القديمة بعد التأكد من عدم استخدامها
5. 🔄 يجب اختبار جميع وظائف المصادقة

## التحقق من الاستخدام

```bash
# البحث عن الاستخدامات القديمة
grep -r "useHybridAuthStore\|useEnhancedAuthStore" src/
grep -r "auth-store\|enhanced-auth-store\|hybrid-auth-store" src/

# البحث عن الاستيرادات القديمة
grep -r "from.*auth.*store" src/
```

## فوائد الدمج

- ✅ ملف واحد للمصادقة بدلاً من 3 ملفات
- ✅ واجهة برمجية موحدة ومتسقة  
- ✅ خصائص محسوبة مفيدة
- ✅ دعم أفضل لكلا نظامي المصادقة
- ✅ سهولة الصيانة والتطوير
- ✅ تقليل التعقيد والازدواجية