# دليل دمج صفحة Account - الملف الشخصي المتكامل

## 🎯 **الهدف من التحديث**

تم دمج جميع ميزات صفحة `profile` في صفحة `account` لتصبح صفحة `account` هي الصفحة الرئيسية الموحدة لإدارة الحساب مع جميع الميزات المتقدمة.

---

## 🔄 **التغييرات المطبقة**

### **1. صفحة Account المحدثة (`/[lang]/account`)**

#### **الميزات الجديدة المدمجة:**
- ✅ **Header متطور**: Avatar، Badge للدور، معلومات العضوية
- ✅ **ثلاثة تبويبات رئيسية**:
  - **الملف الشخصي**: معلومات الحساب الأساسية
  - **الأمان**: تغيير كلمة المرور أو إدارة حساب Google
  - **الطلبات**: تاريخ الطلبات والحالة
- ✅ **دعم كامل للغات**: عربي (RTL) وإنجليزي (LTR)
- ✅ **تصميم متجاوب**: يعمل على جميع الأجهزة
- ✅ **تكامل مع NextAuth**: دعم حسابات Google و المحلية

#### **البنية الجديدة:**
```
/[lang]/account/
├── page.tsx (Server Component)
├── _components/
│   ├── AccountPageClient.tsx (Client Component - الرئيسي)
│   └── ProfileForm.tsx (محدث للعرض فقط)
```

### **2. إعادة توجيه صفحة Profile**

صفحة `/[lang]/profile` تقوم الآن بإعادة توجيه تلقائية إلى `/[lang]/account`:

```typescript
// app/[lang]/(site)/profile/page.tsx
useEffect(() => {
  router.replace(`/${lang}/account`)
}, [router, lang])
```

### **3. تحديث Navigation**

- **Sidebar الداشبورد**: يوجه الآن إلى `/account` بدلاً من `/profile`
- **روابط تغيير كلمة المرور**: تعيد التوجيه إلى `/account`

---

## 🎨 **الميزات المتقدمة**

### **1. Header التفاعلي**
```typescript
// معلومات المستخدم مع Avatar وBadge
<Avatar className="h-20 w-20">
  <AvatarImage src={currentUser?.image} />
  <AvatarFallback>{getInitials(username)}</AvatarFallback>
</Avatar>

<Badge variant={getRoleBadgeVariant(role)}>
  {getRoleText(role)}
</Badge>
```

### **2. تبويبات ذكية**
```typescript
// ثلاثة تبويبات مع أيقونات
<TabsList className="grid w-full grid-cols-3">
  <TabsTrigger value="profile">
    <UserIcon className="h-4 w-4 mr-2" />
    Profile
  </TabsTrigger>
  <TabsTrigger value="security">
    <Lock className="h-4 w-4 mr-2" />
    Security
  </TabsTrigger>
  <TabsTrigger value="orders">
    <Mail className="h-4 w-4 mr-2" />
    Orders
  </TabsTrigger>
</TabsList>
```

### **3. معالجة ذكية للحسابات**
```typescript
// تمييز بين حسابات Google والمحلية
{currentUser?.provider === "google" ? (
  // رسالة وزر لإدارة حساب Google
  <Button onClick={() => window.open("https://myaccount.google.com/security")}>
    Manage Google Account
  </Button>
) : (
  // نموذج تغيير كلمة المرور للحسابات المحلية
  <ChangePasswordForm />
)}
```

---

## 🌐 **دعم اللغات المحسن**

### **الترجمة التلقائية:**
```typescript
const safeDictionary = {
  account: {
    tabs: {
      profile: dictionary?.account?.tabs?.profile || (dir === "rtl" ? "الملف الشخصي" : "Profile"),
      orders: dictionary?.account?.tabs?.orders || (dir === "rtl" ? "الطلبات" : "Orders"),
    }
  }
};
```

### **دعم RTL/LTR:**
```typescript
const dir = lang === "ar" ? "rtl" : "ltr"

<div className={cn("flex items-center gap-6", dir === "rtl" && "flex-row-reverse")}>
  {/* المحتوى يتكيف مع اتجاه اللغة */}
</div>
```

---

## 📱 **التصميم المتجاوب**

### **Grid Layout:**
```typescript
// شبكة متجاوبة للمعلومات
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="space-y-2">
    <label>Name</label>
    <p>{user.username}</p>
  </div>
  {/* المزيد من الحقول */}
</div>
```

### **Mobile-First:**
- تبويبات تتكيف مع الشاشات الصغيرة
- أزرار وأيقونات محسنة للمس
- نصوص قابلة للقراءة على جميع الأحجام

---

## 🔧 **التكامل التقني**

### **Server + Client Components:**
```typescript
// Server Component (page.tsx)
export default async function AccountPage({ params }) {
  const session = await getServerSession(authOptions)
  const orders = await getUserOrders(user.id)
  
  return <AccountPageClient user={user} orders={orders} />
}

// Client Component (AccountPageClient.tsx)
export default function AccountPageClient({ user, orders }) {
  const [activeTab, setActiveTab] = useState("profile")
  // التفاعل والحالة
}
```

