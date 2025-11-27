import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { currentUser } from "@/data/mockUserSettings";
import { ExternalLink, Download, AlertTriangle } from "lucide-react";

export function AccountSettingsTab() {
  const handleDownloadData = () => {
    toast({
      title: "Coming soon",
      description: "Data export will be available soon.",
    });
  };

  const handleDeactivate = () => {
    toast({
      title: "Contact Admin",
      description: "Please contact your Admin to deactivate your account.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Account Email</p>
              <p className="font-medium">{currentUser.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created On</p>
              <p className="font-medium">{currentUser.createdAt}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Organization</p>
              <p className="font-medium">{currentUser.org}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button variant="outline" onClick={handleDownloadData}>
              <Download className="h-4 w-4 mr-2" />
              Download my data
            </Button>
            <Button variant="destructive" onClick={handleDeactivate}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Deactivate my account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legal & Version</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              Privacy Policy <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="#"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              Terms of Service <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="#"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              Security Practices <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            AVIR version: <span className="font-mono">v0.3.9 (demo)</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
