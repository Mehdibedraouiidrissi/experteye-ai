
import Logo from "@/components/shared/Logo";

interface AuthFormHeaderProps {
  isLogin: boolean;
}

const AuthFormHeader = ({ isLogin }: AuthFormHeaderProps) => {
  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center mb-6">
      <Logo size="lg" className="mb-4" />
      <h2 className="text-xl font-medium text-center text-foreground/80 mb-2">
        AI-Powered Support
      </h2>
      <p className="text-sm text-center text-muted-foreground">
        {isLogin 
          ? "Access our AI-powered support chatbot, designed to assist with product specifications, troubleshooting, warranty information, and more."
          : "Create an account to access our AI-powered support chatbot, designed to assist with product specifications, troubleshooting, warranty information, and more."
        }
      </p>
    </div>
  );
};

export default AuthFormHeader;
