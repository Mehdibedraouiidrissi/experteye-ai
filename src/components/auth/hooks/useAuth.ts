
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthApi } from "@/services/api";
import { ApiService } from "@/services/api/apiService";

export const useAuth = (isLogin: boolean) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check backend connectivity on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const available = await ApiService.checkBackendConnection();
        setIsBackendAvailable(available);
        if (!available) {
          setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
        } else {
          setBackendError(null);
        }
      } catch (error) {
        console.error("Backend check error:", error);
        setIsBackendAvailable(false);
        setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
      }
    };
    
    checkBackend();
  }, []);

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

  // Check for stored token on component mount for login form
  useEffect(() => {
    if (isLogin) {
      // Check if we're already logged in
      const token = localStorage.getItem("auth_token");
      if (token) {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        // If token exists, navigate to dashboard
        console.log("Token found in localStorage, redirecting to dashboard");
        window.location.href = `/dashboard?_t=${timestamp}`;
      }
    }
  }, [isLogin]);

  const validateExpertEyeEmail = (email: string) => {
    return email.endsWith("@experteye.com");
  };

  const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 8 || password.length > 12) {
      return {
        valid: false,
        message: "Password must be between 8 and 12 characters"
      };
    }

    if (!/^[A-Z]/.test(password)) {
      return {
        valid: false,
        message: "Password must start with an uppercase letter"
      };
    }

    if (!/\d/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one digit"
      };
    }

    return { valid: true, message: "" };
  };

  const retryBackendConnection = async () => {
    setIsLoading(true);
    try {
      const available = await ApiService.checkBackendConnection();
      setIsBackendAvailable(available);
      if (!available) {
        setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
        toast({
          title: "Connection failed",
          description: "Could not connect to the backend server. Please check that it's running.",
          variant: "destructive",
        });
      } else {
        setBackendError(null);
        toast({
          title: "Connection restored",
          description: "Successfully connected to the backend server.",
        });
      }
    } catch (error) {
      setIsBackendAvailable(false);
      setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setBackendError(null);
    
    // Check backend availability first
    if (!isBackendAvailable) {
      try {
        await retryBackendConnection();
        if (!isBackendAvailable) {
          return;
        }
      } catch (error) {
        return;
      }
    }
    
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

      // Password validation
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        toast({
          title: "Invalid Password",
          description: passwordValidation.message,
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
        
        const response = await AuthApi.login(loginIdentifier, password);
        
        toast({
          title: "Logged in successfully",
          description: "Welcome back to ExpertEye!",
        });
        
        // We don't need to redirect here as the AuthApi.login function will handle that
      } else {
        const result = await AuthApi.register(username, email, password);
        
        toast({
          title: "Account created successfully",
          description: "Your account has been created. You can now login.",
        });
        
        // Use navigate instead of direct window.location for better UX
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 500);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle network issues specifically
      if (error?.status === 0) {
        setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
        setIsBackendAvailable(false);
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
    isBackendAvailable,
    retryBackendConnection,
    handleSubmit,
  };
};
