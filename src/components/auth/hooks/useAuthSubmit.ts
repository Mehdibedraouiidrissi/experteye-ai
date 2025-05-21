
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "../services/authService";

/**
 * Hook for handling authentication form submissions
 */
export const useAuthSubmit = (
  isLogin: boolean,
  formData: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  },
  setIsLoading: (loading: boolean) => void,
  setBackendError: (error: string | null) => void,
  isBackendAvailable: boolean,
  retryBackendConnection: () => Promise<boolean>
) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
    
    // Extract form data
    const { email, username, password, confirmPassword } = formData;
    
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

  return { handleSubmit };
};
