
import { useToast } from "@/hooks/use-toast";
import { AuthApi } from "./authApi";

export const useApiErrorHandler = () => {
  const { toast } = useToast();
  
  const handleError = (error: any) => {
    if (error && typeof error === 'object' && 'message' in error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    // Handle authentication errors
    if (error && error.status === 401) {
      AuthApi.logout();
      window.location.href = "/login";
    }
  };
  
  return { handleError };
};
