
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileUp, UploadCloud, File, X, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
}

const DocumentUpload = () => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const processFiles = (files: File[]) => {
    const supportedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];
    
    const filesToProcess = files.filter(file => supportedTypes.includes(file.type));
    
    if (filesToProcess.length !== files.length) {
      toast({
        title: "Unsupported file type",
        description: "Some files were skipped. We support PDF, Word, Excel, PowerPoint, and text files.",
        variant: "destructive",
      });
    }
    
    const newFiles = filesToProcess.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading" as const,
    }));
    
    setUploadingFiles(prev => [...prev, ...newFiles]);
    
    // Simulate file upload
    newFiles.forEach(file => {
      simulateFileUpload(file.id);
    });
  };
  
  const simulateFileUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadingFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { ...file, progress: 100, status: Math.random() > 0.1 ? "complete" : "error", error: "Processing failed" }
              : file
          )
        );
        
        const file = uploadingFiles.find(f => f.id === fileId);
        if (file) {
          toast({
            title: Math.random() > 0.1 ? "File uploaded successfully" : "Upload error",
            description: Math.random() > 0.1 
              ? `${file.name} has been uploaded and is being processed.`
              : `Failed to process ${file.name}. Please try again.`,
            variant: Math.random() > 0.1 ? "default" : "destructive",
          });
        }
      } else {
        setUploadingFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { ...file, progress }
              : file
          )
        );
      }
    }, 300);
  };
  
  const removeFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(file => file.id !== fileId));
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    const mb = kb / 1024;
    return mb.toFixed(1) + ' MB';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>
          Upload your documents for AI-powered analysis and querying
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className={cn(
            "h-10 w-10 mb-4 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
          <h3 className="text-lg font-medium mb-2">
            Drag and drop your documents
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, Word, Excel, PowerPoint, and text files
          </p>
          <div className="flex gap-2">
            <Button as="label" htmlFor="file-upload" className="cursor-pointer">
              <FileUp className="mr-2 h-4 w-4" />
              Select File
              <input 
                id="file-upload" 
                type="file" 
                multiple 
                className="sr-only" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              />
            </Button>
          </div>
        </div>

        {uploadingFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium">Uploads</h4>
            {uploadingFiles.map(file => (
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
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {formatFileSize(file.size)}
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={file.progress} className="h-1 flex-1" />
                    <div className="flex-shrink-0 w-10 text-right text-xs">
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
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <h4 className="text-sm font-medium">Supported File Types</h4>
        <div className="flex flex-wrap gap-2">
          <div className="bg-muted px-2.5 py-1 rounded text-xs font-medium">.PDF</div>
          <div className="bg-muted px-2.5 py-1 rounded text-xs font-medium">.DOCX</div>
          <div className="bg-muted px-2.5 py-1 rounded text-xs font-medium">.XLSX</div>
          <div className="bg-muted px-2.5 py-1 rounded text-xs font-medium">.PPTX</div>
          <div className="bg-muted px-2.5 py-1 rounded text-xs font-medium">.TXT</div>
          <div className="bg-muted px-2.5 py-1 rounded text-xs font-medium">.SAS</div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentUpload;
