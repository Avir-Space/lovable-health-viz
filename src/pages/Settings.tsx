import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileIdentityTab } from "@/components/settings/ProfileIdentityTab";
import { AccessVisibilityTab } from "@/components/settings/AccessVisibilityTab";
import { NotificationsAlertsTab } from "@/components/settings/NotificationsAlertsTab";
import { SecuritySessionsTab } from "@/components/settings/SecuritySessionsTab";
import { PersonalizationTab } from "@/components/settings/PersonalizationTab";
import { UserLogsTab } from "@/components/settings/UserLogsTab";
import { AccountSettingsTab } from "@/components/settings/AccountSettingsTab";

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your personal preferences and security for AVIR.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="profile">Profile & Identity</TabsTrigger>
          <TabsTrigger value="access">Access & Visibility</TabsTrigger>
          <TabsTrigger value="notifications">Notifications & Alerts</TabsTrigger>
          <TabsTrigger value="security">Security & Sessions</TabsTrigger>
          <TabsTrigger value="personalization">Personalization</TabsTrigger>
          <TabsTrigger value="logs">User Logs</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileIdentityTab />
        </TabsContent>

        <TabsContent value="access">
          <AccessVisibilityTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsAlertsTab />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySessionsTab />
        </TabsContent>

        <TabsContent value="personalization">
          <PersonalizationTab />
        </TabsContent>

        <TabsContent value="logs">
          <UserLogsTab />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
