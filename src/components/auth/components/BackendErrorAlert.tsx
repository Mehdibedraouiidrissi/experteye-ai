
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface BackendErrorAlertProps {
  error: string | null;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const BackendErrorAlert = ({ error, onRetry, isRetrying = false }: BackendErrorAlertProps) => {
  if (!error) return null;
  
  const isConnectionError = error.toLowerCase().includes("unable to connect") || 
                           error.toLowerCase().includes("backend service");
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        {isConnectionError && onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 bg-white/10 hover:bg-white/20"
            onClick={onRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default BackendErrorAlert;
