# 💀 دليل Skeleton Loaders

## 📋 نظرة عامة

تم إنشاء نظام skeleton loaders احترافي لتحسين تجربة المستخدم أثناء تحميل البيانات.

---

## 🎯 لماذا Skeleton بدلاً من Spinner؟

### **قبل (Spinner):**
❌ المستخدم يرى شاشة فارغة مع spinner  
❌ لا يعرف ما الذي سيظهر  
❌ تجربة مربكة  
❌ يبدو أن التطبيق "معلق"  

### **بعد (Skeleton):**
✅ المستخدم يرى هيكل الصفحة  
✅ يعرف ما الذي سيظهر  
✅ تجربة أفضل وأكثر احترافية  
✅ يشعر أن التحميل نشط  

---

## 📦 الـ Skeleton Components المتاحة

### **1. Page Skeletons** (صفحات كاملة)

#### **`HomePageSkeleton`**
```typescript
import { HomePageSkeleton } from '@/components/ui/skeletons'

export default function Loading() {
  return <HomePageSkeleton dir="rtl" />
}
```

#### **`ProductsPageSkeleton`**
```typescript
import { ProductsPageSkeleton } from '@/components/ui/skeletons'

export default function Loading() {
  return <ProductsPageSkeleton />
}
```

#### **`ProductDetailSkeleton`**
```typescript
import { ProductDetailSkeleton } from '@/components/ui/skeletons'

export default function Loading() {
  return <ProductDetailSkeleton />
}
```

---

### **2. Product Skeletons** (منتجات)

#### **`ProductCardSkeleton`** - بطاقة منتج واحدة
```typescript
import { ProductCardSkeleton } from '@/components/ui/skeletons'

function MyComponent() {
  return <ProductCardSkeleton />
}
```

#### **`ProductCardGridSkeleton`** - grid من المنتجات
```typescript
import { ProductCardGridSkeleton } from '@/components/ui/skeletons'

function MyComponent() {
  return <ProductCardGridSkeleton count={6} /> {/* 6 cards */}
}
```

**الميزات:**
- ✅ Product image placeholder
- ✅ Title و category
- ✅ Description lines
- ✅ Price و discount
- ✅ Action buttons

---

### **3. List Skeletons** (قوائم)

#### **`ListItemSkeleton`** - عنصر قائمة واحد
```typescript
import { ListItemSkeleton } from '@/components/ui/skeletons'

function MyComponent() {
  return <ListItemSkeleton />
}
```

#### **`ListSkeleton`** - قائمة كاملة
```typescript
import { ListSkeleton } from '@/components/ui/skeletons'

function MyComponent() {
  return <ListSkeleton count={5} /> {/* 5 items */}
}
```

#### **`HorizontalListSkeleton`** - قائمة أفقية
```typescript
import { HorizontalListSkeleton } from '@/components/ui/skeletons'

function MyComponent() {
  return <HorizontalListSkeleton count={4} />
}
```

**الميزات:**
- ✅ Avatar/Image placeholder
- ✅ Title و subtitle
- ✅ Action button
- ✅ Responsive design

---

### **4. Form Skeletons** (نماذج)

#### **`FormFieldSkeleton`** - حقل واحد
```typescript
import { FormFieldSkeleton } from '@/components/ui/skeletons'

function MyComponent() {
  return <FormFieldSkeleton />
}
```

#### **`FormSkeleton`** - نموذج كامل
```typescript
import { FormSkeleton } from '@/components/ui/skeletons'

function MyComponent() {
  return <FormSkeleton fields={4} /> {/* 4 fields */}
}
```

#### **`InlineFormSkeleton`** - نموذج مدمج
```typescript
import { InlineFormSkeleton } from '@/components/ui/skeletons'

function MyComponent() {
  return <InlineFormSkeleton fields={3} />
}
```

#### **`SearchFormSkeleton`** - شريط بحث
```typescript
import { SearchFormSkeleton } from '@/components/ui/skeletons'

function MyComponent() {
  return <SearchFormSkeleton />
}
```

#### **`FilterFormSkeleton`** - لوحة فلاتر
```typescript
import { FilterFormSkeleton } from '@/components/ui/skeletons'

function MyComponent() {
  return <FilterFormSkeleton />
}
```

**الميزات:**
- ✅ Label و input placeholders
- ✅ Submit buttons
- ✅ Multiple fields support
- ✅ Card wrapper (optional)

---

## 🎨 Loading Pages

### **Global Loading (`app/[lang]/loading.tsx`)**

يظهر تلقائياً أثناء navigation بين الصفحات:

```typescript
// app/[lang]/loading.tsx
import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card } from "@/components/shadcnUI/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-4">
      {/* Your skeleton layout */}
    </div>
  )
}
```

**الميزات:**
- ✅ Header skeleton
- ✅ 3-column grid
- ✅ Cards مع images
- ✅ List items
- ✅ Fully responsive

---

### **Cart Loading (`app/[lang]/(site)/cart/loading.tsx`)**

Loading مخصص لصفحة السلة:

```typescript
// Automatically shown while cart page loads
```

**الميزات:**
- ✅ Cart items (product cards)
- ✅ Quantity selectors
- ✅ Order summary
- ✅ Coupon input
- ✅ Checkout button
- ✅ Payment methods icons

