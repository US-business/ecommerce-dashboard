"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/shadcnUI/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcnUI/sheet"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores"
import WishListLink from "./pages-link/WishListLink"
import CartDropdown from "./pages-link/CartDropdown"
import UserAccordionMenu from "./pages-link/UserAccordionMenu"
import CartAccordionMenu from "./pages-link/CartAccordionMenu"
import { Separator } from "@/components/shadcnUI/separator"

type MobileMenuProps = {
  categories: any[] | undefined
  user: { id: number } | null 
  cart: any
  dictionary: any
  dir : "rtl" | "ltr"
}

export function MobileMenu({ categories, user, cart, dictionary, dir }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden flex items-center gap-2">
      <WishListLink />
      <CartDropdown user={user} cart={cart} dictionary={dictionary} dir={dir} />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10"> 
            <Menu className="h-5 w-5" />
            <span className="sr-only">{dictionary.menu.open}</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side={dir === "rtl" ? "left" : "right"} 
          className="w-full sm:w-[400px] p-0"
          dir={dir}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className={cn(
              "flex items-center justify-between p-4 border-b",
              dir === "rtl" && "flex-row-reverse"
            )}>
              <h2 className="text-lg font-semibold">
                {dictionary.menu.title}
              </h2>
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-4 space-y-6">
              <div className="flex flex-col space-y-6">
                <div className="p-2 space-y-4">
                  <CartAccordionMenu user={user} cart={cart} dictionary={dictionary} dir={dir} />
                  <Separator className="border-2"/>
                  <UserAccordionMenu dictionary={dictionary} dir={dir} />
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}