
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import AuthFormHeader from "@/components/auth/components/AuthFormHeader";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ExpertEye - Login";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4 relative">
      <AuthFormHeader isLogin={true} />
      
      <AuthForm isLogin={true} />
      
      <footer className="mt-8 text-xs text-center text-muted-foreground">
        <div className="logo-container justify-center mb-2">
          <div className="logo-img flex items-center justify-center h-6 w-6">
            <img 
              src="/lovable-uploads/2c36dba7-9c21-44c0-9d59-c51c67614466.png" 
              alt="ExpertEye Logo" 
              className="h-full w-full"
            />
          </div>
          <span className="text-sm font-bold text-primary logo-text">ExpertEye</span>
        </div>
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
