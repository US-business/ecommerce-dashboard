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
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);
  
  return {
    title: `${dictionary.cms.contact.title} | E-Commerce Dashboard`,
    description: dictionary.cms.contact.subtitle,
  };
}

export default async function ContactPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  const contactInfo = [
    {
      icon: MapPin,
      title: dictionary.cms.contact.info.address,
      value: dictionary.cms.contact.office.address,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Phone,
      title: dictionary.cms.contact.info.phone,
      value: dictionary.cms.contact.office.phone,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Mail,
      title: dictionary.cms.contact.info.email,
      value: dictionary.cms.contact.office.email,
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Clock,
      title: dictionary.cms.contact.info.hours,
      value: dictionary.cms.contact.office.hours,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Quick Response",
      description: "We respond to all inquiries within 24 hours",
    },
    {
      icon: HeadphonesIcon,
      title: "Professional Support",
      description: "Our expert team is here to help you succeed",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Supporting customers worldwide with local expertise",
    },
  ];

  const supportChannels = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      action: "Call Now",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions via email",
      action: "Send Email",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 text-sm font-medium">
          {dictionary.cms.contact.subtitle}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
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
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">Find us on the map</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
            <p className="text-lg mb-6 opacity-90">
              Our support team is available to help you with any urgent matters
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Channels */}
      <div className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you
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