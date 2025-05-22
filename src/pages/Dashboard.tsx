
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const Dashboard = () => {
  const { data: stats } = useDashboardStats();
  
  // Simplified admin check: directly check the username from localStorage
  const isAdmin = localStorage.getItem("username") === "admin";
  
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
