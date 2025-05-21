
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "./StatCard";
import RecentActivity from "./RecentActivity";
import AdminPanel from "./admin/AdminPanel";
import { FileText, MessageSquare, Users, Binary, ArrowRight } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: stats } = useDashboardStats();
  
  return (
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
          change={stats?.documents.trend || 0}
        />
        <StatCard 
          title="Conversations" 
          value={stats?.conversations.total || 0}
          description={`Active today: ${stats?.conversations.activeToday || 0}`}
          icon={<MessageSquare className="h-5 w-5" />}
          change={stats?.conversations.trend || 0}
        />
        <StatCard 
          title="Users" 
          value={stats?.users.total || 0}
          description={`${stats?.users.activeNow || 0} active now`}
          icon={<Users className="h-5 w-5" />}
          change={stats?.users.trend || 0}
        />
        <StatCard 
          title="Vector DB" 
          value={stats?.vectorDb.totalChunks || 0}
          description="Text chunks indexed"
          icon={<Binary className="h-5 w-5" />}
          change={stats?.vectorDb.trend || 0}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <AdminPanel />
        
        <div className="space-y-6">
          <RecentActivity recentActivity={stats?.recentActivity} />
          
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
  );
};

export default AdminDashboard;
