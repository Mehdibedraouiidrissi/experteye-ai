
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, FileUp, Database, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ExpertEye - Dashboard";
  }, []);

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome to ExpertEye</h1>
          <p className="text-muted-foreground">
            Document intelligence at your fingertips
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Documents"
            value={42}
            icon={<FileText className="h-5 w-5" />}
            description="Across all formats"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Document Pages"
            value={1248}
            icon={<Database className="h-5 w-5" />}
            description="Total indexed pages"
          />
          <StatCard
            title="Conversations"
            value={16}
            icon={<MessageSquare className="h-5 w-5" />}
            description="In the last 30 days"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Queries Answered"
            value={184}
            icon={<Search className="h-5 w-5" />}
            description="Based on your documents"
          />
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <RecentActivity />
          </div>
          <div className="space-y-4 md:space-y-6">
            <div className="bg-accent p-4 md:p-6 rounded-lg flex flex-col gap-3 md:gap-4">
              <h3 className="text-lg font-medium">Upload Documents</h3>
              <p className="text-sm text-muted-foreground">
                Add new documents to your collection for AI-powered analysis
              </p>
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => navigate("/documents")}
              >
                <FileUp className="mr-2 h-5 w-5" />
                Upload Now
              </Button>
            </div>

            <div className="bg-muted p-4 md:p-6 rounded-lg flex flex-col gap-3 md:gap-4">
              <h3 className="text-lg font-medium">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Ask a question about your documents or start a new conversation
              </p>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={() => navigate("/chat")}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Chatting
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
