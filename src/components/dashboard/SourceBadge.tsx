import { Badge } from "@/components/ui/badge";

interface SourceBadgeProps {
  source: string;
}

const sourceColors: Record<string, string> = {
  AMOS: "bg-chart-1 text-primary-foreground",
  TRAX: "bg-chart-2 text-accent-foreground",
  SAP: "bg-chart-3 text-success-foreground",
  Ramco: "bg-chart-4 text-primary-foreground",
  AIMS: "bg-chart-5 text-primary-foreground",
  Jeppesen: "bg-primary text-primary-foreground",
};

export function SourceBadge({ source }: SourceBadgeProps) {
  const colorClass = sourceColors[source] || "bg-muted text-muted-foreground";
  
  return (
    <Badge variant="secondary" className={`${colorClass} text-xs px-2 py-0.5`}>
      {source}
    </Badge>
  );
}
