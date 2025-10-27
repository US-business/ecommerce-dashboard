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

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang as Locale;
    const dictionary = await getDictionary(lang);

    return {
        title: `${dictionary.cms.shipping.title} | متجر إلكتروني`,
        description: dictionary.cms.shipping.description,
    }
}

export default async function ShippingPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang as Locale;
    const dictionary = await getDictionary(lang);
    const dir = lang === "ar" ? "rtl" : "ltr";

    const shippingOptions = [
        {
            icon: Truck,
            name: dictionary.cms.shipping.options.express.name,
            time: dictionary.cms.shipping.options.express.time,
            cost: dictionary.cms.shipping.options.express.cost,
            description: dictionary.cms.shipping.options.express.description
        },
        {
            icon: Clock,
            name: dictionary.cms.shipping.options.standard.name,
            time: dictionary.cms.shipping.options.standard.time,
            cost: dictionary.cms.shipping.options.standard.cost,
            description: dictionary.cms.shipping.options.standard.description
        },
        {
            icon: Globe,
            name: dictionary.cms.shipping.options.international.name,
            time: dictionary.cms.shipping.options.international.time,
            cost: dictionary.cms.shipping.options.international.cost,
            description: dictionary.cms.shipping.options.international.description
        }
    ]

    const shippingZones = [
        {
            zone: dictionary.cms.shipping.zones.local.zone,
            time: dictionary.cms.shipping.zones.local.time,
            cost: dictionary.cms.shipping.zones.local.cost,
            areas: dictionary.cms.shipping.zones.local.areas.split("، ")
        },
        {
            zone: dictionary.cms.shipping.zones.main.zone,
            time: dictionary.cms.shipping.zones.main.time,
            cost: dictionary.cms.shipping.zones.main.cost,
            areas: dictionary.cms.shipping.zones.main.areas.split("، ")
        },
        {
            zone: dictionary.cms.shipping.zones.remote.zone,
            time: dictionary.cms.shipping.zones.remote.time,
            cost: dictionary.cms.shipping.zones.remote.cost,
            areas: dictionary.cms.shipping.zones.remote.areas.split("، ")
        }
    ]

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Header Section */}
            <div className="text-center mb-16">
                <Badge className="mb-4 bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-500 px-4 py-2">
                    <Truck className="w-4 h-4 mr-2" />
                    {dictionary.cms.shipping.shippingDelivery}
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
                    {dictionary.cms.shipping.availableOptions}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {shippingOptions.map((option, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                                        <option.icon className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
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
                    {dictionary.cms.shipping.deliveryZones}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {shippingZones.map((zone, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
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
                    {dictionary.cms.shipping.features}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/30 transition-colors">
                                <MapPin className="w-7 h-7 text-amber-600 dark:text-amber-500" />
                            </div>
                            <h3 className="font-semibold mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                {dictionary.cms.shipping.shippingFeatures.tracking.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {dictionary.cms.shipping.shippingFeatures.tracking.description}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                <Shield className="w-7 h-7 text-slate-600 dark:text-slate-400" />
                            </div>
                            <h3 className="font-semibold mb-3 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                                {dictionary.cms.shipping.shippingFeatures.packaging.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {dictionary.cms.shipping.shippingFeatures.packaging.description}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/30 transition-colors">
                                <Award className="w-7 h-7 text-amber-600 dark:text-amber-500" />
                            </div>
                            <h3 className="font-semibold mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                {dictionary.cms.shipping.shippingFeatures.guarantee.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {dictionary.cms.shipping.shippingFeatures.guarantee.description}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                <Star className="w-7 h-7 text-slate-600 dark:text-slate-400" />
                            </div>
                            <h3 className="font-semibold mb-3 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                                {dictionary.cms.shipping.shippingFeatures.premium.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {dictionary.cms.shipping.shippingFeatures.premium.description}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Contact Section */}
            <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800">
                <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">
                        {dictionary.cms.shipping.questionsAbout.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        {dictionary.cms.shipping.questionsAbout.description}
                    </p>

                    <div className={cn(
                        "flex flex-col sm:flex-row gap-4 justify-center",
                        dir === "rtl" ? "flex-row-reverse" : "flex-row"
                    )}>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{dictionary.cms.contact.office.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span>{dictionary.cms.contact.office.email}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
