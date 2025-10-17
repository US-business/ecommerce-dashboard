import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/providers/theme-provider"

import Header from "@/components/layout/Header"
import { Navbar } from "@/components/layout/Header/Navbar"
import { cn } from "@/lib/utils"


export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Multilingual e-commerce",
  generator: ''
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
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
      <Header />
      <main className={cn("w-full overflow-hidden ")}>
        {children}
      </main>
      {/* </ThemeProvider> */}
    </>
  )
}
