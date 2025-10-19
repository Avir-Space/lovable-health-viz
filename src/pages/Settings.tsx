import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <SettingsIcon className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground max-w-md">
          Configure your application preferences and system settings
        </p>
      </div>
    </div>
  );
}
