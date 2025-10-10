# Cart Page Internationalization Plan

## Problem
The cart page (`app/[lang]/(site)/cart/page.tsx`) and its components currently use hardcoded strings with conditional rendering based on `dir === "rtl"`. This approach is not using the project's i18n system properly, leading to maintenance issues and potential inconsistencies.

## Current Issues
- Hardcoded strings in cart page: login message, empty cart messages, breadcrumbs, VAT notice
- Hardcoded strings in CartItems component: "Out of Stock"
- Hardcoded strings in OrderSummary component: order summary labels, payment methods notice, out-of-stock warning
- Hardcoded strings in TrustIndicators component: security, shipping, payment method labels
- Incorrect plural handling: uses "عنصر" (singular) instead of "عناصر" (plural) for items

## Solution Overview
Implement proper internationalization by:
1. Adding missing translation keys to `lib/i18n/translations/en.json` and `lib/i18n/translations/ar.json`
2. Modifying server-side code to use `getDictionary`
3. Updating client components to use `useTranslation` hook
4. Ensuring grammatical accuracy and appropriate terminology

## Detailed Implementation Steps

### 1. Add Missing Translation Keys

#### English (en.json) - Add to cart section:
```json
"cart": {
  "title": "Shopping Cart",
  "emptyCart": "Your cart is empty",
  "emptyCartDescription": "Looks like you haven't added any items to your cart yet",
  "startShopping": "Start Shopping",
  "loginRequired": "Please login to view your cart",
  "items": "items",
  "pricesIncludeVAT": "Prices include VAT",
  "orderSummary": "Order Summary",
  "acceptedPaymentMethods": "Accepted Payment Methods",
  "removeOutOfStockItems": "Please remove out-of-stock items to continue",
  "outOfStock": "Out of Stock",
  "securePayment": "Secure Payment",
  "sslProtection": "256-bit SSL protection",
  "fastShipping": "Fast Shipping",
  "deliveryTime": "1-3 day delivery",
  "multiplePayment": "Multiple Payment",
  "paymentOptions": "Visa, MC, PayPal"
}
```

#### Arabic (ar.json) - Add to cart section:
```json
"cart": {
  "title": "سلة التسوق",
  "emptyCart": "سلة التسوق فارغة",
  "emptyCartDescription": "يبدو أنك لم تضف أي منتجات إلى سلة التسوق بعد",
  "startShopping": "تسوق الآن",
  "loginRequired": "يرجى تسجيل الدخول لعرض السلة",
  "items": "عناصر",
  "pricesIncludeVAT": "الأسعار تشمل ضريبة القيمة المضافة",
  "orderSummary": "ملخص الطلب",
  "acceptedPaymentMethods": "طرق الدفع المقبولة",
  "removeOutOfStockItems": "يرجى إزالة العناصر غير المتوفرة للمتابعة",
  "outOfStock": "غير متوفر",
  "securePayment": "دفع آمن",
  "sslProtection": "حماية SSL 256-bit",
  "fastShipping": "شحن سريع",
  "deliveryTime": "توصيل في 1-3 أيام",
  "multiplePayment": "طرق دفع متعددة",
  "paymentOptions": "فيزا، ماستركارد، باي بال"
}
```

### 2. Modify Cart Page (Server Component)
- Import `getDictionary` from `@/lib/i18n/get-dictionary`
- Use `await getDictionary(locale)` to get translations
- Replace all hardcoded dir checks with translation lookups
- Pass translations or locale to client components if needed

### 3. Update Client Components
- Replace `dir` prop with `useTranslation` hook usage
- Use `t()` function for all text strings
- Ensure components work with both languages properly

### 4. Ensure RTL/LTR Layout
- Keep `dir` prop for layout purposes where needed
- Use CSS classes and conditional rendering for RTL-specific adjustments

### 5. Testing
- Test both English and Arabic versions
- Verify plural handling works correctly
- Check that all strings are properly translated
- Ensure no broken layouts or missing translations

## Benefits
- Consistent terminology across the application
- Easier maintenance and updates
- Proper localization support
- Grammatically correct translations
- Better user experience in both languages

## Files to Modify
1. `lib/i18n/translations/en.json`
2. `lib/i18n/translations/ar.json`
3. `app/[lang]/(site)/cart/page.tsx`
4. `components/ui/cart/CartItems.tsx`
5. `components/ui/cart/OrderSummary.tsx`
6. `components/ui/cart/TrustIndicators.tsx`