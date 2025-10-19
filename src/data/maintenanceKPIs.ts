export interface KPIData {
  key: string;
  name: string;
  variant: "gauge" | "table" | "line" | "bar" | "pie" | "heatmap" | "delta" | "numeric" | "timeline" | "line+numeric";
  xAxis: string;
  yAxis: string;
  columns: string[];
  data: Record<string, any>[];
}

export const maintenanceKPIs: KPIData[] = [
  {
    key: "fleet_airworthiness_pct",
    name: "Fleet Airworthiness %",
    variant: "gauge",
    xAxis: "Segment",
    yAxis: "Percent",
    columns: ["Segment", "Percent"],
    data: [
      { Segment: "Airworthy", Percent: 93 },
      { Segment: "Other", Percent: 7 }
    ]
  },
  {
    key: "airworthiness_status_by_a",
    name: "Airworthiness Status by Aircraft",
    variant: "table",
    xAxis: "Aircraft",
    yAxis: "Airworthy Hours Last 14d",
    columns: ["Aircraft", "Airworthy Hours Last 14d"],
    data: [
      { Aircraft: "A6-GAA", "Airworthy Hours Last 14d": 304 },
      { Aircraft: "A6-MMG", "Airworthy Hours Last 14d": 246 },
      { Aircraft: "A6-EBD", "Airworthy Hours Last 14d": 294 },
      { Aircraft: "A6-PCN", "Airworthy Hours Last 14d": 234 },
      { Aircraft: "A6-EWA", "Airworthy Hours Last 14d": 262 },
      { Aircraft: "A6-DSS", "Airworthy Hours Last 14d": 305 },
      { Aircraft: "A6-ABV", "Airworthy Hours Last 14d": 310 },
      { Aircraft: "A6-JIS", "Airworthy Hours Last 14d": 245 },
      { Aircraft: "A6-WIS", "Airworthy Hours Last 14d": 292 },
      { Aircraft: "A6-RWY", "Airworthy Hours Last 14d": 245 },
      { Aircraft: "A6-GDP", "Airworthy Hours Last 14d": 293 },
      { Aircraft: "A6-MNT", "Airworthy Hours Last 14d": 237 },
      { Aircraft: "A6-UGP", "Airworthy Hours Last 14d": 275 },
      { Aircraft: "A6-YEN", "Airworthy Hours Last 14d": 240 },
      { Aircraft: "A6-LFT", "Airworthy Hours Last 14d": 291 }
    ]
  },
  {
    key: "aog_events_count_and_minutes",
    name: "AOG Events (Count & Minutes)",
    variant: "line+numeric",
    xAxis: "Date",
    yAxis: "AOG Count",
    columns: ["Date", "AOG Count", "Station", "AOG Minutes (last 7d)"],
    data: [
      { Date: "2025-09-10", "AOG Count": 4.87, Station: "DXB", "AOG Minutes (last 7d)": 120.6 },
      { Date: "2025-09-11", "AOG Count": 2.11, Station: "DEL", "AOG Minutes (last 7d)": 169.9 },
      { Date: "2025-09-12", "AOG Count": 3.55, Station: "BOM", "AOG Minutes (last 7d)": 124.5 },
      { Date: "2025-09-13", "AOG Count": 2.63, Station: "SIN", "AOG Minutes (last 7d)": 123.8 },
      { Date: "2025-09-14", "AOG Count": 3.05, Station: "JED", "AOG Minutes (last 7d)": 137.0 }
    ]
  },
  {
    key: "tech_delay_minutes",
    name: "Tech Delay Minutes",
    variant: "bar",
    xAxis: "Route",
    yAxis: "Avg Tech Delay Minutes per Day (last 7d)",
    columns: ["Route", "Avg Tech Delay Minutes per Day (last 7d)"],
    data: [
      { Route: "DOH-JFK", "Avg Tech Delay Minutes per Day (last 7d)": 26 },
      { Route: "DXB-BOM", "Avg Tech Delay Minutes per Day (last 7d)": 24 },
      { Route: "DXB-SIN", "Avg Tech Delay Minutes per Day (last 7d)": 21 },
      { Route: "DEL-DOH", "Avg Tech Delay Minutes per Day (last 7d)": 19 },
      { Route: "DXB-JED", "Avg Tech Delay Minutes per Day (last 7d)": 18 }
    ]
  },
  {
    key: "scheduled_vs_unscheduled",
    name: "Scheduled vs. Unscheduled",
    variant: "pie",
    xAxis: "Task Type",
    yAxis: "Share",
    columns: ["Task Type", "Share"],
    data: [
      { "Task Type": "Scheduled", Share: 64 },
      { "Task Type": "Unscheduled", Share: 36 }
    ]
  },
  {
    key: "work_order_backlog_aging",
    name: "Work Order Backlog Aging",
    variant: "heatmap",
    xAxis: "Aging",
    yAxis: "Open WOs",
    columns: ["Aging", "Open WOs"],
    data: [
      { Aging: "0–7d", "Open WOs": 157 },
      { Aging: "8–30d", "Open WOs": 2 },
      { Aging: "30d+", "Open WOs": 81 }
    ]
  },
  {
    key: "mean_time_to_repair_mttr",
    name: "Mean Time to Repair (MTTR)",
    variant: "line",
    xAxis: "Date",
    yAxis: "Hours",
    columns: ["Date", "Hours"],
    data: [
      { Date: "2025-09-08", Hours: 18.04 },
      { Date: "2025-09-09", Hours: 21.43 },
      { Date: "2025-09-10", Hours: 21.97 },
      { Date: "2025-09-11", Hours: 20.92 },
      { Date: "2025-09-12", Hours: 24.36 }
    ]
  },
  {
    key: "work_orders_awaiting_parts_count",
    name: "Work Orders Awaiting Parts (Count)",
    variant: "table",
    xAxis: "Part Status",
    yAxis: "WOs Blocked",
    columns: ["Part Status", "WOs Blocked"],
    data: [
      { "Part Status": "Awaiting Approval", "WOs Blocked": 2 },
      { "Part Status": "PO Raised", "WOs Blocked": 53 },
      { "Part Status": "At Customs", "WOs Blocked": 75 }
    ]
  },
  {
    key: "spare_induced_delays_pct",
    name: "Spare-Induced Delays %",
    variant: "delta",
    xAxis: "Station",
    yAxis: "% vs Prior Month",
    columns: ["Station", "% vs Prior Month"],
    data: [
      { Station: "SIN", "% vs Prior Month": -1.9 },
      { Station: "JED", "% vs Prior Month": -0.8 },
      { Station: "JFK", "% vs Prior Month": 10.7 },
      { Station: "DEL", "% vs Prior Month": 9 },
      { Station: "BOM", "% vs Prior Month": 5.3 }
    ]
  },
  {
    key: "repeat_defects_30_90d",
    name: "Repeat Defects (30/90d)",
    variant: "line",
    xAxis: "Week Ending",
    yAxis: "Repeat Defects",
    columns: ["Week Ending", "Repeat Defects"],
    data: [
      { "Week Ending": "2025-09-11", "Repeat Defects": 10 },
      { "Week Ending": "2025-09-18", "Repeat Defects": 11 },
      { "Week Ending": "2025-09-25", "Repeat Defects": 2 },
      { "Week Ending": "2025-10-02", "Repeat Defects": 9 },
      { "Week Ending": "2025-10-09", "Repeat Defects": 8 }
    ]
  },
  {
    key: "unscheduled_removals_30_90d",
    name: "Unscheduled Removals (30/90d)",
    variant: "line",
    xAxis: "Date",
    yAxis: "Removals",
    columns: ["Date", "Removals"],
    data: [
      { Date: "2025-09-08", Removals: 1 },
      { Date: "2025-09-09", Removals: 0 },
      { Date: "2025-09-10", Removals: 1 },
      { Date: "2025-09-11", Removals: 2 },
      { Date: "2025-09-12", Removals: 2 }
    ]
  },
  {
    key: "deferral_count",
    name: "Deferral Count",
    variant: "numeric",
    xAxis: "Metric",
    yAxis: "Count",
    columns: ["Metric", "Count"],
    data: [
      { Metric: "Open Deferrals", Count: 90 }
    ]
  },
  {
    key: "deferral_aging",
    name: "Deferral Aging",
    variant: "bar",
    xAxis: "Deferral Age",
    yAxis: "Open Deferrals",
    columns: ["Deferral Age", "Open Deferrals"],
    data: [
      { "Deferral Age": "0–7d", "Open Deferrals": 40 },
      { "Deferral Age": "8–30d", "Open Deferrals": 27 },
      { "Deferral Age": "30d+", "Open Deferrals": 23 }
    ]
  },
  {
    key: "mel_cdl_items_open",
    name: "MEL/CDL Items Open",
    variant: "table",
    xAxis: "Aircraft",
    yAxis: "Open MEL/CDL Items",
    columns: ["Aircraft", "Open MEL/CDL Items"],
    data: [
      { Aircraft: "A6-IST", "Open MEL/CDL Items": 2 },
      { Aircraft: "A6-KAL", "Open MEL/CDL Items": 5 },
      { Aircraft: "A6-TAR", "Open MEL/CDL Items": 3 },
      { Aircraft: "A6-CRU", "Open MEL/CDL Items": 4 },
      { Aircraft: "A6-FIG", "Open MEL/CDL Items": 5 },
      { Aircraft: "A6-XNP", "Open MEL/CDL Items": 4 }
    ]
  },
  {
    key: "work_packages_due_next_7_30d",
    name: "Work Packages Due (Next 7/30d)",
    variant: "timeline",
    xAxis: "Date",
    yAxis: "Packages Due",
    columns: ["Date", "Packages Due"],
    data: [
      { Date: "2025-10-10", "Packages Due": 3 },
      { Date: "2025-10-11", "Packages Due": 4 },
      { Date: "2025-10-12", "Packages Due": 5 },
      { Date: "2025-10-13", "Packages Due": 5 },
      { Date: "2025-10-14", "Packages Due": 2 }
    ]
  }
];

export const dataSources = ["AMOS", "TRAX", "SAP", "Ramco", "AIMS", "Jeppesen"];
