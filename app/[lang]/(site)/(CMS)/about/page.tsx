import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { Card, CardContent } from "@/components/shadcnUI/card";
import { Badge } from "@/components/shadcnUI/badge";
import { Separator } from "@/components/shadcnUI/separator";
import { 
  Rocket, 
  Users, 
  Target, 
  Heart, 
  Star, 
  Shield,
  TrendingUp,
  Award
} from "lucide-react";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);
  
  return {
    title: `${dictionary.cms.about.title} | E-Commerce Dashboard`,
    description: dictionary.cms.about.subtitle,
  };
}

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  const values = [
    {
      icon: Rocket,
      title: dictionary.cms.about.values.innovation.title,
      description: dictionary.cms.about.values.innovation.description,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Award,
      title: dictionary.cms.about.values.quality.title,
      description: dictionary.cms.about.values.quality.description,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Heart,
      title: dictionary.cms.about.values.customer.title,
      description: dictionary.cms.about.values.customer.description,
      color: "bg-rose-100 text-rose-600",
    },
  ];

  const stats = [
    { label: "Happy Customers", value: "10,000+", icon: Users },
    { label: "Years Experience", value: "5+", icon: TrendingUp },
    { label: "Products Sold", value: "50,000+", icon: Star },
    { label: "Success Rate", value: "99%", icon: Shield },
  ];

  const teamMembers = [
    {
      name: "Ahmed Al-Rashid",
      role: "CEO & Founder",
      image: "/team/ceo.jpg",
      description: "Visionary leader with 10+ years in e-commerce"
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      image: "/team/cto.jpg",
      description: "Tech innovator specializing in scalable platforms"
    },
    {
      name: "Mohammed Hassan",
      role: "Head of Design",
      image: "/team/designer.jpg",
      description: "Creative director with expertise in UX/UI"
    },
    {
      name: "Lisa Chen",
      role: "Marketing Director",
      image: "/team/marketing.jpg",
      description: "Growth strategist and brand development expert"
    },
  ];

  const isRTL = lang === 'ar';

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 text-sm font-medium">
          {dictionary.cms.about.subtitle}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {dictionary.cms.about.hero.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dictionary.cms.about.hero.description}
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="mb-16" />

      {/* Mission Section */}
      <div className="mb-16">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div className={`flex flex-col md:flex-row items-center gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">{dictionary.cms.about.mission.title}</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {dictionary.cms.about.mission.description}
                </p>
              </div>
              <div className="flex-1">
                <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <Target className="h-24 w-24 text-primary/30" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{dictionary.cms.about.values.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our core values guide everything we do and drive our commitment to excellence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${value.color}`}>
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="mb-16" />

      {/* Team Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{dictionary.cms.about.team.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary.cms.about.team.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="h-12 w-12 text-primary/60" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of satisfied customers and experience the future of e-commerce
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}