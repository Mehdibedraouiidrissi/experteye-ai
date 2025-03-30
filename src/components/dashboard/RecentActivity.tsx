
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FileText,
  User,
  Calendar,
  Minimize,
  FolderOpen,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityType = "chat" | "document" | "user";

interface Activity {
  id: string;
  type: ActivityType;
  action: string;
  subject: string;
  timestamp: Date;
}

const RecentActivity = () => {
  const [activities] = useState<Activity[]>([
    {
      id: "1",
      type: "chat",
      action: "New conversation",
      subject: "Annual Report Analysis",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: "2",
      type: "document",
      action: "Document uploaded",
      subject: "Strategic Planning 2024-2025.docx",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "3",
      type: "chat",
      action: "Query about",
      subject: "Q2 Financial metrics",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: "4",
      type: "document",
      action: "Document processed",
      subject: "Regional Market Analysis.xlsx",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "5",
      type: "user",
      action: "User login",
      subject: "Admin user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    },
    {
      id: "6",
      type: "document",
      action: "Document deleted",
      subject: "Old project notes.pdf",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
      id: "7",
      type: "chat",
      action: "New conversation",
      subject: "Contract Review",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    },
  ]);

  const getActivityIcon = (type: ActivityType, action: string) => {
    if (type === "chat") {
      return <MessageSquare className="h-5 w-5 text-expertEye-500" />;
    } else if (type === "document") {
      if (action.includes("uploaded")) {
        return <FolderOpen className="h-5 w-5 text-green-500" />;
      } else if (action.includes("processed")) {
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      } else if (action.includes("deleted")) {
        return <Trash2 className="h-5 w-5 text-red-500" />;
      } else {
        return <FileText className="h-5 w-5 text-orange-500" />;
      }
    } else {
      return <User className="h-5 w-5 text-purple-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <CardDescription>
          Latest actions in your document system
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[340px]">
          <div className="px-6 pb-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 py-3 border-b last:border-0"
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type, activity.action)}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.subject}
                  </p>
                </div>
                <div className="flex-shrink-0 text-xs text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            ))}
            <Button variant="link" className="mt-2 w-full">
              View all activity
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
