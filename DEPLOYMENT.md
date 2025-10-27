# 🚀 دليل النشر - E-commerce Dashboard

## 📋 قائمة التحقق قبل النشر

### ✅ 1. اختبار البناء محلياً

```bash
# تثبيت Dependencies
npm install

# اختبار البناء
npm run build

# تشغيل النسخة المبنية
npm start
```

**تأكد من عدم وجود أخطاء في البناء!**

---

### 🔐 2. إعداد المتغيرات البيئية

#### أ) قاعدة البيانات (Neon PostgreSQL)

1. سجل حساب على [Neon.tech](https://neon.tech)
2. أنشئ مشروع جديد
3. انسخ `DATABASE_URL` من لوحة التحكم
4. تأكد من أن الصيغة: `postgresql://user:password@host/database?sslmode=require`

#### ب) توليد NEXTAUTH_SECRET

```bash
# على Windows (PowerShell)
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# على Mac/Linux
openssl rand -base64 32
```

#### ج) Google OAuth

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. أنشئ مشروع جديد أو استخدم مشروع موجود
3. أنشئ OAuth 2.0 Client ID
4. أضف URIs المصرح بها:
   - **Authorized JavaScript origins**: `https://your-domain.vercel.app`
   - **Authorized redirect URIs**: `https://your-domain.vercel.app/api/auth/callback/google`

#### د) Cloudinary (للصور)

1. سجل على [Cloudinary](https://cloudinary.com)
2. احصل على:
   - Cloud Name
   - API Key
   - API Secret
3. أنشئ Upload Preset:
   - Settings → Upload → Add upload preset
   - Mode: `unsigned`
   - انسخ اسم الـ preset

---

### 🌐 3. النشر على Vercel (موصى به)

#### الخطوات:

1. **ادفع الكود إلى GitHub** (تم ✅)

2. **اذهب إلى [Vercel Dashboard](https://vercel.com)**

3. **انقر على "Add New Project"**

4. **استورد Repository من GitHub:**
   ```
   https://github.com/US-business/ecommerce-dashboard
   ```

5. **أضف Environment Variables:**

   انقر على "Environment Variables" وأضف:
   
   ```env
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
   ```

6. **انقر على "Deploy"**

7. **انتظر اكتمال البناء والنشر**

---

### 🗄️ 4. إعداد قاعدة البيانات

بعد النشر الأول:

```bash
# على local machine مع DATABASE_URL للـ Production
npm run db:push
```

أو استخدم Vercel CLI:

```bash
vercel env pull .env.production.local
npm run db:push
```

---

### 👤 5. إنشاء Super Admin (اختياري)

```bash
# أضف إلى Environment Variables في Vercel:
SUPER_ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_PASSWORD=SecurePassword123!

# سيتم تشغيل seed-admin-safe.ts تلقائياً بعد البناء
```

---

## 🔄 النشر البديل

### Netlify

```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

### Railway

1. اذهب إلى [Railway.app](https://railway.app)
2. أنشئ مشروع من GitHub
3. أضف Environment Variables
4. انشر

### DigitalOcean App Platform

1. اذهب إلى [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Create App من GitHub
3. اختر Repository
4. أضف Environment Variables

---

## ⚠️ تحذيرات مهمة

### 🔴 لا تنشر أبداً:

- ❌ ملفات `.env` أو `.env.local`
- ❌ مفاتيح API في الكود
- ❌ كلمات مرور مباشرة
- ❌ بيانات اعتماد حساسة

### ✅ تأكد من:

- ✅ `.gitignore` يحتوي على `.env*`
- ✅ جميع المتغيرات البيئية في Dashboard للمنصة
- ✅ `NEXTAUTH_SECRET` طوله 32 حرف على الأقل
- ✅ Google OAuth URIs محدثة للدومين الجديد

---

## 🧪 اختبار بعد النشر

1. **اختبر تسجيل الدخول:**
   - تسجيل دخول بـ Google
   - تسجيل دخول بـ Email/Password

2. **اختبر رفع الصور:**
   - أضف منتج بصورة
   - تحقق من رفع الصورة إلى Cloudinary

3. **اختبر قاعدة البيانات:**
   - أضف فئة
   - أضف منتج
   - عدل بيانات

4. **اختبر الصفحات:**
   - الصفحة الرئيسية
   - صفحة المنتجات
   - لوحة التحكم

---

## 📊 مراقبة الأداء

### Vercel Analytics (مجاني)

```bash
npm install @vercel/analytics
```

ثم أضف في `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🆘 استكشاف الأخطاء

### خطأ في البناء:

```bash
# نظف الكاش وأعد البناء
rm -rf .next
npm run build
```

### خطأ في قاعدة البيانات:

```bash
# تحقق من DATABASE_URL
echo $DATABASE_URL

# أعد دفع Schema
npm run db:push
```

### خطأ في Google OAuth:

- تحقق من Redirect URIs في Google Console
- تأكد من `NEXTAUTH_URL` مطابق لدومين Production

---

## 📚 موارد إضافية

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Postgres](https://neon.tech/docs)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

---

## ✨ تهانينا!

مشروعك الآن على الإنترنت! 🎉

لأي أسئلة أو مشاكل، تحقق من:
- Logs في Vercel Dashboard
- [GitHub Issues](https://github.com/US-business/ecommerce-dashboard/issues)
