
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AdminPanel from "@/components/dashboard/AdminPanel";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Binary,
  ArrowRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "ExpertEye - Dashboard";
  }, []);
  
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to ExpertEye Document Intelligence
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Documents" 
            value={247}
            description="12 uploaded today"
            icon={<FileText className="h-5 w-5" />}
            trend={{
              value: 16,
              isPositive: true
            }}
          />
          <StatCard 
            title="Conversations" 
            value={186}
            description="Active today: 42"
            icon={<MessageSquare className="h-5 w-5" />}
            trend={{
              value: 24,
              isPositive: true
            }}
          />
          <StatCard 
            title="Users" 
            value={50}
            description="12 active now"
            icon={<Users className="h-5 w-5" />}
            trend={{
              value: 8,
              isPositive: true
            }}
          />
          <StatCard 
            title="Vector DB" 
            value={12500}
            description="Text chunks indexed"
            icon={<Binary className="h-5 w-5" />}
            trend={{
              value: 32,
              isPositive: true
            }}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <AdminPanel />
          
          <div className="space-y-6">
            <RecentActivity />
            
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
