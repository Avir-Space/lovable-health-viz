import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Search, Filter, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { mockInventoryParts, InventoryForecastPart } from "@/data/mockInventory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InventoryForecasting() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [baseFilter, setBaseFilter] = useState<string>("all");

  const allBases = useMemo(() => {
    const bases = new Set<string>();
    mockInventoryParts.forEach(p => p.bases.forEach(b => bases.add(b.base)));
    return Array.from(bases).sort();
  }, []);

  const filteredParts = useMemo(() => {
    return mockInventoryParts.filter(part => {
      const matchesSearch =
        part.partNumber.toLowerCase().includes(search.toLowerCase()) ||
        part.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || part.category === categoryFilter;
      const matchesRisk = riskFilter === "all" || part.risk === riskFilter;
      const matchesBase = baseFilter === "all" || part.bases.some(b => b.base === baseFilter);
      return matchesSearch && matchesCategory && matchesRisk && matchesBase;
    });
  }, [search, categoryFilter, riskFilter, baseFilter]);

  const getRiskBadge = (risk: InventoryForecastPart["risk"]) => {
    switch (risk) {
      case "high":
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />High</Badge>;
      case "medium":
        return <Badge variant="outline" className="gap-1 border-amber-500 text-amber-600"><Clock className="h-3 w-3" />Medium</Badge>;
      case "low":
        return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" />Low</Badge>;
    }
  };

  const summaryStats = useMemo(() => {
    const high = mockInventoryParts.filter(p => p.risk === "high").length;
    const medium = mockInventoryParts.filter(p => p.risk === "medium").length;
    const low = mockInventoryParts.filter(p => p.risk === "low").length;
    const belowMin = mockInventoryParts.filter(p => p.currentStock < p.minRequired).length;
    return { high, medium, low, belowMin };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Package className="h-8 w-8" />
          Inventory Forecasting
        </h1>
        <p className="text-muted-foreground">
          AI-driven demand forecasting and inventory optimization recommendations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>High Risk Parts</CardDescription>
            <CardTitle className="text-2xl text-destructive">{summaryStats.high}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Medium Risk Parts</CardDescription>
            <CardTitle className="text-2xl text-amber-600">{summaryStats.medium}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Low Risk Parts</CardDescription>
            <CardTitle className="text-2xl text-green-600">{summaryStats.low}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Below Min Stock</CardDescription>
            <CardTitle className="text-2xl">{summaryStats.belowMin}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by part number or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="rotable">Rotable</SelectItem>
                <SelectItem value="consumable">Consumable</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={baseFilter} onValueChange={setBaseFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Base" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bases</SelectItem>
                {allBases.map(base => (
                  <SelectItem key={base} value={base}>{base}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Lead Time</TableHead>
                <TableHead className="text-center">Forecast (30d)</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Risk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.map((part) => (
                <TableRow
                  key={part.partNumber}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/inventory-forecasting/${encodeURIComponent(part.partNumber)}`)}
                >
                  <TableCell className="font-mono font-medium">{part.partNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{part.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs capitalize">
                        {part.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{part.leadTimeDays} days</TableCell>
                  <TableCell className="text-center">{part.forecastDemand30d}</TableCell>
                  <TableCell className="text-center">
                    <span className={part.currentStock < part.minRequired ? "text-destructive font-medium" : ""}>
                      {part.currentStock}
                    </span>
                    <span className="text-muted-foreground"> / {part.minRequired}</span>
                  </TableCell>
                  <TableCell className="text-center">{getRiskBadge(part.risk)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/inventory-forecasting/${encodeURIComponent(part.partNumber)}`)}
                      >
                        View Forecast
                      </Button>
                      <Button size="sm" variant="default">
                        Create Task
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredParts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No parts match your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
