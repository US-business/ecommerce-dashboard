import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Badge } from "@/components/shadcnUI/badge";
import { Separator } from "@/components/shadcnUI/separator";
import { Alert, AlertDescription } from "@/components/shadcnUI/alert";
import { 
  FileText,
  Scale,
  Shield,
  User,
  AlertCircle,
  Copyright,
  Ban,
  Calendar,
  CheckCircle
} from "lucide-react";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);
  
  return {
    title: `${dictionary.cms.terms.title} | E-Commerce Dashboard`,
    description: dictionary.cms.terms.subtitle,
  };
}

export default async function TermsPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  const sections = [
    {
      key: 'acceptance',
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      key: 'services',
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      key: 'account',
      icon: User,
      color: "bg-purple-100 text-purple-600",
    },
    {
      key: 'prohibited',
      icon: Ban,
      color: "bg-red-100 text-red-600",
    },
    {
      key: 'intellectual',
      icon: Copyright,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      key: 'limitation',
      icon: Shield,
      color: "bg-orange-100 text-orange-600",
    },
    {
      key: 'modifications',
      icon: Calendar,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const keyPoints = [
    {
      icon: Scale,
      title: "Legal Agreement",
      description: "These terms constitute a legally binding agreement between you and us",
    },
    {
      icon: Shield,
      title: "User Protection",
      description: "We're committed to providing a safe and secure platform for all users",
    },
    {
      icon: FileText,
      title: "Clear Guidelines",
      description: "Our terms provide clear guidelines on acceptable use of our services",
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 text-sm font-medium">
          <Calendar className="h-3 w-3 mr-1" />
          {dictionary.cms.terms.lastUpdated}: January 15, 2024
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {dictionary.cms.terms.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dictionary.cms.terms.subtitle}
        </p>
      </div>

      {/* Important Notice */}
      <Alert className="mb-16 border-orange-200 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Important:</strong> By using our services, you agree to these terms. 
          Please read them carefully before proceeding.
        </AlertDescription>
      </Alert>

      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {keyPoints.map((point, index) => (
          <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <point.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="mb-16" />

      {/* Terms Sections */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={section.key} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <section.icon className="h-5 w-5" />
                  </div>
                  {dictionary.cms.terms.sections[section.key].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {dictionary.cms.terms.sections[section.key].content}
                  </p>
                  
                  {/* Additional content for specific sections */}
                  {section.key === 'prohibited' && (
                    <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-2">Prohibited Activities Include:</h4>
                      <ul className="list-disc list-inside text-red-800 space-y-1">
                        <li>Violating any applicable laws or regulations</li>
                        <li>Infringing on intellectual property rights</li>
                        <li>Transmitting harmful or malicious code</li>
                        <li>Engaging in fraudulent activities</li>
                        <li>Harassing or threatening other users</li>
                        <li>Unauthorized data collection or scraping</li>
                      </ul>
                    </div>
                  )}

                  {section.key === 'account' && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Account Responsibilities:</h4>
                      <ul className="list-disc list-inside text-purple-800 space-y-1">
                        <li>Provide accurate and complete information</li>
                        <li>Keep your login credentials secure</li>
                        <li>Notify us of unauthorized account access</li>
                        <li>Update your information when necessary</li>
                        <li>Comply with our community guidelines</li>
                      </ul>
                    </div>
                  )}

                  {section.key === 'intellectual' && (
                    <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Protected Materials Include:</h4>
                      <ul className="list-disc list-inside text-indigo-800 space-y-1">
                        <li>Website design and layout</li>
                        <li>Logos, trademarks, and brand assets</li>
                        <li>Software code and algorithms</li>
                        <li>Content, text, and images</li>
                        <li>Product descriptions and specifications</li>
                      </ul>
                    </div>
                  )}

                  {section.key === 'limitation' && (
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Limitation Scope:</h4>
                      <ul className="list-disc list-inside text-orange-800 space-y-1">
                        <li>Direct, indirect, or consequential damages</li>
                        <li>Loss of profits or business opportunities</li>
                        <li>Data loss or corruption</li>
                        <li>Service interruptions or downtime</li>
                        <li>Third-party actions or omissions</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Governing Law Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-primary" />
              Governing Law & Jurisdiction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These terms are governed by the laws of [Your Jurisdiction]. Any disputes 
              arising from these terms will be subject to the exclusive jurisdiction of 
              the courts in [Your Location].
            </p>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Dispute Resolution Process:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Direct negotiation between parties</li>
                <li>Mediation through agreed mediator</li>
                <li>Binding arbitration if mediation fails</li>
                <li>Court proceedings as final resort</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white max-w-4xl mx-auto">
          <CardContent className="p-8">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
            <p className="text-lg mb-6 opacity-90">
              If you have any questions about these terms and conditions, 
              please don't hesitate to contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Contact Legal Team
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                Download Terms
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Privacy Policy</h3>
            <p className="text-sm text-muted-foreground">How we protect your data</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Cookie Policy</h3>
            <p className="text-sm text-muted-foreground">Our use of cookies explained</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Scale className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Legal Notice</h3>
            <p className="text-sm text-muted-foreground">Important legal information</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}