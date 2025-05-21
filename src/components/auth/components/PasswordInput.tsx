
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean; // Add the disabled prop
}

const PasswordInput = ({
  id,
  value,
  onChange,
  label = "Password",
  placeholder = "••••••••",
  required = true,
  autoComplete = "current-password",
  disabled = false // Add default value
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pr-10"
          autoComplete={autoComplete}
          disabled={disabled} // Pass the disabled prop to the Input
        />
        <button 
          type="button" 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled} // Also disable the show/hide button when the input is disabled
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
