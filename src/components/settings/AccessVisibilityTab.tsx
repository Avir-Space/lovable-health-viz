import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { currentUser, accessibleModules } from "@/data/mockUserSettings";

export function AccessVisibilityTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Roles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">IAAM Role</p>
              <Badge variant="secondary">{currentUser.iaamRole}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">AVIR Role</p>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                {currentUser.avirRole}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Roles are managed by your Admin. Contact them if you need different
            access.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modules I Can Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {accessibleModules.map((module) => (
              <div
                key={module.name}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{module.name}</span>
                </div>
                <Badge
                  variant={
                    module.access === "View + Actions" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {module.access}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
