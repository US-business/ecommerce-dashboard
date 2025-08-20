"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useAppStore } from "@/lib/stores/app-store"
import { LogOut, User, LayoutDashboard, LogIn, ShoppingCart, Info, X, Search, Package } from "lucide-react"
import { useTheme } from "next-themes"
import { ProductProps } from "@/types/product"
import { getAllProductsActions } from "@/lib/actions/products"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { SearchBar } from "./Search"

export function Navbar() {
    const router = useRouter()
    const pathName = usePathname()
    const { theme, setTheme } = useTheme()
    const { scrolled, visible } = useScroll()
    const { t, dir } = useI18nStore()
    const { user, isSuperAdmin, signOut } = useAuthStore()
    const { setIsLoadingPage } = useAppStore();

    const [open, setOpen] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [products, setProducts] = useState<ProductProps[]>([])
    const [search, setSearch] = useState("")
    const [isSearching, setIsSearching] = useState(false)

    const searchInputRef = useRef<HTMLInputElement>(null)

    // فتح التركيز عند البداية
    useEffect(() => {
        if (searchInputRef.current) searchInputRef.current.focus()
    }, [])

    // Escape لإغلاق البحث
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSearch("")
                setOpen(false)
            }
        }
        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [])

    // فحص إذا يظهر الهيدر
    function checkIsActive() {
        const href = window.location.href.includes("signin") || window.location.href.includes("register") || window.location.href.includes("account") || window.location.href.includes("dashboard")
        setIsActive(!href)
    }

    // تحميل المنتجات مع debounce








    const handelGoToDashboard = () => {
        router.push("/dashboard")
        setIsLoadingPage(true)
    }

    useEffect(() => {
        const href = window.location.href.includes("dashboard")
        if (pathName === "/dashboard" || href) setIsLoadingPage(false)
        checkIsActive()
        window.addEventListener("scroll", checkIsActive)
        return () => window.removeEventListener("scroll", checkIsActive)
    }, [pathName, setIsLoadingPage])

    return (
        <>
            {isActive && (
                <header
                    className={cn(
                        "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b transition-all duration-300",
                        scrolled ? "shadow-md" : "shadow-none",
                        visible ? "translate-y-0" : "-translate-y-full"
                    )}
                >
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <ShoppingCart className="h-6 w-6 text-primary" />
                            <span className="font-bold text-lg hidden sm:inline-block">E-Commerce</span>
                        </Link>

                        {/* Search */}
                        <SearchBar dir={dir} />

                        {/* User & Dashboard */}
                        <div className="flex items-center gap-4">
                            {isSuperAdmin && (
                                <Button variant="ghost" size="sm" onClick={handelGoToDashboard} className={cn("gap-2", dir === "rtl" && "flex-row-reverse cursor-pointer")}>
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="hidden sm:inline-block">{t("common.dashboard")}</span>
                                </Button>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="gap-2 rounded-full w-9 h-9 p-0 sm:w-auto sm:h-auto sm:p-2 sm:rounded-md">
                                        <User className="h-4 w-4" />
                                        <span className="hidden sm:inline-block">{user ? user.username : t("common.account")}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    {user ? (
                                        <>
                                            <DropdownMenuItem onClick={() => router.push("/account")} className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>{t("common.myAccount")}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 hover:text-red-700">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>{t("auth.signOut")}</span>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuItem onClick={() => router.push("/signin")} className="cursor-pointer">
                                            <LogIn className="mr-2 h-4 w-4" />
                                            <span>{t("auth.signIn")}</span>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Link href="/about">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Info className="h-4 w-4" />
                                    <span className="hidden sm:inline-block">{t("common.about")}</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>
            )}
        </>
    )
}
