# دليل رفع المشروع على GitHub

## 🚀 **خطوات رفع المشروع على GitHub**

### **1. إعداد Git محلياً**

```bash
# تهيئة Git repository
git init

# إضافة جميع الملفات
git add .

# أول commit
git commit -m "Initial commit: E-Commerce Dashboard with Next.js 15"
```

### **2. إنشاء Repository على GitHub**

1. اذهب إلى [GitHub.com](https://github.com)
2. انقر على "New repository" أو "+"
3. املأ التفاصيل:
   - **Repository name**: `ecommerce-dashboard` أو اسم من اختيارك
   - **Description**: `Modern e-commerce platform with admin dashboard - Next.js 15, TypeScript, Arabic/English support`
   - **Visibility**: Public أو Private حسب رغبتك
   - **لا تضع** ✅ في "Add a README file" (لأن لدينا README بالفعل)
   - **لا تضع** ✅ في "Add .gitignore" (لأن لدينا .gitignore بالفعل)
   - **اختر** MIT License إذا كنت تريد

4. انقر "Create repository"

### **3. ربط المشروع المحلي بـ GitHub**

```bash
# إضافة remote origin (استبدل USERNAME و REPOSITORY_NAME)
git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git

# تأكد من اسم الفرع الرئيسي
git branch -M main

# رفع الكود لأول مرة
git push -u origin main
```

### **4. إعداد متغيرات البيئة للإنتاج**

⚠️ **مهم جداً**: لا ترفع ملف `.env.local` على GitHub!

بدلاً من ذلك:
1. تأكد أن `.env.local` موجود في `.gitignore`
2. استخدم `.env.example` كقالب للآخرين

### **5. إعداد GitHub Actions (اختياري)**

إنشاء ملف `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Build project
      run: npm run build
```

## 🌐 **نشر على Vercel**

### **1. ربط GitHub بـ Vercel**

1. اذهب إلى [Vercel.com](https://vercel.com)
2. سجل دخول بحساب GitHub
3. انقر "New Project"
4. اختر repository الخاص بك
5. انقر "Import"

### **2. إعداد متغيرات البيئة في Vercel**

في لوحة تحكم Vercel:
1. اذهب إلى "Settings" → "Environment Variables"
2. أضف جميع المتغيرات من `.env.local`:

```env
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
SUPER_ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_PASSWORD=your_secure_admin_password
```

### **3. إعداد قاعدة البيانات للإنتاج**

#### **خيار 1: Neon (مجاني)**
1. اذهب إلى [Neon.tech](https://neon.tech)
2. أنشئ حساب وقاعدة بيانات جديدة
3. انسخ connection string
4. أضفه كـ `DATABASE_URL` في Vercel

#### **خيار 2: Supabase (مجاني)**
1. اذهب إلى [Supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. انسخ PostgreSQL connection string
4. أضفه كـ `DATABASE_URL` في Vercel

### **4. تشغيل Migration**

بعد النشر، قم بتشغيل:
```bash
npm run db:push
```

## 🔒 **أمان المشروع**

### **ما يجب عدم رفعه على GitHub:**
- ✅ `.env.local` (محمي بـ .gitignore)
- ✅ `node_modules/` (محمي بـ .gitignore)
- ✅ `.next/` (محمي بـ .gitignore)
- ✅ أي ملفات تحتوي على أسرار

### **ما يجب تغييره للإنتاج:**
- 🔐 **كلمات المرور**: غيّر جميع كلمات المرور الافتراضية
- 🔐 **JWT Secrets**: استخدم أسرار قوية وعشوائية
- 🔐 **Database URLs**: استخدم قاعدة بيانات إنتاج منفصلة
- 🔐 **OAuth Settings**: حدّث redirect URLs للدومين الجديد

## 📝 **تحديث المشروع**

### **للتحديثات المستقبلية:**

```bash
# إضافة التغييرات
git add .

# commit مع رسالة وصفية
git commit -m "feat: add new feature description"

# رفع التحديثات
git push origin main
```

### **أنواع commit messages المقترحة:**
```bash
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve cart update issue"
git commit -m "docs: update README with deployment guide"
git commit -m "style: improve responsive design"
git commit -m "refactor: optimize database queries"
```

## 🎯 **نصائح مهمة**

### **1. الأمان**
- لا ترفع أبداً ملفات تحتوي على أسرار
- استخدم environment variables للإعدادات الحساسة
- غيّر كلمات المرور الافتراضية

### **2. التوثيق**
- حدّث README.md عند إضافة ميزات جديدة
- أضف تعليقات واضحة في الكود
- وثّق أي تغييرات في API

### **3. الاختبار**
- اختبر المشروع محلياً قبل الرفع
- تأكد من عمل جميع الميزات
- اختبر على أجهزة مختلفة

### **4. النشر**
- استخدم فروع منفصلة للتطوير (`develop`)
- اختبر في بيئة staging قبل الإنتاج
- راقب الأداء بعد النشر

## 🔗 **روابط مفيدة**

- [GitHub Docs](https://docs.github.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🎉 **مبروك!**

مشروعك الآن على GitHub وجاهز للمشاركة مع العالم! 🚀

---

**تاريخ الإنشاء**: 6 أكتوبر 2025  
**المطور**: Kiro AI Assistant