### **Type Safety:**
```typescript
// أنواع محددة ومحسنة
type User = {
  id: number;
  username: string | null;
  email: string;
  role: "super_admin" | "viewer";
  // المزيد من الحقول
}

const safeUser = {
  ...user,
  id: user.id || 0, // تأكد من وجود ID
}
```

---

## 🧪 **كيفية الاختبار**

### **1. الوصول للصفحة:**
```bash
# الوصول المباشر
/ar/account
/en/account

# من الداشبورد
Dashboard → Profile (في الشريط الجانبي)

# إعادة التوجيه من profile
/ar/profile → /ar/account (تلقائي)
```

### **2. اختبار التبويبات:**
```bash
# تبويب الملف الشخصي
- عرض معلومات المستخدم
- Avatar مع الأحرف الأولى
- Badge للدور (Super Admin/User)
- معلومات العضوية

# تبويب الأمان
- للحسابات المحلية: نموذج تغيير كلمة المرور
- لحسابات Google: رسالة مع رابط الإدارة

# تبويب الطلبات
- عرض الطلبات إذا وجدت
- رسالة "لا توجد طلبات" مع زر التسوق
```

### **3. اختبار اللغات:**
```bash
# العربية (RTL)
/ar/account
- النصوص باللغة العربية
- الاتجاه من اليمين لليسار
- الأيقونات والأزرار متكيفة

# الإنجليزية (LTR)
/en/account
- النصوص باللغة الإنجليزية
- الاتجاه من اليسار لليمين
- التصميم القياسي
```

---

## 🎯 **الفوائد المحققة**

### **للمستخدمين:**
- ✅ **تجربة موحدة**: صفحة واحدة لجميع إعدادات الحساب
- ✅ **سهولة التنقل**: تبويبات واضحة ومنظمة
- ✅ **معلومات شاملة**: عرض كامل لبيانات الحساب
- ✅ **أمان محسن**: إدارة كلمة المرور حسب نوع الحساب

### **للمطورين:**
- ✅ **كود منظم**: فصل واضح بين Server و Client Components
- ✅ **قابلية الصيانة**: مكونات قابلة للإعادة الاستخدام
- ✅ **Type Safety**: أنواع محددة ومحسنة
- ✅ **Performance**: تحميل محسن للبيانات

### **للأعمال:**
- ✅ **تجربة مستخدم متميزة**: رضا أكبر للعملاء
- ✅ **إدارة أفضل**: معلومات منظمة وسهلة الوصول
- ✅ **أمان عالي**: حماية محسنة للحسابات
- ✅ **دعم متعدد اللغات**: وصول أوسع للعملاء

---

## 📋 **الملفات المحدثة**

### **ملفات رئيسية:**
```
✅ app/[lang]/(site)/account/page.tsx
✅ app/[lang]/(site)/account/_components/AccountPageClient.tsx
✅ app/[lang]/(site)/account/_components/ProfileForm.tsx
✅ app/[lang]/(site)/profile/page.tsx (redirect)
✅ components/dashboard/layout/sidebar.tsx
✅ app/[lang]/(site)/change-password/page.tsx
```

### **مكونات مستخدمة:**
```
✅ components/shadcnUI/tabs.tsx
✅ components/shadcnUI/avatar.tsx
✅ components/shadcnUI/badge.tsx
✅ components/auth/ChangePasswordForm.tsx
```

---

## 🚀 **الخطوات التالية**

### **تحسينات مقترحة:**
1. **إضافة تعديل الملف الشخصي**: نموذج لتحديث المعلومات
2. **تحسين عرض الطلبات**: تفاصيل أكثر وفلترة
3. **إضافة الإشعارات**: تفضيلات الإشعارات
4. **تحسين الأمان**: إعدادات أمان إضافية

### **ميزات متقدمة:**
1. **تفعيل 2FA**: مصادقة ثنائية
2. **إدارة الجلسات**: عرض الأجهزة النشطة
3. **سجل الأنشطة**: تتبع تسجيلات الدخول
4. **تخصيص الواجهة**: إعدادات المظهر

---

## 📞 **الدعم والمساعدة**

### **للمطورين:**
- راجع الكود في `AccountPageClient.tsx` للفهم الكامل
- استخدم `ChangePasswordForm` كمرجع للمكونات القابلة للإعادة الاستخدام
- اتبع نمط Server/Client Components للصفحات الجديدة

### **للمستخدمين:**
- الوصول عبر `/account` أو من الداشبورد
- جميع الميزات متاحة في التبويبات الثلاثة
- دعم كامل للعربية والإنجليزية

**تاريخ التحديث**: 6 أكتوبر 2025  
**الإصدار**: 2.0.0  
**المطور**: Kiro AI Assistant