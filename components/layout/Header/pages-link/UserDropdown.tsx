"use client"
import React, { useEffect, useState } from 'react'
import { LogOut, User, LayoutDashboard, LogIn, ShoppingCart, Info, Settings, Package, Heart, UserCircle, Box } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcnUI/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   DropdownMenuLabel,
} from "@/components/shadcnUI/dropdown-menu"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuthStore } from "@/lib/stores/index"
import { getUserOrders } from '@/lib/actions/orders'

type UserDropdownProps = {
   dictionary : any
   dir : "ltr" | "rtl"
}

const UserDropdown = ({ dictionary , dir }: UserDropdownProps) => {
   const { user, signOut, isLoading } = useAuthStore()
   const router = useRouter()
   const [orders, setOrders] = useState([]);


   const handleSignOut = async () => { 
      await signOut()
      router.push("/")
   }

   const getInitials = (username: string) => {
      return username.charAt(0).toUpperCase()
   }


   useEffect(() => {

      if (user) {
         getUserOrders(user.id).then((orderData: any) => {
            setOrders(orderData);
         }).catch(error => {
            console.error('Error loading orders:', error);
         });
      }
   }, [user]);


   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button
               variant="ghost"
               size="sm"
               className={cn(
                  " gap-2 rounded-full transition-all duration-200 hover:bg-accent",
                  "w-9 h-9 p-0 sm:w-auto sm:h-auto sm:p-2 sm:rounded-md"
               )}
            >
               {isLoading ? (
                  <>
                     <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                     <span className={cn("hidden sm:inline-block")}>
                        {dictionary.common.loading}
                     </span>
                  </>
               ) : user ? (
                  <>
                     <Avatar className="h-6 w-6">
                        <AvatarImage src={user.image || ""} alt={user.username} />
                        <AvatarFallback className="text-xs font-medium bg-purple-400 text-white">
                           {getInitials(user.username)}
                        </AvatarFallback>
                     </Avatar>
                     <span className={cn("hidden sm:inline-block font-medium")}>
                        {user.username}
                     </span>
                  </>
               ) : (
                  <>
                     <UserCircle className="h-5 w-5" />
                     <span className={cn("hidden sm:inline-block")}>
                        {dictionary?.common?.account}
                     </span>
                  </>
               )}
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent
            align={dir === "rtl" ? "start" : "end"}
            className="w-64"
            sideOffset={5}
         >
            {user ? (
               <>
                  <DropdownMenuLabel className={cn("font-normal", dir === "rtl" && "text-right")}>
                     <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                           {user.username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                           {user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground capitalize">
                           {user.role === "super_admin"
                              ? (dictionary?.general?.superAdmin)
                              : (dictionary?.general?.user)
                           }
                        </p>
                     </div>
                  </DropdownMenuLabel> 
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                     onClick={() => router.push("/account")}
                     className={cn("cursor-pointer", dir === "rtl" && "flex-row-reverse")}
                  >
                     <User className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                     <span>{dictionary?.common?.account}</span>
                  </DropdownMenuItem>
                  {orders.length !== 0 ? (
                     <DropdownMenuItem
                        onClick={() => router.push("/user-orders")}
                        className={cn("cursor-pointer", dir === "rtl" && "flex-row-reverse")}
                     >
                        <Box className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                        <span>{dictionary?.orders.title}</span>
                     </DropdownMenuItem>
                  ) : null}

                  <DropdownMenuItem
                     onClick={() => router.push("/cart")}
                     className={cn("cursor-pointer", dir === "rtl" && "flex-row-reverse")}
                  >
                     <ShoppingCart className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                     <span>{dictionary?.cart?.title}</span>
                  </DropdownMenuItem>

                  {user.role === "super_admin" && (
                     <DropdownMenuItem
                        onClick={() => router.push("/dashboard")}
                        className={cn("cursor-pointer", dir === "rtl" && "flex-row-reverse")}
                     >
                        <LayoutDashboard className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                        <span>{dictionary.dashboard.title}</span>
                     </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                     onClick={handleSignOut}
                     className={cn(
                        "cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50",
                        dir === "rtl" && "flex-row-reverse"
                     )}
                  >
                     <LogOut className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                     <span>{dictionary?.auth?.signOut}</span>
                  </DropdownMenuItem>
               </>
            ) : (
               <>
                  <DropdownMenuItem
                     onClick={() => router.push("/signin")}
                     className={cn("cursor-pointer", dir === "rtl" && "flex-row-reverse")}
                  >
                     <LogIn className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                     <span>{dictionary?.auth?.signIn}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                     onClick={() => router.push("/signup")}
                     className={cn("cursor-pointer", dir === "rtl" && "flex-row-reverse")}
                  >
                     <UserCircle className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                     <span>{dictionary?.auth?.signUp}</span>
                  </DropdownMenuItem>
               </>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   )
}

export default UserDropdown