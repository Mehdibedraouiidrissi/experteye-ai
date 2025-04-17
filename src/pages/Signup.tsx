
import { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import AuthFormHeader from "@/components/auth/components/AuthFormHeader";

const Signup = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "ExpertEye - Sign Up";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4">
      <AuthFormHeader isLogin={false} />
      
      <AuthForm isLogin={false} />
      
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
    </div>
  );
};

export default Signup;
