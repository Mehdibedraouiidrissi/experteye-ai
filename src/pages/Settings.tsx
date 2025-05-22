
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsForm from "@/components/settings/SettingsForm";
import UserSettings from "@/components/settings/UserSettings";

const Settings = () => {
  const isAdmin = localStorage.getItem("username") === "admin";

  useEffect(() => {
    document.title = "ExpertEye - Settings";
  }, []);

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Settings</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Configure your ExpertEye experience" : "Manage your account settings"}
          </p>
        </div>
        
        {isAdmin ? <SettingsForm /> : <UserSettings />}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
