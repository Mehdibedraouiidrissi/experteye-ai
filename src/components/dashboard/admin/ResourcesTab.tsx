
import { Progress } from "@/components/ui/progress";
import { HardDrive, Server, Activity } from "lucide-react";

const ResourcesTab = () => {
  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span>RAM Usage</span>
          </div>
          <span className="text-muted-foreground">2.4 GB / 8 GB</span>
        </div>
        <Progress value={30} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <span>CPU Usage</span>
          </div>
          <span className="text-muted-foreground">42%</span>
        </div>
        <Progress value={42} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span>API Requests</span>
          </div>
          <span className="text-muted-foreground">143 / minute</span>
        </div>
        <Progress value={58} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Vector DB Size</div>
          <div className="text-2xl font-bold">1.2 GB</div>
          <div className="text-xs text-muted-foreground mt-1">12,543 vectors</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Model Size</div>
          <div className="text-2xl font-bold">1.5 GB</div>
          <div className="text-xs text-muted-foreground mt-1">deepseek:1.5b</div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesTab;
