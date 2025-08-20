"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Package, LayoutDashboard, User, ShoppingCart, Heart, Sun, Moon, Monitor, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LanguageToggle } from "@/components/language-toggle"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores"

export function AnimatedHeader() {
   const [isVisible, setIsVisible] = useState(true)
   const [lastScrollY, setLastScrollY] = useState(0)
   const [isSearchOpen, setIsSearchOpen] = useState(false)
   const [searchQuery, setSearchQuery] = useState("")
   const searchInputRef = useRef<HTMLInputElement>(null)
   const { theme, setTheme } = useTheme()
   const { t, dir } = useI18nStore()
   const router = useRouter()

   useEffect(() => {
      const controlNavbar = () => {
         const currentScrollY = window.scrollY

         if (currentScrollY < lastScrollY || currentScrollY < 10) {
            setIsVisible(true)
         } else {
            setIsVisible(false)
         }

         setLastScrollY(currentScrollY)
      }

      window.addEventListener("scroll", controlNavbar)
      return () => window.removeEventListener("scroll", controlNavbar)
   }, [lastScrollY])

   useEffect(() => {
      if (isSearchOpen && searchInputRef.current) {
         searchInputRef.current.focus()
      }
   }, [isSearchOpen])

   useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === "Escape" && isSearchOpen) {
            setIsSearchOpen(false)
            setSearchQuery("")
         }
      }

      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
   }, [isSearchOpen])

   const handleLogoClick = () => {
      router.push("/")
   }

   const handleDashboardClick = () => {
      router.push("/dashboard")
   }

   const handleUserClick = () => {
      router.push("/login")
   }

   const handleCartClick = () => {
      router.push("/cart")
   }

   const handleWishlistClick = () => {
      router.push("/wishlist")
   }

   const handleSearchClick = () => {
      setIsSearchOpen(!isSearchOpen)
      if (isSearchOpen) {
         setSearchQuery("")
      }
   }

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
         router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
         setIsSearchOpen(false)
         setSearchQuery("")
      }
   }

   return (
      <header
         className={cn(
            "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-transform duration-300 ease-in-out",
            isVisible ? "translate-y-0" : "-translate-y-full",
         )}
      >
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className={cn("flex items-center justify-between h-16", dir === "rtl" && "flex-row-reverse")}>
               {/* Logo */}
               <div
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleLogoClick}
               >
                  <Package className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-foreground">{dir === "rtl" ? "متجر إلكتروني" : "E-Commerce"}</span>
               </div>

               {isSearchOpen && (
                  <div className="flex-1 mx-4">
                     <form onSubmit={handleSearchSubmit} className="relative">
                        <Input
                           ref={searchInputRef}
                           type="text"
                           placeholder={dir === "rtl" ? "البحث عن المنتجات..." : "Search products..."}
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full pr-10 pl-4"
                           dir={dir}
                        />
                        <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           onClick={handleSearchClick}
                           className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-accent"
                        >
                           <X className="h-4 w-4" />
                        </Button>
                     </form>
                  </div>
               )}

               {/* Navigation Icons */}
               <div className={cn("flex items-center space-x-4", dir === "rtl" && "space-x-reverse")}>
                  <LanguageToggle />

                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={handleSearchClick}
                     className={cn("hover:bg-accent transition-colors", isSearchOpen && "bg-accent")}
                     title={dir === "rtl" ? "البحث" : "Search"}
                  >
                     <Search className="h-5 w-5" />
                  </Button>

                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={handleCartClick}
                     className="hover:bg-accent transition-colors relative"
                     title={dir === "rtl" ? "سلة التسوق" : "Shopping Cart"}
                  >
                     <ShoppingCart className="h-5 w-5" />
                     {/* Optional: Add cart item count badge */}
                     <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        3
                     </span>
                  </Button>

                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={handleWishlistClick}
                     className="hover:bg-accent transition-colors"
                     title={dir === "rtl" ? "قائمة الأمنيات" : "Wishlist"}
                  >
                     <Heart className="h-5 w-5" />
                  </Button>

                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="hover:bg-accent transition-colors"
                           title={dir === "rtl" ? "تغيير المظهر" : "Toggle theme"}
                        >
                           <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                           <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                           <span className="sr-only">Toggle theme</span>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                           <Sun className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                           {dir === "rtl" ? "فاتح" : "Light"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                           <Moon className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                           {dir === "rtl" ? "داكن" : "Dark"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                           <Monitor className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                           {dir === "rtl" ? "النظام" : "System"}
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={handleDashboardClick}
                     className="hover:bg-accent transition-colors"
                     title={dir === "rtl" ? "لوحة التحكم" : "Dashboard"}
                  >
                     <LayoutDashboard className="h-5 w-5" />
                  </Button>

                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={handleUserClick}
                     className="hover:bg-accent transition-colors"
                     title={dir === "rtl" ? "تسجيل الدخول" : "Login"}
                  >
                     <User className="h-5 w-5" />
                  </Button>
               </div>
            </div>
         </div>
      </header>
   )
}
