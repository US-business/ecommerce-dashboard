import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Settings, Package, CreditCard, RefreshCw, MessageSquare, ChevronRight } from "lucide-react";

interface CategorySidebarProps {
    dictionary: {
        cms: {
            faq: {
                categories: {
                    general: string;
                    orders: string;
                    payments: string;
                    returns: string;
                    technical: string;
                };
            };
        };
        categories: {
            title: string;
        };
    };
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    searchTerm?: string;
}

export function CategorySidebar({
    dictionary,
    activeCategory,
    onCategoryChange,
    searchTerm
}: CategorySidebarProps) {
    if (searchTerm) return null;

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

    return (
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
                                    onClick={() => onCategoryChange(category)}
                                    className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${isActive ? 'bg-primary/10 border-r-2 border-primary' : ''
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${categoryColors[category as keyof typeof categoryColors]}`}>
                                        <IconComponent className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">
                                        {dictionary.cms.faq.categories[category as keyof typeof dictionary.cms.faq.categories]}
                                    </span>
                                    <ChevronRight className="h-4 w-4 ml-auto" />
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
