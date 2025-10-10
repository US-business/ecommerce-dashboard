# 🚀 أوامر Git و GitHub - دليل سريع

## 📋 **الأوامر الأساسية لرفع المشروع**

### **1. تهيئة Git وأول commit**
```bash
# تهيئة Git repository
git init

# إضافة جميع الملفات
git add .

# أول commit
git commit -m "🎉 Initial commit: E-Commerce Dashboard with Next.js 15

✨ Features:
- Modern e-commerce platform with admin dashboard
- Next.js 15 with App Router and TypeScript
- Full Arabic (RTL) and English (LTR) support
- NextAuth.js with Google OAuth integration
- Drizzle ORM with PostgreSQL
- Tailwind CSS with shadcn/ui components
- Cloudinary image management
- Comprehensive user and admin management
- Shopping cart and order system
- Multi-language product catalog
- Responsive design for all devices

🛠️ Tech Stack:
- Next.js 15, TypeScript, Tailwind CSS
- NextAuth.js, Drizzle ORM, PostgreSQL
- Cloudinary, Vercel deployment ready"
```

### **2. ربط بـ GitHub**
```bash
# إضافة remote origin (استبدل USERNAME و REPO_NAME بالقيم الصحيحة)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# تأكد من اسم الفرع الرئيسي
git branch -M main

# رفع الكود لأول مرة
git push -u origin main
```

## 🔄 **أوامر التحديث اليومية**

### **إضافة تغييرات جديدة**
```bash
# إضافة ملفات محددة
git add filename.js
git add src/components/

# أو إضافة جميع التغييرات
git add .

# commit مع رسالة وصفية
git commit -m "feat: add user profile management system"

# رفع التحديثات
git push origin main
```

### **أنواع commit messages**
```bash
# ميزة جديدة
git commit -m "feat: add shopping cart functionality"

# إصلاح خطأ
git commit -m "fix: resolve authentication redirect issue"

# تحديث التوثيق
git commit -m "docs: update README with deployment instructions"

# تحسين الكود
git commit -m "refactor: optimize database queries"

# تحسين التصميم
git commit -m "style: improve responsive design for mobile"

# إضافة اختبارات
git commit -m "test: add unit tests for user authentication"

# مهام صيانة
git commit -m "chore: update dependencies to latest versions"
```

## 🌿 **العمل مع الفروع (Branches)**

### **إنشاء فرع جديد**
```bash
# إنشاء فرع للميزة الجديدة
git checkout -b feature/user-dashboard
git checkout -b feature/payment-integration
git checkout -b fix/cart-calculation-bug

# رفع الفرع الجديد
git push -u origin feature/user-dashboard
```

### **التنقل بين الفروع**
```bash
# العودة للفرع الرئيسي
git checkout main

# الانتقال لفرع آخر
git checkout feature/user-dashboard

# عرض جميع الفروع
git branch -a
```

### **دمج الفروع**
```bash
# العودة للفرع الرئيسي
git checkout main

# دمج الفرع
git merge feature/user-dashboard

# حذف الفرع بعد الدمج
git branch -d feature/user-dashboard
git push origin --delete feature/user-dashboard
```

## 📊 **أوامر المراقبة والمعلومات**

### **حالة المشروع**
```bash
# عرض حالة الملفات
git status

# عرض تاريخ commits
git log --oneline

# عرض التغييرات
git diff

# عرض معلومات remote
git remote -v
```

### **التراجع عن التغييرات**
```bash
# التراجع عن تغييرات غير محفوظة
git checkout -- filename.js

# التراجع عن آخر commit (مع الاحتفاظ بالتغييرات)
git reset --soft HEAD~1

# التراجع عن آخر commit (بدون الاحتفاظ بالتغييرات)
git reset --hard HEAD~1
```

## 🔄 **مزامنة مع GitHub**

### **تحديث المشروع المحلي**
```bash
# جلب آخر التحديثات
git fetch origin

# دمج التحديثات
git pull origin main

# أو في خطوة واحدة
git pull
```

### **حل تعارضات الدمج**
```bash
# عند حدوث تعارض
git status  # لرؤية الملفات المتعارضة

# بعد حل التعارضات يدوياً
git add .
git commit -m "resolve merge conflicts"
git push
```

## 🏷️ **إنشاء إصدارات (Tags)**

### **إنشاء tag للإصدار**
```bash
# إنشاء tag للإصدار الحالي
git tag -a v1.0.0 -m "🎉 Release v1.0.0: Initial stable release"

# رفع tags إلى GitHub
git push origin --tags

# عرض جميع tags
git tag -l
```

## 🔧 **أوامر مفيدة للصيانة**

### **تنظيف المشروع**
```bash
# حذف فروع محلية مدموجة
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d

# تنظيف references
git remote prune origin

# ضغط تاريخ Git
git gc --aggressive
```

### **معلومات مفيدة**
```bash
# حجم repository
git count-objects -vH

# إحصائيات المساهمين
git shortlog -sn

# عرض الملفات الأكبر
git ls-files | xargs wc -l | sort -nr | head -10
```

## 🚨 **أوامر الطوارئ**

### **في حالة المشاكل**
```bash
# إعادة تعيين كامل للفرع الرئيسي
git fetch origin
git reset --hard origin/main

# حفظ التغييرات مؤقتاً
git stash
git stash pop  # لاستعادتها لاحقاً

# إلغاء آخر push (خطير!)
git push --force-with-lease origin main
```

## 📝 **نصائح مهمة**

### **قبل كل push**
```bash
# تأكد من عدم وجود أخطاء
npm run lint
npm run type-check
npm run build

# اختبر المشروع
npm run dev
```

### **رسائل commit جيدة**
```bash
# ❌ سيء
git commit -m "fix"
git commit -m "update"

# ✅ جيد
git commit -m "fix: resolve cart total calculation error"
git commit -m "feat: add Arabic language support for product pages"
```

### **أمان المشروع**
```bash
# تأكد من .gitignore
git status  # لا يجب أن ترى .env.local أو node_modules

# فحص الملفات قبل commit
git diff --cached
```

## 🎯 **سير العمل المقترح**

### **للميزات الجديدة**
```bash
1. git checkout main
2. git pull origin main
3. git checkout -b feature/new-feature
4. # اعمل على الميزة
5. git add .
6. git commit -m "feat: add new feature"
7. git push -u origin feature/new-feature
8. # أنشئ Pull Request على GitHub
9. # بعد الموافقة والدمج
10. git checkout main
11. git pull origin main
12. git branch -d feature/new-feature
```

### **للإصلاحات السريعة**
```bash
1. git checkout main
2. git pull origin main
3. git checkout -b fix/quick-fix
4. # اصلح المشكلة
5. git add .
6. git commit -m "fix: resolve critical issue"
7. git push -u origin fix/quick-fix
8. # دمج سريع إذا كان إصلاح حرج
```

---

**💡 نصيحة**: احفظ هذا الملف كمرجع سريع لأوامر Git الأساسية!