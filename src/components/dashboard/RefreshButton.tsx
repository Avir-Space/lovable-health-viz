import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface RefreshButtonProps {
  onRefresh?: () => void;
}

export function RefreshButton({ onRefresh }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  const handleRefresh = () => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefresh;

    if (timeSinceLastRefresh < 60000) {
      const remainingSeconds = Math.ceil((60000 - timeSinceLastRefresh) / 1000);
      toast({
        title: "Please wait",
        description: `You can refresh again in ${remainingSeconds} seconds`,
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);
    setLastRefresh(now);

    if (onRefresh) {
      onRefresh();
    }

    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data refreshed",
        description: "Latest data has been loaded",
      });
    }, 1000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="h-8 w-8"
    >
      {isRefreshing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
    </Button>
  );
}
