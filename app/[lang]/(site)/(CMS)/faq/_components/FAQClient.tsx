"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Button } from "@/components/shadcnUI/button";
import { Input } from "@/components/shadcnUI/input";
import { Badge } from "@/components/shadcnUI/badge";
import { Separator } from "@/components/shadcnUI/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcnUI/accordion";
import { 
  HelpCircle,
  Search,
  Package,
  CreditCard,
  RefreshCw,
  Settings,
  MessageSquare,
  Phone,
  Mail, 
  ChevronRight
} from "lucide-react";

interface FAQClientProps {
  dictionary: any;
}

export function FAQClient({ dictionary }: FAQClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("general");

  const categoryIcons = {
    general: Settings,
    orders: Package,
    payments: CreditCard,
    returns: RefreshCw,
    technical: MessageSquare,
  };

  const categoryColors = {
    general: "bg-blue-100 text-blue-600",
    orders: "bg-green-100 text-green-600",
    payments: "bg-purple-100 text-purple-600",
    returns: "bg-orange-100 text-orange-600",
    technical: "bg-red-100 text-red-600",
  };

  // Filter questions based on search term
  const filteredQuestions = useMemo(() => {
    if (!searchTerm) return dictionary.cms.faq.questions[activeCategory];
    
    const allQuestions = Object.values(dictionary.cms.faq.questions).flat() as Array<{
      question: string;
      answer: string;
    }>;
    
    return allQuestions.filter((item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeCategory, dictionary.cms.faq.questions]);

  const stats = [
    { label: "Total Questions", value: "50+", icon: HelpCircle },
    { label: "Categories", value: "5", icon: Settings },
    { label: "Average Response", value: "< 24h", icon: MessageSquare },
    { label: "Satisfaction Rate", value: "98%", icon: Package },
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
          {dictionary.cms.faq.subtitle}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {dictionary.cms.faq.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Find answers to the most commonly asked questions about our services
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={dictionary.cms.faq.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center border-0 shadow-md">
            <CardContent className="p-4">
              <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-lg font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category Sidebar */}
        {!searchTerm && (
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{dictionary.categories.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {Object.keys(dictionary.cms.faq.categories).map((category) => {
                    const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
                    const isActive = activeCategory === category;
                    
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                          isActive ? 'bg-primary/10 border-r-2 border-primary' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${categoryColors[category as keyof typeof categoryColors]}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className="font-medium">
                          {dictionary.cms.faq.categories[category]}
                        </span>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ Content */}
        <div className={searchTerm ? "lg:col-span-4" : "lg:col-span-3"}>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                {searchTerm ? "Search Results" : dictionary.cms.faq.categories[activeCategory]}
              </CardTitle>
              {!searchTerm && (
                <p className="text-sm text-muted-foreground">
                  {filteredQuestions.length} questions in this category
                </p>
              )}
            </CardHeader>
            <CardContent>
              {filteredQuestions.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredQuestions.map((item : any, index : number) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:text-primary">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Results Found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any questions matching your search term.
                  </p>
                  <Button
                    onClick={() => setSearchTerm("")}
                    variant="outline"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-16" />

      {/* Support Channels */}
      <div className="mb-16">
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

      {/* Call to Action */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <CardContent className="p-8">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-4">Didn't Find Your Answer?</h3>
            <p className="text-lg mb-6 opacity-90">
              Our dedicated support team is ready to help you with any questions or concerns
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Mail className="h-4 w-4 mr-2" />
                Submit Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}