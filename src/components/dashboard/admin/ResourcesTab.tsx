
import { Progress } from "@/components/ui/progress";
import { HardDrive, Server, Activity } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const ResourcesTab = () => {
  const { data: stats } = useDashboardStats();
  const system = stats?.system;

  // Calculate RAM percentage
  const ramPercentage = system ? (system.ram.used / system.ram.total) * 100 : 0;
  
  // Format RAM values to GB with 1 decimal
  const ramUsed = system ? (system.ram.used / 1024).toFixed(1) : "0";
  const ramTotal = system ? (system.ram.total / 1024).toFixed(1) : "0";

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span>RAM Usage</span>
          </div>
          <span className="text-muted-foreground">{ramUsed} GB / {ramTotal} GB</span>
        </div>
        <Progress value={ramPercentage} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <span>CPU Usage</span>
          </div>
          <span className="text-muted-foreground">{system?.cpu || 0}%</span>
        </div>
        <Progress value={system?.cpu || 0} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span>API Requests</span>
          </div>
          <span className="text-muted-foreground">{system?.apiRequests || 0} / minute</span>
        </div>
        <Progress value={system ? (system.apiRequests / 200) * 100 : 0} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Vector DB Size</div>
          <div className="text-2xl font-bold">{(system?.vectorDbSize || 0).toFixed(1)} GB</div>
          <div className="text-xs text-muted-foreground mt-1">{stats?.vectorDb.totalChunks.toLocaleString()} vectors</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Model Size</div>
          <div className="text-2xl font-bold">{(system?.modelSize || 0).toFixed(1)} GB</div>
          <div className="text-xs text-muted-foreground mt-1">deepseek:1.5b</div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesTab;
