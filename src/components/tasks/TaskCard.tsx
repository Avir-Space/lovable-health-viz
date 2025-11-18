import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Calendar, GripVertical } from "lucide-react";
import { Task } from "@/pages/CentralTasks";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  isDragging?: boolean;
}

const PRIORITY_COLORS = {
  low: "bg-blue-100 text-blue-700 border-blue-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

const IMPACT_COLORS = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-rose-100 text-rose-700",
};

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border border-border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? "shadow-lg" : ""
      }`}
      onClick={() => onClick(task)}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground mb-2 line-clamp-2">{task.title}</h4>

          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge
              variant="outline"
              className={PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.medium}
            >
              {task.priority}
            </Badge>
            {task.impact_band && (
              <Badge
                variant="outline"
                className={IMPACT_COLORS[task.impact_band as keyof typeof IMPACT_COLORS] || IMPACT_COLORS.medium}
              >
                {task.impact_band} impact
              </Badge>
            )}
          </div>

          {(task.source_dashboard || task.source_kpi_key) && (
            <div className="text-xs text-muted-foreground mb-2 truncate">
              From: {task.source_dashboard || "Manual"} {task.source_kpi_key && `• ${task.source_kpi_key}`}
            </div>
          )}

          {task.assignee_name && (
            <div className="text-xs text-muted-foreground mb-1">👤 {task.assignee_name}</div>
          )}

          {task.due_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.due_date), "MMM d, yyyy")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
