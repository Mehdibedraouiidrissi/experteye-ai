
import { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import AuthFormHeader from "@/components/auth/components/AuthFormHeader";
import Logo from "@/components/shared/Logo";

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
        <Logo size="sm" className="justify-center mb-2" />
        <p>ExpertEye &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Powered by RAG and Local LLMs</p>
      </footer>
    </div>
  );
};

export default Signup;
