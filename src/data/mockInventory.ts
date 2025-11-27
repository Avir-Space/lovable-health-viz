export type InventoryForecastPart = {
  partNumber: string;
  description: string;
  category: "rotable" | "consumable";
  leadTimeDays: number;
  currentStock: number;
  minRequired: number;
  forecastDemand30d: number;
  forecastDemand90d: number;
  risk: "high" | "medium" | "low";

  // Daily demand series for 30 days (sum should equal forecastDemand30d)
  dailyDemand30d: number[];

  // Impact metrics
  daysUntilShortage: number;
  aogProbabilityPercent: number;
  aircraftAtRisk30d: number;
  flightsAtRisk30d: number;
  maintenanceEventsAtRisk90d: number;
  projectedCostExposure90dUsd: number;

  // Historical orders (last 12 months)
  historicalOrdersMonthly: {
    monthLabel: string;
    orders: number;
  }[];

  // Unplanned maintenance events
  unplannedMaintenanceEvents: {
    date: string;
    aircraft: string;
    eventType: string;
    description: string;
    downtimeHours: number;
  }[];

  bases: {
    base: string;
    stock: number;
    inbound: number;
    outbound: number;
  }[];

  usageDrivers: {
    tail: string;
    fleetType: string;
    predictedFailures: number;
    predictedReplacements: number;
  }[];

  recommendedActions: {
    title: string;
    description: string;
  }[];
};

