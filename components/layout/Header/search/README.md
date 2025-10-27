# Search Component Architecture

## 📋 نظرة عامة

تم إعادة هيكلة مكون البحث ليكون **Server Component** مع فصل كل المكونات الفرعية إلى ملفات مستقلة في مجلد `_components`.

## 🏗️ البنية

```
search/
├── Search.tsx                      # Server Component (يجلب الفئات من السيرفر)
├── _components/
│   ├── SearchBarClient.tsx        # Client Component الرئيسي (يدير الحالة والتفاعل)
│   ├── CategorySelector.tsx       # قائمة اختيار الفئات
│   ├── SearchInput.tsx            # حقل البحث والأزرار
│   ├── SearchResults.tsx          # حاوية نتائج البحث
│   ├── ProductItem.tsx            # عنصر المنتج في النتائج
│   ├── LoadingState.tsx           # حالة التحميل
│   ├── EmptyState.tsx             # حالة فارغة (لا توجد نتائج)
│   └── index.ts                   # تصدير جميع المكونات
└── README.md                      # هذا الملف
```

## 🔄 تدفق البيانات

1. **Search.tsx (Server Component)**:
   - يجلب الفئات من قاعدة البيانات عند التحميل الأولي
   - يمرر الفئات إلى `SearchBarClient`

2. **SearchBarClient.tsx (Client Component)**:
   - يدير حالة البحث والمنتجات
   - يتعامل مع التفاعلات (كتابة، اختيار فئة، إلخ)
   - يعرض المكونات الفرعية

3. **المكونات الفرعية**:
   - كل مكون مسؤول عن جزء محدد من الواجهة
   - تتلقى البيانات والـ callbacks من `SearchBarClient`

## 📱 الاستجابة (Responsive)

جميع المكونات مُحسّنة للاستجابة لجميع أحجام الشاشات:

### CategorySelector
- `min-w-[70px]` على الشاشات الصغيرة
- `md:min-w-[100px]` على الشاشات المتوسطة

### SearchInput
- أيقونات `h-3 w-3` على الموبايل
- `md:h-4 md:w-4` على الشاشات الأكبر
- نص `text-sm` على الموبايل، `md:text-base` على الأجهزة الأكبر

### SearchResults
- `max-h-[300px]` على الموبايل
- `md:max-h-96` على الشاشات الأكبر

### ProductItem
- صور `w-10 h-10` على الموبايل
- `md:w-12 md:h-12` على الشاشات الأكبر
- أحجام نصوص متدرجة حسب الشاشة

## 🎯 المميزات

### ✅ Server Component
- تحسين الأداء بجلب البيانات من السيرفر
- تقليل حجم JavaScript المرسل للعميل
- SEO-friendly

### ✅ فصل المسؤوليات
- كل مكون له مسؤولية واحدة واضحة
- سهولة الصيانة والتطوير
- إمكانية إعادة الاستخدام

### ✅ Responsive Design
- يعمل بشكل مثالي على جميع الأجهزة
- تجربة مستخدم محسّنة
- أحجام نصوص وعناصر مناسبة لكل شاشة

### ✅ Performance
- Debouncing للبحث (300ms)
- Lazy loading للنتائج
- إغلاق النتائج بزر Escape

### ✅ i18n Support
- دعم كامل للعربية والإنجليزية
- RTL/LTR support
- اتجاه المحتوى ديناميكي

## 📝 كيفية الاستخدام

```tsx
import { SearchBar } from "./components/layout/Header/search/Search"

// في Server Component
export default function Layout() {
  return (
    <header>
      <SearchBar />
    </header>
  )
}
```

## 🔧 التخصيص

### إضافة حالة جديدة للبحث

1. أنشئ مكون جديد في `_components/`
2. استورده في `SearchBarClient.tsx`
3. أضفه في الموضع المناسب

### تعديل التصميم

- كل مكون يحتوي على Tailwind classes خاصة به
- يمكن تعديلها مباشرة في الملف المعني
- استخدم responsive classes (`sm:`, `md:`, `lg:`, `xl:`)

## 🚀 أفضل الممارسات

1. **لا تضع state في Server Components**: استخدم Client Components للـ state
2. **اجعل المكونات صغيرة**: كل مكون يفعل شيء واحد بشكل جيد
3. **استخدم TypeScript**: حدد types واضحة لكل props
4. **اختبر على أحجام شاشات مختلفة**: تأكد من الاستجابة الصحيحة

## 📦 التبعيات

- `@/lib/actions/products` - لجلب المنتجات
- `@/lib/actions/categories` - لجلب الفئات
- `@/lib/stores` - لإدارة الحالة العامة
- `lucide-react` - للأيقونات
- `@/components/shadcnUI` - للمكونات الأساسية

## 🐛 Troubleshooting

### البحث لا يعمل
- تحقق من اتصال API
- تأكد من وجود `getAllProductsActions`

### الفئات لا تظهر
- تحقق من `getCategories` في Server Component
- تأكد من أن البيانات تمرر بشكل صحيح

### مشاكل في الاستجابة
- استخدم DevTools لفحص breakpoints
- تأكد من استخدام responsive classes

---

تم التطوير بواسطة Cascade AI 🚀
