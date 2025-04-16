
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ExpertEye - Login";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-md flex flex-col items-center justify-center mb-6">
        <div className="logo-container mb-4">
          <div className="logo-img flex items-center justify-center">
            <img 
              src="/lovable-uploads/2c36dba7-9c21-44c0-9d59-c51c67614466.png" 
              alt="ExpertEye Logo" 
              className="h-10 w-10"
            />
          </div>
          <h1 className="text-3xl font-bold text-primary logo-text">
            ExpertEye
          </h1>
        </div>
        <h2 className="text-xl font-medium text-center text-foreground/80 mb-2">
          AI-Powered Support
        </h2>
        <p className="text-sm text-center text-muted-foreground">
          Access our AI-powered support chatbot, designed to assist with product specifications, troubleshooting, warranty information, and more.
        </p>
      </div>
      
      <AuthForm isLogin={true} />
      
      <footer className="mt-8 text-xs text-center text-muted-foreground">
        <p>ExpertEye &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Powered by RAG and Local LLMs</p>
      </footer>

      {/* Chat Demo Button */}
      <Button 
        size="lg" 
        className="fixed bottom-6 right-6 rounded-full h-16 w-16 shadow-lg bg-[#3A0CA3] hover:bg-[#2C0882] text-white"
        onClick={() => navigate("/chatdemo")}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Login;
