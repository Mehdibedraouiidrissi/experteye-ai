
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
                           error.toLowerCase().includes("backend service") ||
                           error.toLowerCase().includes("timed out");
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-medium">{error}</span>
        {isConnectionError && onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="min-w-24 bg-white/10 hover:bg-white/20 border-white/20"
            onClick={onRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-2" />
            )}
            Retry Connection
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default BackendErrorAlert;
