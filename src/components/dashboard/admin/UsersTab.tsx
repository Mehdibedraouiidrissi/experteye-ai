
import { Progress } from "@/components/ui/progress";
import { Users, Clock } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatDistanceToNow } from "date-fns";

const UsersTab = () => {
  const { data: stats } = useDashboardStats();
  const users = stats?.system?.users;

  // Calculate active users percentage
  const activePercentage = users 
    ? (users.activeSessions / users.total) * 100 
    : 0;

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Active Users</span>
          </div>
          <span className="text-muted-foreground">{users?.activeSessions || 0} / {users?.total || 0}</span>
        </div>
        <Progress value={activePercentage} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Total Users</div>
          <div className="text-2xl font-bold">{users?.total || 0}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {users?.admins || 0} admins, {(users?.total || 0) - (users?.admins || 0)} regular users
          </div>
        </div>
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="text-sm font-medium mb-2">Active Sessions</div>
          <div className="text-2xl font-bold">{users?.activeSessions || 0}</div>
          <div className="text-xs text-muted-foreground mt-1">Last hour: {users?.activeSessions || 0} unique users</div>
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-md mt-4">
        <div className="text-sm font-medium mb-2">Recent Activity</div>
        <div className="space-y-3 mt-2">
          {users?.recentActions?.map((action, index) => (
            <div key={index} className="flex items-center text-xs">
              <Clock className="h-3 w-3 text-muted-foreground mr-2" />
              <span className="text-muted-foreground mr-2">
                {formatDistanceToNow(new Date(action.time), { addSuffix: true })}:
              </span>
              <span>{action.action}</span>
            </div>
          ))}
          {(!users?.recentActions || users.recentActions.length === 0) && (
            <div className="text-xs text-muted-foreground">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
