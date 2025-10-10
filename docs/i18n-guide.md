# دليل نظام الترجمة المحسّن
# Enhanced I18n System Guide

## 📋 نظرة عامة / Overview

تم تحسين نظام الترجمة في المشروع ليصبح أكثر قوة وسهولة في الاستخدام، مع دعم شامل للعربية والإنجليزية.

The i18n system has been enhanced to be more robust and user-friendly, with comprehensive Arabic and English support.

## 🏗️ البنية المحدثة / Updated Architecture

### الملفات الأساسية / Core Files
- `lib/i18n/i18n-config.ts` - التكوين الموحد / Unified configuration
- `lib/i18n/translations/ar.json` - الترجمات العربية / Arabic translations
- `lib/i18n/translations/en.json` - الترجمات الإنجليزية / English translations
- `hooks/use-translation.ts` - Hook المحسّن / Enhanced hook
- `hooks/use-validation.ts` - نظام التحقق المترجم / Translated validation system

### المكونات المساعدة / Helper Components
- `components/ui/translation-helpers.tsx` - مكونات مساعدة للترجمة

## 🚀 كيفية الاستخدام / How to Use

### 1. الترجمة الأساسية / Basic Translation

```typescript
import { useTranslation } from '@/hooks/use-translation'

function MyComponent() {
  const { t, locale, dir } = useTranslation()
  
  return (
    <div dir={dir}>
      <h1>{t('common.welcome')}</h1>
      <p>{t('products.description')}</p>
    </div>
  )
}
```

### 2. الترجمة مع المتغيرات / Translation with Interpolation

```typescript
function ValidationExample() {
  const { tWithInterpolation, getValidationError } = useTranslation()
  
  // ترجمة مع متغيرات
  const message = tWithInterpolation('errors.validation.minLength', { min: 6 })
  
  // رسالة تحقق محددة
  const validationError = getValidationError('minLength', { min: 6 })
  
  return <span className="text-red-500">{validationError}</span>
}
```

### 3. البيانات متعددة اللغات / Multilingual Data

```typescript
function ProductName({ product }) {
  const { getLocalizedField } = useTranslation()
  
  // للكائنات من قاعدة البيانات مع nameEn/nameAr
  return <h2>{getLocalizedField(product, 'name')}</h2>
}

function CategoryContent({ category }) {
  const { getLocalizedContent } = useTranslation()
  
  // للكائنات مع خصائص { en: "...", ar: "..." }
  const content = { en: "Electronics", ar: "إلكترونيات" }
  return <span>{getLocalizedContent(content)}</span>
}
```

### 4. تنسيق العملة والتاريخ / Currency and Date Formatting

```typescript
function PriceDisplay({ amount, date }) {
  const { formatCurrency, formatDate } = useTranslation()
  
  return (
    <div>
      <span>{formatCurrency(amount, 'USD')}</span>
      <time>{formatDate(date, { dateStyle: 'full' })}</time>
    </div>
  )
}
```

### 5. المكونات المساعدة / Helper Components

```typescript
import { 
  ErrorMessage, 
  SuccessMessage, 
  ValidationError,
  ConfirmDialog,
  Currency,
  LocalizedContent 
} from '@/components/ui/translation-helpers'

function FormExample() {
  return (
    <form>
      {/* رسالة خطأ تلقائية */}
      <ErrorMessage errorType="networkError" />
      
      {/* رسالة نجاح */}
      <SuccessMessage messageKey="saved" />
      
      {/* خطأ تحقق مع متغيرات */}
      <ValidationError 
        validationType="minLength" 
        variables={{ min: 6 }} 
      />
      
      {/* عملة مُنسقة */}
      <Currency amount={299.99} currency="USD" />
      
      {/* محتوى محلي */}
      <LocalizedContent 
        content={{ en: "Free Shipping", ar: "شحن مجاني" }} 
      />
    </form>
  )
}
```

### 6. نظام التحقق / Validation System

```typescript
import { useValidation } from '@/hooks/use-validation'

function LoginForm() {
  const { validateFields, rules } = useValidation()
  
  const validationRules = {
    email: rules.requiredEmail(),
    password: rules.password(),
    confirmPassword: rules.required()
  }
  
  const handleSubmit = (data) => {
    const errors = validateFields(data, validationRules)
    if (Object.keys(errors).length > 0) {
      // عرض الأخطاء - مترجمة تلقائياً
      setFormErrors(errors)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* الحقول مع عرض الأخطاء المترجمة */}
    </form>
  )
}
```

