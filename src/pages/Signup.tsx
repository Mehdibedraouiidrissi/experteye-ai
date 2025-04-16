
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const Signup = () => {
  
  useEffect(() => {
    document.title = "ExpertEye - Sign Up";
  }, []);
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center mb-6">
        <div className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
          >
          <img 
            src="/lovable-uploads/b62e1898-4b6c-49cf-8eea-204a5d62414e.png" 
            alt="ExpertEye Logo" 
            className="h-10 w-10"
          />
          <h1 className="text-3xl font-bold" style={{color: "#3A0CA3"}}>
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
