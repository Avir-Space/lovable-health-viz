import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter, User, Activity } from "lucide-react";
import { mockAuditLogs, mockAdminUsers, AuditLogEntry } from "@/data/mockAdminData";

const actionTypes = ["All", "User", "Role", "Integration", "Billing", "Login"] as const;

export function GroupLogsTab() {
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [actionTypeFilter, setActionTypeFilter] = useState<string>("All");

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      // User filter
      if (userFilter !== "all" && log.user !== userFilter) {
        return false;
      }

      // Action type filter
      if (actionTypeFilter !== "All" && log.actionType !== actionTypeFilter) {
        return false;
      }

      // Date filter (simplified mock)
      if (dateFilter !== "all") {
        const logDate = new Date(log.timestamp.split(" ")[0]);
        const today = new Date("2025-11-27");
        const diffDays = Math.floor(
          (today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dateFilter === "7days" && diffDays > 7) return false;
        if (dateFilter === "30days" && diffDays > 30) return false;
      }

      return true;
    });
  }, [dateFilter, userFilter, actionTypeFilter]);

  const getActionTypeBadgeColor = (type: AuditLogEntry["actionType"]) => {
    switch (type) {
      case "User":
        return "bg-blue-100 text-blue-800";
      case "Role":
        return "bg-purple-100 text-purple-800";
      case "Integration":
        return "bg-green-100 text-green-800";
      case "Billing":
        return "bg-amber-100 text-amber-800";
      case "Login":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const uniqueUsers = ["System", ...mockAdminUsers.map((u) => u.name)];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Action type" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDateFilter("all");
                setUserFilter("all");
                setActionTypeFilter("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>
            {filteredLogs.length} entries found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    User
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Action
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Target
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b last:border-0">
                    <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-4 px-4 font-medium">{log.user}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={getActionTypeBadgeColor(log.actionType)}
                        >
                          {log.actionType}
                        </Badge>
                        <span>{log.action}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {log.target}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No log entries match the current filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
