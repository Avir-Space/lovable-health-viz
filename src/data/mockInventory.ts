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
      { title: "Expedite procurement", description: "Vibration trend on VT-AVR suggests replacement within 15 days" },
      { title: "Reposition from BOM", description: "Move 1 unit from BOM to DXB to cover predicted demand" },
      { title: "Schedule predictive replacement", description: "Plan replacement during VT-AVR's next A-Check in 22 days" },
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
      { title: "Maintain buffer", description: "Current stock adequate for 90-day forecast" },
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
      { title: "Reorder consumables", description: "Place order for 30 units to maintain 90-day buffer" },
      { title: "Review consumption rate", description: "DEL base showing higher than expected usage" },
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
      { title: "Expedite pending order", description: "Contact supplier to accelerate delivery of 1 unit" },
      { title: "Evaluate pooling agreement", description: "Consider temporary lease from partner airline" },
      { title: "Schedule predictive replacement", description: "APU showing degradation trend on VT-AVR" },
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
      { title: "Standard replenishment", description: "Schedule routine order for Q2" },
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
      { title: "Monitor closely", description: "Stock at minimum threshold, reorder if any unscheduled demand" },
      { title: "Review repair TAT", description: "Shop turnaround time increased to 28 days" },
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
    bases: [
      { base: "DXB", stock: 2, inbound: 0, outbound: 0 },
      { base: "BOM", stock: 1, inbound: 0, outbound: 0 },
      { base: "DEL", stock: 0, inbound: 0, outbound: 0 },
    ],
    usageDrivers: [
      { tail: "VT-CDE", fleetType: "A321", predictedFailures: 0.2, predictedReplacements: 1 },
    ],
    recommendedActions: [
      { title: "Maintain current levels", description: "Adequate stock for forecast period" },
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
      { title: "Emergency procurement", description: "Long lead time requires immediate order placement" },
      { title: "Seek loan unit", description: "Contact OEM for temporary loan during shortage period" },
      { title: "Prioritize repairs", description: "Expedite shop repair of 2 unserviceable units" },
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
    bases: [
      { base: "DXB", stock: 50, inbound: 20, outbound: 15 },
      { base: "BOM", stock: 40, inbound: 10, outbound: 15 },
      { base: "DEL", stock: 30, inbound: 10, outbound: 15 },
    ],
    usageDrivers: [
      { tail: "Fleet-wide", fleetType: "Mixed", predictedFailures: 0, predictedReplacements: 45 },
    ],
    recommendedActions: [
      { title: "Schedule bulk order", description: "Place monthly consumable order by end of week" },
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
      { title: "Increase safety stock", description: "High-wear item requires additional buffer at DXB" },
      { title: "Review retreading cycle", description: "Consider retreading 4 units in inventory" },
    ],
  },
];

export function getInventoryPart(partNumber: string): InventoryForecastPart | undefined {
  return mockInventoryParts.find(p => p.partNumber === partNumber);
}
