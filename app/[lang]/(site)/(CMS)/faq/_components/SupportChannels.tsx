import { Card, CardContent } from "@/components/shadcnUI/card";
import { Button } from "@/components/shadcnUI/button";
import { Phone, Mail, MessageSquare } from "lucide-react";

interface SupportChannelsProps {
  supportChannels?: Array<{
    icon: any;
    title: string;
    description: string;
    action: string;
    color: string;
  }>;
}

export function SupportChannels({ supportChannels }: SupportChannelsProps) {
  const defaultSupportChannels = [
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

  const displayChannels = supportChannels || defaultSupportChannels;

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Can't find what you're looking for? Our support team is here to help you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayChannels.map((channel, index) => (
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
  );
}
