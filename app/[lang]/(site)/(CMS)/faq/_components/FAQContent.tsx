import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Button } from "@/components/shadcnUI/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/shadcnUI/accordion";
import { HelpCircle, Search } from "lucide-react";

interface FAQContentProps {
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
    };
    activeCategory: string;
    searchTerm: string;
    filteredQuestions: Array<{
        question: string;
        answer: string;
    }>;
    onSearchClear: () => void;
}

export function FAQContent({
    dictionary,
    activeCategory,
    searchTerm,
    filteredQuestions,
    onSearchClear
}: FAQContentProps) {
    return (
        <div className={searchTerm ? "lg:col-span-4" : "lg:col-span-3"}>
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        {searchTerm ? "Search Results" : dictionary.cms.faq.categories[activeCategory as keyof typeof dictionary.cms.faq.categories]}
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
                            {filteredQuestions.map((item: any, index: number) => (
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
                                onClick={onSearchClear}
                                variant="outline"
                            >
                                Clear Search
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
