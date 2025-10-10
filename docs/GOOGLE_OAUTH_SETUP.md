# إعداد مصادقة Google OAuth - دليل المطور

## ✅ ما تم تنفيذه بالفعل:

### 1. **تحديث قاعدة البيانات** ✅
- إضافة حقول OAuth إلى جدول المستخدمين
- إنشاء جداول NextAuth المطلوبة (accounts, sessions, verificationTokens)
- جعل حقل password اختياري للمستخدمين OAuth
- إضافة حقول: image, googleId, provider, emailVerified

### 2. **إعداد NextAuth** ✅
- تثبيت next-auth و @auth/drizzle-adapter
- إنشاء ملف التكوين `/lib/auth/auth.config.ts`
- إعداد Google Provider مع DrizzleAdapter
- إنشاء API route `/app/api/auth/[...nextauth]/route.ts`

### 3. **تكامل الواجهة الأمامية** ✅
- مكون GoogleSignInButton مع تصميم متجاوب
- إضافة SessionProvider إلى layout الرئيسي
- نظام مصادقة هجين يدعم النظامين (JWT + NextAuth)
- AuthStateManager للتنسيق بين النظامين

### 4. **إعداد TypeScript** ✅
- أنواع مخصصة لـ NextAuth في `/types/next-auth.d.ts`
- دعم كامل للغة العربية والإنجليزية

---

## 🔧 **الخطوات المتبقية للمطور:**

### **الخطوة 1: إعداد Google Cloud Console**

1. اذهب إلى [Google Cloud Console](https://console.developers.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google+ API:
   - اذهب إلى "APIs & Services" > "Library"
   - ابحث عن "Google+ API" وفعّله

4. أنشئ OAuth 2.0 Client ID:
   - اذهب إلى "APIs & Services" > "Credentials"
   - انقر "Create Credentials" > "OAuth client ID"
   - اختر "Web application"
   - أضف URIs:
     - **Authorized JavaScript origins**: `http://localhost:3000`
     - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

### **الخطوة 2: تحديث متغيرات البيئة**

في ملف `.env.local`، استبدل هذه القيم:
```env
# NextAuth.js OAuth Configuration
GOOGLE_CLIENT_ID='paste_your_actual_google_client_id_here'
GOOGLE_CLIENT_SECRET='paste_your_actual_google_client_secret_here'

# NextAuth Configuration
NEXTAUTH_SECRET='generate_a_strong_random_secret_here'
NEXTAUTH_URL='http://localhost:3000'
```

### **الخطوة 3: تشغيل Migration لقاعدة البيانات**

```bash
npm run db:push
# أو
npm run db:generate && npm run db:migrate
```

---

## 🧪 **كيفية الاختبار:**

### **اختبار النظام الحالي (للتأكد من عدم الإخلال):**
1. اذهب إلى `/ar/signin` أو `/en/signin`
2. جرب تسجيل الدخول بالبيانات الموجودة:
   - Email: `client.store.info@gmail.com`
   - Password: `123`
3. تأكد أن النظام يعمل كما كان

### **اختبار Google OAuth:**
1. اذهب إلى صفحة تسجيل الدخول
2. انقر على "Continue with Google"
3. اختر حساب Google
4. تأكد من إنشاء المستخدم في قاعدة البيانات
5. تأكد من تسجيل الدخول الصحيح

---

## 🔄 **كيف يعمل النظام الهجين:**

### **للمستخدمين الجدد:**
- **التسجيل التقليدي**: يحفظ في قاعدة البيانات مع `provider="email"`
- **Google OAuth**: ينشئ حساب تلقائياً مع `provider="google"`

### **لتسجيل الدخول:**
- **NextAuth** يتعامل مع Google OAuth
- **النظام المخصص** يتعامل مع البريد الإلكتروني/كلمة المرور
- **AuthStateManager** ينسق بين النظامين

### **إدارة الجلسات:**
- Google OAuth: جلسات NextAuth
- التقليدي: JWT مخصص
- كلاهما يعمل مع store واحد موحد

---

## ⚠️ **ملاحظات مهمة:**

### **الأمان:**
- لا تشارك `GOOGLE_CLIENT_SECRET` أبداً
- استخدم HTTPS في الإنتاج
- غيّر `NEXTAUTH_SECRET` لقيمة قوية

### **الإنتاج:**
- حديث redirect URIs للدومين الفعلي
- استخدم متغيرات بيئة آمنة
- فعّل domain verification في Google Console

### **قاعدة البيانات:**
- النظام يدعم المستخدمين الموجودين
- لا تحتاج لمسح أو تغيير البيانات الحالية
- Google OAuth ينشئ مستخدمين جدد تلقائياً

---

## 🚀 **الميزات الجديدة:**

1. **تسجيل دخول بنقرة واحدة** من Google
2. **تجربة مستخدم محسنة** مع OAuth
3. **أمان إضافي** مع Google's security
4. **إدارة موحدة** للمستخدمين من مصادر مختلفة
5. **دعم كامل للغات** (العربية والإنجليزية)

---

## ✅ **اختبر النظام الآن:**

```bash
npm run dev
```

- اذهب إلى http://localhost:3000/ar/signin
- جرب النظامين معاً!

**مبروك! 🎉 لديك الآن نظام مصادقة هجين متطور!**