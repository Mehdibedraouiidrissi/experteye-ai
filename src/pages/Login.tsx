
import { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { Eye } from "lucide-react";

const Login = () => {
  useEffect(() => {
    document.title = "ExpertEye - Login";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Eye className="h-8 w-8 text-expertEye-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-expertEye-600 to-expertEye-800 bg-clip-text text-transparent">
            ExpertEye
          </h1>
        </div>
        <h2 className="text-xl font-medium text-center text-foreground/80 mb-2">
          Document Intelligence
        </h2>
        <p className="text-sm text-center text-muted-foreground">
          Access your documents and ask questions using AI
        </p>
      </div>
      
      <AuthForm isLogin={true} />
      
      <footer className="mt-8 text-xs text-center text-muted-foreground">
        <p>ExpertEye Document Intelligence &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Powered by RAG and Local LLMs</p>
      </footer>
    </div>
  );
};

export default Login;