export const mockInventoryParts: InventoryForecastPart[] = [
  {
    partNumber: "PN-7734",
    description: "Hydraulic Actuator Assembly",
    category: "rotable",
    leadTimeDays: 45,
    currentStock: 3,
    minRequired: 5,
    forecastDemand30d: 4,
    forecastDemand90d: 12,
    risk: "high",
    dailyDemand30d: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    daysUntilShortage: 23,
    aogProbabilityPercent: 35,
    aircraftAtRisk30d: 3,
    flightsAtRisk30d: 28,
    maintenanceEventsAtRisk90d: 5,
    projectedCostExposure90dUsd: 145000,
    historicalOrdersMonthly: [
      { monthLabel: "Dec 2024", orders: 1 },
      { monthLabel: "Jan 2025", orders: 0 },
      { monthLabel: "Feb 2025", orders: 2 },
      { monthLabel: "Mar 2025", orders: 1 },
      { monthLabel: "Apr 2025", orders: 0 },
      { monthLabel: "May 2025", orders: 1 },
      { monthLabel: "Jun 2025", orders: 0 },
      { monthLabel: "Jul 2025", orders: 3 },
      { monthLabel: "Aug 2025", orders: 2 },
      { monthLabel: "Sep 2025", orders: 1 },
      { monthLabel: "Oct 2025", orders: 1 },
      { monthLabel: "Nov 2025", orders: 0 },
    ],
    unplannedMaintenanceEvents: [
      { date: "2025-09-12", aircraft: "VT-AVR", eventType: "Unscheduled removal", description: "Hydraulic actuator leak on landing gear", downtimeHours: 6 },
      { date: "2025-07-03", aircraft: "VT-BXR", eventType: "AOG event", description: "Actuator failure during pushback", downtimeHours: 11 },
      { date: "2025-05-21", aircraft: "VT-CDE", eventType: "Line maintenance", description: "High-pressure line vibration inspection", downtimeHours: 3 },
      { date: "2025-02-14", aircraft: "VT-AVR", eventType: "Unscheduled removal", description: "Hydraulic seal degradation detected", downtimeHours: 8 },
    ],
    bases: [
      { base: "DXB", stock: 1, inbound: 2, outbound: 1 },
      { base: "BOM", stock: 2, inbound: 0, outbound: 1 },
      { base: "DEL", stock: 0, inbound: 1, outbound: 0 },
    ],
    usageDrivers: [
      { tail: "VT-AVR", fleetType: "A320", predictedFailures: 1.2, predictedReplacements: 2 },
      { tail: "VT-BXR", fleetType: "A320", predictedFailures: 0.8, predictedReplacements: 1 },
      { tail: "VT-CDE", fleetType: "A321", predictedFailures: 0.5, predictedReplacements: 1 },
    ],
    recommendedActions: [
      { title: "Expedite procurement", description: "Vibration trend on VT-AVR suggests replacement within 15 days – AVIR predicts 35% AOG probability if delayed" },
      { title: "Reposition from BOM", description: "Move 1 unit from BOM to DXB to cover predicted demand and reduce AOG risk by 60%" },
      { title: "Schedule predictive replacement", description: "Plan replacement during VT-AVR's next A-Check in 22 days to avoid unscheduled downtime" },
    ],
  },
  {
    partNumber: "PN-0048",
    description: "Oil Pump - Engine #1",
    category: "rotable",
    leadTimeDays: 30,
    currentStock: 6,
    minRequired: 4,
    forecastDemand30d: 2,
    forecastDemand90d: 6,
    risk: "low",
    dailyDemand30d: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    daysUntilShortage: 90,
    aogProbabilityPercent: 3,
    aircraftAtRisk30d: 0,
    flightsAtRisk30d: 0,
    maintenanceEventsAtRisk90d: 1,
    projectedCostExposure90dUsd: 12000,
    historicalOrdersMonthly: [
      { monthLabel: "Dec 2024", orders: 0 },
      { monthLabel: "Jan 2025", orders: 1 },
      { monthLabel: "Feb 2025", orders: 0 },
      { monthLabel: "Mar 2025", orders: 1 },
      { monthLabel: "Apr 2025", orders: 0 },
      { monthLabel: "May 2025", orders: 0 },
      { monthLabel: "Jun 2025", orders: 1 },
      { monthLabel: "Jul 2025", orders: 0 },
      { monthLabel: "Aug 2025", orders: 1 },
      { monthLabel: "Sep 2025", orders: 0 },
      { monthLabel: "Oct 2025", orders: 1 },
      { monthLabel: "Nov 2025", orders: 0 },
    ],
    unplannedMaintenanceEvents: [
      { date: "2025-06-18", aircraft: "VT-AVR", eventType: "Line maintenance", description: "Oil pressure fluctuation investigation", downtimeHours: 2 },
      { date: "2025-03-05", aircraft: "VT-FGH", eventType: "Scheduled replacement", description: "Routine pump replacement during C-check", downtimeHours: 0 },
    ],
    bases: [
      { base: "DXB", stock: 3, inbound: 1, outbound: 0 },
      { base: "BOM", stock: 2, inbound: 0, outbound: 1 },
      { base: "DEL", stock: 1, inbound: 0, outbound: 0 },
    ],
    usageDrivers: [
      { tail: "VT-AVR", fleetType: "A320", predictedFailures: 0.3, predictedReplacements: 1 },
      { tail: "VT-FGH", fleetType: "B737", predictedFailures: 0.2, predictedReplacements: 0 },
    ],
    recommendedActions: [
      { title: "Maintain buffer", description: "Current stock adequate for 90-day forecast – no immediate action required" },
    ],
  },
  {
    partNumber: "PN-2341",
    description: "Fuel Filter Element",
    category: "consumable",
    leadTimeDays: 7,
    currentStock: 24,
    minRequired: 20,
    forecastDemand30d: 18,
    forecastDemand90d: 52,
    risk: "medium",
    dailyDemand30d: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    daysUntilShortage: 38,
    aogProbabilityPercent: 12,
    aircraftAtRisk30d: 1,
    flightsAtRisk30d: 8,
    maintenanceEventsAtRisk90d: 3,
    projectedCostExposure90dUsd: 28000,
    historicalOrdersMonthly: [
      { monthLabel: "Dec 2024", orders: 4 },
      { monthLabel: "Jan 2025", orders: 5 },
      { monthLabel: "Feb 2025", orders: 4 },
      { monthLabel: "Mar 2025", orders: 6 },
      { monthLabel: "Apr 2025", orders: 4 },
      { monthLabel: "May 2025", orders: 5 },
      { monthLabel: "Jun 2025", orders: 4 },
      { monthLabel: "Jul 2025", orders: 5 },
      { monthLabel: "Aug 2025", orders: 6 },
      { monthLabel: "Sep 2025", orders: 4 },
      { monthLabel: "Oct 2025", orders: 5 },
      { monthLabel: "Nov 2025", orders: 4 },
    ],
    unplannedMaintenanceEvents: [
      { date: "2025-08-22", aircraft: "VT-AVR", eventType: "Line maintenance", description: "Filter element replacement due to contamination", downtimeHours: 1 },
      { date: "2025-04-10", aircraft: "VT-BXR", eventType: "Line maintenance", description: "Early filter change due to debris detection", downtimeHours: 1 },
    ],
    bases: [
      { base: "DXB", stock: 10, inbound: 8, outbound: 6 },
      { base: "BOM", stock: 8, inbound: 4, outbound: 4 },
      { base: "DEL", stock: 6, inbound: 2, outbound: 2 },
    ],
    usageDrivers: [
      { tail: "VT-AVR", fleetType: "A320", predictedFailures: 0, predictedReplacements: 6 },
      { tail: "VT-BXR", fleetType: "A320", predictedFailures: 0, predictedReplacements: 6 },
      { tail: "VT-CDE", fleetType: "A321", predictedFailures: 0, predictedReplacements: 6 },
    ],
    recommendedActions: [
      { title: "Reorder consumables", description: "Place order for 30 units to maintain 90-day buffer and avoid operational disruption" },
      { title: "Review consumption rate", description: "DEL base showing 15% higher than predicted usage – AVIR recommends audit" },
    ],
  },
  {
    partNumber: "PN-5512",
    description: "APU Starter Motor",
    category: "rotable",
    leadTimeDays: 60,
    currentStock: 2,
    minRequired: 3,
    forecastDemand30d: 1,
    forecastDemand90d: 3,
    risk: "high",
    dailyDemand30d: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    daysUntilShortage: 18,
    aogProbabilityPercent: 42,
    aircraftAtRisk30d: 2,
    flightsAtRisk30d: 18,
    maintenanceEventsAtRisk90d: 2,
    projectedCostExposure90dUsd: 185000,
    historicalOrdersMonthly: [
      { monthLabel: "Dec 2024", orders: 0 },
      { monthLabel: "Jan 2025", orders: 0 },
      { monthLabel: "Feb 2025", orders: 1 },
      { monthLabel: "Mar 2025", orders: 0 },
      { monthLabel: "Apr 2025", orders: 0 },
      { monthLabel: "May 2025", orders: 1 },
      { monthLabel: "Jun 2025", orders: 0 },
      { monthLabel: "Jul 2025", orders: 0 },
      { monthLabel: "Aug 2025", orders: 0 },
      { monthLabel: "Sep 2025", orders: 1 },
      { monthLabel: "Oct 2025", orders: 0 },
      { monthLabel: "Nov 2025", orders: 0 },
    ],
    unplannedMaintenanceEvents: [
      { date: "2025-09-05", aircraft: "VT-AVR", eventType: "AOG event", description: "APU failed to start during ground ops", downtimeHours: 14 },
      { date: "2025-05-12", aircraft: "VT-XYZ", eventType: "Unscheduled removal", description: "Abnormal starter motor vibration", downtimeHours: 8 },
      { date: "2025-02-28", aircraft: "VT-AVR", eventType: "Line maintenance", description: "APU start sequence anomaly investigation", downtimeHours: 4 },
    ],
    bases: [
      { base: "DXB", stock: 1, inbound: 1, outbound: 0 },
      { base: "BOM", stock: 1, inbound: 0, outbound: 1 },
      { base: "DEL", stock: 0, inbound: 0, outbound: 0 },
    ],
    usageDrivers: [
      { tail: "VT-AVR", fleetType: "A320", predictedFailures: 0.6, predictedReplacements: 1 },
      { tail: "VT-XYZ", fleetType: "A320", predictedFailures: 0.4, predictedReplacements: 1 },
    ],
    recommendedActions: [
      { title: "Expedite pending order", description: "Contact supplier to accelerate delivery – 60-day lead time creates 42% AOG probability" },
      { title: "Evaluate pooling agreement", description: "AVIR recommends temporary lease from partner airline to bridge gap" },
      { title: "Schedule predictive replacement", description: "APU degradation trend on VT-AVR detected – plan replacement to avoid unscheduled event" },
    ],
  },
  {
    partNumber: "PN-8891",
    description: "Landing Gear Brake Assembly",
    category: "rotable",
    leadTimeDays: 21,
    currentStock: 8,
    minRequired: 6,
    forecastDemand30d: 3,
    forecastDemand90d: 9,
    risk: "low",
    dailyDemand30d: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    daysUntilShortage: 78,
    aogProbabilityPercent: 2,
    aircraftAtRisk30d: 0,
    flightsAtRisk30d: 0,
    maintenanceEventsAtRisk90d: 0,
    projectedCostExposure90dUsd: 8500,
    historicalOrdersMonthly: [
      { monthLabel: "Dec 2024", orders: 1 },
      { monthLabel: "Jan 2025", orders: 0 },
      { monthLabel: "Feb 2025", orders: 1 },
      { monthLabel: "Mar 2025", orders: 1 },
      { monthLabel: "Apr 2025", orders: 0 },
      { monthLabel: "May 2025", orders: 1 },
      { monthLabel: "Jun 2025", orders: 0 },
      { monthLabel: "Jul 2025", orders: 1 },
      { monthLabel: "Aug 2025", orders: 1 },
      { monthLabel: "Sep 2025", orders: 0 },
      { monthLabel: "Oct 2025", orders: 1 },
      { monthLabel: "Nov 2025", orders: 1 },
    ],
    unplannedMaintenanceEvents: [
      { date: "2025-07-15", aircraft: "VT-CDE", eventType: "Line maintenance", description: "Brake wear inspection exceeded limits", downtimeHours: 2 },
    ],
    bases: [
      { base: "DXB", stock: 4, inbound: 2, outbound: 1 },
      { base: "BOM", stock: 2, inbound: 1, outbound: 1 },
      { base: "DEL", stock: 2, inbound: 0, outbound: 1 },
    ],
    usageDrivers: [
      { tail: "VT-AVR", fleetType: "A320", predictedFailures: 0.1, predictedReplacements: 1 },
      { tail: "VT-BXR", fleetType: "A320", predictedFailures: 0.1, predictedReplacements: 1 },
      { tail: "VT-CDE", fleetType: "A321", predictedFailures: 0.2, predictedReplacements: 1 },
    ],
    recommendedActions: [
      { title: "Standard replenishment", description: "Schedule routine order for Q2 – no urgent action required" },
    ],
  },
  {
    partNumber: "PN-3367",
    description: "Bleed Air Valve",
    category: "rotable",
    leadTimeDays: 35,
    currentStock: 4,
    minRequired: 4,
    forecastDemand30d: 2,
    forecastDemand90d: 5,
    risk: "medium",
    dailyDemand30d: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    daysUntilShortage: 45,
    aogProbabilityPercent: 18,
    aircraftAtRisk30d: 1,
    flightsAtRisk30d: 6,
    maintenanceEventsAtRisk90d: 2,
    projectedCostExposure90dUsd: 52000,
    historicalOrdersMonthly: [
      { monthLabel: "Dec 2024", orders: 0 },
      { monthLabel: "Jan 2025", orders: 1 },
      { monthLabel: "Feb 2025", orders: 0 },
      { monthLabel: "Mar 2025", orders: 0 },
      { monthLabel: "Apr 2025", orders: 1 },
      { monthLabel: "May 2025", orders: 0 },
      { monthLabel: "Jun 2025", orders: 1 },
      { monthLabel: "Jul 2025", orders: 0 },
      { monthLabel: "Aug 2025", orders: 0 },
      { monthLabel: "Sep 2025", orders: 1 },
      { monthLabel: "Oct 2025", orders: 0 },
      { monthLabel: "Nov 2025", orders: 1 },
    ],
    unplannedMaintenanceEvents: [
      { date: "2025-09-18", aircraft: "VT-AVR", eventType: "Unscheduled removal", description: "Bleed air leak detected during preflight", downtimeHours: 5 },
      { date: "2025-06-02", aircraft: "VT-FGH", eventType: "Line maintenance", description: "Valve sticking during engine start", downtimeHours: 3 },
    ],
    bases: [
      { base: "DXB", stock: 2, inbound: 1, outbound: 1 },
      { base: "BOM", stock: 1, inbound: 0, outbound: 0 },
      { base: "DEL", stock: 1, inbound: 1, outbound: 1 },
    ],
    usageDrivers: [
      { tail: "VT-AVR", fleetType: "A320", predictedFailures: 0.5, predictedReplacements: 1 },
      { tail: "VT-FGH", fleetType: "B737", predictedFailures: 0.3, predictedReplacements: 1 },
    ],
    recommendedActions: [
      { title: "Monitor closely", description: "Stock at minimum threshold – AVIR will alert if unscheduled demand detected" },
      { title: "Review repair TAT", description: "Shop turnaround increased to 28 days – consider alternative vendor" },
    ],
  },
  {
    partNumber: "PN-4420",
    description: "Cabin Pressure Controller",
    category: "rotable",
    leadTimeDays: 42,
    currentStock: 3,
    minRequired: 2,
    forecastDemand30d: 1,
    forecastDemand90d: 2,
    risk: "low",
    dailyDemand30d: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    daysUntilShortage: 90,
    aogProbabilityPercent: 4,
    aircraftAtRisk30d: 0,
    flightsAtRisk30d: 0,
    maintenanceEventsAtRisk90d: 1,
    projectedCostExposure90dUsd: 15000,
    historicalOrdersMonthly: [
      { monthLabel: "Dec 2024", orders: 0 },
      { monthLabel: "Jan 2025", orders: 0 },
      { monthLabel: "Feb 2025", orders: 1 },
      { monthLabel: "Mar 2025", orders: 0 },
      { monthLabel: "Apr 2025", orders: 0 },
      { monthLabel: "May 2025", orders: 0 },
      { monthLabel: "Jun 2025", orders: 0 },
      { monthLabel: "Jul 2025", orders: 1 },
      { monthLabel: "Aug 2025", orders: 0 },
      { monthLabel: "Sep 2025", orders: 0 },
      { monthLabel: "Oct 2025", orders: 0 },
      { monthLabel: "Nov 2025", orders: 0 },
    ],
    unplannedMaintenanceEvents: [
      { date: "2025-07-20", aircraft: "VT-CDE", eventType: "Line maintenance", description: "Cabin altitude fluctuation investigation", downtimeHours: 3 },
    ],
    bases: [
      { base: "DXB", stock: 2, inbound: 0, outbound: 0 },
      { base: "BOM", stock: 1, inbound: 0, outbound: 0 },
      { base: "DEL", stock: 0, inbound: 0, outbound: 0 },
    ],
    usageDrivers: [
      { tail: "VT-CDE", fleetType: "A321", predictedFailures: 0.2, predictedReplacements: 1 },
    ],
    recommendedActions: [
      { title: "Maintain current levels", description: "Adequate stock for forecast period – no action required" },
    ],
  },
  {
    partNumber: "PN-6654",
    description: "Avionics Display Unit",
    category: "rotable",
    leadTimeDays: 90,
    currentStock: 2,
    minRequired: 4,
    forecastDemand30d: 2,
    forecastDemand90d: 4,
    risk: "high",
    dailyDemand30d: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    daysUntilShortage: 11,
    aogProbabilityPercent: 58,
    aircraftAtRisk30d: 4,
    flightsAtRisk30d: 42,
    maintenanceEventsAtRisk90d: 3,
    projectedCostExposure90dUsd: 320000,
    historicalOrdersMonthly: [
      { monthLabel: "Dec 2024", orders: 0 },
      { monthLabel: "Jan 2025", orders: 1 },
      { monthLabel: "Feb 2025", orders: 0 },
      { monthLabel: "Mar 2025", orders: 0 },
      { monthLabel: "Apr 2025", orders: 0 },
      { monthLabel: "May 2025", orders: 1 },
      { monthLabel: "Jun 2025", orders: 0 },
      { monthLabel: "Jul 2025", orders: 0 },
      { monthLabel: "Aug 2025", orders: 1 },
      { monthLabel: "Sep 2025", orders: 0 },
      { monthLabel: "Oct 2025", orders: 1 },
      { monthLabel: "Nov 2025", orders: 0 },
    ],
    unplannedMaintenanceEvents: [
      { date: "2025-10-02", aircraft: "VT-AVR", eventType: "AOG event", description: "Primary flight display failure", downtimeHours: 18 },
      { date: "2025-08-15", aircraft: "VT-BXR", eventType: "Unscheduled removal", description: "Display unit intermittent blank screen", downtimeHours: 6 },
      { date: "2025-05-08", aircraft: "VT-XYZ", eventType: "Line maintenance", description: "Display brightness degradation", downtimeHours: 2 },
    ],
    bases: [
      { base: "DXB", stock: 1, inbound: 1, outbound: 1 },
      { base: "BOM", stock: 1, inbound: 0, outbound: 0 },
      { base: "DEL", stock: 0, inbound: 0, outbound: 1 },
    ],
    usageDrivers: [
      { tail: "VT-AVR", fleetType: "A320", predictedFailures: 0.8, predictedReplacements: 1 },
      { tail: "VT-BXR", fleetType: "A320", predictedFailures: 0.4, predictedReplacements: 1 },
      { tail: "VT-XYZ", fleetType: "A320", predictedFailures: 0.3, predictedReplacements: 0 },
    ],
    recommendedActions: [
      { title: "Emergency procurement", description: "90-day lead time creates critical gap – AVIR estimates 58% AOG probability" },
      { title: "Seek loan unit", description: "Contact OEM for temporary loan to bridge shortage – projected $320K exposure" },
      { title: "Prioritize repairs", description: "Expedite shop repair of 2 unserviceable units to restore availability" },
    ],
  },
  {
    partNumber: "PN-1123",
    description: "Engine Oil - Synthetic (Liter)",
    category: "consumable",
    leadTimeDays: 5,
    currentStock: 120,
    minRequired: 80,
    forecastDemand30d: 45,
    forecastDemand90d: 130,
    risk: "low",
    dailyDemand30d: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    daysUntilShortage: 75,
    aogProbabilityPercent: 1,
    aircraftAtRisk30d: 0,
    flightsAtRisk30d: 0,
    maintenanceEventsAtRisk90d: 0,
    projectedCostExposure90dUsd: 4500,
    historicalOrdersMonthly: [
      { monthLabel: "Dec 2024", orders: 12 },
      { monthLabel: "Jan 2025", orders: 15 },
      { monthLabel: "Feb 2025", orders: 14 },
      { monthLabel: "Mar 2025", orders: 13 },
      { monthLabel: "Apr 2025", orders: 16 },
      { monthLabel: "May 2025", orders: 14 },
      { monthLabel: "Jun 2025", orders: 15 },
      { monthLabel: "Jul 2025", orders: 17 },
      { monthLabel: "Aug 2025", orders: 16 },
      { monthLabel: "Sep 2025", orders: 14 },
      { monthLabel: "Oct 2025", orders: 15 },
      { monthLabel: "Nov 2025", orders: 13 },
    ],
    unplannedMaintenanceEvents: [],
    bases: [
      { base: "DXB", stock: 50, inbound: 20, outbound: 15 },
      { base: "BOM", stock: 40, inbound: 10, outbound: 15 },
      { base: "DEL", stock: 30, inbound: 10, outbound: 15 },
    ],
    usageDrivers: [
      { tail: "Fleet-wide", fleetType: "Mixed", predictedFailures: 0, predictedReplacements: 45 },
    ],
    recommendedActions: [
      { title: "Schedule bulk order", description: "Place monthly consumable order by end of week – standard replenishment" },
    ],
  },
  {
    partNumber: "PN-9902",
    description: "Nose Wheel Tire Assembly",
    category: "rotable",
    leadTimeDays: 14,
    currentStock: 6,
    minRequired: 8,
    forecastDemand30d: 4,
    forecastDemand90d: 11,
    risk: "medium",
    dailyDemand30d: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    daysUntilShortage: 32,
    aogProbabilityPercent: 15,
    aircraftAtRisk30d: 2,
    flightsAtRisk30d: 12,
    maintenanceEventsAtRisk90d: 4,
    projectedCostExposure90dUsd: 45000,
    historicalOrdersMonthly: [
      { monthLabel: "Dec 2024", orders: 1 },
      { monthLabel: "Jan 2025", orders: 1 },
      { monthLabel: "Feb 2025", orders: 0 },
      { monthLabel: "Mar 2025", orders: 2 },
      { monthLabel: "Apr 2025", orders: 1 },
      { monthLabel: "May 2025", orders: 0 },
      { monthLabel: "Jun 2025", orders: 1 },
      { monthLabel: "Jul 2025", orders: 2 },
      { monthLabel: "Aug 2025", orders: 1 },
      { monthLabel: "Sep 2025", orders: 1 },
      { monthLabel: "Oct 2025", orders: 0 },
      { monthLabel: "Nov 2025", orders: 1 },
    ],
    unplannedMaintenanceEvents: [
      { date: "2025-07-28", aircraft: "VT-AVR", eventType: "Line maintenance", description: "Tire change due to FOD damage", downtimeHours: 2 },
      { date: "2025-03-15", aircraft: "VT-BXR", eventType: "Line maintenance", description: "Nose tire wear limit exceeded", downtimeHours: 1 },
    ],
    bases: [
      { base: "DXB", stock: 3, inbound: 2, outbound: 2 },
      { base: "BOM", stock: 2, inbound: 1, outbound: 1 },
      { base: "DEL", stock: 1, inbound: 1, outbound: 1 },
    ],
    usageDrivers: [
      { tail: "VT-AVR", fleetType: "A320", predictedFailures: 0.1, predictedReplacements: 2 },
      { tail: "VT-BXR", fleetType: "A320", predictedFailures: 0.1, predictedReplacements: 1 },
      { tail: "VT-CDE", fleetType: "A321", predictedFailures: 0.1, predictedReplacements: 1 },
    ],
    recommendedActions: [
      { title: "Increase safety stock", description: "High-wear item requires additional buffer at DXB – 15% AOG probability if delayed" },
      { title: "Review retreading cycle", description: "Consider retreading 4 units in inventory to extend serviceable pool" },
    ],
  },
];

export function getInventoryPart(partNumber: string): InventoryForecastPart | undefined {
  return mockInventoryParts.find(p => p.partNumber === partNumber);
}
