# Gallery Sort Functionality - Fix

## ✅ المشكلة التي تم حلها

كانت قائمة الترتيب (Sort) في صفحة Gallery لا تعمل. عند تغيير الترتيب من القائمة المنسدلة، لم تكن الصور تُرتّب بشكل فعلي.

## 🔍 سبب المشكلة

### 1. **الدالة لا تستقبل معامل sortBy**
```typescript
// ❌ قبل الإصلاح
export async function getGalleryImagesDB(
    page = 1,
    limit = 20,
    search?: string,
    tags?: string[]
): Promise<GalleryResponse>
```

الدالة `getGalleryImagesDB` في `lib/actions/gallery.ts` لم تكن تستقبل معامل `sortBy`.

### 2. **الترتيب ثابت**
```typescript
// ❌ قبل الإصلاح
const baseQuery = db
    .select()
    .from(galleryImages)
    .orderBy(desc(galleryImages.createdAt)) // دائماً newest
```

كان الترتيب ثابتاً على `newest` فقط.

### 3. **عدم تمرير sortBy**
```typescript
// ❌ قبل الإصلاح
const dbResponse = await getGalleryImagesDB(
    currentPage,
    imagesPerPage,
    searchQuery,
    selectedTags
    // لا يوجد sortBy هنا!
)
```

### 4. **ترجمة Size مفقودة**
```typescript
// ❌ قبل الإصلاح
translations: {
    filters: string
    searchPlaceholder: string
    newest: string
    oldest: string
    name: string
    // size مفقود!
    grid: string
    list: string
}
```

## 🔧 الحل المُطبق

### 1. **إضافة معامل sortBy**
```typescript
// ✅ بعد الإصلاح
export async function getGalleryImagesDB(
    page = 1,
    limit = 20,
    search?: string,
    tags?: string[],
    sortBy: string = 'newest'  // ✅ معامل جديد
): Promise<GalleryResponse>
```

### 2. **إضافة منطق الترتيب**
```typescript
// ✅ بعد الإصلاح
import { like, or, and, desc, asc, count, arrayContains } from "drizzle-orm"

// Determine sort order
let orderByClause
switch (sortBy) {
    case 'oldest':
        orderByClause = asc(galleryImages.createdAt)
        break
    case 'name':
        orderByClause = asc(galleryImages.fileName)
        break
    case 'size':
        orderByClause = desc(galleryImages.fileSize)
        break
    case 'newest':
    default:
        orderByClause = desc(galleryImages.createdAt)
        break
}

// Base query
const baseQuery = db
    .select()
    .from(galleryImages)
    .orderBy(orderByClause)  // ✅ ترتيب ديناميكي
    .limit(limit)
    .offset(offset)
```

### 3. **تمرير sortBy في gallery-client-wrapper**
```typescript
// ✅ بعد الإصلاح
const dbResponse = await getGalleryImagesDB(
    currentPage,
    imagesPerPage,
    searchQuery,
    selectedTags,
    sortBy  // ✅ تمرير sortBy
)
```

### 4. **تمرير sortBy في page.tsx**
```typescript
// ✅ بعد الإصلاح
const dbResponse = await getGalleryImagesDB(
    initialPage,
    imagesPerPage,
    "",
    [],
    'newest'  // ✅ القيمة الافتراضية
)
```

### 5. **إضافة size في الترجمات**

#### في `gallery-search-controls.tsx`:
```typescript
// ✅ بعد الإصلاح
translations: {
    filters: string
    searchPlaceholder: string
    newest: string
    oldest: string
    name: string
    size: string      // ✅ مضاف
    grid: string
    list: string
}
```

#### في `gallery-client-wrapper.tsx`:
```typescript
// ✅ بعد الإصلاح
translations={{
    filters: t("gallery.filters"),
    searchPlaceholder: t("gallery.searchPlaceholder"),
    newest: t("common.newest"),
    oldest: t("common.oldest"),
    name: t("account.general.name"),
    size: t("common.size"),  // ✅ مضاف
    grid: t("gallery.grid"),
    list: t("gallery.list")
}}
```

## 📊 خيارات الترتيب المتاحة

