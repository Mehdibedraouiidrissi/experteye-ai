
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentUpload } from "./DocumentUploadService";
import FileDropZone from "./FileDropZone";
import FileUploadList, { UploadingFile } from "./FileUploadList";
import SupportedFileTypes from "./SupportedFileTypes";

const DocumentUpload = () => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { processFiles, simulateFileUpload } = useDocumentUpload();
  
  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      // This ensures any active intervals are cleared when component unmounts
      uploadingFiles.forEach(file => {
        if (file.status === "uploading") {
          // We can't directly access the interval IDs here, but this is where cleanup would happen
          // in a real implementation with stored interval IDs
        }
      });
    };
  }, [uploadingFiles]);
  
  const supportedTypes = [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  
  const handleFileSelect = (files: File[]) => {
    const newFiles = processFiles(files, supportedTypes);
    setUploadingFiles(prev => [...prev, ...newFiles]);
    
    // Simulate file upload
    newFiles.forEach(file => {
      simulateFileUpload(file.id, [...uploadingFiles, ...newFiles], setUploadingFiles);
    });
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
