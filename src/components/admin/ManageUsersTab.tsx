import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Plus, Upload, UserPlus, ChevronDown, Eye } from "lucide-react";
import { mockAdminUsers, AdminUser, avirRoles } from "@/data/mockAdminData";
import { useToast } from "@/hooks/use-toast";

interface InviteRow {
  id: string;
  name: string;
  avirRole: string;
  iaamRole: "Admin" | "User";
}

export function ManageUsersTab() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteRows, setInviteRows] = useState<InviteRow[]>([
    { id: "1", name: "", avirRole: "", iaamRole: "User" },
  ]);

  const totalSeats = 10;
  const usedSeats = users.length;
  const remainingSeats = totalSeats - usedSeats;

  const handleToggleActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const handleChangeIaamRole = (userId: string, role: "Admin" | "User") => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, iaamRole: role } : user
      )
    );
  };

  const addInviteRow = () => {
    setInviteRows((prev) => [
      ...prev,
      { id: String(Date.now()), name: "", avirRole: "", iaamRole: "User" },
    ]);
  };

  const updateInviteRow = (id: string, field: keyof InviteRow, value: string) => {
    setInviteRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSendInvites = () => {
    toast({
      title: "Invitations Sent",
      description: `${inviteRows.filter((r) => r.name).length} invitation(s) sent successfully (mock).`,
    });
    setInviteModalOpen(false);
    setInviteRows([{ id: "1", name: "", avirRole: "", iaamRole: "User" }]);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">
              {usedSeats} / {totalSeats}
            </span>
            <span className="text-muted-foreground">
              Users Assigned. You can invite {remainingSeats} more users to use AVIR.
            </span>
          </div>
          <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Users
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Invite Users</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {inviteRows.map((row, index) => (
                  <div key={row.id} className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        User Name
                      </Label>
                      <Input
                        placeholder="Enter name"
                        value={row.name}
                        onChange={(e) =>
                          updateInviteRow(row.id, "name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        AVIR Role
                      </Label>
                      <Select
                        value={row.avirRole}
                        onValueChange={(value) =>
                          updateInviteRow(row.id, "avirRole", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {avirRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        IAAM Role
                      </Label>
                      <Select
                        value={row.iaamRole}
                        onValueChange={(value) =>
                          updateInviteRow(row.id, "iaamRole", value as "Admin" | "User")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="User">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addInviteRow}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another User
                </Button>

                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    <Upload className="h-4 w-4" />
                    <span>Bulk upload .CSV</span>
                    <span className="text-xs">(Coming soon)</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setInviteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSendInvites}>Send Invites</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Email ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    IAAM Role
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    AVIR Role
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    User Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-4 px-4 font-medium">{user.name}</td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${
                              user.iaamRole === "Admin"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {user.iaamRole}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleChangeIaamRole(user.id, "Admin")}
                          >
                            Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeIaamRole(user.id, "User")}
                          >
                            User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 hover:bg-amber-100 w-fit"
                        >
                          {user.avirRole}
                        </Badge>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="text-xs text-primary hover:underline flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              View Accesses
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64">
                            <div className="space-y-2">
                              <p className="font-medium text-sm">
                                Module Access for {user.avirRole}
                              </p>
                              <ul className="text-xs space-y-1 text-muted-foreground">
                                {user.avirRoleAccesses.map((access) => (
                                  <li key={access}>• {access}</li>
                                ))}
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={() => handleToggleActive(user.id)}
                          />
                          <span
                            className={`text-sm ${
                              user.isActive
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
