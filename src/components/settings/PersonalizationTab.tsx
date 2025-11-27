import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  defaultPersonalization,
  landingPageOptions,
} from "@/data/mockUserSettings";
import { Sun, Moon, Monitor } from "lucide-react";

export function PersonalizationTab() {
  const [prefs, setPrefs] = useState(defaultPersonalization);

  const handleSave = () => {
    toast({
      title: "Personalization saved",
      description: "Your preferences have been updated (mock).",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-medium">Theme</h3>
          <RadioGroup
            value={prefs.theme}
            onValueChange={(value: "light" | "dark" | "system") =>
              setPrefs({ ...prefs, theme: value })
            }
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-1">
                <Sun className="h-4 w-4" /> Light
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-1">
                <Moon className="h-4 w-4" /> Dark
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center gap-1">
                <Monitor className="h-4 w-4" /> System
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Date & Time Format</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Time Format</Label>
              <RadioGroup
                value={prefs.timeFormat}
                onValueChange={(value: "24h" | "12h") =>
                  setPrefs({ ...prefs, timeFormat: value })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h">24-hour</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12h" id="12h" />
                  <Label htmlFor="12h">12-hour</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select
                value={prefs.dateFormat}
                onValueChange={(value: "DD-MM-YYYY" | "MM-DD-YYYY") =>
                  setPrefs({ ...prefs, dateFormat: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                  <SelectItem value="MM-DD-YYYY">MM-DD-YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Dashboard Preferences</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Default Landing Page</Label>
              <Select
                value={prefs.defaultLandingPage}
                onValueChange={(value) =>
                  setPrefs({ ...prefs, defaultLandingPage: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {landingPageOptions.map((page) => (
                    <SelectItem key={page} value={page}>
                      {page}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="collapse-sidebar">
                Collapse sidebar by default
              </Label>
              <Switch
                id="collapse-sidebar"
                checked={prefs.collapseSidebar}
                onCheckedChange={(checked) =>
                  setPrefs({ ...prefs, collapseSidebar: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="grid-view">
                Show aircraft in grid view (future)
              </Label>
              <Switch
                id="grid-view"
                checked={prefs.gridViewAircraft}
                onCheckedChange={(checked) =>
                  setPrefs({ ...prefs, gridViewAircraft: checked })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>Save personalization</Button>
        </div>
      </CardContent>
    </Card>
  );
}
