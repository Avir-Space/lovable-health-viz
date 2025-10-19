import { LayoutDashboard } from "lucide-react";

export default function MyDashboard() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <LayoutDashboard className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground max-w-md">
          Create your personalized dashboard view with custom KPIs and metrics
        </p>
      </div>
    </div>
  );
}
