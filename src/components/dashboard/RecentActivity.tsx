
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  recentActivity?: Array<{
    id: string;
    action: string;
    timestamp: string;
    user: string;
  }>;
}

const RecentActivity = ({ recentActivity = [] }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest actions in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.slice(0, 5).map((item) => (
            <div key={item.id} className="flex flex-col gap-1 text-sm">
              <p>{item.action}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{item.user}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
