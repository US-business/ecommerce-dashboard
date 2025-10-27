"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/shadcnUI/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcnUI/sheet"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores"
import WishListLink from "../pages-link/WishListLink"
import CartDropdown from "../pages-link/CartDropdown"
import UserAccordionMenu from "./_components/UserAccordionMenu"
import CartAccordionMenu from "./_components/CartAccordionMenu"
import WishlistAccordionMenu from "./_components/WishlistAccordionMenu"
import CategoryAccordionMenu from "./_components/CategoryAccordionMenu"
import { Separator } from "@/components/shadcnUI/separator"
import { LanguageToggle } from "@/components/language-toggle"

type MobileMenuProps = {
  categories: any[] | undefined
  user: { id: number } | null
  cart: any
  wishlist?: any
  dictionary: any
  dir: "rtl" | "ltr"
  lang?: string
}

export function MobileMenu({ categories, user, cart, wishlist, dictionary, dir, lang = 'en' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden flex items-center gap-2">
      <WishListLink wishlist={wishlist} />
      <CartDropdown user={user} cart={cart} dictionary={dictionary} dir={dir} />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 bg-slate-600 text-slate-50  hover:text-slate-900 hover:bg-slate-200 rounded">
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
              "bg-gradient-to-r from-slate-50 to-slate-100",
              dir === "rtl" && "flex-row-reverse"
            )}>
              <h2 className={cn(
                "text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent"
              )}>
                {dictionary.menu.title}
              </h2>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col">
                {/* Cart, Wishlist & User Sections */}
                <div className="p-4 space-y-4">
                  {/* Language Toggle Section */}
                  <div className={cn(
                    "flex items-center justify-between py-3 px-2 rounded-lg",
                    "bg-gradient-to-r from-blue-50 to-indigo-50",
                    "border border-blue-100",
                    "transition-all duration-200 hover:shadow-sm",
                  )}>
                    <span className={cn(
                      "text-sm font-semibold text-slate-700 flex items-center gap-2",
                    )}>
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      {dir === 'rtl' ? 'اللغة' : 'Language'}
                    </span>
                    <LanguageToggle />
                  </div>
                  <Separator className="border-2" />
                  <UserAccordionMenu dictionary={dictionary} dir={dir} />
                  <Separator className="border-2" />
                  <CartAccordionMenu user={user} cart={cart} dictionary={dictionary} dir={dir} />
                  <Separator className="border-2" />
                  <WishlistAccordionMenu user={user} wishlist={wishlist} dictionary={dictionary} dir={dir} />
                </div>

                {/* Categories Section */}
                <CategoryAccordionMenu 
                  categories={categories}
                  dir={dir}
                  lang={lang}
                  onCategoryClick={() => setIsOpen(false)}
                />

              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}