
import { Progress } from "@/components/ui/progress";
import { FileText } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const DocumentsTab = () => {
  const { data: stats } = useDashboardStats();
  const documents = stats?.system?.documents;

  // Calculate processing percentage
  const processingPercentage = documents 
    ? (documents.processing / (documents.total || 1)) * 100 
    : 0;

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Document Processing Queue</span>
          </div>
          <span className="text-muted-foreground">{documents?.processing || 0} pending</span>
        </div>
        <Progress value={processingPercentage} className="h-2" />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Total Documents</div>
          <div className="text-2xl font-bold">{documents?.total || 0}</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Processed</div>
          <div className="text-2xl font-bold">{documents?.processed || 0}</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Processing</div>
          <div className="text-2xl font-bold">{documents?.processing || 0}</div>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-md mt-4">
        <div className="text-sm font-medium mb-2">Document Types</div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3">
          {documents?.types && Object.entries(documents.types).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between text-xs">
              <span>{type.toUpperCase()}</span>
              <span className="text-muted-foreground">{count} files</span>
            </div>
          ))}
          {(!documents?.types || Object.keys(documents.types).length === 0) && (
            <div className="text-xs text-muted-foreground">No documents</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
