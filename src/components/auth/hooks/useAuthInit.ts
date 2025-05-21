
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ApiService, AuthApi } from "@/services/api";
import { useBackendConnectivity } from "./utils/backendUtils";

/**
 * Hook for handling authentication initialization
 */
export const useAuthInit = (isLogin: boolean) => {
  const {
    isBackendAvailable,
    backendError,
    setBackendError,
    isRetrying,
    checkBackendConnection,
    retryBackendConnection,
    setIsBackendAvailable
  } = useBackendConnectivity();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check backend connectivity on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
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

  return {
    isBackendAvailable,
    backendError,
    setBackendError,
    isRetrying,
    retryBackendConnection,
  };
};
