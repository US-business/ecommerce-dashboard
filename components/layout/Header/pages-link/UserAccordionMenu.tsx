"use client";
import React, { useEffect, useState } from "react";
import { LogOut, User, LayoutDashboard, LogIn, ShoppingCart, Box, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shadcnUI/accordion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/index";
import { getUserOrders } from "@/lib/actions/orders";

interface UserAccordionMenuProps {
   dictionary: any;
   dir: "ltr" | "rtl";
}

const UserAccordionMenu = ({ dictionary, dir }: UserAccordionMenuProps) => {
   const { user, signOut, isLoading } = useAuthStore();
   const router = useRouter();
   const [orders, setOrders] = useState([]);

   useEffect(() => {
      if (user) {
         getUserOrders(user.id).then((orderData: any) => {
            setOrders(orderData);
         }).catch(error => {
            console.error("Error loading orders:", error);
         });
      }
   }, [user]);

   const handleSignOut = async () => {
      await signOut();
      router.push("/");
   };

   const getInitials = (username: string) => username.charAt(0).toUpperCase();

   return (
      <Accordion type="single" collapsible className="w-full">
         <AccordionItem value="user-menu">
            <AccordionTrigger className={cn("flex items-center ", dir === "rtl" && "flex-row-reverse")}>
               {isLoading ? (
                  <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
               ) : user ? (
                  <div className={cn("flex items-center justify-center flex-1 gap-2", dir === "rtl" && "flex-row-reverse")}>
                     <Avatar className="h-6 w-6">
                        <AvatarImage src={user.image || ""} alt={user.username} />
                        <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
                           {getInitials(user.username)}
                        </AvatarFallback>
                     </Avatar>
                     <span className="font-medium">{user.username}</span>
                  </div>
               ) : (
                  <div className={cn("flex items-center justify-center flex-1 gap-2", dir === "rtl" && "flex-row-reverse")}>
                     <UserCircle className="h-5 w-5" />
                     <span>{dictionary?.common?.account}</span> 
                  </div>
               )}
            </AccordionTrigger>
            <AccordionContent>
               {user ? (
                  <div className="flex flex-col gap-2 py-2">
                     <div className="text-xs text-muted-foreground mb-2">
                        {user.email}
                     </div>
                     <button onClick={() => router.push("/account")} className="flex items-center gap-2 w-full py-2 px-3 rounded hover:bg-accent text-sm">
                        <User className="h-4 w-4" />
                        <span>{dictionary?.common?.account}</span>
                     </button>
                     {orders.length !== 0 && (
                        <button onClick={() => router.push("/user-orders")} className="flex items-center gap-2 w-full py-2 px-3 rounded hover:bg-accent text-sm">
                           <Box className="h-4 w-4" />
                           <span>{dictionary?.orders.title}</span>
                        </button>
                     )}
                     <button onClick={() => router.push("/cart")} className="flex items-center gap-2 w-full py-2 px-3 rounded hover:bg-accent text-sm">
                        <ShoppingCart className="h-4 w-4" />
                        <span>{dictionary?.cart?.title}</span>
                     </button>
                     {user.role === "super_admin" && (
                        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 w-full py-2 px-3 rounded hover:bg-accent text-sm">
                           <LayoutDashboard className="h-4 w-4" />
                           <span>{dictionary.dashboard.title}</span>
                        </button>
                     )}
                     <button onClick={handleSignOut} className="flex items-center gap-2 w-full py-2 px-3 rounded text-red-600 hover:text-red-700 hover:bg-red-50 text-sm">
                        <LogOut className="h-4 w-4" />
                        <span>{dictionary?.auth?.signOut}</span>
                     </button>
                  </div>
               ) : (
                  <div className="flex flex-col gap-2 py-2">
                     <button onClick={() => router.push("/signin")} className="flex items-center gap-2 w-full py-2 px-3 rounded hover:bg-accent text-sm">
                        <LogIn className="h-4 w-4" />
                        <span>{dictionary?.auth?.signIn}</span>
                     </button>
                     <button onClick={() => router.push("/signup")} className="flex items-center gap-2 w-full py-2 px-3 rounded hover:bg-accent text-sm">
                        <UserCircle className="h-4 w-4" />
                        <span>{dictionary?.auth?.signUp}</span>
                     </button>
                  </div>
               )}
            </AccordionContent>
         </AccordionItem>
      </Accordion>
   );
};

export default UserAccordionMenu;
