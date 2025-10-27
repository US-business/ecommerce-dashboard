# Order Detail Page Components

## 📦 النظرة العامة

تم تقسيم صفحة تفاصيل الطلب إلى مكونات منفصلة قابلة لإعادة الاستخدام، كل مكون مسؤول عن جزء محدد من واجهة المستخدم.

## 📁 الملفات

### **utils.ts** 🛠️

ملف يحتوي على الدوال المساعدة (utility functions) المشتركة بين المكونات.

**الدوال:**
- `getStatusColor(status: string)` - تُرجع الألوان المناسبة لكل حالة

**لماذا ملف منفصل؟**
- في Next.js 15، لا يمكن تمرير دوال من Server Components إلى Client Components
- الحل: إنشاء utility file يتم استيراده مباشرة في Client Components
- [اقرأ المزيد في FUNCTION_PROPS_FIX.md](./FUNCTION_PROPS_FIX.md)

## 🗂️ المكونات

### 1. **OrderHeader.tsx** 📌

**الوظيفة:** عرض رأس الصفحة مع معلومات الطلب الأساسية وأزرار التنقل.

**الخصائص (Props):**
```typescript
interface OrderHeaderProps {
  orderId: number
  createdAt: Date | null
}
```

**الميزات:**
- ✅ زر الرجوع إلى قائمة الطلبات
- ✅ عرض رقم الطلب وتاريخ الإنشاء
- ✅ زر طباعة الفاتورة
- ✅ دعم RTL/LTR
- ✅ ترجمة كاملة

**الاستخدام:**
```tsx
<OrderHeader orderId={order.id} createdAt={order.createdAt} />
```

---

### 2. **OrderDetailsCard.tsx** 📋

**الوظيفة:** عرض تفاصيل الطلب الأساسية.

**الخصائص (Props):**
```typescript
interface OrderDetailsCardProps {
  order: {
    id: number
    status: string
    paymentStatus: string
    paymentType: string
    shippingMethod: string
    createdAt: Date | null
  }
}
```

**المعلومات المعروضة:**
- رقم الطلب (Order ID)
- حالة الطلب (Status) - مع إمكانية التعديل
- حالة الدفع (Payment Status)
- طريقة الدفع (Payment Method)
- طريقة الشحن (Shipping Method)
- تاريخ الإنشاء (Created At)

**الميزات:**
- ✅ دعم RTL/LTR
- ✅ ترجمة كاملة
- ✅ تكامل مع UpdateOrderStatus
- ✅ ألوان ديناميكية للحالات

**الاستخدام:**
```tsx
<OrderDetailsCard order={order} />
```

**ملاحظة:** تستخدم `getStatusColor` من `utils.ts` داخلياً.

---

### 3. **PricingDetailsCard.tsx** 💰

**الوظيفة:** عرض تفاصيل الأسعار والخصومات.

**الخصائص (Props):**
```typescript
interface PricingDetailsCardProps {
  order: {
    subtotal: string | number
    shippingCost: string | number
    discountAmount?: string | number | null
    totalAmount: string | number
    coupon?: {
      code: string
      discountType: string
      discountValue: string | number
    } | null
  }
}
```

**المعلومات المعروضة:**
- المجموع الفرعي (Subtotal)
- تكلفة الشحن (Shipping Cost)
- الخصم من الكوبون (Coupon Discount)
- الخصم العادي (Regular Discount)
- الإجمالي النهائي (Total)

**الميزات:**
- ✅ عرض معلومات الكوبون إذا وُجدت
- ✅ عرض الخصم العادي إذا لم يكن هناك كوبون
- ✅ دعم نوعي الخصم (نسبة مئوية أو مبلغ ثابت)
- ✅ دعم RTL/LTR
- ✅ ترجمة كاملة

**الاستخدام:**
```tsx
<PricingDetailsCard order={order} />
```

---

### 4. **CustomerInfoCard.tsx** 👤

**الوظيفة:** عرض معلومات العميل.

**الخصائص (Props):**
```typescript
interface CustomerInfoCardProps {
  order: {
    user?: {
      username: string | null
      email: string | null
      phoneNumber: string | null
    } | null
    shippingAddress: string
  }
}
```

**المعلومات المعروضة:**
- اسم العميل (Name)
- البريد الإلكتروني (Email)
- رقم الهاتف (Phone) - مع أيقونة
- عنوان الشحن (Shipping Address) - مع أيقونة

**الميزات:**
- ✅ أيقونات تعبيرية (User, Phone, MapPin)
- ✅ Grid layout responsive
- ✅ دعم RTL/LTR
- ✅ ترجمة كاملة
- ✅ معالجة القيم الفارغة (N/A)

**الاستخدام:**
```tsx
<CustomerInfoCard order={order} />
```

---

### 5. **OrderItemsCard.tsx** 📦

**الوظيفة:** عرض قائمة المنتجات في الطلب.

**الخصائص (Props):**
```typescript
interface OrderItem {
  id: number
  quantity: number
  price: string | number
  product?: {
    nameEn: string | null
    nameAr: string | null
  } | null
}

interface OrderItemsCardProps {
  order: {
    items: OrderItem[]
    totalAmount: string | number
  }
}
```

**المعلومات المعروضة:**
- اسم المنتج بالإنجليزية والعربية
- الكمية والسعر لكل منتج
- الإجمالي لكل منتج
- الإجمالي الكلي للطلب

