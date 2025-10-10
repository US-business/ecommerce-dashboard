"use client"
import { placeOrderFromCheckout } from '@/lib/actions/orders'
import { cn } from '@/lib/utils'
import { CreditCard, Truck, Zap, Mail, Phone, User, MapPin, Building, Package } from 'lucide-react'
import { useCartStore, type CartItem } from "@/lib/stores/cart-store"
import { useCouponsStore } from '@/lib/stores'
import { Separator } from '@/components/shadcnUI/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcnUI/card'
import { Input } from '@/components/shadcnUI/input'
import { Label } from '@/components/shadcnUI/label'
import { Button } from '@/components/shadcnUI/button'
import { RadioGroup, RadioGroupItem } from '@/components/shadcnUI/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcnUI/select'
import { Badge } from '@/components/shadcnUI/badge'
import { Alert, AlertDescription } from '@/components/shadcnUI/alert'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as UserProps from "@/types/user"


export type CheckoutItem = {
    id: number
    productId: number
    name: string
    nameAr: string
    price: number
    quantity: number
    image: string
}



type CartResponse = {
    success: boolean;
    data: {
        items: CartItem[];
        coupon?: any;
    } | null;
};

// type User = {
//     id: number;

// };

type Dir = 'rtl' | 'ltr';

export default function CheckoutContent({
    dir,
    cart,
    user
}: {
    dir: Dir;
    cart: any | null;
    user: UserProps.User | null;
}) {

    const { coupons } = useCouponsStore()
    const { getTotalPrice } = useCartStore()
    const { items, setItems } = useCartStore()
    const [shippingMethod, setShippingMethod] = useState<'contact' | 'express'>('contact');
   const router = useRouter();


    const appliedCoupon = cart?.data?.coupon

    const subtotal = getTotalPrice()

    const couponDiscount = appliedCoupon
        ? appliedCoupon.discountType === 'percentage'
            ? (subtotal * Number(appliedCoupon?.discountValue)) / 100
            : Math.min(Number(appliedCoupon.discountValue), subtotal)
        : 0

    const taxableAmount = Math.max(subtotal - couponDiscount, 0)

    // const shipping = shippingMethod === 'basic'
    //     ? (taxableAmount > 50 ? 0 : 9.99)
    //     : 100;
    const shipping = shippingMethod === 'express'
        ? 200
        : 0;
    const total = taxableAmount + shipping

    useEffect(() => {
        if (cart?.success && Array.isArray(cart?.data?.items)) {
            const mapped: CartItem[] = (cart.data?.items ?? []).map((item: any): CartItem => ({
                id: Number(item.id),
                productId: Number(item.productId),
                quantity: Number(item.quantity),
                product: {
                    id: Number(item.product?.id),
                    nameEn: String(item.product?.nameEn ?? ""),
                    nameAr: String(item.product?.nameAr ?? ""),
                    price: item.product?.price != null ? String(item.product.price) : null,
                    images: Array.isArray(item.product?.images) ? item.product.images : [],
                    quantityInStock: Number(item.product?.quantityInStock ?? 0),
                    discountType: (item.product?.discountType as 'fixed' | 'percentage' | 'none') ?? 'none',
                    discountValue: item.product?.discountValue != null ? String(item.product.discountValue) : null,
                },
                coupon: item.coupon,
            }))
            setItems(mapped)
        } else {
            // No server cart; ensure local store is cleared to avoid stale items
            setItems([])
        }
    }, [user?.id, cart?.success, cart?.data?.items, setItems])



    const handleSubmit = async (formData: FormData) => {
        const form = await placeOrderFromCheckout({
            userId: user?.id,
            cartItemsData: items, // cart items هنا
            subtotal,
            discountAmount: couponDiscount,
            couponId: appliedCoupon?.id ?? null,
        },
            formData
        )
        if(form.success) {
            router.push('/order-success')
        }
    }


    return (
        <form action={handleSubmit}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{dir === 'rtl' ? 'إتمام الطلب' : 'Checkout'}</h1>
                        <p className="text-gray-600 text-lg">{dir === 'rtl' ? 'أكمل بياناتك لإنهاء عملية الشراء' : 'Complete your details to finish your purchase'}</p>
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
                        {/* Main Form */}
                        <div className="lg:col-span-7">
                            <div className="space-y-6">
                                {/* Contact Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">1</span>
                                            </div>
                                            <Mail className="w-5 h-5 text-primary" />
                                            {dir === 'rtl' ? 'معلومات التواصل' : 'Contact Information'}
                                        </CardTitle>
                                        <CardDescription>
                                            {dir === 'rtl' ? 'أدخل بياناتك للتواصل معك' : 'Enter your contact details'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="sm:col-span-2">
                                                <Label htmlFor="email" className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {dir === 'rtl' ? 'البريد الإلكتروني *' : 'Email *'}
                                                </Label>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    required
                                                    placeholder={dir === 'rtl' ? 'example@email.com' : 'example@email.com'}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label htmlFor="phone" className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {dir === 'rtl' ? 'رقم الهاتف *' : 'Phone *'}
                                                </Label>
                                                <Input
                                                    type="tel"
                                                    name="phone"
                                                    id="phone"
                                                    required
                                                    placeholder={dir === 'rtl' ? '+20 1234567890' : '+20 1234567890'}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Shipping Address */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">2</span>
                                            </div>
                                            <MapPin className="w-5 h-5 text-primary" />
                                            {dir === 'rtl' ? 'عنوان التوصيل' : 'Shipping Address'}
                                        </CardTitle>
                                        <CardDescription>
                                            {dir === 'rtl' ? 'أدخل عنوان التوصيل الخاص بك' : 'Enter your delivery address'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="firstName" className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    {dir === 'rtl' ? 'الاسم الأول *' : 'First name *'}
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    required
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">
                                                    {dir === 'rtl' ? 'الاسم الأخير *' : 'Last name *'}
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    required
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label htmlFor="address" className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    {dir === 'rtl' ? 'العنوان *' : 'Address *'}
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    required
                                                    placeholder={dir === 'rtl' ? 'الشارع والمنطقة' : 'Street and area'}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label htmlFor="apartment" className="flex items-center gap-2">
                                                    <Building className="w-4 h-4" />
                                                    {dir === 'rtl' ? 'الشقة / المكتب (اختياري)' : 'Apartment / Office (optional)'}
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="apartment"
                                                    id="apartment"
                                                    placeholder={dir === 'rtl' ? 'رقم الشقة أو المكتب' : 'Apartment or office number'}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="city">
                                                    {dir === 'rtl' ? 'المدينة *' : 'City *'}
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="city"
                                                    id="city"
                                                    required
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="governorate">
                                                    {dir === 'rtl' ? 'المحافظة *' : 'Governorate *'}
                                                </Label>
                                                <Select name="governorate" required>
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder={dir === 'rtl' ? 'اختر المحافظة' : 'Choose governorate'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="القاهرة">القاهرة</SelectItem>
                                                        <SelectItem value="الإسكندرية">الإسكندرية</SelectItem>
                                                        <SelectItem value="الجيزة">الجيزة</SelectItem>
                                                        <SelectItem value="الدقهلية">الدقهلية</SelectItem>
                                                        <SelectItem value="الشرقية">الشرقية</SelectItem>
                                                        <SelectItem value="المنوفية">المنوفية</SelectItem>
                                                        <SelectItem value="القليوبية">القليوبية</SelectItem>
                                                        <SelectItem value="البحيرة">البحيرة</SelectItem>
                                                        <SelectItem value="الغربية">الغربية</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label htmlFor="postalCode">
                                                    {dir === 'rtl' ? 'الرمز البريدي (اختياري)' : 'Postal code (optional)'}
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="postalCode"
                                                    id="postalCode"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Shipping Method */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">3</span>
                                            </div>
                                            <Truck className="w-5 h-5 text-primary" />
                                            {dir === 'rtl' ? 'طريقة التوصيل' : 'Shipping Method'}
                                        </CardTitle>
                                        <CardDescription>
                                            {dir === 'rtl' ? 'اختر طريقة التوصيل المناسبة' : 'Choose your preferred shipping method'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup
                                            value={shippingMethod}
                                            onValueChange={(value: 'contact' | 'express') => setShippingMethod(value)}
                                            className="space-y-4"
                                        >
                                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                                <RadioGroupItem value="contact" id="contact-shipping" />
                                                <label htmlFor="contact-shipping" className="flex-1 cursor-pointer">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <Truck className="w-4 h-4 text-gray-500" />
                                                                <span className="font-medium">
                                                                    {dir === 'rtl' ? 'التواصل مع العميل وتحديد تكلفة الشحن' : 'Contact customer to set shipping cost'}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500">
                                                                {dir === 'rtl' ? 'سيتم تحديد المدة والتكلفة بعد التواصل' : 'Time and cost determined after contact'}
                                                            </p>
                                                        </div>
                                                        <Badge variant="secondary">
                                                            {dir === 'rtl' ? 'لاحقًا' : 'TBD'}
                                                        </Badge>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                                <RadioGroupItem value="express" id="express-shipping" />
                                                <label htmlFor="express-shipping" className="flex-1 cursor-pointer">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <Zap className="w-4 h-4 text-yellow-500" />
                                                                <span className="font-medium">
                                                                    {dir === 'rtl' ? 'توصيل سريع' : 'Express Shipping'}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500">
                                                                {dir === 'rtl' ? '1-2 أيام عمل' : '1-2 business days'}
                                                            </p>
                                                        </div>
                                                        <Badge variant="outline" className="font-semibold">
                                                            200 {dir === 'rtl' ? 'ج.م' : 'EGP'}
                                                        </Badge>
                                                    </div>
                                                </label>
                                            </div>
                                        </RadioGroup>
                                    </CardContent>
                                </Card>

                                {/* Payment Method */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">4</span>
                                            </div>
                                            <CreditCard className="w-5 h-5 text-primary" />
                                            {dir === 'rtl' ? 'طريقة الدفع' : 'Payment Method'}
                                        </CardTitle>
                                        <CardDescription>
                                            {dir === 'rtl' ? 'اختر طريقة الدفع المفضلة' : 'Choose your preferred payment method'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup defaultValue="cash" className="space-y-4">
                                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                                <RadioGroupItem value="cash" id="cash-payment" />
                                                <input type="hidden" name="paymentMethod" value="cash" />
                                                <label htmlFor="cash-payment" className="flex items-center gap-3 cursor-pointer">
                                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <span className="text-green-600 text-lg font-bold">$</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {dir === 'rtl' ? 'الدفع عند الاستلام' : 'Cash on delivery'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {dir === 'rtl' ? 'ادفع عند وصول الطلب' : 'Pay when your order arrives'}
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors opacity-50">
                                                <RadioGroupItem value="card" id="card-payment" disabled />
                                                <label htmlFor="card-payment" className="flex items-center gap-3 cursor-not-allowed">
                                                    <CreditCard className="w-10 h-10 text-blue-600" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {dir === 'rtl' ? 'بطاقة ائتمانية / خصم مباشر' : 'Credit / Debit card'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {dir === 'rtl' ? 'قريبًا' : 'Coming soon'}
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </RadioGroup>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-10 lg:mt-0 lg:col-span-5">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-primary" />
                                        {dir === 'rtl' ? 'ملخص الطلب' : 'Order Summary'}
                                    </CardTitle>
                                    <CardDescription>
                                        {dir === 'rtl' ? 'مراجعة العناصر والأسعار' : 'Review your items and pricing'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Items List */}
                                    <div className="space-y-4 max-h-64 overflow-y-auto">
                                        {items.map((item: CartItem) => {
                                            const itemPrice = Number(item.product.price)
                                            const discountValue = Number(item.product.discountValue || 0)
                                            let finalPrice = itemPrice || 0

                                            // Apply discount
                                            if (item.product.discountType === 'percentage') {
                                                finalPrice = itemPrice - (itemPrice * discountValue) / 100
                                            } else if (item.product.discountType === 'fixed') {
                                                finalPrice = itemPrice - discountValue
                                            }
                                            finalPrice = Math.max(0, finalPrice)

                                            return (
                                                <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-lg overflow-hidden">
                                                        <Image
                                                            src={item.product?.images[0] ?? '/placeholder.jpg'}
                                                            alt={item.product?.nameEn ?? 'product'}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-center object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-gray-900 truncate text-sm">
                                                            {dir === "rtl" ? item.product.nameAr : item.product.nameEn}
                                                        </h3>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <Badge variant="secondary" className="text-xs">
                                                                x{item.quantity}
                                                            </Badge>
                                                            <span className="font-bold text-primary text-sm">
                                                                EGP {finalPrice.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <Separator />

                                    {/* Price Breakdown */}
                                    <div className="space-y-3">
                                        <div className={cn("flex justify-between text-sm", dir === "rtl" && "flex-row-reverse")}>
                                            <span className="text-gray-600">{dir === "rtl" ? "المجموع الفرعي" : "Subtotal"}</span>
                                            <span className="font-medium">EGP {subtotal.toFixed(2)}</span>
                                        </div>

                                        {appliedCoupon && (
                                            <div className={cn("flex justify-between text-sm text-green-600", dir === "rtl" && "flex-row-reverse")}>
                                                <span className="flex items-center gap-1">
                                                    {dir === "rtl" ? "خصم" : "Discount"}
                                                    <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                                        {appliedCoupon.code}
                                                    </Badge>
                                                </span>
                                                <span className="font-medium">-EGP {couponDiscount.toFixed(2)}</span>
                                            </div>
                                        )}

                                        <div className={cn("flex justify-between text-sm", dir === "rtl" && "flex-row-reverse")}>
                                            <span className="text-gray-600 flex items-center gap-1">
                                                <Truck className="w-4 h-4" />
                                                {dir === "rtl" ? "الشحن" : "Shipping"}
                                            </span>
                                            <span className="font-medium">
                                                {shippingMethod === 'contact'
                                                    ? <Badge variant="secondary">{dir === 'rtl' ? 'سيحدد لاحقًا' : 'TBD'}</Badge>
                                                    : `EGP ${shipping.toFixed(2)}`
                                                }
                                            </span>
                                        </div>

                                        <Separator />

                                        <div className={cn("flex justify-between text-lg font-bold", dir === "rtl" && "flex-row-reverse")}>
                                            <span>{dir === "rtl" ? "المجموع" : "Total"}</span>
                                            <span className="text-primary">EGP {total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Out of Stock Alert */}
                                    {items.some((item) => item.product.quantityInStock <= 0) && (
                                        <Alert className="border-red-200 bg-red-50">
                                            <AlertDescription className="text-red-600 text-sm text-center">
                                                {dir === "rtl"
                                                    ? "يرجى إزالة العناصر غير المتوفرة للمتابعة"
                                                    : "Please remove out-of-stock items to continue"}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Hidden Inputs */}
                                    <input type="hidden" name="selectedShippingMethod" value={shippingMethod} />
                                    <input type="hidden" name="appliedCouponCode" value={appliedCoupon?.code ?? ''} />
                                    <input type="hidden" name="calculatedTotal" value={total.toFixed(2)} />

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base font-medium"
                                        disabled={items.some((item) => item.product.quantityInStock <= 0)}
                                    >
                                        <Package className="w-4 h-4 mr-2" />
                                        {dir === 'rtl' ? 'إتمام الطلب' : 'Place Order'}
                                    </Button>

                                    {/* Security Notice */}
                                    <div className="text-center pt-2">
                                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                            🔒 {dir === 'rtl' ? 'جميع بياناتك محمية ومشفرة' : 'Your data is protected and encrypted'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
