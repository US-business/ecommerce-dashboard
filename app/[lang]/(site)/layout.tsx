import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/providers/theme-provider"

import Header from "@/components/layout/Header"
import { Navbar } from "@/components/layout/Navbar/Navbar"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/layout/Footer"
import BackToTopButton from "@/components/ui/BackToTopButton"


export const metadata: Metadata = {
  title: {
    default: "متجر إلكتروني | E-Commerce Store - أفضل المنتجات والأسعار",
    template: "%s | متجر إلكتروني"
  },
  description: "متجر إلكتروني رائد يوفر أفضل المنتجات بأسعار تنافسية مع خدمة عملاء استثنائية. تسوق بأمان وثقة مع ضمان الجودة والتوصيل السريع.",
  keywords: [
    "متجر إلكتروني",
    "تسوق عبر الإنترنت",
    "منتجات إلكترونية",
    "ملابس",
    "أحذية",
    "إكسسوارات",
    "هواتف ذكية",
    "لابتوب",
    "أجهزة منزلية",
    "عروض خاصة",
    "توصيل مجاني",
    "دفع آمن",
    "جودة مضمونة"
  ],
  authors: [{ name: "متجر إلكتروني", url: "https://ecommerce.com" }],
  creator: "متجر إلكتروني",
  publisher: "متجر إلكتروني",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ecommerce.com"),
  alternates: {
    canonical: "/",
    languages: {
      "ar": "/ar",
      "en": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://ecommerce.com",
    title: "متجر إلكتروني | أفضل متجر للتسوق عبر الإنترنت",
    description: "اكتشف آلاف المنتجات المتنوعة بأفضل الأسعار مع خدمة عملاء متميزة وتوصيل سريع",
    siteName: "متجر إلكتروني",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "متجر إلكتروني - تسوق بأمان وثقة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "متجر إلكتروني | أفضل متجر للتسوق عبر الإنترنت",
    description: "اكتشف آلاف المنتجات المتنوعة بأفضل الأسعار مع خدمة عملاء متميزة وتوصيل سريع",
    images: ["/og-image.jpg"],
    creator: "@ecommerce",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "ecommerce",
  classification: "Business",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {

  return (
    <>
      {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange`
            > */}
      <Navbar />
      <Header params={params}/>
      <main className={cn("w-full overflow-hidden bg-gradient-to-r from-teal-50 via-purple-50 to-sky-50 ")}>
        {children}
      </main>
      <Footer params={params} />
      <BackToTopButton />
      {/* </ThemeProvider> */}
    </>
  )
}
