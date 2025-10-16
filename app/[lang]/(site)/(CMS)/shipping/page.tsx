import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import {
    Truck,
    Clock,
    MapPin,
    Shield,
    CheckCircle,
    Phone,
    Mail,
    Globe,
    Package,
    Timer,
    Award,
    Star
} from "lucide-react"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { lang: string } }) {
    const lang = params.lang as Locale;
    const dictionary = await getDictionary(lang);

    return {
        title: `${dictionary.cms.shipping.title} | متجر إلكتروني`,
        description: dictionary.cms.shipping.description,
    }
}

export default async function ShippingPage({ params }: { params: { lang: string } }) {
    const lang = params.lang as Locale;
    const dictionary = await getDictionary(lang);
    const dir = lang === "ar" ? "rtl" : "ltr";

    const shippingOptions = [
        {
            icon: Truck,
            name: dir === "rtl" ? "الشحن السريع" : "Express Shipping",
            time: dir === "rtl" ? "1-2 يوم عمل" : "1-2 business days",
            cost: dir === "rtl" ? "مجاني فوق $100" : "Free over $100",
            description: dir === "rtl" ? "توصيل سريع في نفس اليوم أو اليوم التالي" : "Same day or next day delivery"
        },
        {
            icon: Clock,
            name: dir === "rtl" ? "الشحن القياسي" : "Standard Shipping",
            time: dir === "rtl" ? "3-5 أيام عمل" : "3-5 business days",
            cost: dir === "rtl" ? "مجاني فوق $50" : "Free over $50",
            description: dir === "rtl" ? "خيار اقتصادي مع تتبع كامل" : "Economical option with full tracking"
        },
        {
            icon: Globe,
            name: dir === "rtl" ? "الشحن الدولي" : "International Shipping",
            time: dir === "rtl" ? "7-14 يوم عمل" : "7-14 business days",
            cost: dir === "rtl" ? "يختلف حسب البلد" : "Varies by country",
            description: dir === "rtl" ? "شحن إلى أكثر من 150 دولة" : "Shipping to over 150 countries"
        }
    ]

    const shippingZones = [
        {
            zone: dir === "rtl" ? "المنطقة المحلية" : "Local Area",
            time: dir === "rtl" ? "1 يوم" : "1 day",
            cost: dir === "rtl" ? "مجاني" : "Free",
            areas: [dir === "rtl" ? "الرياض" : "Riyadh", dir === "rtl" ? "جدة" : "Jeddah", dir === "rtl" ? "الدمام" : "Dammam"]
        },
        {
            zone: dir === "rtl" ? "المناطق الرئيسية" : "Main Regions",
            time: dir === "rtl" ? "2 يوم" : "2 days",
            cost: dir === "rtl" ? "مجاني فوق $50" : "Free over $50",
            areas: [dir === "rtl" ? "المنطقة الشرقية" : "Eastern Province", dir === "rtl" ? "المنطقة الغربية" : "Western Province"]
        },
        {
            zone: dir === "rtl" ? "المناطق النائية" : "Remote Areas",
            time: dir === "rtl" ? "3-5 أيام" : "3-5 days",
            cost: dir === "rtl" ? "$10 رسوم إضافية" : "$10 extra fee",
            areas: [dir === "rtl" ? "نجران" : "Najran", dir === "rtl" ? "جيزان" : "Jizan", dir === "rtl" ? "حائل" : "Hail"]
        }
    ]

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Header Section */}
            <div className="text-center mb-16">
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2">
                    <Truck className="w-4 h-4 mr-2" />
                    {dir === "rtl" ? "الشحن والتوصيل" : "Shipping & Delivery"}
                </Badge>

                <h1 className="text-4xl font-bold mb-6">
                    {dictionary.cms.shipping.title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {dictionary.cms.shipping.description}
                </p>
            </div>

            {/* Shipping Options */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-center mb-12">
                    {dir === "rtl" ? "خيارات الشحن المتاحة" : "Available Shipping Options"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {shippingOptions.map((option, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <option.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                                            {option.name}
                                        </h3>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">{option.time}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium text-green-600">{option.cost}</span>
                                </div>

                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {option.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Shipping Zones */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-center mb-12">
                    {dir === "rtl" ? "مناطق التوصيل" : "Delivery Zones"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {shippingZones.map((zone, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                    {zone.zone}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Timer className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">{zone.time}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">{zone.cost}</span>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2 text-sm">
                                        {dir === "rtl" ? "المناطق المشمولة:" : "Covered Areas:"}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {zone.areas.map((area, areaIndex) => (
                                            <Badge key={areaIndex} variant="outline" className="text-xs">
                                                {area}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-center mb-12">
                    {dir === "rtl" ? "مميزات الشحن لدينا" : "Our Shipping Features"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                                <MapPin className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                                {dir === "rtl" ? "تتبع دقيق" : "Accurate Tracking"}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {dir === "rtl" ? "تتبع شحنتك خطوة بخطوة" : "Track your shipment step by step"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
                                <Shield className="w-7 h-7 text-green-600" />
                            </div>
                            <h3 className="font-semibold mb-3 group-hover:text-green-600 transition-colors">
                                {dir === "rtl" ? "تعبئة آمنة" : "Secure Packaging"}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {dir === "rtl" ? "تعبئة احترافية تحمي منتجاتك" : "Professional packaging that protects your products"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30 transition-colors">
                                <Award className="w-7 h-7 text-purple-600" />
                            </div>
                            <h3 className="font-semibold mb-3 group-hover:text-purple-600 transition-colors">
                                {dir === "rtl" ? "ضمان التوصيل" : "Delivery Guarantee"}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {dir === "rtl" ? "ضمان توصيل منتجاتك بحالة ممتازة" : "Guarantee delivery of your products in excellent condition"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30 transition-colors">
                                <Star className="w-7 h-7 text-orange-600" />
                            </div>
                            <h3 className="font-semibold mb-3 group-hover:text-orange-600 transition-colors">
                                {dir === "rtl" ? "خدمة متميزة" : "Premium Service"}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {dir === "rtl" ? "خدمة عملاء متميزة في كل خطوة" : "Exceptional customer service every step of the way"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Contact Section */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">
                        {dir === "rtl" ? "هل لديك أسئلة حول الشحن؟" : "Questions About Shipping?"}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        {dir === "rtl"
                            ? "فريق الشحن متاح لمساعدتك في أي استفسار حول التوصيل والشحن"
                            : "Our shipping team is available to help with any questions about delivery and shipping"
                        }
                    </p>

                    <div className={cn(
                        "flex flex-col sm:flex-row gap-4 justify-center",
                        dir === "rtl" ? "flex-row-reverse" : "flex-row"
                    )}>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span>shipping@ecommerce.com</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
