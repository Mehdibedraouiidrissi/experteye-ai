
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const Dashboard = () => {
  const { data: stats } = useDashboardStats();
  const isAdmin = stats?.system?.users?.admins === 5; // Admin check based on system stats
  
  useEffect(() => {
    document.title = "ExpertEye - Dashboard";
  }, []);

  return (
    <DashboardLayout>
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
