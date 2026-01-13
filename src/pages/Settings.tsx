import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DownloadSettings from "@/components/DownloadSettings";
import { Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-[hsl(40,40%,90%)] flex items-center gap-2">
            <SettingsIcon className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your application settings and preferences
          </p>
        </div>

        <div className="grid gap-6">
          <DownloadSettings />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;




