
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, CheckCircle2, ClockIcon, File } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProcessingStatus = "pending" | "processing" | "completed" | "error";

interface FileUploadProgressProps {
  fileName: string;
  fileSize: string;
  progress: number;
  status: ProcessingStatus;
  errorMessage?: string;
  onCancel: () => void;
}

const FileUploadProgress = ({
  fileName,
  fileSize,
  progress,
  status,
  errorMessage,
  onCancel
}: FileUploadProgressProps) => {
  return (
    <Card className="mb-3 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium truncate max-w-xs">{fileName}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{fileSize}</span>
                <StatusBadge status={status} />
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8"
            disabled={status === "completed"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Progress value={progress} className="h-2 mb-2" />

        {errorMessage && (
          <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </div>
        )}

        {status === "processing" && (
          <div className="text-xs text-muted-foreground mt-1">
            Extracting text and creating vector embeddings...
          </div>
        )}

        {status === "completed" && (
          <div className="text-xs text-green-600 mt-1">
            Document processed and ready for queries.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: ProcessingStatus }) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-xs gap-1 font-normal bg-muted/50">
          <ClockIcon className="h-3 w-3" /> Pending
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="outline" className="text-xs gap-1 font-normal bg-blue-500/10 text-blue-600 border-blue-200">
          <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
              fill="none"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="text-xs gap-1 font-normal bg-green-500/10 text-green-600 border-green-200">
          <CheckCircle2 className="h-3 w-3" /> Completed
        </Badge>
      );
    case "error":
      return (
        <Badge variant="outline" className="text-xs gap-1 font-normal bg-destructive/10 text-destructive border-destructive/30">
          <AlertCircle className="h-3 w-3" /> Error
        </Badge>
      );
  }
};

export default FileUploadProgress;
