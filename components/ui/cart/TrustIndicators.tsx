import { cn } from '@/lib/utils'
import { CreditCard, Shield, Truck } from 'lucide-react'
import React from 'react'

type TrustIndicatorsProps = {
   dir: string
   dictionary?: any
}

const TrustIndicators = ({ dir, dictionary }: TrustIndicatorsProps) => {

   return (
      <>
         {/* Trust Indicators */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
               className={cn(
                  "flex items-center space-x-3 p-4 bg-white rounded-lg",
               )}
            >
               <Shield className="w-8 h-8 text-green-600" />
               <div>
                  <p className="font-medium text-sm">{dictionary?.cart?.securePayment || "Secure Payment"}</p>
                  <p className="text-xs text-gray-600">
                     {dictionary?.cart?.sslProtection || "256-bit SSL protection"}
                  </p>
               </div>
            </div>
            <div
               className={cn(
                  "flex items-center space-x-3 p-4 bg-white rounded-lg",
               )}
            >
               <Truck className="w-8 h-8 text-blue-600" />
               <div>
                  <p className="font-medium text-sm">{dictionary?.cart?.fastShipping || "Fast Shipping"}</p>
                  <p className="text-xs text-gray-600">{dictionary?.cart?.deliveryTime || "1-3 day delivery"}</p>
               </div>
            </div>
            <div
               className={cn(
                  "flex items-center space-x-3 p-4 bg-white rounded-lg",
               )}
            >
               <CreditCard className="w-8 h-8 text-purple-600" />
               <div>
                  <p className="font-medium text-sm">{dictionary?.cart?.multiplePayment || "Multiple Payment"}</p>
                  <p className="text-xs text-gray-600">
                     {dictionary?.cart?.paymentOptions || "Visa, MC, PayPal"}
                  </p>
               </div>
            </div>
         </div>
      </>
   )
}

export default TrustIndicators