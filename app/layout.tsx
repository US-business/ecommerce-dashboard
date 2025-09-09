import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { StoreInitializer } from "@/components/providers/store-initializer"

import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Multilingual e-commerce",
  generator: ''
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="rtl">
      <body className={cn(inter.className, "bg-linear-to-r from-teal-50 via-purple-100/50 to-cyan-50")}>
        <StoreInitializer>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </StoreInitializer>
      </body>
    </html>
  )
}
