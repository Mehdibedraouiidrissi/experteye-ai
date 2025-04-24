
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
            <div key={item.id} className="flex items-start gap-2 text-sm">
              <div className="flex-1 space-y-1">
                <p>{item.action}</p>
                <p className="text-xs text-muted-foreground">
                  {item.user} • {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </p>
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
