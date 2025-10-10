"use client"

import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import {
   Facebook,
   Twitter,
   Instagram,
   Youtube,
   Mail,
   Phone,
   MapPin,
   Truck,
   Shield,
   RotateCcw,
   CreditCard,
   Star,
   Users,
   Award,
   Clock,
   LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores"

type FeaturesProps = {
   icon: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>
   title: { en: any; ar: any } | any
   description: { en: string; ar: string } | any
}

type StatsProps = {
   icon: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>
   value: { en: any; ar: any } | any
   label: { en: string; ar: string } | any
}

export function Footer() {
   const { t, dir } = useI18nStore()

   const features: FeaturesProps[] = [
      {
         icon: Truck,
         title: { en: "Free Shipping", ar: "شحن مجاني" },
         description: { en: "On orders over $50", ar: "للطلبات فوق $50" },
      },
      {
         icon: RotateCcw,
         title: { en: "Easy Returns", ar: "إرجاع سهل" },
         description: { en: "30-day return policy", ar: "سياسة إرجاع 30 يوم" },
      },
      {
         icon: Shield,
         title: { en: "Secure Payment", ar: "دفع آمن" },
         description: { en: "SSL encrypted checkout", ar: "دفع مشفر بـ SSL" },
      },
      {
         icon: Clock,
         title: { en: "24/7 Support", ar: "دعم 24/7" },
         description: { en: "Customer service", ar: "خدمة العملاء" },
      },
   ]

   const stats : StatsProps[] = [
      {
         icon: Users,
         value: "50K+",
         label: { en: "Happy Customers", ar: "عميل سعيد" },
      },
      {
         icon: Award,
         value: "10K+",
         label: { en: "Products Sold", ar: "منتج مباع" },
      },
      {
         icon: Star,
         value: "4.9",
         label: { en: "Average Rating", ar: "متوسط التقييم" },
      },
   ]

   return (
      <footer className="bg-gray-900 text-white">
         {/* Features Section */}
         <div className="border-b border-gray-800">
            <div className="container mx-auto px-4 py-12">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature: FeaturesProps, index) => (
                     <div
                        key={index}
                        className={cn(
                           "flex items-center space-x-4 text-center md:text-left",
                           dir === "rtl" && "space-x-reverse md:text-right",
                        )}
                     >
                        <div className="flex-shrink-0">
                           <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                              <feature.icon className="w-6 h-6 text-white" />
                           </div>
                        </div>
                        <div>
                           <h3 className="font-semibold text-lg">{feature?.title[dir]}</h3>
                           <p className="text-gray-400 text-sm">{feature?.description[dir]}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Main Footer Content */}
         <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               {/* Company Info */}
               <div className={cn("lg:col-span-1", dir === "rtl" && "text-right")}>
                  <div className={cn("flex items-center space-x-2 mb-4", dir === "rtl" && "space-x-reverse")}>
                     <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">E</span>
                     </div>
                     <span className="text-xl font-bold">{dir === "rtl" ? "متجر إلكتروني" : "E-Commerce"}</span>
                  </div>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                     {dir === "rtl"
                        ? "متجرك الإلكتروني المفضل للحصول على أفضل المنتجات بأسعار تنافسية وخدمة عملاء ممتازة."
                        : "Your favorite online store for the best products at competitive prices with excellent customer service."}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                     {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                           <div className="flex justify-center mb-2">
                              <stat.icon className="w-5 h-5 text-primary" />
                           </div>
                           <div className="font-bold text-lg">{stat.value}</div>
                           <div className="text-xs text-gray-400">{stat.label[dir]}</div>
                        </div>
                     ))}
                  </div>

                  {/* Social Links */}
                  <div className={cn("flex space-x-4", dir === "rtl" && "space-x-reverse")}>
                     <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                        <Facebook className="w-5 h-5" />
                     </Button>
                     <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                        <Twitter className="w-5 h-5" />
                     </Button>
                     <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                        <Instagram className="w-5 h-5" />
                     </Button>
                     <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                        <Youtube className="w-5 h-5" />
                     </Button>
                  </div>
               </div>

               {/* Quick Links */}
               <div className={cn(dir === "rtl" && "text-right")}>
                  <h3 className="font-semibold text-lg mb-4">{dir === "rtl" ? "الشركة" : "Company"}</h3>
                  <ul className="space-y-3">
                     {[
                        { en: "About Us", ar: "من نحن", href: `/${dir}/about` },
                        { en: "Our Story", ar: "قصتنا", href: "/story" },
                        { en: "Careers", ar: "الوظائف", href: "/careers" },
                        { en: "Press", ar: "الصحافة", href: "/press" },
                        { en: "Blog", ar: "المدونة", href: "/blog" },
                     ].map((link : any, index) => (
                        <li key={index}>
                           <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                              {link[dir]}
                           </a>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Customer Service */}
               <div className={cn(dir === "rtl" && "text-right")}>
                  <h3 className="font-semibold text-lg mb-4">{dir === "rtl" ? "خدمة العملاء" : "Customer Service"}</h3>
                  <ul className="space-y-3">
                     {[
                        { en: "Contact Us", ar: "اتصل بنا", href: `/${dir}/contact` },
                        { en: "FAQ", ar: "الأسئلة الشائعة", href: `/${dir}/faq` },
                        { en: "Shipping Info", ar: "معلومات الشحن", href: "/shipping" },
                        { en: "Returns", ar: "الإرجاع", href: "/returns" },
                        { en: "Size Guide", ar: "دليل المقاسات", href: "/size-guide" },
                     ].map((link : any, index) => (
                        <li key={index}>
                           <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                              {link[dir]}
                           </a>
                        </li>
                     ))}
                  </ul>

                  {/* Contact Info */}
                  <div className="mt-6 space-y-3">
                     <div className={cn("flex items-center space-x-3", dir === "rtl" && "space-x-reverse")}>
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-gray-400">+1 (555) 123-4567</span>
                     </div>
                     <div className={cn("flex items-center space-x-3", dir === "rtl" && "space-x-reverse")}>
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-gray-400">support@ecommerce.com</span>
                     </div>
                     <div className={cn("flex items-center space-x-3", dir === "rtl" && "space-x-reverse")}>
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-gray-400">
                           {dir === "rtl" ? "123 شارع التجارة، المدينة" : "123 Commerce St, City"}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Newsletter */}
               <div className={cn(dir === "rtl" && "text-right")}>
                  <h3 className="font-semibold text-lg mb-4">{dir === "rtl" ? "النشرة الإخبارية" : "Newsletter"}</h3>
                  <p className="text-gray-400 mb-4">
                     {dir === "rtl"
                        ? "اشترك في نشرتنا الإخبارية للحصول على آخر العروض والمنتجات الجديدة."
                        : "Subscribe to our newsletter for the latest offers and new products."}
                  </p>
                  <div className={cn("flex space-x-2 mb-4", dir === "rtl" && "space-x-reverse")}>
                     <Input
                        type="email"
                        placeholder={dir === "rtl" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                     />
                     <Button className="bg-primary hover:bg-primary/90">{dir === "rtl" ? "اشتراك" : "Subscribe"}</Button>
                  </div>

                  {/* Policies */}
                  <div className="space-y-2">
                     <h4 className="font-medium">{dir === "rtl" ? "السياسات" : "Policies"}</h4>
                     <ul className="space-y-2">
                        {[
                           { en: "Privacy Policy", ar: "سياسة الخصوصية", href: `/${dir}/privacy` },
                           { en: "Terms of Service", ar: "شروط الخدمة", href: `/${dir}/terms` },
                           { en: "Cookie Policy", ar: "سياسة الكوكيز", href: "/cookies" },
                        ].map((link :any, index) => (
                           <li key={index}>
                              <a
                                 href={link.href}
                                 className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                              >
                                 {link[dir]}
                              </a>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>
         </div>

         {/* Bottom Footer */}
         <div className="border-t border-gray-800">
            <div className="container mx-auto px-4 py-6">
               <div
                  className={cn(
                     "flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0",
                     dir === "rtl" && "md:flex-row-reverse",
                  )}
               >
                  <div className="text-gray-400 text-sm">
                     © 2024 {dir === "rtl" ? "متجر إلكتروني" : "E-Commerce"}.{" "}
                     {dir === "rtl" ? "جميع الحقوق محفوظة" : "All rights reserved"}.
                  </div>

                  {/* Payment Methods */}
                  <div className={cn("flex items-center space-x-4", dir === "rtl" && "space-x-reverse")}>
                     <span className="text-gray-400 text-sm">{dir === "rtl" ? "طرق الدفع:" : "Payment methods:"}</span>
                     <div className={cn("flex space-x-2", dir === "rtl" && "space-x-reverse")}>
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                           V
                        </div>
                        <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                           M
                        </div>
                        <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                           A
                        </div>
                        <div className="w-8 h-5 bg-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">
                           P
                        </div>
                     </div>
                  </div>

                  {/* Security Badges */}
                  <div className={cn("flex items-center space-x-4", dir === "rtl" && "space-x-reverse")}>
                     <div className={cn("flex items-center space-x-2", dir === "rtl" && "space-x-reverse")}>
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-gray-400 text-sm">SSL {dir === "rtl" ? "آمن" : "Secure"}</span>
                     </div>
                     <div className={cn("flex items-center space-x-2", dir === "rtl" && "space-x-reverse")}>
                        <CreditCard className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-400 text-sm">PCI {dir === "rtl" ? "متوافق" : "Compliant"}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </footer>
   )
}
