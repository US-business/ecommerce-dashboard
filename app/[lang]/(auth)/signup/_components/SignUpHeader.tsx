"use client"

import { UserCheck } from "lucide-react"

interface SignUpHeaderProps {
  dir: "ltr" | "rtl"
}

export function SignUpHeader({ dir }: SignUpHeaderProps) {
  return (
    <div className="text-center">
      <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
        <UserCheck className="h-6 w-6 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900">
        {dir === "rtl" ? "إنشاء حساب جديد" : "Create New Account"}
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        {dir === "rtl" 
          ? "انضم إلينا اليوم واستمتع بتجربة تسوق رائعة" 
          : "Join us today and enjoy a great shopping experience"
        }
      </p>
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          {dir === "rtl" 
            ? "سيتم إنشاء حساب كمستخدم عادي. يمكن للمديرين إنشاء حسابات إدارية من لوحة التحكم." 
            : "Your account will be created as a regular user. Admin accounts can be created from the dashboard."
          }
        </p>
      </div>
    </div>
  )
}
