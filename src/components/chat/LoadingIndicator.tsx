
import { Loader2 } from "lucide-react";

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-3 text-muted-foreground">Generating response...</span>
    </div>
  );
};

export default LoadingIndicator;