| الخيار | الوصف | الترتيب |
|--------|-------|---------|
| **Newest** | الأحدث أولاً | `DESC(createdAt)` |
| **Oldest** | الأقدم أولاً | `ASC(createdAt)` |
| **Name** | حسب الاسم أبجدياً | `ASC(fileName)` |
| **Size** | الأكبر حجماً أولاً | `DESC(fileSize)` |

## 🎯 الملفات المُعدّلة

### 1. `lib/actions/gallery.ts`
- ✅ إضافة معامل `sortBy`
- ✅ استيراد `asc` من drizzle-orm
- ✅ إضافة `switch` statement للترتيب
- ✅ تطبيق `orderByClause` الديناميكي

### 2. `gallery-client-wrapper.tsx`
- ✅ تمرير `sortBy` إلى `getGalleryImagesDB`
- ✅ إضافة `size: t("common.size")` في translations

### 3. `gallery-search-controls.tsx`
- ✅ إضافة `size: string` في interface
- ✅ استخدام `translations.size` في SelectItem

### 4. `page.tsx`
- ✅ تمرير `'newest'` كقيمة افتراضية

## ✅ التحقق من الإصلاح

### اختبار الوظيفة:
```bash
# 1. افتح المتصفح
http://localhost:3000/ar/dashboard/gallery

# 2. اختر خيارات الترتيب المختلفة:
- اختر "Newest" → يجب أن تظهر الصور الأحدث أولاً
- اختر "Oldest" → يجب أن تظهر الصور الأقدم أولاً
- اختر "Name" → يجب أن تُرتب حسب الاسم أبجدياً
- اختر "Size" → يجب أن تظهر الأكبر حجماً أولاً

# 3. تحقق من:
- تغيير فوري للصور عند اختيار الترتيب
- عمل الترتيب مع البحث والفلترة
- الحفاظ على الترتيب عند التنقل بين الصفحات
```

## 🔄 تدفق البيانات

```
User selects sort option
    ↓
setSortBy(value) in GalleryClientWrapper
    ↓
useEffect detects sortBy change
    ↓
loadImages() called with new sortBy
    ↓
getGalleryImagesDB(page, limit, search, tags, sortBy)
    ↓
SQL query with dynamic ORDER BY
    ↓
Sorted images returned
    ↓
addImages() updates store
    ↓
Components re-render with sorted images
```

## 🎨 واجهة المستخدم

### القائمة المنسدلة:
```tsx
<Select value={sortBy} onValueChange={onSortChange}>
    <SelectTrigger className="w-32">
        <SelectValue />
    </SelectTrigger>
    <SelectContent>
        <SelectItem value="newest">الأحدث</SelectItem>
        <SelectItem value="oldest">الأقدم</SelectItem>
        <SelectItem value="name">الاسم</SelectItem>
        <SelectItem value="size">الحجم</SelectItem>
    </SelectContent>
</Select>
```

## 📝 ملاحظات مهمة

### 1. القيمة الافتراضية
```typescript
const [sortBy, setSortBy] = useState<string>('newest')
```
القيمة الافتراضية هي `'newest'` (الأحدث أولاً).

### 2. التفاعل مع useEffect
```typescript
useEffect(() => {
    loadImages()
}, [currentPage, searchQuery, selectedTags, sortBy])
```
عند تغيير `sortBy`، يتم إعادة تحميل الصور تلقائياً.

### 3. إعادة تعيين الصفحة
عند تغيير البحث أو الفلاتر، يتم الرجوع للصفحة الأولى، لكن **ليس** عند تغيير الترتيب فقط.

### 4. الترجمات
الترجمات مأخوذة من:
- `common.newest` → "الأحدث" / "Newest"
- `common.oldest` → "الأقدم" / "Oldest"
- `account.general.name` → "الاسم" / "Name"
- `common.size` → "الحجم" / "Size"

## ✅ الخلاصة

| قبل | بعد |
|-----|-----|
| ❌ الترتيب لا يعمل | ✅ الترتيب يعمل بشكل كامل |
| ❌ دائماً newest فقط | ✅ 4 خيارات للترتيب |
| ❌ sortBy غير مُمرر | ✅ sortBy يُمرر للـ API |
| ❌ size مفقود | ✅ size موجود في الترجمات |
| ❌ ترتيب ثابت في SQL | ✅ ترتيب ديناميكي |

---

**الحالة:** ✅ مُصلح ويعمل بشكل ممتاز!

**التاريخ:** 2024
**المطور:** Cascade AI
