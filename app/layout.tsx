import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { Navbar } from "@/components/layout/Navbar"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { StoreInitializer } from "@/components/providers/store-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Commerce Dashboard",
  description: "Multilingual e-commerce admin dashboard",
  generator: 'v0dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-[3200px]`}>
        <ErrorBoundary>
          {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > */}
            <StoreInitializer>
              <Navbar />
              {children}
            </StoreInitializer>
          {/* </ThemeProvider> */}
        </ErrorBoundary>
      </body>
    </html>
  )
}