---

### **Products Loading (`app/[lang]/(site)/products/loading.tsx`)**

```typescript
// Uses ProductsPageSkeleton component
```

---

## 🔧 إنشاء Custom Skeleton

### **مثال - Custom Component Skeleton:**

```typescript
import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent, CardHeader } from "@/components/shadcnUI/card"

export function MyCustomSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" /> {/* Title */}
        <Skeleton className="h-4 w-full" /> {/* Description */}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Your custom skeleton layout */}
        <Skeleton className="h-40 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 📝 Best Practices

### **✅ افعل:**

1. **استخدم Skeleton للمحتوى الرئيسي:**
```typescript
// ✅ Good
<Suspense fallback={<ProductCardGridSkeleton count={6} />}>
  <ProductGrid />
</Suspense>
```

2. **اجعل الـ Skeleton مشابه للمحتوى الحقيقي:**
```typescript
// ✅ نفس layout المحتوى
<Card>
  <Skeleton className="h-48 w-full" /> {/* Same as actual image */}
  <CardContent>
    <Skeleton className="h-6 w-3/4" /> {/* Same as title */}
  </CardContent>
</Card>
```

3. **استخدم أحجام واقعية:**
```typescript
// ✅ واقعي
<Skeleton className="h-6 w-48" /> {/* For a heading */}
<Skeleton className="h-4 w-full" /> {/* For a paragraph */}
```

4. **أضف spacing مناسب:**
```typescript
// ✅ Good spacing
<div className="space-y-4">
  <Skeleton className="h-6 w-48" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

---

### **❌ لا تفعل:**

1. **لا تستخدم Spinner بدلاً من Skeleton:**
```typescript
// ❌ Bad
<div className="flex justify-center">
  <Loader2 className="animate-spin" />
</div>

// ✅ Good
<ProductCardSkeleton />
```

2. **لا تجعل الـ Skeleton مختلف كثيراً عن المحتوى:**
```typescript
// ❌ Bad - doesn't match actual content
<Skeleton className="h-20 w-20" /> {/* For a full-width card */}
```

3. **لا تنسَ Responsive design:**
```typescript
// ❌ Bad - fixed width
<Skeleton className="w-[500px]" />

// ✅ Good - responsive
<Skeleton className="w-full max-w-md" />
```

---

## 🎯 استخدامات شائعة

### **1. في Suspense Boundaries:**
```typescript
import { Suspense } from 'react'
import { ProductCardGridSkeleton } from '@/components/ui/skeletons'

function MyPage() {
  return (
    <Suspense fallback={<ProductCardGridSkeleton count={6} />}>
      <ProductList />
    </Suspense>
  )
}
```

### **2. في Loading States:**
```typescript
function MyComponent() {
  const [loading, setLoading] = useState(true)
  
  if (loading) {
    return <ListSkeleton count={5} />
  }
  
  return <List items={data} />
}
```

### **3. في Server Components:**
```typescript
// app/products/loading.tsx
export default function Loading() {
  return <ProductCardGridSkeleton count={12} />
}
```

---

## 🎨 Skeleton من Shadcn UI

### **Base Skeleton Component:**

```typescript
import { Skeleton } from "@/components/shadcnUI/skeleton"

<Skeleton className="h-12 w-12 rounded-full" /> {/* Circle */}
<Skeleton className="h-4 w-full" /> {/* Line */}
<Skeleton className="h-32 w-full" /> {/* Block */}
```

**الميزات:**
- ✅ `animate-pulse` animation
- ✅ `bg-accent` color
- ✅ `rounded-md` default
- ✅ Customizable مع className

---

## 📊 التأثير

### **قبل:**
```
Loading Time Perception: 😐 متوسط
User Anxiety: 😰 عالي
Bounce Rate: 📈 مرتفع
```

### **بعد:**
```
Loading Time Perception: 😊 سريع
User Anxiety: 😌 منخفض
Bounce Rate: 📉 منخفض
User Experience: ⭐⭐⭐⭐⭐
```

---

## 🔗 الملفات

### **Created:**
- ✅ `app/[lang]/loading.tsx` - محسّن بـ Skeleton
- ✅ `app/[lang]/(site)/cart/loading.tsx` - Cart skeleton
- ✅ `components/ui/skeletons/ProductCardSkeleton.tsx` - NEW
- ✅ `components/ui/skeletons/ListSkeleton.tsx` - NEW
- ✅ `components/ui/skeletons/FormSkeleton.tsx` - NEW
- ✅ `components/ui/skeletons/index.ts` - Updated exports

### **Existing:**
- ✅ `components/ui/skeletons/HomePageSkeleton.tsx`
- ✅ `components/ui/skeletons/ProductsPageSkeleton.tsx`
- ✅ `components/ui/skeletons/ProductDetailSkeleton.tsx`
- ✅ `components/shadcnUI/skeleton.tsx`

---

## 🎉 النتيجة

**Skeleton loaders احترافية في كل المشروع!**

```
✅ Loading pages محسّنة
✅ Reusable skeleton components
✅ تجربة مستخدم أفضل
✅ Perceived performance أسرع
✅ Professional look
✅ Modern UX patterns
```

---

**تاريخ الإنشاء:** 2025-10-18  
**الحالة:** ✅ مكتمل ومطبق
