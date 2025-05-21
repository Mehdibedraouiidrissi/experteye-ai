
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BackendErrorAlertProps {
  error: string | null;
}

const BackendErrorAlert = ({ error }: BackendErrorAlertProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
  );
};

export default BackendErrorAlert;
