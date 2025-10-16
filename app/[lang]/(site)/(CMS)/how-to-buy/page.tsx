import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Button } from "@/components/shadcnUI/button"
import {
  ShoppingCart,
  CreditCard,
  Truck,
  CheckCircle,
  Search,
  Heart,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Shield,
  RotateCcw,
  Award,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  return {
    title: `${dictionary.cms.howToBuy.title} | متجر إلكتروني`,
    description: dictionary.cms.howToBuy.description,
  }
}

export default async function HowToBuyPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const steps = [
    {
      icon: Search,
      title: dir === "rtl" ? "تصفح المنتجات" : "Browse Products",
      description: dir === "rtl"
        ? "تصفح مجموعتنا الواسعة من المنتجات واستخدم الفلاتر للعثور على ما تبحث عنه"
        : "Browse our wide range of products and use filters to find what you're looking for",
      step: "1"
    },
    {
      icon: Heart,
      title: dir === "rtl" ? "أضف للمفضلة" : "Add to Wishlist",
      description: dir === "rtl"
        ? "أضف المنتجات التي تعجبك إلى قائمة المفضلة لحفظها لوقت لاحق"
        : "Add products you like to your wishlist to save them for later",
      step: "2"
    },
    {
      icon: ShoppingCart,
      title: dir === "rtl" ? "أضف للسلة" : "Add to Cart",
      description: dir === "rtl"
        ? "اختر الكمية المناسبة وأضف المنتج إلى سلة التسوق الخاصة بك"
        : "Select the right quantity and add the product to your shopping cart",
      step: "3"
    },
    {
      icon: CreditCard,
      title: dir === "rtl" ? "ادفع بأمان" : "Secure Payment",
      description: dir === "rtl"
        ? "ادفع بطرق متعددة وآمنة مع حماية SSL متقدمة لبياناتك"
        : "Pay with multiple secure methods with advanced SSL protection for your data",
      step: "4"
    },
    {
      icon: Truck,
      title: dir === "rtl" ? "تتبع الشحنة" : "Track Delivery",
      description: dir === "rtl"
        ? "تتبع شحنتك في الوقت الفعلي حتى تصل إليك"
        : "Track your shipment in real-time until it reaches you",
      step: "5"
    },
    {
      icon: CheckCircle,
      title: dir === "rtl" ? "استلم المنتج" : "Receive Product",
      description: dir === "rtl"
        ? "استلم منتجك واستمتع بالجودة العالية والضمان الممتد"
        : "Receive your product and enjoy the high quality and extended warranty",
      step: "6"
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: dir === "rtl" ? "أمان مضمون" : "Guaranteed Security",
      description: dir === "rtl" ? "حماية متقدمة لبياناتك الشخصية والمالية" : "Advanced protection for your personal and financial data"
    },
    {
      icon: Clock,
      title: dir === "rtl" ? "توصيل سريع" : "Fast Delivery",
      description: dir === "rtl" ? "توصيل خلال 24 ساعة في معظم المناطق" : "Delivery within 24 hours in most areas"
    },
    {
      icon: RotateCcw,
      title: dir === "rtl" ? "إرجاع سهل" : "Easy Returns",
      description: dir === "rtl" ? "إرجاع مجاني خلال 30 يوم بدون أسئلة" : "Free returns within 30 days, no questions asked"
    },
    {
      icon: Award,
      title: dir === "rtl" ? "جودة عالية" : "High Quality",
      description: dir === "rtl" ? "منتجات أصلية من علامات تجارية موثوقة" : "Authentic products from trusted brands"
    },
    {
      icon: Users,
      title: dir === "rtl" ? "دعم عملاء" : "Customer Support",
      description: dir === "rtl" ? "فريق دعم متخصص متاح 24/7" : "Specialized support team available 24/7"
    }
  ]

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2">
          <ShoppingCart className="w-4 h-4 mr-2" />
          {dir === "rtl" ? "دليل التسوق" : "Shopping Guide"}
        </Badge>

        <h1 className="text-4xl font-bold mb-6">
          {dictionary.cms.howToBuy.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dictionary.cms.howToBuy.description}
        </p>
      </div>

      {/* Step by Step Guide */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">
          {dir === "rtl" ? "خطوات التسوق خطوة بخطوة" : "Step-by-Step Shopping Guide"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {step.step}
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">
          {dir === "rtl" ? "لماذا تختار متجرنا؟" : "Why Choose Our Store?"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            {dir === "rtl" ? "هل لديك أسئلة أخرى؟" : "Have More Questions?"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {dir === "rtl"
              ? "فريق الدعم متاح لمساعدتك في أي وقت. لا تتردد في التواصل معنا"
              : "Our support team is available to help you anytime. Don't hesitate to contact us"
            }
          </p>

          <div className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center",
            dir === "rtl" ? "flex-row-reverse" : "flex-row"
          )}>
            <Button className="bg-primary hover:bg-primary/90">
              <MessageCircle className="w-4 h-4 mr-2" />
              {dir === "rtl" ? "تواصل معنا" : "Contact Us"}
            </Button>
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              +1 (555) 123-4567
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
