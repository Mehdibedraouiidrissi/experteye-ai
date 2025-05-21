
import { useState, useCallback } from "react";
import { ApiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for handling backend connectivity
 */
export const useBackendConnectivity = () => {
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  /**
   * Checks backend connectivity
   */
  const checkBackendConnection = useCallback(async () => {
    try {
      console.log("Initial backend connection check...");
      setIsRetrying(true);
      const available = await ApiService.checkBackendConnection();
      
      setIsBackendAvailable(available);
      if (!available) {
        setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
      } else {
        setBackendError(null);
      }
      setIsRetrying(false);
      return available;
    } catch (error) {
      console.error("Backend check error:", error);
      setIsBackendAvailable(false);
      setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
      setIsRetrying(false);
      return false;
    }
  }, []);

  /**
   * Retries backend connection
   */
  const retryBackendConnection = useCallback(async () => {
    setIsRetrying(true);
    try {
      // Forcibly clear any cached backend status
      setBackendError(null);
      
      // Try to connect with a fresh request
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
      return available;
    } catch (error) {
      setIsBackendAvailable(false);
      setBackendError("Unable to connect to the backend server. Please ensure the backend service is running and accessible.");
      return false;
    } finally {
      setIsRetrying(false);
    }
  }, [toast]);

  return {
    isBackendAvailable,
    backendError,
    setBackendError,
    isRetrying,
    checkBackendConnection,
    retryBackendConnection,
    setIsBackendAvailable // Export this function to allow updates
  };
};
