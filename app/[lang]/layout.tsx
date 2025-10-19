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
import { env } from "@/lib/config/env"

const inter = Inter({ subsets: ["latin"] })

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: 'E-Commerce Store | متجر إلكتروني',
    template: '%s | E-Commerce Store'
  },
  description: 'Modern e-commerce platform with multilingual support (Arabic & English). Shop the best products with secure checkout and fast delivery. متجر إلكتروني حديث يدعم العربية والإنجليزية.',
  keywords: ['e-commerce', 'online store', 'shopping', 'متجر إلكتروني', 'تسوق أونلاين', 'products', 'منتجات'],
  authors: [{ name: 'E-Commerce Team' }],
  creator: 'E-Commerce Team',
  publisher: 'E-Commerce Store',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_SA'],
    url: env.NEXT_PUBLIC_APP_URL,
    siteName: 'E-Commerce Store',
    title: 'E-Commerce Store | متجر إلكتروني',
    description: 'Modern e-commerce platform with multilingual support',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'E-Commerce Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Commerce Store | متجر إلكتروني',
    description: 'Modern e-commerce platform with multilingual support',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
