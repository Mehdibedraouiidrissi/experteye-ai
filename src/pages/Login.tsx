
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
=======
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
>>>>>>> 7e9cd1441b7c9e5a345e2df50e6c52d1494b9b40
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ExpertEye - Login";
  }, []);
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-md flex flex-col items-center justify-center mb-6">
        <div 
          className="flex items-center gap-2 cursor-pointer"
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
