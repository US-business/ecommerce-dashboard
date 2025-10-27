import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ChevronDown, Grid3x3 } from 'lucide-react'
import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/shadcnUI/navigation-menu"

type CategoryNavbarProps = {
    categories: any[] | undefined
    lang: string
    dir: 'rtl' | 'ltr'
}

export const CategoryNavbar = ({ categories, lang, dir }: CategoryNavbarProps) => {
    if (!categories || categories.length === 0) return null;

    // عرض أول 6 فئات في الشريط
    const displayedCategories = categories.slice(0, 6);
    const hasMore = categories.length > 6;

    return (
        <nav className={cn(
            "hidden lg:block w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-50 border-t border-slate-500/30"
        )}>
            <div className={cn(
                "container mx-auto px-4 lg:px-8",
                "h-8 sm:h-10 lg:h-8", 
                "flex items-center justify-start gap-1"
            )}>
                <NavigationMenu dir={dir}>
                    <NavigationMenuList className="gap-1">
                        {displayedCategories.map((category) => (
                            <NavigationMenuItem key={category.id}>
                                <Link
                                    href={`/${lang}/category/${category.slug}`}
                                    legacyBehavior
                                    passHref
                                >
                                    <NavigationMenuLink
                                        className={cn(
                                            "group inline-flex h-8 w-max items-center justify-center",
                                            "rounded-sm px-4 py-0",
                                            "text-sm font-semibold text-slate-900",
                                            "transition-all duration-200",
                                            "hover:bg-slate-800/20 hover:text-amber-900",
                                            "focus:bg-slate-800/20 focus:text-amber-900 focus:outline-none",
                                            "disabled:pointer-events-none disabled:opacity-50"
                                        )}
                                    >
                                        {dir === 'rtl' ? category.nameAr : category.nameEn}
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        ))}

                        {/* All Categories Dropdown */}
                        {hasMore && (
                            <NavigationMenuItem>
                                <NavigationMenuTrigger
                                    className={cn(
                                        "h-8 px-4 py-2",
                                        "text-sm font-medium text-slate-100",
                                        "bg-amber-600 hover:bg-amber-700",
                                        "data-[state=open]:bg-amber-700",
                                        "transition-all duration-200"
                                    )}
                                >
                                    <Grid3x3 className="w-4 h-4 mr-2" />
                                    {dir === 'rtl' ? 'كل الفئات' : 'All Categories'}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className={cn(
                                        "grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px]",
                                        "grid-cols-2 md:grid-cols-3"
                                    )}>
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/${lang}/category/${category.slug}`}
                                                className={cn(
                                                    "block select-none space-y-1 rounded-md p-3",
                                                    "leading-none no-underline outline-none",
                                                    "transition-colors",
                                                    "hover:bg-slate-100 hover:text-amber-600",
                                                    "focus:bg-slate-100 focus:text-amber-600"
                                                )}
                                            >
                                                <div className="text-sm font-medium leading-none">
                                                    {dir === 'rtl' ? category.nameAr : category.nameEn}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </nav>
    )
}
