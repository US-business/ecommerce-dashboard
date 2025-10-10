import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Badge } from "@/components/shadcnUI/badge";
import { Separator } from "@/components/shadcnUI/separator";
import { 
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  FileText,
  Phone,
  Calendar
} from "lucide-react";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);
  
  return {
    title: `${dictionary.cms.privacy.title} | E-Commerce Dashboard`,
    description: dictionary.cms.privacy.subtitle,
  };
}

export default async function PrivacyPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  const sections = [
    {
      key: 'introduction',
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      key: 'collection',
      icon: Database,
      color: "bg-green-100 text-green-600",
    },
    {
      key: 'usage',
      icon: Eye,
      color: "bg-purple-100 text-purple-600",
    },
    {
      key: 'sharing',
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
    {
      key: 'security',
      icon: Shield,
      color: "bg-red-100 text-red-600",
    },
    {
      key: 'rights',
      icon: Lock,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      key: 'contact',
      icon: Phone,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const highlights = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "We implement industry-standard security measures to protect your information",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your privacy is our priority and we never sell your personal data",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We're transparent about what data we collect and how we use it",
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 text-sm font-medium">
          <Calendar className="h-3 w-3 mr-1" />
          {dictionary.cms.privacy.lastUpdated}: January 15, 2024
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {dictionary.cms.privacy.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dictionary.cms.privacy.subtitle}
        </p>
      </div>

      {/* Highlights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {highlights.map((highlight, index) => (
          <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <highlight.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{highlight.title}</h3>
              <p className="text-sm text-muted-foreground">{highlight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="mb-16" />

      {/* Privacy Policy Sections */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={section.key} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <section.icon className="h-5 w-5" />
                  </div>
                  {dictionary.cms.privacy.sections[section.key].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {dictionary.cms.privacy.sections[section.key].content}
                  </p>
                  
                  {/* Additional content for specific sections */}
                  {section.key === 'collection' && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Types of Information We Collect:</h4>
                      <ul className="list-disc list-inside text-blue-800 space-y-1">
                        <li>Personal identification information (name, email, phone)</li>
                        <li>Payment and billing information</li>
                        <li>Device and usage data</li>
                        <li>Location data (when permitted)</li>
                        <li>Communication preferences</li>
                      </ul>
                    </div>
                  )}

                  {section.key === 'usage' && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">We Use Your Information To:</h4>
                      <ul className="list-disc list-inside text-purple-800 space-y-1">
                        <li>Process orders and payments</li>
                        <li>Provide customer support</li>
                        <li>Send important updates</li>
                        <li>Improve our services</li>
                        <li>Personalize your experience</li>
                      </ul>
                    </div>
                  )}

                  {section.key === 'rights' && (
                    <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Your Rights Include:</h4>
                      <ul className="list-disc list-inside text-indigo-800 space-y-1">
                        <li>Right to access your personal data</li>
                        <li>Right to correct inaccurate information</li>
                        <li>Right to delete your data</li>
                        <li>Right to restrict processing</li>
                        <li>Right to data portability</li>
                        <li>Right to object to processing</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white max-w-4xl mx-auto">
          <CardContent className="p-8">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
            <p className="text-lg mb-6 opacity-90">
              We're committed to transparency and protecting your personal information. 
              If you have any questions about this policy, don't hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Contact Us
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                Download PDF
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Cookie Policy</h3>
            <p className="text-sm text-muted-foreground">Learn about our use of cookies</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Terms of Service</h3>
            <p className="text-sm text-muted-foreground">Read our terms and conditions</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Data Protection Officer</h3>
            <p className="text-sm text-muted-foreground">Contact our DPO directly</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}