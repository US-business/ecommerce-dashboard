import { SearchBar } from "../Search"
import LogoLink from "./pages-link/LogoLink"
import WishListLink from "./pages-link/WishListLink"
import CartDropdown from "./pages-link/CartDropdown"
import UserDropdown from "./pages-link/UserDropdown"
import ScrolledHeader from "./ScrolledHeader"
import { MobileMenu } from "./MobileMenu"
import { getCategories } from "@/lib/actions/categories"
import { type Locale } from "@/lib/i18n/i18n-config"
import { getCartFull } from "@/lib/actions/cart"
import { getNextAuthUser } from "@/lib/auth/guards"
import { getDictionary } from "@/lib/i18n/get-dictionary"

async function Header({ params }: { params: Promise<{ lang: string }> }) {

    // const pathName = usePathname()
    // // فحص إذا يظهر الهيدر
    // const hiddenPaths = ["/signin", "/register", "/account", "/dashboard"];
    // const isActive = !hiddenPaths.some(path => pathName?.startsWith(path));

    const resolvedParams = await params;
    console.log("resolvedParams" , resolvedParams);
    
    const lang = resolvedParams?.lang as Locale;
    const dictionary = await getDictionary(lang);
    const dir = lang === "ar" ? "rtl" : "ltr";


    const { data: categories } = await getCategories()

    const user = await getNextAuthUser()

    let cart = null
    if (user?.id) {
        cart = await getCartFull(user.id)
    }

    return (
        <>
            <ScrolledHeader>
                <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <LogoLink />
                    </div>

                    {/* Desktop Search Bar - Hidden on mobile and tablet */}
                    <div className="hidden xl:flex flex-1 max-w-2xl mx-8">
                        <SearchBar categories={categories} />
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                        <WishListLink />
                        <CartDropdown user={user ? { id: user.id! } : null} cart={cart} dictionary={dictionary} dir={dir} />
                        <UserDropdown dictionary={dictionary} dir={dir} />
                    </div>

                    {/* Mobile Menu Button */}
                    <MobileMenu
                        categories={categories}
                        user={user ? { id: user.id! } : null}
                        cart={cart}
                        dictionary={dictionary}
                        dir={dir}
                    />
                </div>

                {/* Mobile/Tablet Search Bar - Below header */}
                <div className="lg:hidden border-t bg-white/95 backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <SearchBar categories={categories} />
                    </div>
                </div>
            </ScrolledHeader>
        </>
    )
}

export default Header