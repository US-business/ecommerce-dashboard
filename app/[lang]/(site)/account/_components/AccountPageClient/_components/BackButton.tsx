import { Button } from "@/components/shadcnUI/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  text: string;
  onBack: () => void;
}

export function BackButton({ text, onBack }: BackButtonProps) {
  return (
    <div className={cn("mb-6")}>
      <Button
        variant="ghost"
        onClick={onBack}
        className={cn("flex items-center gap-2")}
      >
        <ArrowLeft className={cn("h-4 w-4")} />
        {text}
      </Button>
    </div>
  );
}
