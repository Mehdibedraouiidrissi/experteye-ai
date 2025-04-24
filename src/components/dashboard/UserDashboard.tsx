
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, Activity } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatDistanceToNow } from "date-fns";

const UserDashboard = () => {
  const { data: stats } = useDashboardStats();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">My Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to ExpertEye AI Assistant
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              My Conversations
            </CardTitle>
            <CardDescription>Recent chat activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{stats?.conversations.activeToday || 0}</div>
            <p className="text-sm text-muted-foreground">Active conversations today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Documents
            </CardTitle>
            <CardDescription>Document activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{stats?.documents.uploadedToday || 0}</div>
            <p className="text-sm text-muted-foreground">Documents uploaded today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex flex-col gap-1 text-sm">
                  <p>{activity.action}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                  </div>
                </div>
              ))}
              {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