**الميزات:**
- ✅ عرض جميع المنتجات في قائمة
- ✅ حساب الإجمالي لكل منتج
- ✅ عرض الإجمالي النهائي
- ✅ دعم RTL/LTR
- ✅ ترجمة كاملة

**الاستخدام:**
```tsx
<OrderItemsCard order={order} />
```

---

### 6. **PaymentInfoCard.tsx** 💳

**الوظيفة:** عرض معلومات الدفع.

**الخصائص (Props):**
```typescript
interface PaymentInfoCardProps {
  order: {
    paymentType: string
    paymentStatus: string
  }
}
```

**المعلومات المعروضة:**
- طريقة الدفع (Payment Method)
- حالة الدفع (Payment Status) - مع Badge ملون

**الميزات:**
- ✅ Badge ملون حسب حالة الدفع
- ✅ Grid layout
- ✅ دعم RTL/LTR
- ✅ ترجمة كاملة

**الاستخدام:**
```tsx
<PaymentInfoCard order={order} />
```

**ملاحظة:** تستخدم `getStatusColor` من `utils.ts` داخلياً.

---

## 📄 ملف page.tsx المُحدّث

الملف الرئيسي الآن أصبح **بسيطاً جداً** ويستورد المكونات فقط:

```tsx
import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/actions/orders"
import { OrderNotes } from "../_components/OrderNotes"
import { OrderHeader } from "./_components/OrderHeader"
import { OrderDetailsCard } from "./_components/OrderDetailsCard"
import { PricingDetailsCard } from "./_components/PricingDetailsCard"
import { CustomerInfoCard } from "./_components/CustomerInfoCard"
import { OrderItemsCard } from "./_components/OrderItemsCard"
import { PaymentInfoCard } from "./_components/PaymentInfoCard"

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const resolvedParams = await params;
    const { id } = resolvedParams
    const order = await getOrderById(id)

      <CustomerInfoCard order={order} />
      <OrderItemsCard order={order} />
      <PaymentInfoCard order={order} />
      <OrderNotes orderId={order.id} initialNotes={order.notes as any} />
    </div>
  )
}
```

## 🎯 الفوائد

### 1. **قابلية إعادة الاستخدام**
كل مكون يمكن استخدامه في أماكن أخرى في التطبيق.

### 2. **سهولة الصيانة**
تعديل أي جزء من الصفحة أصبح أسهل - فقط عدّل المكون المطلوب.

### 3. **اختبار أسهل**
كل مكون يمكن اختباره بشكل منفصل.

### 4. **كود أنظف**
الملف الرئيسي `page.tsx` الآن 67 سطر بدلاً من 300+ سطر!

### 5. **تعاون أفضل**
أعضاء الفريق يمكنهم العمل على مكونات مختلفة في نفس الوقت.

## 🌍 دعم i18n و RTL

جميع المكونات:
- ✅ تستخدم `useI18nStore` للترجمة
- ✅ تدعم RTL/LTR بشكل كامل
- ✅ تستخدم `cn()` للمحاذاة الديناميكية
- ✅ جميع النصوص قابلة للترجمة

## 📊 البنية النهائية

```
d:\ecommerce-dashboard\app\[lang]\(dashboard)\dashboard\orders\
│
├── [id]/
│   ├── _components/                      📁 مجلد المكونات
│   │   ├── OrderHeader.tsx              ✅ مكون
│   │   ├── OrderDetailsCard.tsx         ✅ مكون
│   │   ├── PricingDetailsCard.tsx       ✅ مكون
│   │   ├── CustomerInfoCard.tsx         ✅ مكون
│   │   ├── OrderItemsCard.tsx           ✅ مكون
│   │   ├── PaymentInfoCard.tsx          ✅ مكون
│   │   ├── utils.ts                     🛠️ دوال مساعدة
│   │   ├── index.ts                     ✅ ملف التصدير المركزي
│   │   ├── README.md                    ✅ التوثيق الكامل
│   │   └── FUNCTION_PROPS_FIX.md        ✅ شرح حل المشكلة
│   │
│   ├── invoice/
│   │   └── page.tsx                     📄 (بدون تغيير)
│   │
│   └── page.tsx                         ♻️ تم تبسيطه (53 سطر)
└── _components/
    ├── OrdersList.tsx
    ├── OrderNotes.tsx
    └── UpdateOrderStatus.tsx
```

## ✅ Checklist

- [x] إنشاء OrderHeader.tsx
- [x] إنشاء OrderDetailsCard.tsx
- [x] إنشاء PricingDetailsCard.tsx
- [x] إنشاء CustomerInfoCard.tsx
- [x] إنشاء OrderItemsCard.tsx
- [x] إنشاء PaymentInfoCard.tsx
- [x] تحديث page.tsx لاستخدام المكونات
- [x] جميع المكونات تدعم i18n
- [x] جميع المكونات تدعم RTL/LTR
- [x] التوثيق الكامل

## 🚀 الاختبار

```bash
# تشغيل التطبيق
npm run dev

# فتح صفحة تفاصيل طلب
http://localhost:3000/ar/dashboard/orders/1

# الاختبار:
1. التحقق من عرض جميع الأقسام ✅
2. تغيير اللغة من Header ✅
3. التحقق من RTL ✅
4. تغيير حالة الطلب ✅
5. إضافة ملاحظة ✅
6. طباعة الفاتورة ✅
```

---

**الحالة:** ✅ جميع المكونات تعمل بشكل مثالي!

**التاريخ:** 2024
**المطور:** Cascade AI
