
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FileDropZone from "./FileDropZone";
import FileUploadList, { UploadingFile } from "./FileUploadList";
import SupportedFileTypes from "./SupportedFileTypes";
import { useToast } from "@/hooks/use-toast";
import { DocumentsApi, useApiErrorHandler } from "@/services/api";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

const DocumentUpload = () => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { toast } = useToast();
  const { handleError } = useApiErrorHandler();
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup logic if needed
    };
  }, []);
  
  const supportedTypes = [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB limit
  
  const handleFileSelect = async (files: File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: {name: string, reason: string}[] = [];
    
    // Validate files
    for (const file of files) {
      // Check file extension
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const isValidType = ['.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.sas'].some(ext => 
        extension === ext.replace('.', '')
      );
      
      if (!isValidType) {
        invalidFiles.push({
          name: file.name,
          reason: "Unsupported file type"
        });
      } else if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push({
          name: file.name,
          reason: "File size exceeds 100MB limit"
        });
      } else {
        validFiles.push(file);
      }
    }
    
    if (invalidFiles.length > 0) {
      const details = invalidFiles.map(f => `${f.name}: ${f.reason}`).join('\n');
      toast({
        title: "Some files couldn't be uploaded",
        description: details,
        variant: "destructive",
      });
    }
    
    if (validFiles.length === 0) return;
    
    // Add valid files to uploading list
    const newFiles: UploadingFile[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading" as const,
    }));
    
    setUploadingFiles(prev => [...prev, ...newFiles]);
    
    // Upload each file with chunked upload method for large files
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileId = newFiles[i].id;
      
      try {
        await uploadFile(file, fileId);
        
        // Mark as complete
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

  const uploadFile = async (file: File, fileId: string) => {
    try {
      // Use the API to upload the file with progress tracking
      const xhr = new XMLHttpRequest();
      
      // Create a promise to handle the XHR
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.open('POST', 'http://localhost:5000/api/documents/upload', true);
        
        // Set authorization header if needed
        const token = localStorage.getItem('auth_token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadingFiles(prev => 
              prev.map(f => f.id === fileId ? { ...f, progress: percentComplete } : f)
            );
          }
        };
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Server responded with status: ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error occurred'));
        xhr.ontimeout = () => reject(new Error('Upload timed out'));
        
        // Prepare form data
        const formData = new FormData();
        formData.append('file', file);
        
        // Send the request
        xhr.send(formData);
      });
      
      await uploadPromise;
    } catch (error) {
      throw error;
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
          Upload your documents for AI-powered analysis and querying (up to 100MB per file)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileDropZone 
          onFileSelect={handleFileSelect}
          supportedTypes={supportedTypes}
          maxFileSize={MAX_FILE_SIZE}
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
