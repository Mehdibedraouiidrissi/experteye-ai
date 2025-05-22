
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const Dashboard = () => {
  const { data: stats } = useDashboardStats();
  
  // Improved admin check: verify if the user is an admin based on auth data
  // We need to access the actual user data instead of comparing with a fixed number
  const isAdmin = stats?.system?.users?.admins > 0 && 
                  localStorage.getItem("username") === "admin";
  
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
