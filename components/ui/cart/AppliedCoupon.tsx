
import { Button } from '@/components/shadcnUI/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcnUI/card'
import { Input } from '@/components/shadcnUI/input'
import { Coupon, useCouponsStore } from '@/lib/stores/coupons-store'
import { cn } from '@/lib/utils'
import { Check, Tag } from 'lucide-react'
import React, { useState } from 'react'
import { applyCouponAction, removeCouponAction } from '@/lib/actions/cart'

type AppliedCouponProps = {
    coupons: Coupon[]
    dir: string
    cartId: number
    currentCoupon?: Coupon | null
}

const AppliedCoupon = ({ coupons, dir, cartId, currentCoupon }: AppliedCouponProps) => {

    const [couponCode, setCouponCode] = useState("")
    const [couponError, setCouponError] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(currentCoupon || null)
    const { addCoupon, removeCoupon } = useCouponsStore()

    // Update local state when currentCoupon changes
    React.useEffect(() => {
        setAppliedCoupon(currentCoupon || null)
        if (currentCoupon) {
            setCouponCode(currentCoupon.code)
        }
    }, [currentCoupon])

    if (coupons?.length === 0) return null
    
    const applyCouponHandler = async () => {
        const foundCoupon: Coupon | undefined = coupons?.find((coupon: Coupon) => coupon.code === couponCode.toUpperCase())
        setCouponError("")
        console.log(foundCoupon);
        
        if (!foundCoupon || !foundCoupon.isActive) {
            setCouponError(dir === "rtl" ? "كود الخصم غير صحيح أو غير مفعل" : "Invalid or inactive coupon code")
            return
        }

        const result = await applyCouponAction(cartId, couponCode.toUpperCase())

        if (result.success) {
            setAppliedCoupon(foundCoupon)
            addCoupon(foundCoupon)
            // Refresh the page to show updated cart with coupon
            window.location.reload()
        } else {
            setCouponError(!result || (dir === "rtl" ? "فشل في تطبيق كود الخصم" : "Failed to apply coupon"))
        }
    }

    const removeCouponHandler = async () => {
        const result = await removeCouponAction(cartId)
        if (result.success) {
            setAppliedCoupon(null)
            setCouponCode("")
            if (appliedCoupon) {
                removeCoupon(appliedCoupon.id)
            }
            // Refresh the page to show updated cart without coupon
            window.location.reload()
        }
    }
    return (
        <>
            {/* Coupon Code */}
            <Card>
                <CardHeader>
                    <CardTitle className={cn("flex items-center", dir === "rtl" && "flex-row-reverse")}>
                        <Tag className={cn("w-5 h-5", dir === "rtl" ? "ml-2" : "mr-2")} />
                        {dir === "rtl" ? "كود الخصم" : "Coupon Code"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 p-0">
                    {appliedCoupon ? (
                        <div
                            className={cn(
                                "flex items-center justify-between bg-green-50 rounded-md p-2",
                                dir === "rtl" && "flex-row-reverse",
                            )}
                        >
                            <div className={cn("flex items-center space-x-2", dir === "rtl" && "space-x-reverse")}>
                                <Check className={cn("w-4 h-4 text-green-600", dir === "rtl" ? "ml-2" : "mr-2")} />
                                <span className="font-medium text-green-800 text-sm">
                                    {appliedCoupon.code} (
                                    -
                                    {appliedCoupon?.discountType === 'percentage'
                                        ? `${appliedCoupon?.discountValue}%`
                                        : `EGP ${Number(appliedCoupon?.discountValue ?? 0).toFixed(2)} `}
                                    )
                                </span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={removeCouponHandler} className="text-green-600">
                                {dir === "rtl" ? "إزالة" : "Remove"}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className={cn("flex items-center gap-2", dir === "rtl" && "")}>
                                <Input
                                    placeholder={dir === "rtl" ? "أدخل كود الخصم" : "Enter coupon code"}
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={applyCouponHandler} disabled={!couponCode.trim()}>
                                    {dir === "rtl" ? "تطبيق" : "Apply"}
                                </Button>
                            </div>
                            {couponError && <p className="text-sm text-red-600">{couponError}</p>}
                            <p className="text-xs text-gray-600">
                                {dir === "rtl" ? "اكتب كود الخصم بأحرف كبيرة" : "Write coupon code in uppercase"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default AppliedCoupon