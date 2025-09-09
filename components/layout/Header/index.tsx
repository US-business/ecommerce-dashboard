"use client"
import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"
import { SearchBar } from "../Search"
import LogoLink from "./LogoLink"
import WishListLink from "./WishListLink"
import CartListLink from "./CartListLink"
import UserListLink from "./UserListLink"

function Header() {

    // const pathName = usePathname()
    const { scrolled, visible } = useScroll()

    // // فحص إذا يظهر الهيدر
    // const hiddenPaths = ["/signin", "/register", "/account", "/dashboard"];
    // const isActive = !hiddenPaths.some(path => pathName?.startsWith(path));



    return (
        <>
            {/* {isActive && ( */}
            <header
                className={cn(
                    "sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b transition-all duration-300",
                    scrolled ? "shadow-md" : "shadow-none",
                    visible ? "translate-y-0" : "-translate-y-full"
                )}
            >

                <div className="container mx-auto h-16 flex items-center justify-between">
                    {/* Logo */}
                    <LogoLink />


                    {/* Search */}
                    <SearchBar />




                    {/* User & Dashboard */}
                    <div className="flex items-center gap-6">
                        <WishListLink />
                        <CartListLink />
                        <UserListLink />
                        {/* <ThemeToggle /> */}
                    </div>
                </div>
            </header>
            {/* )} */}
        </>
    )
}

export default Header