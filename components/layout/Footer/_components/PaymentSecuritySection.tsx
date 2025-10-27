"use client"

import { Shield, CreditCard, Award, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

type PaymentMethod = {
  name: string
  color: string
}

interface PaymentSecuritySectionProps {
  dir: string
  lang?: string
  className?: string
}

export function PaymentSecuritySection({ dir, lang = 'en', className = '' }: PaymentSecuritySectionProps) {
  const paymentMethods: PaymentMethod[] = [
    { name: "VISA", color: "bg-blue-600" },
    { name: "MC", color: "bg-red-600" },
    { name: "AMEX", color: "bg-blue-500" },
    { name: "PP", color: "bg-blue-700" }
  ]

  return (
    <div className={cn(
      "flex flex-col md:flex-row justify-between items-center gap-6",
      className
    )}>
      {/* Payment Methods */}
      <div className={cn(
        "flex flex-wrap items-center gap-4",
      )}>
        <span className="text-muted-foreground text-sm font-medium">
          {dir === 'rtl' ? "طرق الدفع :" : "Payment methods :"}
        </span>
        <div className={cn(
          "flex gap-2",
        )}>
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className={cn(
                "w-12 h-8 rounded-md text-white text-xs flex items-center justify-center font-bold shadow-sm border border-border",
                method.color
              )}
            >
              {method.name}
            </div>
          ))}
        </div>
      </div>

      {/* Security Badges */}
      <div className={cn(
        "flex flex-wrap items-center gap-5",
      )}>
        <div className={cn(
          "flex items-center gap-2 text-muted-foreground",
        )}>
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-xs font-medium">SSL {dir === 'rtl' ? "آمن" : "Secure"}</span>
        </div>
        <div className={cn(
          "flex items-center gap-2 text-muted-foreground",
        )}>
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs font-medium">PCI {dir === 'rtl' ? "متوافق" : "Compliant"}</span>
        </div>
        <div className={cn(
          "flex items-center gap-2 text-muted-foreground",
        )}>
          <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-xs font-medium">{dir === 'rtl' ? "موثوق" : "Trusted"}</span>
        </div>
      </div>
    </div>
  )
}

export default PaymentSecuritySection