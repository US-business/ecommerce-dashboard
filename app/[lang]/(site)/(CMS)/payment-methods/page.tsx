import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import {
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  Shield,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  return {
    title: `${dictionary.cms.paymentMethods.title} | متجر إلكتروني`,
    description: dictionary.cms.paymentMethods.description,
  }
}

export default async function PaymentMethodsPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const paymentMethods = [
    {
      icon: CreditCard,
      name: "Visa",
      description: dir === "rtl" ? "بطاقات فيزا الائتمانية والخصم" : "Visa credit and debit cards",
      popular: true,
      processingTime: dir === "rtl" ? "فوري" : "Instant"
    },
    {
      icon: CreditCard,
      name: "Mastercard",
      description: dir === "rtl" ? "بطاقات ماستركارد الائتمانية والخصم" : "Mastercard credit and debit cards",
      popular: true,
      processingTime: dir === "rtl" ? "فوري" : "Instant"
    },
    {
      icon: CreditCard,
      name: "American Express",
      description: dir === "rtl" ? "بطاقات أمريكان إكسبريس" : "American Express cards",
      popular: false,
      processingTime: dir === "rtl" ? "فوري" : "Instant"
    },
    {
      icon: Smartphone,
      name: dir === "rtl" ? "أبل باي" : "Apple Pay",
      description: dir === "rtl" ? "الدفع السريع والآمن عبر أجهزة أبل" : "Fast and secure payment via Apple devices",
      popular: true,
      processingTime: dir === "rtl" ? "فوري" : "Instant"
    },
    {
      icon: Smartphone,
      name: dir === "rtl" ? "جوجل باي" : "Google Pay",
      description: dir === "rtl" ? "الدفع السريع عبر خدمات جوجل" : "Fast payment via Google services",
      popular: true,
      processingTime: dir === "rtl" ? "فوري" : "Instant"
    },
    {
      icon: Building,
      name: dir === "rtl" ? "التحويل البنكي" : "Bank Transfer",
      description: dir === "rtl" ? "تحويل مباشر من حسابك البنكي" : "Direct transfer from your bank account",
      popular: false,
      processingTime: dir === "rtl" ? "1-3 أيام عمل" : "1-3 business days"
    },
    {
      icon: Wallet,
      name: dir === "rtl" ? "باي بال" : "PayPal",
      description: dir === "rtl" ? "الدفع الآمن عبر باي بال" : "Secure payment via PayPal",
      popular: true,
      processingTime: dir === "rtl" ? "فوري" : "Instant"
    }
  ]

  const securityFeatures = [
    {
      icon: Shield,
      title: dir === "rtl" ? "تشفير SSL" : "SSL Encryption",
      description: dir === "rtl" ? "حماية متقدمة لبياناتك" : "Advanced data protection"
    },
    {
      icon: Lock,
      title: dir === "rtl" ? "حماية PCI DSS" : "PCI DSS Compliance",
      description: dir === "rtl" ? "امتثال لمعايير أمان البطاقات" : "Compliance with card security standards"
    },
    {
      icon: CheckCircle,
      title: dir === "rtl" ? "التحقق الثنائي" : "Two-Factor Authentication",
      description: dir === "rtl" ? "حماية إضافية لحسابك" : "Extra protection for your account"
    },
    {
      icon: Globe,
      title: dir === "rtl" ? "حماية عالمية" : "Global Protection",
      description: dir === "rtl" ? "أمان معتمد عالمياً" : "Globally certified security"
    }
  ]

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2">
          <CreditCard className="w-4 h-4 mr-2" />
          {dir === "rtl" ? "طرق الدفع" : "Payment Methods"}
        </Badge>

        <h1 className="text-4xl font-bold mb-6">
          {dictionary.cms.paymentMethods.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dictionary.cms.paymentMethods.description}
        </p>
      </div>

      {/* Payment Methods Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">
          {dir === "rtl" ? "اختر طريقة الدفع المناسبة" : "Choose Your Payment Method"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  {method.popular && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      {dir === "rtl" ? "شائع" : "Popular"}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {method.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {method.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{method.processingTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">
          {dir === "rtl" ? "الأمان والحماية" : "Security & Protection"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
                  <feature.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold mb-3 group-hover:text-green-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
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
            {dir === "rtl" ? "أسئلة شائعة حول الدفع" : "Payment FAQ"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {dir === "rtl"
              ? "إليك إجابات على أكثر الأسئلة شيوعاً حول طرق الدفع والأمان"
              : "Here are answers to the most common questions about payment methods and security"
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  {dir === "rtl" ? "هل الدفع آمن؟" : "Is payment secure?"}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {dir === "rtl"
                    ? "نعم، نحن نستخدم تشفير SSL متقدم وحماية PCI DSS لحماية بياناتك"
                    : "Yes, we use advanced SSL encryption and PCI DSS protection for your data"
                  }
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  {dir === "rtl" ? "ما هي طرق الدفع المتاحة؟" : "What payment methods are available?"}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {dir === "rtl"
                    ? "نقبل جميع البطاقات الائتمانية الرئيسية وأبل باي وجوجل باي وباي بال"
                    : "We accept all major credit cards, Apple Pay, Google Pay, and PayPal"
                  }
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  {dir === "rtl" ? "متى يتم خصم المبلغ؟" : "When is the amount charged?"}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {dir === "rtl"
                    ? "يتم خصم المبلغ فور تأكيد الطلب بالنسبة للبطاقات والمحافظ الإلكترونية"
                    : "The amount is charged immediately upon order confirmation for cards and e-wallets"
                  }
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  {dir === "rtl" ? "هل يمكنني إلغاء الطلب؟" : "Can I cancel my order?"}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {dir === "rtl"
                    ? "يمكنك إلغاء الطلب قبل الشحن مع استرداد كامل للمبلغ"
                    : "You can cancel your order before shipping with a full refund"
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
