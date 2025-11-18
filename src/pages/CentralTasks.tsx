import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { TaskColumn } from "@/components/tasks/TaskColumn";
import { TaskCard } from "@/components/tasks/TaskCard";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { EditTaskModal } from "@/components/tasks/EditTaskModal";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  impact_band: string | null;
  source_type: string;
  source_dashboard: string | null;
  source_kpi_key: string | null;
  source_ref: any;
  aircraft_reg: string | null;
  fleet: string | null;
  location: string | null;
  assignee_id: string | null;
  assignee_name: string | null;
  due_date: string | null;
  sort_order: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_COLUMNS = [
  { key: "backlog", label: "Backlog" },
  { key: "triage", label: "To triage" },
  { key: "planned", label: "Planned" },
  { key: "in_progress", label: "In progress" },
  { key: "waiting_on_someone", label: "Waiting on someone" },
  { key: "blocked", label: "Blocked" },
  { key: "done", label: "Done" },
];

export default function CentralTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDashboard, setFilterDashboard] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("central_tasks" as any)
        .select("*")
        .order("status")
        .order("sort_order", { ascending: true, nullsFirst: true })
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTasks((data || []) as any);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overColumnId = over.id as string;
    const newStatus = overColumnId.replace("column-", "");

    if (activeTask.status === newStatus) return;

    // Optimistically update UI
    const updatedTasks = tasks.map((t) =>
      t.id === activeTask.id ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    // Calculate new sort_order
    const tasksInNewColumn = updatedTasks.filter((t) => t.status === newStatus && t.id !== activeTask.id);
    const maxSortOrder = Math.max(...tasksInNewColumn.map((t) => t.sort_order || 0), 0);

    try {
      const { error } = await supabase
        .from("central_tasks" as any)
        .update({
          status: newStatus,
          sort_order: maxSortOrder + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", activeTask.id);

      if (error) throw error;

      toast.success("Task moved successfully");
      await loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to move task");
      setTasks(tasks);
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const tasksInStatus = tasks.filter((t) => t.status === (taskData.status || "backlog"));
      const maxSortOrder = Math.max(...tasksInStatus.map((t) => t.sort_order || 0), 0);

      const { error } = await supabase
        .from("central_tasks" as any)
        .insert([
          {
            ...taskData,
            created_by: user?.id,
            sort_order: maxSortOrder + 1,
          },
        ]);

      if (error) throw error;

      toast.success("Task created successfully");
      setCreateModalOpen(false);
      await loadTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from("central_tasks" as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Task updated successfully");
      setEditTask(null);
      await loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const { error } = await supabase
        .from("central_tasks" as any)
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Task deleted successfully");
      setEditTask(null);
      await loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !(task.description || "").toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterDashboard !== "all" && task.source_dashboard !== filterDashboard) {
      return false;
    }
    if (filterPriority !== "all" && task.priority !== filterPriority) {
      return false;
    }
    if (filterStatus !== "all" && task.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const tasksByStatus = STATUS_COLUMNS.reduce((acc, column) => {
    acc[column.key] = filteredTasks.filter((t) => t.status === column.key);
    return acc;
  }, {} as Record<string, Task[]>);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const uniqueDashboards = Array.from(new Set(tasks.map((t) => t.source_dashboard).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Central Tasks</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Unified Kanban board for actions created across AVIR
              </p>
            </div>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New task
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterDashboard} onValueChange={setFilterDashboard}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Dashboard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dashboards</SelectItem>
                {uniqueDashboards.map((db) => (
                  <SelectItem key={db} value={db!}>
                    {db}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_COLUMNS.map((col) => (
                  <SelectItem key={col.key} value={col.key}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading tasks...</div>
        ) : (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-5 pb-4 min-w-max">
              {STATUS_COLUMNS.map((column) => (
                <TaskColumn
                  key={column.key}
                  id={column.key}
                  title={column.label}
                  tasks={tasksByStatus[column.key] || []}
                  onTaskClick={setEditTask}
                />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? (
                <div className="rotate-3 opacity-80">
                  <TaskCard task={activeTask} onClick={() => {}} isDragging />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <CreateTaskModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateTask}
      />

      {editTask && (
        <EditTaskModal
          task={editTask}
          open={!!editTask}
          onOpenChange={(open) => !open && setEditTask(null)}
          onSubmit={(updates) => handleUpdateTask(editTask.id, updates)}
          onDelete={() => handleDeleteTask(editTask.id)}
        />
      )}
    </div>
  );
}
