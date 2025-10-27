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

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dictionary = await getDictionary(lang);

  return {
    title: `${dictionary.cms.howToBuy.title} | متجر إلكتروني`,
    description: dictionary.cms.howToBuy.description,
  }
}

export default async function HowToBuyPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const steps = [
    {
      icon: Search,
      title: dictionary.cms.howToBuy.steps.browse.title,
      description: dictionary.cms.howToBuy.steps.browse.description,
      step: "1"
    },
    {
      icon: Heart,
      title: dictionary.cms.howToBuy.steps.wishlist.title,
      description: dictionary.cms.howToBuy.steps.wishlist.description,
      step: "2"
    },
    {
      icon: ShoppingCart,
      title: dictionary.cms.howToBuy.steps.addToCart.title,
      description: dictionary.cms.howToBuy.steps.addToCart.description,
      step: "3"
    },
    {
      icon: CreditCard,
      title: dictionary.cms.howToBuy.steps.payment.title,
      description: dictionary.cms.howToBuy.steps.payment.description,
      step: "4"
    },
    {
      icon: Truck,
      title: dictionary.cms.howToBuy.steps.track.title,
      description: dictionary.cms.howToBuy.steps.track.description,
      step: "5"
    },
    {
      icon: CheckCircle,
      title: dictionary.cms.howToBuy.steps.receive.title,
      description: dictionary.cms.howToBuy.steps.receive.description,
      step: "6"
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: dictionary.cms.howToBuy.benefits.security.title,
      description: dictionary.cms.howToBuy.benefits.security.description
    },
    {
      icon: Clock,
      title: dictionary.cms.howToBuy.benefits.fastDelivery.title,
      description: dictionary.cms.howToBuy.benefits.fastDelivery.description
    },
    {
      icon: RotateCcw,
      title: dictionary.cms.howToBuy.benefits.easyReturns.title,
      description: dictionary.cms.howToBuy.benefits.easyReturns.description
    },
    {
      icon: Award,
      title: dictionary.cms.howToBuy.benefits.highQuality.title,
      description: dictionary.cms.howToBuy.benefits.highQuality.description
    },
    {
      icon: Users,
      title: dictionary.cms.howToBuy.benefits.support.title,
      description: dictionary.cms.howToBuy.benefits.support.description
    }
  ]

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-500 px-4 py-2">
          <ShoppingCart className="w-4 h-4 mr-2" />
          {dictionary.cms.howToBuy.shoppingGuide}
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
          {dictionary.cms.howToBuy.stepByStep}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                    {step.step}
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
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
          {dictionary.cms.howToBuy.whyChoose}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/30 transition-colors">
                  <benefit.icon className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                </div>
                <h3 className="font-semibold mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
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
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            {dictionary.cms.howToBuy.moreQuestions.title}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {dictionary.cms.howToBuy.moreQuestions.description}
          </p>

          <div className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center",
            dir === "rtl" ? "flex-row-reverse" : "flex-row"
          )}>
            <Button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              {dictionary.cms.about.supportChannels.liveChat.action}
            </Button>
            <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-500">
              <Phone className="w-4 h-4 mr-2" />
              {dictionary.cms.contact.office.phone}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
