
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AuthFormFooterProps {
  isLogin: boolean;
}

const AuthFormFooter = ({ isLogin }: AuthFormFooterProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-center">
      <Button 
        variant="link" 
        onClick={() => navigate(isLogin ? "/signup" : "/login")}
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </Button>
    </div>
  );
};

export default AuthFormFooter;
