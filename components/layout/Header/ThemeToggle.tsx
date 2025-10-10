import React from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcnUI/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"



const ThemeToggle = () => {
   const { dir } = useI18nStore()
   const { theme, setTheme } = useTheme()

   return (
      <>
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
      </>
   )
}

export default ThemeToggle