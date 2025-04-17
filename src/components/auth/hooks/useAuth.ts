
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthApi } from "@/services/api";

export const useAuth = (isLogin: boolean) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Clear error when form changes
  useEffect(() => {
    setBackendError(null);
  }, [username, email, password, confirmPassword]);

  // Check for "logout=true" in the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logout") === "true") {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
      // Remove the query parameter to prevent showing the message again on refresh
      navigate("/login", { replace: true });
    }
  }, [navigate, toast]);

  const validateExpertEyeEmail = (email: string) => {
    return email.endsWith("@experteye.com");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setBackendError(null);
    
    // Validation
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
      
      if (!username || username.trim() === "") {
        toast({
          title: "Username required",
          description: "Please enter a valid username.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!username && !email) {
        toast({
          title: "Login information required",
          description: "Please enter a username or email.",
          variant: "destructive",
        });
        return;
      }
      
      if (!password) {
        toast({
          title: "Password required",
          description: "Please enter your password.",
          variant: "destructive",
        });
        return;
      }
      
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
        const loginIdentifier = username || email;
        console.log(`Attempting login with identifier: ${loginIdentifier}`);
        
        await AuthApi.login(loginIdentifier, password);
        
        toast({
          title: "Logged in successfully",
          description: "Welcome back to ExpertEye!",
        });
      } else {
        const result = await AuthApi.register(username, email, password);
        
        toast({
          title: "Account created successfully",
          description: "Your account has been created. You can now login.",
        });
        
        // Use navigate instead of direct window.location for better UX
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle network issues specifically
      if (error?.status === 0) {
        setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
      } else if (error?.message) {
        setBackendError(error.message);
        // Also show toast for better visibility
        toast({
          title: isLogin ? "Login failed" : "Registration failed",
          description: error.message,
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
