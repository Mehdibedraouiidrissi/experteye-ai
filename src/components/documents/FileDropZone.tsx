
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropZoneProps {
  onFileSelect: (files: File[]) => void;
  supportedTypes?: string[];
}

const FileDropZone = ({ 
  onFileSelect, 
  supportedTypes = [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ] 
}: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileSelect(Array.from(e.target.files));
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
      onFileSelect(Array.from(e.dataTransfer.files));
    }
  };

  return (
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
        <Button className="cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
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
  );
};

export default FileDropZone;
