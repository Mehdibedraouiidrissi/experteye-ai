
import { UploadingFile } from "./FileUploadList";
import { useToast } from "@/hooks/use-toast";

export const useDocumentUpload = () => {
  const { toast } = useToast();

  const processFiles = (files: File[], supportedTypes: string[]) => {
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
    
    return newFiles;
  };
  
  const simulateFileUpload = (
    fileId: string, 
    uploadingFiles: UploadingFile[], 
    updateCallback: (updatedFiles: UploadingFile[]) => void
  ) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        const updatedFiles = uploadingFiles.map(file => 
          file.id === fileId 
            ? { ...file, progress: 100, status: Math.random() > 0.1 ? "complete" : "error", error: "Processing failed" }
            : file
        );
        
        updateCallback(updatedFiles);
        
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
        const updatedFiles = uploadingFiles.map(file => 
          file.id === fileId 
            ? { ...file, progress }
            : file
        );
        updateCallback(updatedFiles);
      }
    }, 300);
    
    return interval;
  };
  
  return { processFiles, simulateFileUpload };
};
