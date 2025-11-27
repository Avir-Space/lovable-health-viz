import { Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManageUsersTab } from "@/components/admin/ManageUsersTab";
import { BillingTab } from "@/components/admin/BillingTab";
import { RolePermissionsTab } from "@/components/admin/RolePermissionsTab";
import { IntegrationsTab } from "@/components/admin/IntegrationsTab";
import { GroupLogsTab } from "@/components/admin/GroupLogsTab";

export default function Admin() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin</h1>
        </div>
        <p className="text-muted-foreground">
          Manage users, access, billing, and integrations for your AVIR tenant.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="roles">Role & Permissions</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="logs">Group Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <ManageUsersTab />
        </TabsContent>

        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>

        <TabsContent value="roles">
          <RolePermissionsTab />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>

        <TabsContent value="logs">
          <GroupLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
