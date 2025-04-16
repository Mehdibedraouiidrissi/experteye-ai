
import { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "ExpertEye - Sign Up";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center mb-6">
        <div 
          className="logo-container mb-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
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
          Create an account to access our AI-powered support chatbot, designed to assist with product specifications, troubleshooting, warranty information, and more.
        </p>
      </div>
      
      <AuthForm isLogin={false} />
      
      <footer className="mt-8 text-xs text-center text-muted-foreground">
        <p>ExpertEye &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Powered by RAG and Local LLMs</p>
      </footer>
    </div>
  );
};

export default Signup;
