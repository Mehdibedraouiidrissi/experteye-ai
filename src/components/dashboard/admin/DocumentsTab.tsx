
import { Progress } from "@/components/ui/progress";
import { FileText } from "lucide-react";

const DocumentsTab = () => {
  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Document Processing Queue</span>
          </div>
          <span className="text-muted-foreground">2 pending</span>
        </div>
        <Progress value={20} className="h-2" />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Total Documents</div>
          <div className="text-2xl font-bold">247</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Processed</div>
          <div className="text-2xl font-bold">231</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Processing</div>
          <div className="text-2xl font-bold">16</div>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-md mt-4">
        <div className="text-sm font-medium mb-2">Document Types</div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3">
          <div className="flex items-center justify-between text-xs">
            <span>PDF</span>
            <span className="text-muted-foreground">132 files</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>DOCX</span>
            <span className="text-muted-foreground">54 files</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>XLSX</span>
            <span className="text-muted-foreground">28 files</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>TXT</span>
            <span className="text-muted-foreground">22 files</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>PPTX</span>
            <span className="text-muted-foreground">8 files</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>SAS</span>
            <span className="text-muted-foreground">3 files</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
