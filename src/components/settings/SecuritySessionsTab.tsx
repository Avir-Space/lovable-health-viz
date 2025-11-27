import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { mockSessions } from "@/data/mockUserSettings";
import { Monitor, Smartphone, Laptop } from "lucide-react";

export function SecuritySessionsTab() {
  const [sessions, setSessions] = useState(mockSessions);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.new.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    setPasswordModalOpen(false);
    setPasswordForm({ current: "", new: "", confirm: "" });
    toast({
      title: "Password updated",
      description: "Your password has been changed (mock).",
    });
  };

  const handleLogoutSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    toast({
      title: "Session ended",
      description: "The session has been logged out.",
    });
  };

  const handleLogoutAll = () => {
    setSessions([]);
    toast({
      title: "All sessions ended",
      description: "You have been logged out of all devices (mock).",
    });
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes("iphone")) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (device.toLowerCase().includes("macbook")) {
      return <Laptop className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password & Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium">Password</h4>
            <p className="text-sm text-muted-foreground">
              Change your password to keep your account secure.
            </p>
            <Button variant="outline" onClick={() => setPasswordModalOpen(true)}>
              Change password
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
            {twoFactorEnabled && (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                AVIR will use an authenticator app or SMS for additional
                verification. Full setup flow is not implemented in this mock.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(session.device)}
                          {session.device}
                          {session.current && (
                            <span className="text-xs text-green-600">
                              (current)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{session.browser}</TableCell>
                      <TableCell>{session.location}</TableCell>
                      <TableCell>{session.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLogoutSession(session.id)}
                        >
                          Log out
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="destructive" onClick={handleLogoutAll}>
                Log out of all sessions
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No active sessions. You have been logged out of all devices.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.new}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, new: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
