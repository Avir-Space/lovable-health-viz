// Fuel & Efficiency Dashboard KPIs
export const fuelKPIs = [
  {
    key: "fuel_burn_variance_vs_plan",
    name: "Fuel Burn Variance vs. Plan %",
    variant: "delta",
    xAxis: "Route",
    yAxis: "% vs Plan",
    columns: ["Route", "% vs Plan"],
    data: [
      { Route: "DXB-LHR", "% vs Plan": -2.1 },
      { Route: "DOH-JFK", "% vs Plan": 1.8 },
      { Route: "AUH-BOM", "% vs Plan": -0.5 },
      { Route: "DXB-SIN", "% vs Plan": 0.9 },
      { Route: "LHR-JED", "% vs Plan": -1.2 }
    ]
  },
  {
    key: "fuel_cost_per_flight_hour",
    name: "Fuel Cost per Flight Hour (USD)",
    variant: "line",
    xAxis: "Month",
    yAxis: "USD/Hour",
    columns: ["Month", "USD/Hour"],
    data: [
      { Month: "Apr", "USD/Hour": 2850 },
      { Month: "May", "USD/Hour": 2920 },
      { Month: "Jun", "USD/Hour": 2880 },
      { Month: "Jul", "USD/Hour": 2910 },
      { Month: "Aug", "USD/Hour": 2895 },
      { Month: "Sep", "USD/Hour": 2870 }
    ]
  },
  {
    key: "fuel_efficiency_fleet",
    name: "Fuel Efficiency by Fleet (kg/NM)",
    variant: "bar",
    xAxis: "Fleet Type",
    yAxis: "kg/NM",
    columns: ["Fleet Type", "kg/NM"],
    data: [
      { "Fleet Type": "A320", "kg/NM": 2.85 },
      { "Fleet Type": "A321", "kg/NM": 2.92 },
      { "Fleet Type": "B737-800", "kg/NM": 2.88 },
      { "Fleet Type": "A330", "kg/NM": 5.12 }
    ]
  },
  {
    key: "excess_fuel_loaded_pct",
    name: "Excess Fuel Loaded %",
    variant: "gauge",
    xAxis: "Category",
    yAxis: "Percent",
    columns: ["Category", "Percent"],
    data: [
      { Category: "Within Plan", Percent: 92 },
      { Category: "Excess", Percent: 8 }
    ]
  },
  {
    key: "tankering_savings_usd",
    name: "Tankering Savings (USD/Month)",
    variant: "line",
    xAxis: "Month",
    yAxis: "Savings (USD)",
    columns: ["Month", "Savings (USD)"],
    data: [
      { Month: "Apr", "Savings (USD)": 145000 },
      { Month: "May", "Savings (USD)": 158000 },
      { Month: "Jun", "Savings (USD)": 162000 },
      { Month: "Jul", "Savings (USD)": 171000 },
      { Month: "Aug", "Savings (USD)": 168000 },
      { Month: "Sep", "Savings (USD)": 175000 }
    ]
  },
  {
    key: "apu_usage_minutes_per_flight",
    name: "APU Usage (Minutes per Flight)",
    variant: "bar",
    xAxis: "Station",
    yAxis: "Avg Minutes",
    columns: ["Station", "Avg Minutes"],
    data: [
      { Station: "DXB", "Avg Minutes": 18 },
      { Station: "DOH", "Avg Minutes": 15 },
      { Station: "AUH", "Avg Minutes": 16 },
      { Station: "LHR", "Avg Minutes": 22 },
      { Station: "BOM", "Avg Minutes": 19 }
    ]
  },
  {
    key: "engine_wash_schedule_compliance",
    name: "Engine Wash Schedule Compliance %",
    variant: "numeric",
    xAxis: "Metric",
    yAxis: "Compliance %",
    columns: ["Metric", "Compliance %"],
    data: [
      { Metric: "Engine Wash Compliance", "Compliance %": 94.5 }
    ]
  },
  {
    key: "cost_index_adherence",
    name: "Cost Index Adherence %",
    variant: "gauge",
    xAxis: "Status",
    yAxis: "Percent",
    columns: ["Status", "Percent"],
    data: [
      { Status: "Adhered", Percent: 96.7 },
      { Status: "Deviation", Percent: 3.3 }
    ]
  },
  {
    key: "weight_optimization_savings",
    name: "Weight Optimization Savings (USD)",
    variant: "line",
    xAxis: "Month",
    yAxis: "Savings (USD)",
    columns: ["Month", "Savings (USD)"],
    data: [
      { Month: "Apr", "Savings (USD)": 42000 },
      { Month: "May", "Savings (USD)": 45000 },
      { Month: "Jun", "Savings (USD)": 48000 },
      { Month: "Jul", "Savings (USD)": 51000 },
      { Month: "Aug", "Savings (USD)": 49000 },
      { Month: "Sep", "Savings (USD)": 53000 }
    ]
  },
  {
    key: "green_taxi_usage_pct",
    name: "Green Taxi Usage %",
    variant: "line",
    xAxis: "Month",
    yAxis: "Usage %",
    columns: ["Month", "Usage %"],
    data: [
      { Month: "Apr", "Usage %": 78 },
      { Month: "May", "Usage %": 82 },
      { Month: "Jun", "Usage %": 85 },
      { Month: "Jul", "Usage %": 87 },
      { Month: "Aug", "Usage %": 89 },
      { Month: "Sep", "Usage %": 91 }
    ]
  }
];

export const dataSources = ["AMOS", "TRAX", "AIMS", "Jeppesen"];
