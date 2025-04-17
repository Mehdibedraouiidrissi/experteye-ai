
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthApi, useApiErrorHandler } from "@/services/api";

export const useAuth = (isLogin: boolean) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleError } = useApiErrorHandler();

  const validateExpertEyeEmail = (email: string) => {
    return email.endsWith("@experteye.com");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setBackendError(null);
    
    if (!isLogin) {
      if (!validateExpertEyeEmail(email)) {
        toast({
          title: "Invalid Email",
          description: "Only @experteye.com email addresses are allowed.",
          variant: "destructive",
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (email && !validateExpertEyeEmail(email)) {
        toast({
          title: "Invalid Email Format",
          description: "Only @experteye.com email addresses are allowed.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        await AuthApi.login(username || email, password);
        toast({
          title: "Logged in successfully",
          description: "Welcome back to ExpertEye!",
        });
        // Force navigation using direct call instead of navigate hook
        window.location.href = "/dashboard";
      } else {
        await AuthApi.register(username, email, password);
        toast({
          title: "Account created successfully",
          description: "Your account has been created. You can now login.",
        });
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      if (error?.status === 0 || error?.message?.includes("backend")) {
        setBackendError(error.message || "Unable to connect to the backend server");
      }
      
      if (isLogin) {
        toast({
          title: "Login failed",
          description: "Username or password invalid. Please check your credentials or sign up if you don't have an account.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: error?.message || "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    backendError,
    handleSubmit,
  };
};
