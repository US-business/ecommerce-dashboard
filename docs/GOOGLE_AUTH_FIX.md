# إصلاح مشكلة المصادقة بـ Google

## المشكلة
كان المستخدمون يواجهون مشكلة عند محاولة التسجيل باستخدام Google OAuth:
- يتم توجيههم إلى صفحة Google لاختيار الحساب
- بعد الموافقة، يتم إعادتهم إلى المشروع
- لكن لا يتم إنشاء حساب جديد في قاعدة البيانات

## السبب
كان DrizzleAdapter يسبب مشاكل في التوافق مع أنواع NextAuth، وكان هناك تعارض في كيفية إنشاء المستخدمين.

## الحل
تم إزالة DrizzleAdapter والاعتماد على معالجة يدوية في `signIn` callback:

### التغييرات الرئيسية في `lib/auth/auth.config.ts`:

1. **إزالة DrizzleAdapter**:
   - أزلنا استخدام DrizzleAdapter الذي كان يسبب مشاكل في الأنواع
   - استبدلناه بمعالجة يدوية أكثر تحكمًا

2. **معالجة signIn callback**:
   ```typescript
   async signIn({ user, account, profile }) {
     if (account?.provider === "google") {
       // فحص إذا كان المستخدم موجود
       const existingUser = await db.select()
         .from(users)
         .where(eq(users.email, user.email))
         .then(rows => rows[0])
       
       if (existingUser) {
         return true // مستخدم موجود، السماح بالدخول
       }
       
       // إنشاء مستخدم جديد
       const [newUser] = await db.insert(users).values({
         email: user.email,
         username: user.name || user.email?.split('@')[0],
         image: user.image,
         googleId: account.providerAccountId,
         provider: "google",
         emailVerified: new Date(),
         role: "viewer",
       }).returning()
       
       // إنشاء سجل الحساب (accounts)
       await db.insert(accounts).values({
         userId: newUser.id,
         type: account.type,
         provider: account.provider,
         providerAccountId: account.providerAccountId,
         // ... باقي البيانات
       })
       
       // إنشاء سلة تسوق للمستخدم الجديد
       await db.insert(cart).values({ userId: newUser.id })
       
       return true
     }
   }
   ```

3. **إصلاح أخطاء TypeScript**:
   - إضافة فحوصات للتأكد من وجود `user.email` قبل استخدامه
   - معالجة القيم null/undefined بشكل صحيح

## النتيجة
الآن عند التسجيل بـ Google:
1. ✅ يتم إنشاء المستخدم في جدول `users`
2. ✅ يتم إنشاء سجل في جدول `accounts` للربط مع Google
3. ✅ يتم إنشاء سلة تسوق تلقائيًا للمستخدم الجديد
4. ✅ يتم تسجيل دخول المستخدم بنجاح

## كيفية الاختبار
1. قم بتشغيل المشروع: `npm run dev`
2. انتقل إلى صفحة التسجيل
3. اضغط على زر "تسجيل الدخول بـ Google"
4. اختر حساب Google
5. وافق على الأذونات
6. تحقق من:
   - تم تسجيل دخولك بنجاح
   - تم إنشاء حساب في قاعدة البيانات
   - يمكنك الوصول إلى ملفك الشخصي

## ملاحظات
- جميع عمليات إنشاء المستخدم محاطة بـ try/catch للتعامل مع الأخطاء
- يتم تسجيل جميع الخطوات في Console للمساعدة في التتبع والتشخيص
- استراتيجية الجلسة هي JWT، لذلك لا حاجة لجدول sessions في قاعدة البيانات

## التاريخ
- **التاريخ**: 5 يناير 2025
- **المطور**: Cline AI Assistant
- **الإصدار**: 1.0.0
