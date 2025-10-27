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

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dictionary = await getDictionary(lang);

  return {
    title: `${dictionary.cms.paymentMethods.title} | متجر إلكتروني`,
    description: dictionary.cms.paymentMethods.description,
  }
}

export default async function PaymentMethodsPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const paymentMethods = [
    {
      icon: CreditCard,
      name: "Visa",
      description: dictionary.cms.paymentMethods.methods.creditCard.description,
      popular: true,
      processingTime: dictionary.cms.paymentMethods.methods.instant
    },
    {
      icon: CreditCard,
      name: "Mastercard",
      description: dictionary.cms.paymentMethods.methods.creditCard.description,
      popular: true,
      processingTime: dictionary.cms.paymentMethods.methods.instant
    },
    {
      icon: CreditCard,
      name: "American Express",
      description: dictionary.cms.paymentMethods.methods.creditCard.description,
      popular: false,
      processingTime: dictionary.cms.paymentMethods.methods.instant
    },
    {
      icon: Smartphone,
      name: dictionary.cms.paymentMethods.methods.applePay.name,
      description: dictionary.cms.paymentMethods.methods.applePay.description,
      popular: true,
      processingTime: dictionary.cms.paymentMethods.methods.instant
    },
    {
      icon: Smartphone,
      name: dictionary.cms.paymentMethods.methods.googlePay.name,
      description: dictionary.cms.paymentMethods.methods.googlePay.description,
      popular: true,
      processingTime: dictionary.cms.paymentMethods.methods.instant
    },
    {
      icon: Building,
      name: dictionary.cms.paymentMethods.methods.bankTransfer.name,
      description: dictionary.cms.paymentMethods.methods.bankTransfer.description,
      popular: false,
      processingTime: `1-3 ${dictionary.cms.paymentMethods.methods.businessDays}`
    },
    {
      icon: Wallet,
      name: dictionary.cms.paymentMethods.methods.paypal.name,
      description: dictionary.cms.paymentMethods.methods.paypal.description,
      popular: true,
      processingTime: dictionary.cms.paymentMethods.methods.instant
    }
  ]

  const securityFeatures = [
    {
      icon: Shield,
      title: dictionary.cms.paymentMethods.security.ssl.title,
      description: dictionary.cms.paymentMethods.security.ssl.description
    },
    {
      icon: Lock,
      title: dictionary.cms.paymentMethods.security.pci.title,
      description: dictionary.cms.paymentMethods.security.pci.description
    },
    {
      icon: CheckCircle,
      title: dictionary.cms.paymentMethods.security.twoFactor.title,
      description: dictionary.cms.paymentMethods.security.twoFactor.description
    },
    {
      icon: Globe,
      title: dictionary.cms.paymentMethods.security.global.title,
      description: dictionary.cms.paymentMethods.security.global.description
    }
  ]

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-500 px-4 py-2">
          <CreditCard className="w-4 h-4 mr-2" />
          {dictionary.cms.paymentMethods.paymentMethodsLabel}
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
          {dictionary.cms.paymentMethods.chooseMethod}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                    <method.icon className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                  </div>
                  {method.popular && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-500">
                      {dictionary.cms.paymentMethods.methods.popular}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
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
          {dictionary.cms.paymentMethods.securityProtection}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/30 transition-colors">
                  <feature.icon className="w-7 h-7 text-amber-600 dark:text-amber-500" />
                </div>
                <h3 className="font-semibold mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
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
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            {dictionary.cms.paymentMethods.paymentFaq.title}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {dictionary.cms.paymentMethods.paymentFaq.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  {dictionary.cms.paymentMethods.paymentFaq.isSecure.question}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {dictionary.cms.paymentMethods.paymentFaq.isSecure.answer}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  {dictionary.cms.paymentMethods.paymentFaq.availableMethods.question}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {dictionary.cms.paymentMethods.paymentFaq.availableMethods.answer}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  {dictionary.cms.paymentMethods.paymentFaq.whenCharged.question}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {dictionary.cms.paymentMethods.paymentFaq.whenCharged.answer}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  {dictionary.cms.paymentMethods.paymentFaq.canCancel.question}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {dictionary.cms.paymentMethods.paymentFaq.canCancel.answer}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