## 🎯 أنواع الرسائل المتاحة / Available Message Types

### الأخطاء / Errors
```typescript
const { getErrorMessage } = useTranslation()

// أخطاء عامة
getErrorMessage('generic')
getErrorMessage('networkError')
getErrorMessage('serverError')

// أخطاء التحقق
getValidationError('required')
getValidationError('invalidEmail')
getValidationError('minLength', { min: 6 })
```

### الإشعارات / Notifications
```typescript
const { getNotification } = useTranslation()

// نجاح
getNotification('success', 'saved')
getNotification('success', 'updated')

// معلومات
getNotification('info', 'loading')
getNotification('info', 'processing')

// تحذيرات
getNotification('warning', 'unsavedChanges')
getNotification('warning', 'lowStock')
```

### الحوارات / Dialogs
```typescript
const { getDialog } = useTranslation()

// تأكيدات
getDialog('confirm', 'delete')
getDialog('confirm', 'logout')

// عناوين
getDialog('titles', 'confirmation')
getDialog('titles', 'warning')

// أزرار
getDialog('buttons', 'ok')
getDialog('buttons', 'cancel')
```

## 🔧 إضافة ترجمات جديدة / Adding New Translations

### 1. تحديث ملفات JSON / Update JSON Files

**العربية** (`lib/i18n/translations/ar.json`):
```json
{
  "newFeature": {
    "title": "ميزة جديدة",
    "description": "وصف الميزة الجديدة",
    "actions": {
      "enable": "تفعيل",
      "disable": "إلغاء تفعيل"
    }
  }
}
```

**الإنجليزية** (`lib/i18n/translations/en.json`):
```json
{
  "newFeature": {
    "title": "New Feature",
    "description": "Description of the new feature",
    "actions": {
      "enable": "Enable",
      "disable": "Disable"
    }
  }
}
```

### 2. الاستخدام في المكونات / Usage in Components
```typescript
function NewFeature() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h2>{t('newFeature.title')}</h2>
      <p>{t('newFeature.description')}</p>
      <button>{t('newFeature.actions.enable')}</button>
    </div>
  )
}
```

## ⚡ أفضل الممارسات / Best Practices

### 1. استخدم النظام المركزي / Use Centralized System
```typescript
// ❌ تجنب الكائنات المُبرمجة مباشرة
const title = { en: "Welcome", ar: "مرحباً" }

// ✅ استخدم النظام المركزي
const title = t('common.welcome')
```

### 2. استخدم getLocalizedField للبيانات / Use getLocalizedField for Data
```typescript
// ❌ تجنب الوصول المباشر
const name = locale === 'ar' ? item.nameAr : item.nameEn

// ✅ استخدم الدالة المساعدة
const name = getLocalizedField(item, 'name')
```

### 3. استخدم المكونات المساعدة / Use Helper Components
```typescript
// ❌ تجنب التكرار
{error && <span className="text-red-500">{getValidationError(errorType)}</span>}

// ✅ استخدم المكون المساعد
<ValidationError validationType={errorType} />
```

## 🎨 دعم RTL / RTL Support

النظام يدعم RTL تلقائياً للعربية:

```typescript
function MyComponent() {
  const { isRTL, dir } = useTranslation()
  
  return (
    <div 
      dir={dir}
      className={cn("flex gap-4", {
        "flex-row-reverse": isRTL
      })}
    >
      <span>{t('content')}</span>
    </div>
  )
}
```

## 🔍 استكشاف الأخطاء / Troubleshooting

### مشاكل شائعة / Common Issues

1. **ترجمة مفقودة / Missing Translation**
   ```typescript
   // سيعرض المفتاح إذا لم توجد الترجمة
   const text = t('missing.key') // returns 'missing.key'
   ```

2. **خطأ في المسار / Path Error**
   ```typescript
   // تأكد من صحة المسار
   const text = t('common.save') // ✅
   const text = t('common/save') // ❌
   ```

3. **متغيرات غير مُعرّفة / Undefined Variables**
   ```typescript
   // تأكد من تمرير المتغيرات
   const text = tWithInterpolation('errors.validation.minLength', { min: 6 })
   ```

---

**تم إنشاؤه بواسطة:** نظام التطوير الذكي  
**آخر تحديث:** إصدار محسّن 2024

Created by: Smart Development System  
Last Updated: Enhanced Version 2024