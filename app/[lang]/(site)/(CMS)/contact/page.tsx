import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { ContactForm } from "./_components/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Button } from "@/components/shadcnUI/button";
import { Badge } from "@/components/shadcnUI/badge";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageSquare,
  HeadphonesIcon,
  Globe
} from "lucide-react";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";
  
  return {
    title: `${dictionary.cms.contact.title} | E-Commerce Dashboard`,
    description: dictionary.cms.contact.subtitle,
    dir,
  };
}

export default async function ContactPage({ params }: { params: { lang: string } }) {  const resolvedParams = await params;

  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const contactInfo = [
    {
      icon: MapPin,
      title: dictionary.cms.contact.info.address,
      value: dictionary.cms.contact.office.address,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
    {
      icon: Phone,
      title: dictionary.cms.contact.info.phone,
      value: dictionary.cms.contact.office.phone,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      icon: Mail,
      title: dictionary.cms.contact.info.email,
      value: dictionary.cms.contact.office.email,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
    {
      icon: Clock,
      title: dictionary.cms.contact.info.hours,
      value: dictionary.cms.contact.office.hours,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: dictionary.cms.about.features.quickResponse.title,
      description: dictionary.cms.about.features.quickResponse.description,
    },
    {
      icon: HeadphonesIcon,
      title: dictionary.cms.about.features.professionalSupport.title,
      description: dictionary.cms.about.features.professionalSupport.description,
    },
    {
      icon: Globe,
      title: dictionary.cms.about.features.globalReach.title,
      description: dictionary.cms.about.features.globalReach.description,
    },
  ];

  const supportChannels = [
    {
      icon: Phone,
      title: dictionary.cms.about.supportChannels.phone.title,
      description: dictionary.cms.about.supportChannels.phone.description,
      action: dictionary.cms.about.supportChannels.phone.action,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      icon: Mail,
      title: dictionary.cms.about.supportChannels.email.title,
      description: dictionary.cms.about.supportChannels.email.description,
      action: dictionary.cms.about.supportChannels.email.action,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
    {
      icon: MessageSquare,
      title: dictionary.cms.about.supportChannels.liveChat.title,
      description: dictionary.cms.about.supportChannels.liveChat.description,
      action: dictionary.cms.about.supportChannels.liveChat.action,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 text-sm font-medium">
          {dictionary.cms.contact.subtitle}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-500 dark:to-amber-700 bg-clip-text text-transparent">
          {dictionary.cms.contact.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dictionary.cms.contact.info.description}
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <ContactForm dictionary={dictionary} />

        {/* Contact Information */}
        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{dictionary.cms.contact.office.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${info.color}`}>
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    <p className="text-muted-foreground">{info.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="h-64 bg-gradient-to-br from-amber-50 to-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-amber-600 dark:text-amber-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">{dictionary.cms.contact.map.title}</p>
                  <p className="text-sm text-muted-foreground">{dictionary.cms.contact.map.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-700 dark:to-amber-900 border-0 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">{dictionary.cms.contact.needHelp.title}</h3>
            <p className="text-lg mb-6 opacity-90">
              {dictionary.cms.contact.needHelp.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <Phone className="h-4 w-4 mr-2" />
                {dictionary.cms.about.supportChannels.phone.action}
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-amber-600">
                <Mail className="h-4 w-4 mr-2" />
                {dictionary.cms.about.supportChannels.email.action}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Channels */}
      <div className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{dictionary.cms.contact.stillNeedHelp.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary.cms.contact.stillNeedHelp.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supportChannels.map((channel, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${channel.color}`}>
                  <channel.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{channel.title}</h3>
                <p className="text-muted-foreground mb-4">{channel.description}</p>
                <Button className="w-full" variant="outline">
                  {channel.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}