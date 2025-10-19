# Sign In Components

هذا المجلد يحتوي على المكونات المنفصلة لصفحة تسجيل الدخول.

## البنية

```
_components/
├── LoadingState.tsx        # حالة التحميل
├── SignInHeader.tsx        # العنوان والأيقونة
├── SignInForm.tsx          # النموذج الرئيسي
├── SignInFormFields.tsx    # حقول البريد والباسورد
├── SignInDivider.tsx       # الفاصل "أو"
├── SignInActions.tsx       # الأزرار السفلية
├── index.ts                # التصدير المركزي
└── README.md              # هذا الملف
```

## المكونات

### 1. LoadingState
**الغرض:** عرض حالة التحميل

**Props:**
- `message: string` - رسالة التحميل

**الاستخدام:**
```tsx
<LoadingState message="Loading..." />
```

---

### 2. SignInHeader
**الغرض:** عرض العنوان والأيقونة

**Props:**
- `dir: "ltr" | "rtl"` - اتجاه النص

**الاستخدام:**
```tsx
<SignInHeader dir="rtl" />
```

---

### 3. SignInFormFields
**الغرض:** عرض حقول البريد الإلكتروني وكلمة المرور

**Props:**
- `email: string`
- `password: string`
- `isLoading: boolean`
- `fieldErrors: { email?: string; password?: string }`
- `dir: "ltr" | "rtl"`
- `t: (key: string) => string`
- `onEmailChange: (value: string) => void`
- `onPasswordChange: (value: string) => void`

**الميزات:**
- Validation على مستوى الحقل
- تمييز الحقول الخاطئة بحدود حمراء
- رسائل خطأ تحت كل حقل
- مسح تلقائي للأخطاء عند الكتابة

**الاستخدام:**
```tsx
<SignInFormFields
  email={email}
  password={password}
  isLoading={isLoading}
  fieldErrors={fieldErrors}
  dir="rtl"
  t={t}
  onEmailChange={handleEmailChange}
  onPasswordChange={handlePasswordChange}
/>
```

---

### 4. SignInDivider
**الغرض:** عرض الفاصل "أو" بين النموذج والأزرار

**Props:**
- `dir: "ltr" | "rtl"` - اتجاه النص

**الاستخدام:**
```tsx
<SignInDivider dir="rtl" />
```

---

### 5. SignInActions
**الغرض:** عرض الأزرار السفلية (Google, Continue Shopping, Sign Up)

**Props:**
- `isLoading: boolean`
- `dir: "ltr" | "rtl"`
- `lang: string`
- `onContinueShopping: () => void`
- `onSignUp: () => void`

**الاستخدام:**
```tsx
<SignInActions
  isLoading={isLoading}
  dir="rtl"
  lang="ar"
  onContinueShopping={() => router.push("/ar")}
  onSignUp={() => router.push("/ar/signup")}
/>
```

---

### 6. SignInForm
**الغرض:** النموذج الرئيسي الذي يجمع كل المكونات

**Props:**
- `dir: "ltr" | "rtl"`
- `lang: string`
- `t: (key: string) => string`

**الميزات:**
- معالجة كاملة للنموذج
- Client-side validation
- معالجة الأخطاء
- Auto sign-in
- Redirect handling

**الاستخدام:**
```tsx
<SignInForm dir="rtl" lang="ar" t={t} />
```

---

## التدفق

```
SignInPage
  ├── LoadingState (إذا كان يحمل)
  │
  ├── SignInHeader (العنوان)
  │
  └── SignInForm (النموذج الرئيسي)
       ├── SignInFormFields (حقول البريد والباسورد)
       ├── Remember Me Checkbox
       ├── Submit Button
       ├── SignInDivider (الفاصل)
       └── SignInActions (الأزرار)
```

---

## الفوائد

### 1. **إعادة الاستخدام**
- يمكن استخدام المكونات في صفحات أخرى
- سهولة الصيانة والتحديث

### 2. **الاختبار**
- كل مكون يمكن اختباره بشكل منفصل
- Unit tests أسهل

### 3. **التنظيم**
- كود أكثر تنظيماً
- سهولة القراءة والفهم

### 4. **الأداء**
- تحميل كسول (Lazy Loading) ممكن
- Re-render محسّن

---

## التخصيص

### تغيير الألوان
```tsx
// في SignInHeader.tsx
<div className="bg-primary"> {/* غير primary إلى اللون المطلوب */}
```

### تغيير النصوص
```tsx
// استخدم ملفات الترجمة
t("auth.loginTitle")
```

### إضافة حقول جديدة
```tsx
// أضف في SignInFormFields.tsx
<div className="space-y-2">
  <Label htmlFor="newField">New Field</Label>
  <Input id="newField" />
</div>
```

---

## أمثلة الاستخدام

### الصفحة الرئيسية (المبسطة)
```tsx
export default function SignInPage() {
  const { t, dir } = useI18nStore()
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingState message={t("common.loading")} />
  }
  
  return (
    <div className="container">
      <SignInHeader dir={dir} />
      <SignInForm dir={dir} lang="ar" t={t} />
    </div>
  )
}
```

---

## الملاحظات

- جميع المكونات تدعم RTL/LTR
- جميع المكونات تدعم الوضع المظلم (إذا تم تفعيله)
- جميع المكونات responsive
- جميع المكونات تستخدم TypeScript

---

**تاريخ الإنشاء:** أكتوبر 2025  
**الإصدار:** 1.0.0
