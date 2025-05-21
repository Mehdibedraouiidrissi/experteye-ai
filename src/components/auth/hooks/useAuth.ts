
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthApi, ApiService } from "@/services/api";
import { useBackendConnectivity } from "./utils/backendUtils";
import { useAuthFormFields } from "./utils/formHandlingUtils";
import { AuthService } from "../services/authService";

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
        // Don't have access to setIsRetrying here, use the hook's retryBackendConnection
        // which will set isRetrying internally
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
      }
    };
    
    checkBackend();
  }, [isLogin, navigate, checkBackendConnection]);

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
    let validationError: string | null = null;
    
    if (isLogin) {
      const loginIdentifier = username || email;
      validationError = AuthService.validateLoginInput(loginIdentifier, password);
    } else {
      validationError = AuthService.validateRegistrationInput(username, email, password, confirmPassword);
    }
    
    if (validationError) {
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        const loginIdentifier = username || email;
        
        await AuthService.login(
          loginIdentifier,
          password,
          undefined,
          (error) => {
            if (error?.status === 0) {
              setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
            } else if (error?.message) {
              setBackendError(error.message);
              toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
              });
            }
          }
        );
        // Login redirects within the AuthApi.login method
      } else {
        await AuthService.register(
          username,
          email,
          password,
          () => {
            toast({
              title: "Account created successfully",
              description: "Your account has been created. You can now login.",
            });
            
            // Use navigate instead of direct window.location for better UX
            setTimeout(() => {
              navigate("/login", { replace: true });
            }, 500);
          },
          (error) => {
            if (error?.status === 0) {
              setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
            } else if (error?.message) {
              setBackendError(error.message);
              toast({
                title: "Registration failed",
                description: error.message,
                variant: "destructive",
              });
            }
          }
        );
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      // Error handling is now done in the service callbacks
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
