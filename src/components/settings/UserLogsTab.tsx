import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockUserLogs } from "@/data/mockUserSettings";

const dateRanges = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

const activityTypes = ["All", "Task", "Insight", "Playbook", "Export"];

export function UserLogsTab() {
  const [dateRange, setDateRange] = useState("30");
  const [activityType, setActivityType] = useState("All");

  const filteredLogs = useMemo(() => {
    return mockUserLogs.filter((log) => {
      if (activityType !== "All" && log.type !== activityType) {
        return false;
      }
      // Date filtering would be more complex in production
      // For mock, we show all logs within the mock range
      return true;
    });
  }, [activityType]);

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Task":
        return "default";
      case "Insight":
        return "secondary";
      case "Playbook":
        return "outline";
      case "Export":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Activity Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">
              Activity Type
            </label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Timestamp</TableHead>
              <TableHead className="w-28">Type</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(log.type)}>
                      {log.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.description}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No activity found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
