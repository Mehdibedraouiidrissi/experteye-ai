
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthApi, ApiService } from "@/services/api";
import { validateExpertEyeEmail, validatePassword } from "./utils/validationUtils";
import { useBackendConnectivity } from "./utils/backendUtils";
import { useAuthFormFields } from "./utils/formHandlingUtils";

export const useAuth = (isLogin: boolean) => {
  const {
    email, setEmail,
    username, setUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading, setIsLoading
  } = useAuthFormFields(isLogin);
  
  const {
    isBackendAvailable,
    backendError,
    setBackendError,
    isRetrying,
    checkBackendConnection,
    retryBackendConnection
  } = useBackendConnectivity();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check backend connectivity on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        setIsRetrying(true);
        // Clear any existing errors first
        setBackendError(null);
        
        await checkBackendConnection();
        
        // If backend is available, check token validity
        const token = ApiService.getToken();
        if (token && isLogin) {
          console.log("Token found, validating...");
          try {
            await AuthApi.getUserProfile();
            // If token is valid and we're on login page, redirect to dashboard
            console.log("Token valid, redirecting to dashboard");
            navigate("/dashboard", { replace: true });
          } catch (err) {
            console.log("Invalid token, clearing");
            ApiService.setToken(null);
          }
        }
      } catch (error) {
        console.error("Backend check error:", error);
      } finally {
        setIsRetrying(false);
      }
    };
    
    checkBackend();
  }, [isLogin, navigate, checkBackendConnection, setBackendError, setIsRetrying]);

  // Clear error when form changes
  useEffect(() => {
    setBackendError(null);
  }, [username, email, password, confirmPassword, setBackendError]);

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
        
        // We'll let the AuthApi.login handle the redirection
        await AuthApi.login(loginIdentifier, password);
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
    isRetrying,
    backendError,
    isBackendAvailable,
    retryBackendConnection,
    handleSubmit,
  };
};
