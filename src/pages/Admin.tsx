import { Shield } from "lucide-react";

export default function Admin() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Shield className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground max-w-md">
          Manage users, permissions, and system administration
        </p>
      </div>
    </div>
  );
}
