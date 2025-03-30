
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DocumentsApi, useApiErrorHandler } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, File, FileText, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { formatFileSize } from "./utils";
import { useQuery } from "@tanstack/react-query";

interface Document {
  id: string;
  filename: string;
  file_size: number;
  created_at: string;
  mime_type: string;
  processed: boolean;
  processing_status: "pending" | "processing" | "completed" | "error";
}

const DocumentList = () => {
  const { handleError } = useApiErrorHandler();
  const { toast } = useToast();
  
  const { data: documents = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await DocumentsApi.listDocuments();
      return response as Document[];
    },
    onError: (error) => handleError(error)
  });
  
  const handleDelete = async (documentId: string) => {
    try {
      await DocumentsApi.deleteDocument(documentId);
      refetch();
      toast({
        title: "Document deleted",
        description: "Document has been successfully deleted",
      });
    } catch (error) {
      handleError(error);
    }
  };
  
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) {
      return <File className="h-5 w-5 text-red-500" />;
    } else if (mimeType.includes('word')) {
      return <File className="h-5 w-5 text-blue-500" />;
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return <File className="h-5 w-5 text-green-500" />;
    } else if (mimeType.includes('presentation')) {
      return <File className="h-5 w-5 text-orange-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>Loading documents...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>Failed to load documents</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-muted-foreground">There was an error loading your documents.</p>
            <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
        <CardDescription>Manage your uploaded documents</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't uploaded any documents yet.</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.mime_type)}
                        <span className="font-medium">{doc.filename}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                    <TableCell>{formatDate(doc.created_at)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {renderStatusIcon(doc.processing_status)}
                        <span className="capitalize">{doc.processing_status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentList;
