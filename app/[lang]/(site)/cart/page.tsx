import { getCartFull } from "@/lib/actions/cart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/shadcnUI/breadcrumb"
import BackLink from "@/components/ui/BackLink"
import { type CartItem } from "@/lib/stores/cart-store"
import CartItems from "@/components/ui/cart/CartItems"
import { cookies } from "next/headers"
import { getNextAuthUser } from "@/lib/auth/guards"
import TrustIndicators from "@/components/ui/cart/TrustIndicators"
import OrderSummary from "@/components/ui/cart/OrderSummary"
import { getAllCoupons } from "@/lib/actions/coupons"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"


export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const lang = resolvedParams.lang as Locale

  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value as Locale || lang || "ar"; // default ar
  const dir = locale === "ar" ? "rtl" : "ltr";
  const dictionary = await getDictionary(locale);

  const user = await getNextAuthUser()
  const couponsResult = await getAllCoupons()
  const cart = user?.id ? await getCartFull(user.id) : null


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{dictionary.cart.loginRequired}</p>
      </div>
    )
  }
  // const result = await getCartFull(user.id)
  // console.log('user', user)
  // console.log(' result:', result)
  // console.log('cart', cart)
  // console.log('Cart coupon:', cart?.success && cart.data ? cart.data.coupon : 'No coupon')
  // console.log('Coupons from DB:', couponsResult.data)
  // Load cart data from server on mount

  // let items: CartItem[] = []
  // try {
  //   if (result.success && result.data && Array.isArray(result.data.items) && result.data.items.length > 0) {
  //     items = result.data.items.map((item: any): CartItem => ({
  //       id: Number(item.id),
  //       productId: Number(item.productId),
  //       quantity: Number(item.quantity),
  //       product: {
  //         id: Number(item.product?.id),
  //         nameEn: String(item.product?.nameEn ?? ""),
  //         nameAr: String(item.product?.nameAr ?? ""),
  //         price: item.product?.price != null ? String(item.product.price) : null,
  //         images: Array.isArray(item.product?.images) ? item.product.images : [],
  //         quantityInStock: Number(item.product?.quantityInStock ?? 0),
  //         discountType: (item.product?.discountType as 'fixed' | 'percentage' | 'none') ?? 'none',
  //         discountValue: item.product?.discountValue != null ? String(item.product.discountValue) : null,
  //       },
  //       coupon: item.coupon,
  //     }))
  //     // console.log(items);

  //   }
  // } catch (error) {
  //   console.error('Error loading cart:', error)
  // }



  if (cart?.success && cart?.data?.items.length === 0) {
    return (
      <>
        {/* Hydrate client cart store to clear any stale items in dropdown */}
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {dictionary.cart.emptyCart}
            </h1>
            <p className="text-gray-600">
              {dictionary.cart.emptyCartDescription}
            </p>
            <BackLink dir={dir} className="my-4" href="/" text={dictionary.cart.startShopping} />
          </div>
        </div>
      </>
    )
  }




  return (
    <>
      {/* Hydrate client cart store so dropdown matches server cart */}
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{dictionary.common.home}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{dictionary.cart.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                    <span>
                      {dictionary.cart.title} ({cart?.data?.items.length}{" "}
                      {dictionary.cart.items})
                    </span>
                    <BackLink dir={dir} className="my-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user?.id && <CartItems dir={dir} cart={cart} user={{ id: user.id }} dictionary={dictionary} />}
                </CardContent>
              </Card>
              <p className="text-sm text-sky-700 text-center my-4 bg-sky-50 p-1 rounded border-sky-500 border">
                {dictionary.cart.pricesIncludeVAT}
              </p>
              <TrustIndicators dir={dir} dictionary={dictionary} />
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <OrderSummary
                dir={dir}
                cart={cart}
                couponsDB={couponsResult.data}
                currentCoupon={cart?.success && cart?.data ? cart?.data?.coupon : null}
                cartId={cart?.success && cart.data ? cart.data.id : 0}
                dictionary={dictionary}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
