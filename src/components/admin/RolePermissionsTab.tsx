import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Shield, Save } from "lucide-react";
import { avirRoles, avirModules, mockRolePermissions, RolePermissions } from "@/data/mockAdminData";
import { useToast } from "@/hooks/use-toast";

export function RolePermissionsTab() {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>(avirRoles[0]);
  const [permissions, setPermissions] = useState<Record<string, RolePermissions>>(mockRolePermissions);

  const handlePermissionChange = (
    module: string,
    permType: "view" | "edit" | "admin",
    checked: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [module]: {
          ...prev[selectedRole][module],
          [permType]: checked,
        },
      },
    }));
  };

  const handleSave = () => {
    toast({
      title: "Permissions Saved",
      description: `${selectedRole} permissions updated successfully (mock).`,
    });
  };

  const currentPermissions = permissions[selectedRole] || {};

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Roles List */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            AVIR Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-1">
            {avirRoles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-colors",
                  selectedRole === role
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card className="col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permissions for {selectedRole}</CardTitle>
              <CardDescription>
                Configure module access levels for this role
              </CardDescription>
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Module
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground w-24">
                    View
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground w-24">
                    Edit
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground w-24">
                    Admin
                  </th>
                </tr>
              </thead>
              <tbody>
                {avirModules.map((module) => {
                  const perm = currentPermissions[module] || {
                    view: false,
                    edit: false,
                    admin: false,
                  };
                  return (
                    <tr key={module} className="border-b last:border-0">
                      <td className="py-4 px-4">{module}</td>
                      <td className="py-4 px-4 text-center">
                        <Checkbox
                          checked={perm.view}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(module, "view", checked as boolean)
                          }
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Checkbox
                          checked={perm.edit}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(module, "edit", checked as boolean)
                          }
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Checkbox
                          checked={perm.admin}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(module, "admin", checked as boolean)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
