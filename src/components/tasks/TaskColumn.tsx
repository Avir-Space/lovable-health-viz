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
  const { setNodeRef } = useDroppable({
    id: `column-${id}`,
  });

  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px] bg-muted/30 rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </div>
      <div ref={setNodeRef} className="flex-1 p-3 space-y-3 min-h-[200px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
