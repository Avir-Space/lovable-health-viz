// Crew & Duty Snapshot Dashboard KPIs
export const crewKPIs = [
  {
    key: "crew_utilization_pct",
    name: "Crew Utilization %",
    variant: "gauge",
    xAxis: "Category",
    yAxis: "Percent",
    columns: ["Category", "Percent"],
    data: [
      { Category: "Utilized", Percent: 89.5 },
      { Category: "Available", Percent: 10.5 }
    ]
  },
  {
    key: "fatigue_risk_score",
    name: "Fatigue Risk Score (Avg)",
    variant: "line",
    xAxis: "Date",
    yAxis: "Risk Score",
    columns: ["Date", "Risk Score"],
    data: [
      { Date: "2025-10-01", "Risk Score": 2.3 },
      { Date: "2025-10-02", "Risk Score": 2.5 },
      { Date: "2025-10-03", "Risk Score": 2.1 },
      { Date: "2025-10-04", "Risk Score": 2.4 },
      { Date: "2025-10-05", "Risk Score": 2.2 },
      { Date: "2025-10-06", "Risk Score": 2.0 }
    ]
  },
  {
    key: "pairing_legality_violations",
    name: "Pairing Legality Violations (# & Rate)",
    variant: "table",
    columns: ["Violation Type", "Count", "Rate per 1000 Flights"],
    data: [
      { "Violation Type": "Max FDP", Count: 13, "Rate per 1000 Flights": 0.9 },
      { "Violation Type": "Min Rest", Count: 17, "Rate per 1000 Flights": 1.6 },
      { "Violation Type": "Sector Count", Count: 4, "Rate per 1000 Flights": 2.6 },
      { "Violation Type": "Night Duty", Count: 6, "Rate per 1000 Flights": 2.8 }
    ]
  },
  {
    key: "crew_availability_by_base",
    name: "Crew Availability by Base & Qualification",
    variant: "table",
    columns: ["Qualification", "DXB", "DOH", "AUH", "LHR", "BOM"],
    data: [
      { Qualification: "Captain", DXB: 34, DOH: 53, AUH: 70, LHR: 18, BOM: 22 },
      { Qualification: "First Officer", DXB: 18, DOH: 20, AUH: 23, LHR: 45, BOM: 32 },
      { Qualification: "Cabin", DXB: 58, DOH: 49, AUH: 54, LHR: 74, BOM: 97 }
    ]
  },
  {
    key: "open_flight_pairings",
    name: "Open Flight Pairings (Unassigned)",
    variant: "line",
    xAxis: "Date",
    yAxis: "# Unassigned",
    columns: ["Date", "# Unassigned"],
    data: [
      { Date: "2025-10-13", "# Unassigned": 14 },
      { Date: "2025-10-14", "# Unassigned": 0 },
      { Date: "2025-10-15", "# Unassigned": 3 },
      { Date: "2025-10-16", "# Unassigned": 9 },
      { Date: "2025-10-17", "# Unassigned": 7 },
      { Date: "2025-10-18", "# Unassigned": 6 }
    ]
  },
  {
    key: "fdp_duty_time_utilization",
    name: "FDP/Duty Time Utilization %",
    variant: "line",
    xAxis: "Date",
    yAxis: "Avg Utilization %",
    columns: ["Date", "Avg Utilization %"],
    data: [
      { Date: "2025-09-08", "Avg Utilization %": 89.4 },
      { Date: "2025-09-09", "Avg Utilization %": 87.2 },
      { Date: "2025-09-10", "Avg Utilization %": 96.8 },
      { Date: "2025-09-11", "Avg Utilization %": 97.9 },
      { Date: "2025-09-12", "Avg Utilization %": 96.3 },
      { Date: "2025-09-13", "Avg Utilization %": 91.9 }
    ]
  },
  {
    key: "reserve_coverage_pct",
    name: "Reserve Coverage % & Response Time",
    variant: "line",
    xAxis: "Date",
    yAxis: "Reserve Coverage %",
    columns: ["Date", "Reserve Coverage %", "Response Time (min)"],
    data: [
      { Date: "2025-09-08", "Reserve Coverage %": 81.5, "Response Time (min)": 18 },
      { Date: "2025-09-09", "Reserve Coverage %": 84.4, "Response Time (min)": 18 },
      { Date: "2025-09-10", "Reserve Coverage %": 95.9, "Response Time (min)": 16 },
      { Date: "2025-09-11", "Reserve Coverage %": 72.8, "Response Time (min)": 10 },
      { Date: "2025-09-12", "Reserve Coverage %": 91.9, "Response Time (min)": 19 }
    ]
  },
  {
    key: "training_currency_compliance",
    name: "Training & Currency Compliance %",
    variant: "bar",
    xAxis: "Training Type",
    yAxis: "Compliance %",
    columns: ["Training Type", "Compliance %"],
    data: [
      { "Training Type": "Recurrent", "Compliance %": 98.5 },
      { "Training Type": "Line Check", "Compliance %": 96.2 },
      { "Training Type": "LOFT", "Compliance %": 94.8 },
      { "Training Type": "CRM", "Compliance %": 99.1 }
    ]
  },
  {
    key: "crew_roster_changes_7d",
    name: "Crew Roster Changes (Last 7d)",
    variant: "numeric",
    xAxis: "Metric",
    yAxis: "Count",
    columns: ["Metric", "Count"],
    data: [
      { Metric: "Roster Changes", Count: 127 }
    ]
  },
  {
    key: "sick_leave_absenteeism_pct",
    name: "Sick Leave / Absenteeism %",
    variant: "line",
    xAxis: "Month",
    yAxis: "Absenteeism %",
    columns: ["Month", "Absenteeism %"],
    data: [
      { Month: "Apr", "Absenteeism %": 5.4 },
      { Month: "May", "Absenteeism %": 1.2 },
      { Month: "Jun", "Absenteeism %": 2.3 },
      { Month: "Jul", "Absenteeism %": 2.7 },
      { Month: "Aug", "Absenteeism %": 5.4 },
      { Month: "Sep", "Absenteeism %": 2.6 }
    ]
  }
];

export const dataSources = ["AIMS", "Jeppesen", "SAP", "Ramco"];
