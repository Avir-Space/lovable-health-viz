export const impactKPIs = [
  {
    "key": "cost_saved_usd",
    "name": "Cost Saved (USD)",
    "definition": "Total direct operational cost avoided through AI-driven interventions (maintenance, fuel, inventory, crew).",
    "category": "Finance (Roll-up)",
    "sources": ["AMOS", "TRAX", "SAP", "Ramco", "AIMS", "Jeppesen"],
    "variant": "line",
    "xAxis": "Month",
    "yAxis": "USD",
    "columns": ["Month", "USD"],
    "data": [
      {"Month": "Apr", "USD": 950000},
      {"Month": "May", "USD": 1020000},
      {"Month": "Jun", "USD": 1110000},
      {"Month": "Jul", "USD": 1230000},
      {"Month": "Aug", "USD": 1300000},
      {"Month": "Sep", "USD": 1420000}
    ],
    "aiInsight": "Total $1.42M saved YTD (+18% MoM).",
    "aiAction": "Auto-generate ROI summary; export verified report to ERP."
  },
  {
    "key": "aog_minutes_avoided",
    "name": "AOG Minutes Avoided",
    "definition": "Reduction in aircraft-on-ground downtime minutes prevented due to predictive actions.",
    "category": "Maintenance",
    "sources": ["AMOS", "TRAX"],
    "variant": "line",
    "xAxis": "Month",
    "yAxis": "Minutes Avoided",
    "columns": ["Month", "Minutes Avoided"],
    "data": [
      {"Month": "Apr", "Minutes Avoided": 840},
      {"Month": "May", "Minutes Avoided": 920},
      {"Month": "Jun", "Minutes Avoided": 980},
      {"Month": "Jul", "Minutes Avoided": 1050},
      {"Month": "Aug", "Minutes Avoided": 1170},
      {"Month": "Sep", "Minutes Avoided": 1260}
    ],
    "aiInsight": "Downtime avoided increased +12% vs last month.",
    "aiAction": "Trigger maintenance review; recommend root cause analysis."
  },
  {
    "key": "fuel_saved",
    "name": "Fuel Saved (kg)",
    "definition": "Total kilograms of fuel saved through AI-driven flight planning and operational efficiency.",
    "category": "Fuel & Efficiency",
    "sources": ["AIMS", "Jeppesen"],
    "variant": "line",
    "xAxis": "Month",
    "yAxis": "kg Saved",
    "columns": ["Month", "kg Saved"],
    "data": [
      {"Month": "Apr", "kg Saved": 12500},
      {"Month": "May", "kg Saved": 14200},
      {"Month": "Jun", "kg Saved": 15700},
      {"Month": "Jul", "kg Saved": 17100},
      {"Month": "Aug", "kg Saved": 18600},
      {"Month": "Sep", "kg Saved": 19750}
    ],
    "aiInsight": "Fuel efficiency improving steadily (+9% MoM).",
    "aiAction": "Auto-generate route optimization report; recommend approval."
  },
  {
    "key": "crew_hours_optimized",
    "name": "Crew Hours Optimized",
    "definition": "Crew scheduling hours reduced through AI crew duty optimization.",
    "category": "Crew & Duty",
    "sources": ["AIMS", "Jeppesen"],
    "variant": "bar",
    "xAxis": "Month",
    "yAxis": "Hours Saved",
    "columns": ["Month", "Hours Saved"],
    "data": [
      {"Month": "Apr", "Hours Saved": 140},
      {"Month": "May", "Hours Saved": 170},
      {"Month": "Jun", "Hours Saved": 190},
      {"Month": "Jul", "Hours Saved": 220},
      {"Month": "Aug", "Hours Saved": 260},
      {"Month": "Sep", "Hours Saved": 310}
    ],
    "aiInsight": "Crew utilization improved 22% over Q2.",
    "aiAction": "Suggest optimized roster plan; notify ops scheduling."
  },
  {
    "key": "carbon_emission_reduction",
    "name": "Carbon Emission Reduction (tCO2)",
    "definition": "Estimated total carbon emissions prevented through optimized flight paths and fuel savings.",
    "category": "Sustainability",
    "sources": ["AIMS", "Jeppesen", "SAP"],
    "variant": "bar",
    "xAxis": "Month",
    "yAxis": "tCO2 Avoided",
    "columns": ["Month", "tCO2 Avoided"],
    "data": [
      {"Month": "Apr", "tCO2 Avoided": 45},
      {"Month": "May", "tCO2 Avoided": 52},
      {"Month": "Jun", "tCO2 Avoided": 59},
      {"Month": "Jul", "tCO2 Avoided": 66},
      {"Month": "Aug", "tCO2 Avoided": 72},
      {"Month": "Sep", "tCO2 Avoided": 81}
    ],
    "aiInsight": "Emission reduction increased 13% month-over-month.",
    "aiAction": "Generate sustainability report for audit."
  },
  {
    "key": "procurement_lead_time_reduction",
    "name": "Procurement Lead Time Reduction (days)",
    "definition": "Average days reduced in procurement process via predictive ordering.",
    "category": "Finance & Procurement",
    "sources": ["SAP", "Ramco"],
    "variant": "line",
    "xAxis": "Month",
    "yAxis": "Days Reduced",
    "columns": ["Month", "Days Reduced"],
    "data": [
      {"Month": "Apr", "Days Reduced": 4.5},
      {"Month": "May", "Days Reduced": 4.8},
      {"Month": "Jun", "Days Reduced": 5.2},
      {"Month": "Jul", "Days Reduced": 5.5},
      {"Month": "Aug", "Days Reduced": 6.0},
      {"Month": "Sep", "Days Reduced": 6.4}
    ],
    "aiInsight": "Lead time reduction improving steadily (+12% MoM).",
    "aiAction": "Trigger supplier feedback review."
  }
];

export const dataSources = ["AMOS", "TRAX", "SAP", "Ramco", "AIMS", "Jeppesen"];
