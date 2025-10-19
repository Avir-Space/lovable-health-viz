// Compliance & Airworthiness Dashboard KPIs
export const complianceKPIs = [
  {
    key: "aircraft_airworthy_pct",
    name: "% Aircraft Airworthy vs. Grounded",
    variant: "gauge",
    xAxis: "State",
    yAxis: "Percent",
    columns: ["State", "Percent"],
    data: [
      { State: "Airworthy", Percent: 98.7 },
      { State: "Grounded", Percent: 1.3 }
    ]
  },
  {
    key: "mel_compliance_status",
    name: "MEL Compliance Status",
    variant: "bar",
    xAxis: "Fleet",
    yAxis: "MEL Items Open",
    columns: ["Fleet", "MEL Items Open", "Resolved This Month"],
    data: [
      { Fleet: "A320", "MEL Items Open": 7, "Resolved This Month": 12 },
      { Fleet: "A321", "MEL Items Open": 5, "Resolved This Month": 11 },
      { Fleet: "B737-800", "MEL Items Open": 22, "Resolved This Month": 8 },
      { Fleet: "A330", "MEL Items Open": 15, "Resolved This Month": 7 }
    ]
  },
  {
    key: "ad_sb_compliance",
    name: "AD & SB Compliance %",
    variant: "numeric",
    xAxis: "Metric",
    yAxis: "Compliance %",
    columns: ["Metric", "Compliance %"],
    data: [
      { Metric: "AD Compliance", "Compliance %": 100 },
      { Metric: "SB Compliance", "Compliance %": 97.5 }
    ]
  },
  {
    key: "overdue_ads_sbs",
    name: "Overdue ADs/SBs (Count & Age)",
    variant: "table",
    columns: ["AD/SB Ref", "Fleet", "Days Overdue"],
    data: [
      { "AD/SB Ref": "AD-2023-12-05", Fleet: "A320", "Days Overdue": 0 },
      { "AD/SB Ref": "SB-A320-27-1234", Fleet: "A321", "Days Overdue": 12 },
      { "AD/SB Ref": "SB-B737-32-5678", Fleet: "B737-800", "Days Overdue": 5 }
    ]
  },
  {
    key: "camo_release_cycle_time",
    name: "CAMO Release Cycle Time (Days)",
    variant: "line",
    xAxis: "Month",
    yAxis: "Avg Days",
    columns: ["Month", "Avg Days"],
    data: [
      { Month: "Apr", "Avg Days": 4.2 },
      { Month: "May", "Avg Days": 3.8 },
      { Month: "Jun", "Avg Days": 3.5 },
      { Month: "Jul", "Avg Days": 3.2 },
      { Month: "Aug", "Avg Days": 3.1 },
      { Month: "Sep", "Avg Days": 2.9 }
    ]
  },
  {
    key: "easa_faa_findings",
    name: "EASA/FAA Findings Open",
    variant: "bar",
    xAxis: "Authority",
    yAxis: "Open Findings",
    columns: ["Authority", "Open Findings"],
    data: [
      { Authority: "EASA", "Open Findings": 3 },
      { Authority: "FAA", "Open Findings": 1 },
      { Authority: "GCAA", "Open Findings": 0 }
    ]
  },
  {
    key: "cert_renewal_due_30_90d",
    name: "Cert Renewal Due (30/90d)",
    variant: "table",
    columns: ["Certificate Type", "Aircraft", "Due Date", "Days Until Due"],
    data: [
      { "Certificate Type": "C of A", Aircraft: "A6-EBM", "Due Date": "2025-11-15", "Days Until Due": 27 },
      { "Certificate Type": "RVSM", Aircraft: "A6-PCN", "Due Date": "2025-11-28", "Days Until Due": 40 },
      { "Certificate Type": "ETOPS", Aircraft: "A6-DSS", "Due Date": "2025-12-10", "Days Until Due": 52 }
    ]
  },
  {
    key: "reliability_program_metrics",
    name: "Reliability Program Metrics",
    variant: "bar",
    xAxis: "ATA Chapter",
    yAxis: "PIREP Rate",
    columns: ["ATA Chapter", "PIREP Rate"],
    data: [
      { "ATA Chapter": "ATA 27", "PIREP Rate": 2.3 },
      { "ATA Chapter": "ATA 32", "PIREP Rate": 3.1 },
      { "ATA Chapter": "ATA 49", "PIREP Rate": 1.8 },
      { "ATA Chapter": "ATA 71", "PIREP Rate": 2.7 }
    ]
  },
  {
    key: "inspection_due_next_7_30d",
    name: "Inspection Due (Next 7/30d)",
    variant: "timeline",
    xAxis: "Date",
    yAxis: "Inspections Due",
    columns: ["Date", "Inspections Due"],
    data: [
      { Date: "2025-10-20", "Inspections Due": 5 },
      { Date: "2025-10-27", "Inspections Due": 8 },
      { Date: "2025-11-03", "Inspections Due": 6 },
      { Date: "2025-11-10", "Inspections Due": 4 },
      { Date: "2025-11-17", "Inspections Due": 7 }
    ]
  },
  {
    key: "hours_cycles_remaining",
    name: "Hours/Cycles Remaining to Next Check",
    variant: "table",
    columns: ["Aircraft", "Next Check", "Hours to Go", "Cycles to Go"],
    data: [
      { Aircraft: "A6-GAA", "Next Check": "A Check", "Hours to Go": 124, "Cycles to Go": 85 },
      { Aircraft: "A6-MMG", "Next Check": "C Check", "Hours to Go": 1850, "Cycles to Go": 950 },
      { Aircraft: "A6-EBD", "Next Check": "A Check", "Hours to Go": 89, "Cycles to Go": 62 }
    ]
  }
];

export const dataSources = ["AMOS", "TRAX", "SAP", "Ramco", "AIMS", "Jeppesen"];
