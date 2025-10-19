export interface KPIData {
  key: string;
  name: string;
  variant: "gauge" | "table" | "line" | "bar" | "pie" | "heatmap" | "delta" | "numeric" | "timeline" | "line+numeric";
  xAxis: string;
  yAxis: string;
  columns: string[];
  data: Record<string, any>[];
}

export const inventoryKPIs: KPIData[] = [
  {
    key: "stock_availability_pct",
    name: "Stock Availability %",
    variant: "gauge",
    xAxis: "Category",
    yAxis: "Percent",
    columns: ["Category", "Percent"],
    data: [
      { Category: "Available", Percent: 89 },
      { Category: "Unavailable", Percent: 11 }
    ]
  },
  {
    key: "inventory_turnover_ratio",
    name: "Inventory Turnover Ratio",
    variant: "line",
    xAxis: "Month",
    yAxis: "Turns per Year",
    columns: ["Month", "Turns per Year"],
    data: [
      { Month: "Apr", "Turns per Year": 3.8 },
      { Month: "May", "Turns per Year": 4.1 },
      { Month: "Jun", "Turns per Year": 4.3 },
      { Month: "Jul", "Turns per Year": 4.4 },
      { Month: "Aug", "Turns per Year": 4.2 },
      { Month: "Sep", "Turns per Year": 4.5 }
    ]
  },
  {
    key: "stockouts_by_base",
    name: "Stockouts by Base",
    variant: "bar",
    xAxis: "Base",
    yAxis: "Stockouts",
    columns: ["Base", "Stockouts"],
    data: [
      { Base: "DXB", Stockouts: 12 },
      { Base: "SIN", Stockouts: 9 },
      { Base: "DEL", Stockouts: 8 },
      { Base: "JED", Stockouts: 6 }
    ]
  },
  {
    key: "parts_in_transit",
    name: "Parts in Transit",
    variant: "bar",
    xAxis: "Route",
    yAxis: "Parts Count",
    columns: ["Route", "Parts Count"],
    data: [
      { Route: "DXB-SIN", "Parts Count": 25 },
      { Route: "DXB-DEL", "Parts Count": 19 },
      { Route: "DXB-BOM", "Parts Count": 15 },
      { Route: "SIN-JED", "Parts Count": 11 }
    ]
  },
  {
    key: "aging_of_spares",
    name: "Aging of Spares",
    variant: "heatmap",
    xAxis: "Aging Bucket",
    yAxis: "Count",
    columns: ["Aging Bucket", "Count"],
    data: [
      { "Aging Bucket": "0-30 d", Count: 210 },
      { "Aging Bucket": "31-90 d", Count: 150 },
      { "Aging Bucket": "91-180 d", Count: 96 },
      { "Aging Bucket": "180 d+", Count: 42 }
    ]
  },
  {
    key: "critical_items_low_stock",
    name: "Critical Items Low Stock",
    variant: "table",
    xAxis: "Part Number",
    yAxis: "Qty Available",
    columns: ["Part Number", "Description", "Qty Available"],
    data: [
      { "Part Number": "PN-A123", Description: "Hydraulic Pump", "Qty Available": 1 },
      { "Part Number": "PN-B221", Description: "Brake Valve", "Qty Available": 2 },
      { "Part Number": "PN-C341", Description: "Fuel Filter", "Qty Available": 3 }
    ]
  },
  {
    key: "inventory_value_by_base",
    name: "Inventory Value by Base",
    variant: "bar",
    xAxis: "Base",
    yAxis: "Value (USD M)",
    columns: ["Base", "Value (USD M)"],
    data: [
      { Base: "DXB", "Value (USD M)": 3.2 },
      { Base: "SIN", "Value (USD M)": 2.7 },
      { Base: "DEL", "Value (USD M)": 1.9 },
      { Base: "JED", "Value (USD M)": 1.4 }
    ]
  },
  {
    key: "working_capital_locked",
    name: "Working Capital Locked in Spares",
    variant: "line",
    xAxis: "Month",
    yAxis: "USD Million",
    columns: ["Month", "USD Million"],
    data: [
      { Month: "Apr", "USD Million": 8.2 },
      { Month: "May", "USD Million": 7.9 },
      { Month: "Jun", "USD Million": 7.4 },
      { Month: "Jul", "USD Million": 6.8 },
      { Month: "Aug", "USD Million": 6.5 },
      { Month: "Sep", "USD Million": 6.1 }
    ]
  },
  {
    key: "slow_moving_spares_pct",
    name: "Slow Moving Spares %",
    variant: "pie",
    xAxis: "Category",
    yAxis: "Share",
    columns: ["Category", "Share"],
    data: [
      { Category: "Active", Share: 68 },
      { Category: "Slow Moving", Share: 32 }
    ]
  },
  {
    key: "pending_repair_orders",
    name: "Pending Repair Orders",
    variant: "table",
    xAxis: "Vendor",
    yAxis: "Orders",
    columns: ["Vendor", "Orders", "Age (days)"],
    data: [
      { Vendor: "Lufthansa Tech", Orders: 12, "Age (days)": 24 },
      { Vendor: "Rolls-Royce", Orders: 8, "Age (days)": 30 },
      { Vendor: "Safran", Orders: 5, "Age (days)": 18 }
    ]
  },
  {
    key: "spares_fulfillment_lead_time",
    name: "Spares Fulfillment Lead Time",
    variant: "line",
    xAxis: "Month",
    yAxis: "Days",
    columns: ["Month", "Days"],
    data: [
      { Month: "Apr", Days: 10.5 },
      { Month: "May", Days: 9.8 },
      { Month: "Jun", Days: 9.1 },
      { Month: "Jul", Days: 8.6 },
      { Month: "Aug", Days: 8.2 },
      { Month: "Sep", Days: 7.9 }
    ]
  },
  {
    key: "vendor_performance_score",
    name: "Vendor Performance Score",
    variant: "bar",
    xAxis: "Vendor",
    yAxis: "Score (%)",
    columns: ["Vendor", "Score (%)"],
    data: [
      { Vendor: "Lufthansa Tech", "Score (%)": 96 },
      { Vendor: "Rolls-Royce", "Score (%)": 93 },
      { Vendor: "Safran", "Score (%)": 91 },
      { Vendor: "Collins", "Score (%)": 89 }
    ]
  },
  {
    key: "inventory_accuracy_audit",
    name: "Inventory Accuracy Audit %",
    variant: "numeric",
    xAxis: "Metric",
    yAxis: "Percent",
    columns: ["Metric", "Percent"],
    data: [
      { Metric: "Accuracy", Percent: 98.5 }
    ]
  },
  {
    key: "spares_demand_forecast_error",
    name: "Spares Demand Forecast Error %",
    variant: "line",
    xAxis: "Month",
    yAxis: "Error (%)",
    columns: ["Month", "Error (%)"],
    data: [
      { Month: "Apr", "Error (%)": 7.2 },
      { Month: "May", "Error (%)": 6.9 },
      { Month: "Jun", "Error (%)": 6.3 },
      { Month: "Jul", "Error (%)": 6.0 },
      { Month: "Aug", "Error (%)": 5.8 },
      { Month: "Sep", "Error (%)": 5.6 }
    ]
  },
  {
    key: "inventory_carrying_cost",
    name: "Inventory Carrying Cost (USD M)",
    variant: "line",
    xAxis: "Month",
    yAxis: "USD Million",
    columns: ["Month", "USD Million"],
    data: [
      { Month: "Apr", "USD Million": 1.9 },
      { Month: "May", "USD Million": 1.8 },
      { Month: "Jun", "USD Million": 1.7 },
      { Month: "Jul", "USD Million": 1.6 },
      { Month: "Aug", "USD Million": 1.6 },
      { Month: "Sep", "USD Million": 1.5 }
    ]
  }
];

export const dataSources = ["AMOS", "TRAX", "SAP", "Ramco", "AIMS", "Jeppesen"];
