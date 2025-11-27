import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { defaultNotificationSettings } from "@/data/mockUserSettings";

export function NotificationsAlertsTab() {
  const [settings, setSettings] = useState(defaultNotificationSettings);

  const handleSave = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated (mock).",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications & Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-medium">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="predictive" className="flex-1">
                  Predictive maintenance alerts
                </Label>
                <Switch
                  id="predictive"
                  checked={settings.predictiveMaintenance}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, predictiveMaintenance: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="aog" className="flex-1">
                  AOG / High-risk parts alerts
                </Label>
                <Switch
                  id="aog"
                  checked={settings.aogAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, aogAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="flight" className="flex-1">
                  Flight delay and disruption insights
                </Label>
                <Switch
                  id="flight"
                  checked={settings.flightDelays}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, flightDelays: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cost" className="flex-1">
                  Cost and finance variance alerts
                </Label>
                <Switch
                  id="cost"
                  checked={settings.costVariance}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, costVariance: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tasks" className="flex-1">
                  Central Tasks: assignments and mentions
                </Label>
                <Switch
                  id="tasks"
                  checked={settings.taskAssignments}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, taskAssignments: checked })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Push / In-App Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="inapp" className="flex-1">
                  Enable in-app notifications
                </Label>
                <Switch
                  id="inapp"
                  checked={settings.inAppNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, inAppNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="highsev" className="flex-1">
                  Show only high-severity alerts
                </Label>
                <Switch
                  id="highsev"
                  checked={settings.highSeverityOnly}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, highSeverityOnly: checked })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Digest Frequency</h3>
          <RadioGroup
            value={settings.digestFrequency}
            onValueChange={(value: "daily" | "weekly" | "high-severity") =>
              setSettings({ ...settings, digestFrequency: value })
            }
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Daily digest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Weekly digest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high-severity" id="high-sev" />
              <Label htmlFor="high-sev">Only high severity</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>Save notification preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
