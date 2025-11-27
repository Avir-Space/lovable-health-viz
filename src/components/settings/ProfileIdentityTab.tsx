import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  currentUser,
  departments,
  timeZones,
  languages,
} from "@/data/mockUserSettings";

export function ProfileIdentityTab() {
  const [profile, setProfile] = useState({
    name: currentUser.name,
    jobTitle: currentUser.jobTitle,
    department: currentUser.department,
    workPhone: currentUser.workPhone,
    timeZone: currentUser.timeZone,
    preferredLanguage: currentUser.preferredLanguage,
  });

  const initialProfile = {
    name: currentUser.name,
    jobTitle: currentUser.jobTitle,
    department: currentUser.department,
    workPhone: currentUser.workPhone,
    timeZone: currentUser.timeZone,
    preferredLanguage: currentUser.preferredLanguage,
  };

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved (mock).",
    });
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    toast({
      title: "Changes reverted",
      description: "Your profile has been reset to the original values.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile & Identity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{currentUser.email}</p>
            <p className="text-sm text-muted-foreground">
              Profile picture upload coming soon
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={profile.jobTitle}
              onChange={(e) =>
                setProfile({ ...profile, jobTitle: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={profile.department}
              onValueChange={(value) =>
                setProfile({ ...profile, department: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workPhone">Work Phone</Label>
            <Input
              id="workPhone"
              value={profile.workPhone}
              onChange={(e) =>
                setProfile({ ...profile, workPhone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeZone">Time Zone</Label>
            <Select
              value={profile.timeZone}
              onValueChange={(value) =>
                setProfile({ ...profile, timeZone: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <Select
              value={profile.preferredLanguage}
              onValueChange={(value) =>
                setProfile({ ...profile, preferredLanguage: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
