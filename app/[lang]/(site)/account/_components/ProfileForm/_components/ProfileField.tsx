import { cn } from "@/lib/utils";

interface ProfileFieldProps {
  label: string;
  value: string | null | undefined;
  dir: "rtl" | "ltr";
  fallback?: string;
}

export function ProfileField({ label, value, dir, fallback = "Not specified" }: ProfileFieldProps) {
  return (
    <div className={cn("space-y-2")}>
      <label className="text-sm font-medium text-gray-700 block" dir={dir}>
        {label}
      </label>
      <p className="text-amber-700 border border-amber-700 bg-amber-50 px-2 py-1 rounded" dir={dir}>
        {value || fallback}
      </p>
    </div>
  );
}
