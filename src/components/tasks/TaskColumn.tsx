import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { Task } from "@/pages/CentralTasks";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function TaskColumn({ id, title, tasks, onTaskClick }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
  });

  return (
    <div className={`flex flex-col min-w-[300px] max-w-[340px] flex-shrink-0 bg-card border border-border rounded-lg transition-all ${
      isOver ? "ring-2 ring-primary/50 border-primary/50" : ""
    }`}>
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-xs font-medium text-primary">
            {tasks.length}
          </span>
        </div>
      </div>
      <div ref={setNodeRef} className="flex-1 p-3 space-y-3 min-h-[500px] max-h-[calc(100vh-280px)] overflow-y-auto">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
