import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpDown } from "lucide-react";

interface TableChartProps {
  data: Record<string, any>[];
  columns: string[];
}

export function TableChart({ data, columns }: TableChartProps) {
  // Filter out metadata rows
  const filteredData = data.filter(item => {
    const firstValue = item[columns[0]];
    return !['KPI Variant', 'Variant Detail', 'Reason to Track'].includes(String(firstValue));
  });
  
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal);
    const bStr = String(bVal);
    return sortDirection === "asc" 
      ? aStr.localeCompare(bStr) 
      : bStr.localeCompare(aStr);
  });

  return (
    <ScrollArea className="h-64">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead 
                key={col} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort(col)}
              >
                <div className="flex items-center gap-1">
                  {col}
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => {
                const value = row[col];
                const displayValue = typeof value === 'number' ? value.toFixed(2) : value;
                return (
                  <TableCell key={col} title={String(value)}>
                    {displayValue}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
