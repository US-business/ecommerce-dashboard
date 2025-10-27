import { useState } from "react";
import { Input } from "@/components/shadcnUI/input";
import { Label } from "@/components/shadcnUI/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  dir: "rtl" | "ltr";
  helperText?: string;
}

export function PasswordInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  dir,
  helperText
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={cn("text-sm font-medium", "block")} dir={dir}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          required
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir={dir}
        /> 
        <button
          type="button"
          className={cn(
            "absolute top-3 h-4 w-4 text-gray-400 hover:text-gray-600",
            dir === "rtl" ? "left-3" : "right-3"
          )}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {helperText && (
        <p className={cn("text-xs text-gray-500")} dir={dir}>
          {helperText}
        </p>
      )}
    </div>
  );
}
