// Ops & Dispatch Reliability Dashboard KPIs
export const opsKPIs = [
  {
    key: "dispatch_reliability",
    name: "Dispatch Reliability %",
    variant: "line",
    xAxis: "Date",
    yAxis: "Reliability %",
    columns: ["Date", "Reliability %"],
    data: [
      { Date: "2025-10-01", "Reliability %": 98.8 },
      { Date: "2025-10-02", "Reliability %": 99.2 },
      { Date: "2025-10-03", "Reliability %": 99.5 },
      { Date: "2025-10-04", "Reliability %": 99.6 },
      { Date: "2025-10-05", "Reliability %": 99.4 },
      { Date: "2025-10-06", "Reliability %": 99.1 }
    ]
  },
  {
    key: "on_time_departure_pct",
    name: "On-Time Departure %",
    variant: "gauge",
    xAxis: "Status",
    yAxis: "Percent",
    columns: ["Status", "Percent"],
    data: [
      { Status: "On-Time", Percent: 87.3 },
      { Status: "Delayed", Percent: 12.7 }
    ]
  },
  {
    key: "tech_cancellations_7d",
    name: "Tech Cancellations (Last 7d)",
    variant: "bar",
    xAxis: "Hub",
    yAxis: "Cancellations",
    columns: ["Hub", "Cancellations"],
    data: [
      { Hub: "DXB", Cancellations: 2 },
      { Hub: "DOH", Cancellations: 0 },
      { Hub: "AUH", Cancellations: 1 },
      { Hub: "LHR", Cancellations: 0 },
      { Hub: "BOM", Cancellations: 1 }
    ]
  },
  {
    key: "dispatch_delay_codes",
    name: "Dispatch Delay Codes (Top 5)",
    variant: "bar",
    xAxis: "Delay Code",
    yAxis: "Occurrences",
    columns: ["Delay Code", "Occurrences"],
    data: [
      { "Delay Code": "63-Hydraulic", Occurrences: 18 },
      { "Delay Code": "71-Powerplant", Occurrences: 15 },
      { "Delay Code": "32-Landing Gear", Occurrences: 12 },
      { "Delay Code": "27-Flight Controls", Occurrences: 10 },
      { "Delay Code": "49-APU", Occurrences: 8 }
    ]
  },
  {
    key: "turnaround_time_avg",
    name: "Turnaround Time Avg (Minutes)",
    variant: "line",
    xAxis: "Date",
    yAxis: "Minutes",
    columns: ["Date", "Minutes"],
    data: [
      { Date: "2025-10-01", Minutes: 42 },
      { Date: "2025-10-02", Minutes: 41 },
      { Date: "2025-10-03", Minutes: 39 },
      { Date: "2025-10-04", Minutes: 40 },
      { Date: "2025-10-05", Minutes: 38 },
      { Date: "2025-10-06", Minutes: 37 }
    ]
  },
  {
    key: "go_arounds_diversions",
    name: "Go-Arounds & Diversions",
    variant: "bar",
    xAxis: "Event Type",
    yAxis: "Count (Last 30d)",
    columns: ["Event Type", "Count (Last 30d)"],
    data: [
      { "Event Type": "Go-Around", "Count (Last 30d)": 5 },
      { "Event Type": "Diversion", "Count (Last 30d)": 2 },
      { "Event Type": "Air Return", "Count (Last 30d)": 1 }
    ]
  },
  {
    key: "tech_dispatch_log_aging",
    name: "Tech Dispatch Log - Aging",
    variant: "heatmap",
    xAxis: "Age Bucket",
    yAxis: "Open Items",
    columns: ["Age Bucket", "Open Items"],
    data: [
      { "Age Bucket": "0-7d", "Open Items": 12 },
      { "Age Bucket": "8-30d", "Open Items": 5 },
      { "Age Bucket": "30d+", "Open Items": 2 }
    ]
  },
  {
    key: "flight_ops_incidents",
    name: "Flight Ops Incidents (Last 30d)",
    variant: "table",
    columns: ["Incident Type", "Count", "Severity"],
    data: [
      { "Incident Type": "Bird Strike", Count: 3, Severity: "Low" },
      { "Incident Type": "Lightning Strike", Count: 1, Severity: "Medium" },
      { "Incident Type": "Turbulence Injury", Count: 0, Severity: "N/A" }
    ]
  },
  {
    key: "slots_missed_due_tech",
    name: "Slots Missed Due to Tech",
    variant: "numeric",
    xAxis: "Metric",
    yAxis: "Count",
    columns: ["Metric", "Count"],
    data: [
      { Metric: "Slots Missed (Last 7d)", Count: 4 }
    ]
  },
  {
    key: "passenger_denied_boarding_tech",
    name: "Passenger Denied Boarding (Tech)",
    variant: "line",
    xAxis: "Date",
    yAxis: "Passengers",
    columns: ["Date", "Passengers"],
    data: [
      { Date: "2025-09-01", Passengers: 0 },
      { Date: "2025-09-08", Passengers: 12 },
      { Date: "2025-09-15", Passengers: 0 },
      { Date: "2025-09-22", Passengers: 8 },
      { Date: "2025-09-29", Passengers: 0 },
      { Date: "2025-10-06", Passengers: 0 }
    ]
  },
  {
    key: "etops_dispatch_compliance",
    name: "ETOPS Dispatch Compliance %",
    variant: "gauge",
    xAxis: "Status",
    yAxis: "Percent",
    columns: ["Status", "Percent"],
    data: [
      { Status: "Compliant", Percent: 100 },
      { Status: "Non-Compliant", Percent: 0 }
    ]
  },
  {
    key: "return_to_service_delays",
    name: "Return to Service Delays (Days)",
    variant: "bar",
    xAxis: "Aircraft",
    yAxis: "Days",
    columns: ["Aircraft", "Days"],
    data: [
      { Aircraft: "A6-GAA", Days: 0.5 },
      { Aircraft: "A6-MMG", Days: 2.3 },
      { Aircraft: "A6-EBD", Days: 1.1 },
      { Aircraft: "A6-PCN", Days: 0.8 }
    ]
  }
];

export const dataSources = ["AMOS", "TRAX", "AIMS", "Jeppesen", "SAP"];
