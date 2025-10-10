import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/providers/theme-provider"

import Header from "@/components/layout/Header"
import { Navbar } from "@/components/layout/Header/Navbar"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/layout/Footer"


export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Multilingual e-commerce",
  generator: ''
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
      <main className={cn("w-full overflow-hidden ")}>
        {children}
      </main>
      <Footer />
      {/* </ThemeProvider> */}
    </>
  )
}
