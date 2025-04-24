
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AdminPanel from "@/components/dashboard/AdminPanel";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { FileText, MessageSquare, Users, Binary, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useDashboardStats();
  
  useEffect(() => {
    document.title = "ExpertEye - Dashboard";
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid gap-6">
          <div>
            <Skeleton className="h-8 w-48 mb-1" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-96 col-span-2" />
            <div className="space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to ExpertEye AI Assistant
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Documents" 
            value={stats?.documents.total || 0}
            description={`${stats?.documents.uploadedToday || 0} uploaded today`}
            icon={<FileText className="h-5 w-5" />}
            trend={{
              value: stats?.documents.trend || 0,
              isPositive: (stats?.documents.trend || 0) > 0
            }}
          />
          <StatCard 
            title="Conversations" 
            value={stats?.conversations.total || 0}
            description={`Active today: ${stats?.conversations.activeToday || 0}`}
            icon={<MessageSquare className="h-5 w-5" />}
            trend={{
              value: stats?.conversations.trend || 0,
              isPositive: (stats?.conversations.trend || 0) > 0
            }}
          />
          <StatCard 
            title="Users" 
            value={stats?.users.total || 0}
            description={`${stats?.users.activeNow || 0} active now`}
            icon={<Users className="h-5 w-5" />}
            trend={{
              value: stats?.users.trend || 0,
              isPositive: (stats?.users.trend || 0) > 0
            }}
          />
          <StatCard 
            title="Vector DB" 
            value={stats?.vectorDb.totalChunks || 0}
            description="Text chunks indexed"
            icon={<Binary className="h-5 w-5" />}
            trend={{
              value: stats?.vectorDb.trend || 0,
              isPositive: (stats?.vectorDb.trend || 0) > 0
            }}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <AdminPanel />
          
          <div className="space-y-6">
            <RecentActivity activity={stats?.recentActivity || []} />
            
            <div className="grid gap-4">
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate("/documents")}
              >
                <span>Upload Documents</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between" 
                onClick={() => navigate("/chat")}
              >
                <span>Start New Conversation</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate("/settings")}
              >
                <span>Configure Settings</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
