
import { Card } from "@/components/ui/card";
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import StatCard from "./StatCard";
import RecentActivity from "./RecentActivity";
import AdminPanel from "./admin/AdminPanel";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { FileText, Users } from "lucide-react";

const AdminDashboard = () => {
  const { data: stats } = useDashboardStats();
  
  // Prepare data for charts
  const documentData = [
    { name: "M", documents: stats?.documents.total || 0 },
    { name: "T", documents: stats?.documents.total + (stats?.documents.trend || 0) * 0.2 || 0 },
    { name: "W", documents: stats?.documents.total + (stats?.documents.trend || 0) * 0.4 || 0 },
    { name: "T", documents: stats?.documents.total + (stats?.documents.trend || 0) * 0.6 || 0 },
    { name: "F", documents: stats?.documents.total + (stats?.documents.trend || 0) * 0.8 || 0 },
    { name: "S", documents: stats?.documents.total + (stats?.documents.trend || 0) || 0 },
    { name: "S", documents: stats?.documents.total + (stats?.documents.trend || 0) * 1.2 || 0 },
  ];

  const conversationData = [
    { name: "M", active: stats?.conversations.activeToday - 10 || 0 },
    { name: "T", active: stats?.conversations.activeToday - 5 || 0 },
    { name: "W", active: stats?.conversations.activeToday - 8 || 0 },
    { name: "T", active: stats?.conversations.activeToday - 2 || 0 },
    { name: "F", active: stats?.conversations.activeToday + 5 || 0 },
    { name: "S", active: stats?.conversations.activeToday - 15 || 0 },
    { name: "S", active: stats?.conversations.activeToday || 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
      <div className="col-span-1 md:col-span-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Documents"
            value={stats?.documents.total || 0}
            change={stats?.documents.trend || 0}
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard 
            title="Active Conversations"
            value={stats?.conversations.activeToday || 0}
            change={stats?.conversations.trend || 0}
          />
          <StatCard 
            title="Active Users" 
            value={stats?.users.activeNow || 0}
            change={stats?.users.trend || 0}
            icon={<Users className="h-5 w-5" />}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-medium mb-2">Documents Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={documentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="documents" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-medium mb-2">Conversations</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={conversationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="active" stroke="#818cf8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
        
        <RecentActivity recentActivity={stats?.recentActivity || []} />
      </div>
      
      <AdminPanel />
    </div>
  );
};

export default AdminDashboard;
