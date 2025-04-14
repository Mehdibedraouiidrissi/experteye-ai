
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FileDropZone from "./FileDropZone";
import FileUploadList, { UploadingFile } from "./FileUploadList";
import SupportedFileTypes from "./SupportedFileTypes";
import { useToast } from "@/hooks/use-toast";
import { DocumentsApi, useApiErrorHandler } from "@/services/api";

const DocumentUpload = () => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { toast } = useToast();
  const { handleError } = useApiErrorHandler();
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // No cleanup needed here since we're using real API calls
    };
  }, []);
  
  const supportedTypes = [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  
  const handleFileSelect = async (files: File[]) => {
    const filesToProcess = files.filter(file => {
      // Check file extension
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      return ['.pdf', '.docx', '.xlsx', '.pptx', '.txt'].some(ext => 
        extension.endsWith(ext.replace('.', ''))
      );
    });
    
    if (filesToProcess.length !== files.length) {
      toast({
        title: "Unsupported file type",
        description: "Some files were skipped. We support PDF, Word, Excel, PowerPoint, and text files.",
        variant: "destructive",
      });
    }
    
    // Add files to uploading list
    const newFiles: UploadingFile[] = filesToProcess.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading" as const,
    }));
    
    setUploadingFiles(prev => [...prev, ...newFiles]);
    
    // Process each file
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const fileId = newFiles[i].id;
      
      try {
        // Start by showing upload progress animation
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 5;
          if (progress >= 90) {
            clearInterval(progressInterval);
          }
          
          // Update progress
          setUploadingFiles(prev => 
            prev.map(f => f.id === fileId ? { ...f, progress } : f)
          );
        }, 100);
        
        // Upload the file
        await DocumentsApi.uploadDocument(file);
        
        // Clear interval and set to complete
        clearInterval(progressInterval);
        setUploadingFiles(prev => 
          prev.map(f => f.id === fileId ? 
            { ...f, progress: 100, status: "complete" as const } : f
          )
        );
        
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded and is being processed.`
        });
      } catch (error) {
        // Handle error
        setUploadingFiles(prev => 
          prev.map(f => f.id === fileId ? 
            { 
              ...f, 
              progress: 100, 
              status: "error" as const,
              error: "Upload failed. Please try again."
            } : f
          )
        );
        
        handleError(error);
      }
    }
  };
  
  const removeFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(file => file.id !== fileId));
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
        <FileDropZone 
          onFileSelect={handleFileSelect}
          supportedTypes={supportedTypes}
        />

        <FileUploadList 
          files={uploadingFiles}
          onRemove={removeFile}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <SupportedFileTypes />
      </CardFooter>
    </Card>
  );
};

export default DocumentUpload;
