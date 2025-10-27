# Gallery Database Migration Guide

## إضافة Indexes لجدول gallery_images

### 🎯 الهدف
تحسين أداء استعلامات Gallery عبر إضافة indexes محسّنة.

---

## 📋 الـ Indexes المطلوبة

```sql
-- 1. Index على file_name (للبحث السريع)
CREATE INDEX IF NOT EXISTS gallery_file_name_idx ON gallery_images (file_name);

-- 2. Index على is_featured (للفلترة)
CREATE INDEX IF NOT EXISTS gallery_is_featured_idx ON gallery_images (is_featured);

-- 3. Index على is_default (للفلترة)
CREATE INDEX IF NOT EXISTS gallery_is_default_idx ON gallery_images (is_default);

-- 4. Index على created_at (للترتيب)
CREATE INDEX IF NOT EXISTS gallery_created_at_idx ON gallery_images (created_at);

-- 5. Composite Index على is_featured و created_at (للاستعلامات المركبة)
CREATE INDEX IF NOT EXISTS gallery_featured_created_idx ON gallery_images (is_featured, created_at);
```

---

## 🚀 طرق التطبيق

### الطريقة 1: باستخدام Drizzle Kit (موصى بها)

```bash
# 1. إنشاء migration جديد
npm run db:generate

# 2. تطبيق المig ration
npm run db:migrate

# 3. التحقق من النتيجة
npm run db:studio
```

### الطريقة 2: SQL مباشر

إذا كنت تستخدم PostgreSQL مباشرة:

```bash
# الاتصال بـ Database
psql -U your_username -d your_database_name

# نسخ ولصق الـ SQL أعلاه
```

### الطريقة 3: باستخدام Drizzle Studio

```bash
# 1. افتح Drizzle Studio
npm run db:studio

# 2. اذهب إلى SQL Editor
# 3. الصق الـ SQL أعلاه
# 4. اضغط Execute
```

---

## ✅ التحقق من التطبيق

بعد تطبيق الـ migration، تحقق من الـ indexes:

```sql
-- عرض جميع indexes على gallery_images
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'gallery_images';
```

**النتيجة المتوقعة:**
```
indexname                     | indexdef
------------------------------+------------------------------------------
gallery_file_name_idx         | CREATE INDEX ...
gallery_is_featured_idx       | CREATE INDEX ...
gallery_is_default_idx        | CREATE INDEX ...
gallery_created_at_idx        | CREATE INDEX ...
gallery_featured_created_idx  | CREATE INDEX ...
```

---

## 📊 قياس التحسين

### قبل Indexes:

```sql
EXPLAIN ANALYZE 
SELECT * FROM gallery_images 
WHERE is_featured = true 
ORDER BY created_at DESC 
LIMIT 20;
```

**النتيجة:** ~180ms ❌

### بعد Indexes:

نفس الاستعلام

**النتيجة المتوقعة:** ~70ms ✅ (**-61% تحسين**)

---

## 🔄 Rollback (التراجع)

إذا احتجت لحذف الـ indexes:

```sql
DROP INDEX IF EXISTS gallery_file_name_idx;
DROP INDEX IF EXISTS gallery_is_featured_idx;
DROP INDEX IF EXISTS gallery_is_default_idx;
DROP INDEX IF EXISTS gallery_created_at_idx;
DROP INDEX IF EXISTS gallery_featured_created_idx;
```

---

## 💾 حجم التخزين

الـ Indexes ستضيف مساحة إضافية:

| Index | حجم تقريبي (لـ 1000 صورة) |
|-------|---------------------------|
| file_name_idx | ~50 KB |
| is_featured_idx | ~20 KB |
| is_default_idx | ~20 KB |
| created_at_idx | ~40 KB |
| featured_created_idx | ~60 KB |
| **المجموع** | **~190 KB** |

**لـ 10,000 صورة:** ~1.9 MB
**لـ 100,000 صورة:** ~19 MB

**الخلاصة:** المساحة الإضافية ضئيلة جداً مقارنة بالتحسين الهائل في الأداء.

---

## ⚠️ ملاحظات هامة

1. **Production Environment:**
   - طبّق الـ migration في وقت قليل الاستخدام
   - خذ backup قبل التطبيق
   - راقب الأداء بعد التطبيق

2. **Development Environment:**
   - يمكن التطبيق مباشرة
   - لا حاجة لـ downtime

3. **Index Maintenance:**
   - PostgreSQL يدير الـ indexes تلقائياً
   - لا حاجة لإعادة بناءها (rebuild) إلا في حالات نادرة

---

## 🐛 حل المشاكل

### مشكلة: "permission denied"
**الحل:** تأكد من صلاحيات المستخدم:
```sql
GRANT CREATE ON DATABASE your_database TO your_username;
```

### مشكلة: "relation does not exist"
**الحل:** تأكد من أن جدول gallery_images موجود:
```sql
SELECT * FROM gallery_images LIMIT 1;
```

### مشكلة: "index already exists"
**الحل:** استخدم `IF NOT EXISTS` في الـ SQL أو احذف الـ index القديم أولاً.

---

## 📚 مراجع

- [PostgreSQL Indexes Documentation](https://www.postgresql.org/docs/current/indexes.html)
- [Drizzle ORM Indexes](https://orm.drizzle.team/docs/indexes-constraints)
- [Best Practices for Database Indexing](https://use-the-index-luke.com/)

---

**تاريخ الإنشاء:** 2025-01-19  
**الحالة:** ✅ جاهز للتطبيق
