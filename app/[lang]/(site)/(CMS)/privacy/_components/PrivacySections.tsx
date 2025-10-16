import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Shield, Eye, Lock, Users, Database, FileText, Phone } from "lucide-react";

interface PrivacySectionsProps {
    dictionary: {
        cms: {
            privacy: {
                sections: {
                    introduction: { title: string; content: string };
                    collection: { title: string; content: string };
                    usage: { title: string; content: string };
                    sharing: { title: string; content: string };
                    security: { title: string; content: string };
                    rights: { title: string; content: string };
                    contact: { title: string; content: string };
                };
            };
        };
    };
    sections?: Array<{
        key: string;
        icon: any;
        color: string;
    }>;
}

export function PrivacySections({ dictionary, sections }: PrivacySectionsProps) {
    const defaultSections = [
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

    const displaySections = sections || defaultSections;

    const getSectionContent = (sectionKey: string) => {
        const section = dictionary.cms.privacy.sections[sectionKey as keyof typeof dictionary.cms.privacy.sections];
        return section;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
                {displaySections.map((section, index) => {
                    const sectionData = getSectionContent(section.key);

                    return (
                        <Card key={section.key} className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${section.color}`}>
                                        <section.icon className="h-5 w-5" />
                                    </div>
                                    {sectionData.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {sectionData.content}
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
                    );
                })}
            </div>
        </div>
    );
}
