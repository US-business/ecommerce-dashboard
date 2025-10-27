import { cookies } from 'next/headers'
import { getCartFull } from '@/lib/actions/cart'
import CheckoutContent from '@/app/[lang]/(site)/checkout/_components/CheckoutContent'
import { getNextAuthUser } from '@/lib/auth/guards'
import { getAllCoupons } from '@/lib/actions/coupons'


export default async function CheckoutPage() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('preferred-locale')?.value || 'ar'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  const user = await getNextAuthUser()
  if (!user || !user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{dir === 'rtl' ? 'يرجى تسجيل الدخول لإتمام الشراء' : 'Please login to proceed to checkout'}</p>
      </div>
    )
  }

  const cart = await getCartFull(user.id)
  const couponsResult = await getAllCoupons()
  if (!cart || cart.data?.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{dir === 'rtl' ? 'لا يوجد منتجات في السلة' : 'No products in cart'}</p>
      </div>
    )
  }

  // Define the database cart item type




  // Map NextAuth user to application User type
  const appUser = {
    id: user.id!, // TypeScript knows this exists due to the guard above
    email: user.email,
    username: user.username ?? null,
    role: user.role ?? "viewer",
    image: user.image ?? null,
  }

  return (
    <CheckoutContent 
      dir={dir} 
      cart={cart} 
      user={appUser}
      couponsDB={couponsResult.data}
      currentCoupon={cart?.success && cart?.data ? cart?.data?.coupon : null}
      cartId={cart?.success && cart.data ? cart.data.id : 0}
    />
  )
}