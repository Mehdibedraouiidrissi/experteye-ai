
import { Progress } from "@/components/ui/progress";
import { Users, Clock } from "lucide-react";

const UsersTab = () => {
  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Active Users</span>
          </div>
          <span className="text-muted-foreground">12 / 50</span>
        </div>
        <Progress value={24} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Total Users</div>
          <div className="text-2xl font-bold">50</div>
          <div className="text-xs text-muted-foreground mt-1">3 admins, 47 regular users</div>
        </div>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Active Sessions</div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-xs text-muted-foreground mt-1">Last hour: 24 unique users</div>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-md mt-4">
        <div className="text-sm font-medium mb-2">Recent Activity</div>
        <div className="space-y-3 mt-2">
          <div className="flex items-center text-xs">
            <Clock className="h-3 w-3 text-muted-foreground mr-2" />
            <span className="text-muted-foreground mr-2">2m ago:</span>
            <span>User 'admin' uploaded 2 new documents</span>
          </div>
          <div className="flex items-center text-xs">
            <Clock className="h-3 w-3 text-muted-foreground mr-2" />
            <span className="text-muted-foreground mr-2">15m ago:</span>
            <span>User 'analyst1' created a new chat session</span>
          </div>
          <div className="flex items-center text-xs">
            <Clock className="h-3 w-3 text-muted-foreground mr-2" />
            <span className="text-muted-foreground mr-2">1h ago:</span>
            <span>New user 'researcher3' registered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
