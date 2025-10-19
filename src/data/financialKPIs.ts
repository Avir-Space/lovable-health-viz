// Financial & Procurement Dashboard KPIs
export const financialKPIs = [
  {
    key: "maint_cost_per_flight_hour",
    name: "Maintenance Cost per Flight Hour",
    variant: "line",
    xAxis: "Month",
    yAxis: "USD/FH",
    columns: ["Month", "USD/FH"],
    data: [
      { Month: "Apr", "USD/FH": 1250 },
      { Month: "May", "USD/FH": 1280 },
      { Month: "Jun", "USD/FH": 1310 },
      { Month: "Jul", "USD/FH": 1290 },
      { Month: "Aug", "USD/FH": 1270 },
      { Month: "Sep", "USD/FH": 1245 }
    ]
  },
  {
    key: "maint_budget_variance",
    name: "Maintenance Budget Variance %",
    variant: "delta",
    xAxis: "Category",
    yAxis: "% Variance",
    columns: ["Category", "% Variance"],
    data: [
      { Category: "Labor", "% Variance": -5.2 },
      { Category: "Material", "% Variance": 8.7 },
      { Category: "External MRO", "% Variance": 3.1 },
      { Category: "Tools & Equipment", "% Variance": -2.4 }
    ]
  },
  {
    key: "po_cycle_time_days",
    name: "PO Cycle Time (Days)",
    variant: "line",
    xAxis: "Month",
    yAxis: "Days",
    columns: ["Month", "Days"],
    data: [
      { Month: "Apr", Days: 12.5 },
      { Month: "May", Days: 11.8 },
      { Month: "Jun", Days: 10.9 },
      { Month: "Jul", Days: 10.2 },
      { Month: "Aug", Days: 9.8 },
      { Month: "Sep", Days: 9.3 }
    ]
  },
  {
    key: "vendor_payment_aging",
    name: "Vendor Payment Aging",
    variant: "heatmap",
    xAxis: "Age Bucket",
    yAxis: "Amount (USD K)",
    columns: ["Age Bucket", "Amount (USD K)"],
    data: [
      { "Age Bucket": "0-30d", "Amount (USD K)": 850 },
      { "Age Bucket": "31-60d", "Amount (USD K)": 320 },
      { "Age Bucket": "61-90d", "Amount (USD K)": 85 },
      { "Age Bucket": "90d+", "Amount (USD K)": 45 }
    ]
  },
  {
    key: "cost_per_departure",
    name: "Maintenance Cost per Departure",
    variant: "bar",
    xAxis: "Fleet Type",
    yAxis: "USD/Departure",
    columns: ["Fleet Type", "USD/Departure"],
    data: [
      { "Fleet Type": "A320", "USD/Departure": 980 },
      { "Fleet Type": "A321", "USD/Departure": 1050 },
      { "Fleet Type": "B737-800", "USD/Departure": 1020 },
      { "Fleet Type": "A330", "USD/Departure": 2150 }
    ]
  },
  {
    key: "labor_cost_breakdown",
    name: "Labor Cost Breakdown %",
    variant: "pie",
    xAxis: "Category",
    yAxis: "Share",
    columns: ["Category", "Share"],
    data: [
      { Category: "Line Maintenance", Share: 45 },
      { Category: "Base Maintenance", Share: 32 },
      { Category: "Engineering", Share: 15 },
      { Category: "Admin", Share: 8 }
    ]
  },
  {
    key: "warranty_claims_status",
    name: "Warranty Claims Status",
    variant: "table",
    columns: ["Vendor", "Pending Claims", "Total Value (USD)"],
    data: [
      { Vendor: "Lufthansa Tech", "Pending Claims": 5, "Total Value (USD)": 125000 },
      { Vendor: "Rolls-Royce", "Pending Claims": 3, "Total Value (USD)": 285000 },
      { Vendor: "Safran", "Pending Claims": 2, "Total Value (USD)": 95000 }
    ]
  },
  {
    key: "material_cost_forecast_error",
    name: "Material Cost Forecast Error %",
    variant: "line",
    xAxis: "Month",
    yAxis: "Error %",
    columns: ["Month", "Error %"],
    data: [
      { Month: "Apr", "Error %": 8.2 },
      { Month: "May", "Error %": 7.5 },
      { Month: "Jun", "Error %": 6.8 },
      { Month: "Jul", "Error %": 6.2 },
      { Month: "Aug", "Error %": 5.9 },
      { Month: "Sep", "Error %": 5.4 }
    ]
  },
  {
    key: "cash_locked_in_wip",
    name: "Cash Locked in WIP (USD M)",
    variant: "numeric",
    xAxis: "Metric",
    yAxis: "Amount (USD M)",
    columns: ["Metric", "Amount (USD M)"],
    data: [
      { Metric: "WIP Value", "Amount (USD M)": 3.8 }
    ]
  },
  {
    key: "cost_avoidance_initiatives",
    name: "Cost Avoidance Initiatives (USD M)",
    variant: "bar",
    xAxis: "Initiative",
    yAxis: "Savings (USD M)",
    columns: ["Initiative", "Savings (USD M)"],
    data: [
      { Initiative: "In-House Repairs", "Savings (USD M)": 1.2 },
      { Initiative: "Pool Programs", "Savings (USD M)": 0.9 },
      { Initiative: "Vendor Negotiations", "Savings (USD M)": 0.7 },
      { Initiative: "Process Optimization", "Savings (USD M)": 0.5 }
    ]
  }
];

export const dataSources = ["SAP", "Ramco", "AMOS"];
