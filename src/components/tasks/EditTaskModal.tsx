import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/pages/CentralTasks";
import { Trash2 } from "lucide-react";

interface EditTaskModalProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (updates: Partial<Task>) => void;
  onDelete: () => void;
}

export function EditTaskModal({ task, open, onOpenChange, onSubmit, onDelete }: EditTaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>(task);

  useEffect(() => {
    setFormData(task);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>Update task details or delete the task.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="triage">To triage</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="waiting_on_someone">Waiting on someone</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="impact">Impact band</Label>
                <Select
                  value={formData.impact_band || ""}
                  onValueChange={(value) => setFormData({ ...formData, impact_band: value || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="due_date">Due date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date || ""}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value || null })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="source_dashboard">Source dashboard</Label>
                <Input
                  id="source_dashboard"
                  value={formData.source_dashboard || ""}
                  onChange={(e) => setFormData({ ...formData, source_dashboard: e.target.value || null })}
                  placeholder="e.g. Maintenance Health"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="source_kpi_key">Source KPI key</Label>
                <Input
                  id="source_kpi_key"
                  value={formData.source_kpi_key || ""}
                  onChange={(e) => setFormData({ ...formData, source_kpi_key: e.target.value || null })}
                  placeholder="e.g. maint:unplanned-removals"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="aircraft_reg">Aircraft registration</Label>
                <Input
                  id="aircraft_reg"
                  value={formData.aircraft_reg || ""}
                  onChange={(e) => setFormData({ ...formData, aircraft_reg: e.target.value || null })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fleet">Fleet</Label>
                <Input
                  id="fleet"
                  value={formData.fleet || ""}
                  onChange={(e) => setFormData({ ...formData, fleet: e.target.value || null })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value || null })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignee_name">Assignee name</Label>
                <Input
                  id="assignee_name"
                  value={formData.assignee_name || ""}
                  onChange={(e) => setFormData({ ...formData, assignee_name: e.target.value || null })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="destructive" onClick={onDelete} className="mr-auto">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete task
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
