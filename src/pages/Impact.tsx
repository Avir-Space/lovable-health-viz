import { TrendingUp } from "lucide-react";

export default function Impact() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <TrendingUp className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold">Impact Analysis</h1>
        <p className="text-muted-foreground max-w-md">
          View and analyze the operational impact of maintenance activities
        </p>
      </div>
    </div>
  );
}
