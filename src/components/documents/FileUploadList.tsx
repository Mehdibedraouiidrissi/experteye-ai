
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { File, X, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "./utils";

export interface UploadingFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
}

interface FileUploadListProps {
  files: UploadingFile[];
  onRemove: (fileId: string) => void;
}

const FileUploadList = ({ files, onRemove }: FileUploadListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      <h4 className="text-sm font-medium">Uploads</h4>
      {files.map(file => (
        <div 
          key={file.id} 
          className="flex items-center border rounded-md p-3 gap-3"
        >
          <File className="h-8 w-8 flex-shrink-0 text-primary" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => onRemove(file.id)}
                disabled={file.status === "uploading"}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              {formatFileSize(file.size)}
            </div>
            <div className="flex items-center gap-3">
              <Progress value={file.progress} className="h-1 flex-1" />
              <div className="flex-shrink-0 w-12 text-right text-xs">
                {file.status === "complete" ? (
                  <span className="text-green-500 flex items-center justify-end">
                    <Check className="h-3 w-3 mr-1" /> Done
                  </span>
                ) : file.status === "error" ? (
                  <span className="text-red-500 flex items-center justify-end">
                    <AlertCircle className="h-3 w-3 mr-1" /> Error
                  </span>
                ) : (
                  <span>{file.progress.toFixed(0)}%</span>
                )}
              </div>
            </div>
            {file.status === "error" && file.error && (
              <p className="text-xs text-red-500 mt-1">{file.error}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileUploadList;
