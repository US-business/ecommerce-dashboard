# دليل إنشاء حساب الأدمن (Admin Account Setup Guide)

## 📋 المحتويات
1. [الطريقة الأولى: Script التهيئة (الموصى بها)](#الطريقة-الأولى-script-التهيئة)
2. [الطريقة الثانية: من لوحة التحكم](#الطريقة-الثانية-من-لوحة-التحكم)
3. [المقارنة بين الطريقتين](#المقارنة-بين-الطريقتين)
4. [أفضل الممارسات](#أفضل-الممارسات)

---

## ✅ الوضع الحالي

لديك **طريقتان** لإنشاء حساب الأدمن:

---

## 🎯 الطريقة الأولى: Script التهيئة (الموصى بها)

### ✅ متى تُستخدم؟
- **أول مرة** تُشغّل المشروع
- لإنشاء أول Super Admin
- في بيئة الإنتاج (Production)
- للتهيئة الأولية Automated

### 📝 الخطوات:

#### 1. تثبيت tsx (إذا لم يكن موجوداً)
```bash
npm install tsx --save-dev
```

#### 2. تحديث `.env.local`
```bash
# في ملف .env.local
SUPER_ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_PASSWORD=YourSecurePassword123!
```

**⚠️ مهم:**
- كلمة المرور يجب أن تكون **8 أحرف على الأقل**
- استخدم كلمة مرور قوية في الإنتاج

#### 3. تشغيل Script
```bash
npm run seed:admin
```

### 📊 ماذا يحدث؟

Script `seed-admin.ts` يقوم بـ:
1. ✅ **يتحقق** من وجود admin بنفس الإيميل
2. ✅ **ينشئ حساب جديد** إذا لم يكن موجوداً
3. ✅ **يُحدّث كلمة المرور** إذا كان موجوداً
4. ✅ **يشفّر كلمة المرور** بـ bcrypt (12 rounds)
5. ✅ **يعين Role** كـ `super_admin`

### 💻 Output المتوقع:

#### إذا كان حساب جديد:
```
Checking for existing admin user...
Creating new admin user...
Admin user created successfully!
Email: admin@yourdomain.com
Password: [HIDDEN FOR SECURITY]
```

#### إذا كان موجوداً:
```
Checking for existing admin user...
Admin user with this email already exists. Updating password...
Admin password updated successfully!
Email: admin@yourdomain.com
Password: [HIDDEN FOR SECURITY]
```

### 🔒 الأمان:
- ✅ كلمة المرور **مُشفّرة** بـ bcrypt
- ✅ `.env.local` في `.gitignore` (لا يُرفع لـ Git)
- ✅ Script آمن للاستخدام المتكرر
- ✅ يُحدّث كلمة المرور إذا نسيتها

---

## 🎨 الطريقة الثانية: من لوحة التحكم

### ✅ متى تُستخدم؟
- لإنشاء admins **إضافيين**
- بعد تسجيل دخول Super Admin
- للإدارة اليومية للمستخدمين

### 📝 الخطوات:

#### 1. تسجيل الدخول كـ Super Admin
```
URL: http://localhost:3000/ar/signin
Email: admin@yourdomain.com
Password: [كلمة المرور من .env.local]
```

#### 2. الذهاب لإدارة المستخدمين
```
Dashboard → Users → Create New User
```

#### 3. ملء البيانات
```tsx
Username: admin2
Email: admin2@yourdomain.com
Password: SecurePassword123!
Role: Super Admin  // ⭐ هنا تختار الـ Role
Address: (اختياري)
Phone: (اختياري)
```

#### 4. حفظ
✅ سيتم إنشاء المستخدم وتشفير كلمة المرور تلقائياً

### 🎯 المكونات المستخدمة:
- `components/dashboard/users/user-form.tsx` - النموذج
- `lib/actions/users.ts` - إنشاء المستخدم
- Role Dropdown يدعم:
  - ✅ `viewer` - مستخدم عادي
  - ✅ `super_admin` - أدمن

---

## 📊 المقارنة بين الطريقتين

| المعيار | Script (.env.local) | لوحة التحكم |
|---------|-------------------|--------------|
| **الاستخدام الأول** | ✅ مثالي | ❌ غير ممكن |
| **سهولة الإعداد** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **الأمان** | ✅ عالي | ✅ عالي |
| **التكرار** | ✅ سهل | ✅ سهل |
| **Admins إضافيين** | ⚠️ يدوي | ✅ أفضل |
| **Production** | ✅ موصى به | ✅ جيد |
| **Development** | ✅ ممتاز | ✅ جيد |
| **Automation** | ✅ نعم | ❌ لا |

---

## 🎯 السيناريو الموصى به

### 🚀 المرحلة 1: التهيئة الأولية
```bash
# 1. أول مرة تُشغّل المشروع
npm run seed:admin

# 2. تسجيل الدخول
# استخدم البيانات من .env.local
```

### 👥 المرحلة 2: إضافة Admins
```bash
# استخدم لوحة التحكم لإنشاء admins إضافيين
Dashboard → Users → Create New User
```

---

## 🔒 أفضل الممارسات

### ✅ DO (افعل)

1. **استخدم Script للتهيئة الأولية**
   ```bash
   npm run seed:admin
   ```

2. **استخدم لوحة التحكم للمستخدمين الإضافيين**
   - أسهل وأسرع
   - واجهة مستخدم واضحة
   - تحقق من البيانات

3. **احمِ `.env.local`**
   ```bash
   # تأكد أنه في .gitignore
   .env.local
   ```

4. **استخدم كلمات مرور قوية**
   ```
   ✅ MySecureP@ssw0rd123!
   ❌ admin123
   ```

5. **غيّر كلمة المرور بعد أول دخول**
   - خاصة في Production

### ❌ DON'T (لا تفعل)

1. **لا تضع بيانات حساسة في Git**
   ```bash
   # ❌ لا ترفع .env.local
   git add .env.local  # DON'T!
   ```

2. **لا تستخدم كلمات مرور ضعيفة**
   ```
   ❌ 12345678
   ❌ password
   ❌ admin
   ```

3. **لا تشارك بيانات الأدمن**
   - كل admin له حساب خاص

4. **لا تستخدم نفس كلمة المرور**
   - في Development و Production

---

## 🔄 إعادة تعيين كلمة المرور

### إذا نسيت كلمة المرور:

#### الطريقة 1: باستخدام Script
```bash
# 1. حدّث .env.local
SUPER_ADMIN_PASSWORD=NewPassword123!

# 2. شغّل Script مرة أخرى
npm run seed:admin

# ✅ سيُحدّث كلمة المرور تلقائياً
```

#### الطريقة 2: من Database مباشرة
```bash
# 1. افتح Drizzle Studio
npm run db:studio

# 2. ابحث عن المستخدم في جدول users

# 3. احذف الحساب وأعد إنشاءه بـ Script
```

---

## 📁 الملفات المرتبطة

### Configuration:
- `.env.local` - بيانات الأدمن
- `.env.example` - القالب

### Scripts:
- `scripts/seed-admin.ts` - Script إنشاء الأدمن
- `package.json` - الأوامر

### Components:
- `components/dashboard/users/user-form.tsx` - نموذج المستخدم
- `lib/actions/users.ts` - إنشاء/تحديث المستخدمين

### Database:
- `lib/db/schema.ts` - جدول users
- Role: `viewer | super_admin`

---

## 🐛 استكشاف الأخطاء

### المشكلة: Script لا يعمل
```bash
# الحل 1: تحقق من tsx
npm list tsx
npm install tsx --save-dev

# الحل 2: تحقق من .env.local
cat .env.local | grep SUPER_ADMIN

# الحل 3: تحقق من Database
npm run db:studio
```

### المشكلة: "Email already exists"
```bash
# هذا طبيعي! Script سيُحدّث كلمة المرور
npm run seed:admin
# ✅ Password updated successfully!
```

### المشكلة: لا أستطيع تسجيل الدخول
```bash
# 1. تأكد أن البيانات صحيحة في .env.local
# 2. شغّل Script مرة أخرى
npm run seed:admin
# 3. جرّب تسجيل الدخول بالبيانات الجديدة
```

---

## 🎉 الخلاصة

### ✅ الطريقة الصحيحة:

1. **أول مرة:** استخدم Script
   ```bash
   npm run seed:admin
   ```

2. **Admins إضافيين:** استخدم لوحة التحكم
   ```
   Dashboard → Users → Create New User
   ```

3. **نسيت كلمة المرور:** شغّل Script مرة أخرى
   ```bash
   # حدّث .env.local ثم
   npm run seed:admin
   ```

### 🚫 الطريقة الخاطئة:

❌ وضع بيانات الأدمن فقط في `.env.local` وتوقع أن يعمل تلقائياً
- يجب تشغيل Script أولاً لإنشاء الحساب في Database

---

## 📞 الدعم

إذا واجهت مشكلة:
1. راجع [استكشاف الأخطاء](#استكشاف-الأخطاء)
2. تحقق من Database بـ `npm run db:studio`
3. شغّل Script مرة أخرى `npm run seed:admin`

---

**تاريخ الإنشاء:** أكتوبر 2025  
**آخر تحديث:** أكتوبر 2025  
**الحالة:** ✅ Tested & Production Ready
