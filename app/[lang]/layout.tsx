import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { StoreInitializer } from "@/components/providers/store-initializer"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import { AuthStateManager } from "@/components/auth/AuthStateManager"
import { Toaster } from "@/components/ui/toaster"
import { i18n, type Locale } from "@/lib/i18n/i18n-config"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Multilingual e-commerce",
  generator: ''
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params
  const lang = resolvedParams.lang as Locale
  const dir = lang === "ar" ? "rtl" : "ltr"

  // Get server session for NextAuth
  const session = await getServerSession(authOptions) 

  return (
    <html lang={lang} dir={dir} className={dir === "rtl" ? "rtl" : "ltr"}> 
      <body className={cn(`${inter.className} bg-linear-to-r from-teal-50 via-purple-100/50 to-cyan-50`)}>
        <AuthSessionProvider session={session}>
          <AuthStateManager>
            <StoreInitializer locale={lang}>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
              <Toaster />
            </StoreInitializer>
          </AuthStateManager>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
