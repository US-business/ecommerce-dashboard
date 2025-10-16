
import { cn } from "@/lib/utils"
import {
   FeaturesSection,
   NewsletterSection,
   QuickLinksSection,
   CustomerServiceSection,
   SocialMediaSection,
   PaymentSecuritySection,
   CopyrightSection
} from "./_components"
import ContactInfo from "./_components/ContactInfo "
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"

interface FooterProps {
   className?: string
   params: Promise<{ lang: string }>
}

export async function Footer({ params , className }: FooterProps) {

   const resolvedParams = await params;

   const lang = resolvedParams?.lang as Locale;
   const dictionary = await getDictionary(lang);
   const dir = lang === "ar" ? "rtl" : "ltr";
   
   return (
      <>
         <footer className={cn(
            " border-t border-border relative overflow-hidden mt-3 ",
            className
         )}>
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-[length:32px_32px]" />
            </div>

            {/* Features Section */}
            <FeaturesSection dir={dir} lang={lang} className={cn("")} />

            {/* Main Footer Content */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                  {/* Company Info & Newsletter - spans 2 columns on large screens */}
                  <div className="lg:col-span-2">
                     <NewsletterSection dir={dir} lang={lang} />
                  </div>

                  {/* Quick Links & Customer Service - each takes 1 column */}
                  <div className="space-y-8">
                     <QuickLinksSection dir={dir} lang={lang}/>
                  </div>
                  <div className="space-y-8">
                     <CustomerServiceSection dir={dir} lang={lang} />
                  </div>

               </div>
            </div>

            {/* Social Media & App Download */}
            <div className="relative border-t border-border bg-muted/30">
               <div className="container flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                  <ContactInfo dir={dir} lang={lang} />
                  <SocialMediaSection dir={dir} lang={lang} />
               </div>
            </div>

            {/* Payment Methods & Security */}
            <div className="relative border-t border-border">
               <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <PaymentSecuritySection dir={dir} lang={lang} />
               </div>
            </div>

            {/* Copyright */}
            <div className="relative border-t border-border bg-muted/20">
               <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                  <CopyrightSection dir={dir} lang={lang} />
               </div>
            </div>
         </footer>
      </>
   )
}

export default Footer