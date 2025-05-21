
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  onClick?: () => void;
}

const Logo = ({ 
  size = "md", 
  className,
  showText = true,
  onClick
}: LogoProps) => {
  const navigate = useNavigate();
  
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };
  
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl"
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/");
    }
  };
  
  return (
    <div 
      className={cn(
        "logo-container cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className={cn("logo-img flex items-center justify-center", sizeClasses[size])}>
        <img 
          src="/lovable-uploads/2c36dba7-9c21-44c0-9d59-c51c67614466.png" 
          alt="ExpertEye Logo" 
          className="h-full w-full"
        />
      </div>
      {showText && (
        <span className={cn("font-bold text-primary logo-text", textSizeClasses[size])}>
          ExpertEye
        </span>
      )}
    </div>
  );
};

export default Logo;
