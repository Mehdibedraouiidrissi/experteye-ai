
import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsForm from "@/components/settings/SettingsForm";

const Settings = () => {
  useEffect(() => {
    document.title = "ExpertEye - Settings";
  }, []);
  
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Settings</h1>
          <p className="text-muted-foreground">
            Configure your ExpertEye experience
          </p>
        </div>
        
        <SettingsForm />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
