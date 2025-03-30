
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DocumentUpload from "@/components/documents/DocumentUpload";
import DocumentList from "@/components/documents/DocumentList";

const Documents = () => {
  useEffect(() => {
    document.title = "ExpertEye - Documents";
  }, []);
  
  return (
    <DashboardLayout>
      <div className="grid gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Document Management</h1>
          <p className="text-muted-foreground">
            Upload, manage and process your documents
          </p>
        </div>
        
        <DocumentUpload />
        
        <DocumentList />
      </div>
    </DashboardLayout>
  );
};

export default Documents;
