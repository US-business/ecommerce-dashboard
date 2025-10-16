import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Scale } from "lucide-react";

interface GoverningLawSectionProps {
  title?: string;
  description?: string;
  disputeProcess?: Array<string>;
}

export function GoverningLawSection({
  title = "Governing Law & Jurisdiction",
  description = "These terms are governed by the laws of [Your Jurisdiction]. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in [Your Location].",
  disputeProcess = [
    "Direct negotiation between parties",
    "Mediation through agreed mediator",
    "Binding arbitration if mediation fails",
    "Court proceedings as final resort"
  ]
}: GoverningLawSectionProps) {
  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {description}
          </p>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Dispute Resolution Process:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {disputeProcess.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
