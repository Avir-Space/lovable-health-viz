import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Plug, Settings, RefreshCw, Unplug } from "lucide-react";
import { mockIntegrations, Integration } from "@/data/mockAdminData";
import { useToast } from "@/hooks/use-toast";

export function IntegrationsTab() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration({ ...integration });
    setConfigPanelOpen(true);
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === selectedIntegration.id ? selectedIntegration : i
        )
      );
      toast({
        title: "Configuration Saved",
        description: `${selectedIntegration.name} settings updated (mock).`,
      });
      setConfigPanelOpen(false);
    }
  };

  const handleDisconnect = () => {
    if (selectedIntegration) {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === selectedIntegration.id
            ? { ...i, status: "Not configured" as const, lastSync: null }
            : i
        )
      );
      toast({
        title: "Integration Disconnected",
        description: `${selectedIntegration.name} has been disconnected (mock).`,
      });
      setConfigPanelOpen(false);
    }
  };

  const getStatusColor = (status: Integration["status"]) => {
    switch (status) {
      case "Connected":
        return "bg-green-100 text-green-800";
      case "Sandbox":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: Integration["category"]) => {
    switch (category) {
      case "MRO":
        return "bg-blue-100 text-blue-800";
      case "ERP":
        return "bg-purple-100 text-purple-800";
      case "Ops":
        return "bg-green-100 text-green-800";
      case "Tracking":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Plug className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Connect AVIR to your existing systems</p>
              <p className="text-sm text-muted-foreground mt-1">
                AVIR sits on top of your MRO, ERP, and airline systems. It does not
                replace your source systems but enhances them with AI-powered
                insights.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Manage connections to external systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Integration
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Last Sync
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((integration) => (
                  <tr key={integration.id} className="border-b last:border-0">
                    <td className="py-4 px-4 font-medium">{integration.name}</td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="secondary"
                        className={getCategoryColor(integration.category)}
                      >
                        {integration.category}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(integration.status)}
                      >
                        {integration.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {integration.lastSync || "Never"}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfigure(integration)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      <Sheet open={configPanelOpen} onOpenChange={setConfigPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Configure {selectedIntegration?.name}</SheetTitle>
            <SheetDescription>
              Manage connection settings for this integration
            </SheetDescription>
          </SheetHeader>

          {selectedIntegration && (
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label>Connection Status</Label>
                <Badge
                  variant="secondary"
                  className={getStatusColor(selectedIntegration.status)}
                >
                  {selectedIntegration.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key / Token</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter API key"
                  value={selectedIntegration.apiKey || ""}
                  onChange={(e) =>
                    setSelectedIntegration({
                      ...selectedIntegration,
                      apiKey: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Environment</Label>
                <Select
                  value={selectedIntegration.environment}
                  onValueChange={(value) =>
                    setSelectedIntegration({
                      ...selectedIntegration,
                      environment: value as "Production" | "Sandbox",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Sandbox">Sandbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedIntegration.lastSync && (
                <div className="space-y-2">
                  <Label>Last Sync</Label>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    {selectedIntegration.lastSync}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveConfig} className="flex-1">
                  Save Configuration
                </Button>
              </div>

              {selectedIntegration.status === "Connected" && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDisconnect}
                >
                  <Unplug className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
