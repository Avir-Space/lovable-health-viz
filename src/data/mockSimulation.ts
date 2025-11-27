export type InventorySimulationProfile = {
  id: string;
  label: string;

  // decisions
  reorderQty: number;
  repositionFrom?: string;
  repositionTo?: string;
  repositionQty: number;
  demandScenario: "conservative" | "base" | "stress";
  replacementStrategy: "reactive" | "predictive";

  // baseline (for display only)
  baselineAogProbabilityPercent: number;
  baselineAircraftAtRisk: number;
  baselineFlightsAtRisk30d: number;
  baselineCostExposure90dUsd: number;

  // scenario results
  scenarioAogProbabilityPercent: number;
  scenarioAircraftAtRisk: number;
  scenarioFlightsAtRisk30d: number;
  scenarioCostExposure90dUsd: number;
  savings90dUsd: number;

  summary: string;
};

// Simulation profiles keyed by part number
export const simulationProfiles: Record<string, InventorySimulationProfile[]> = {
  "PN-7734": [
    {
      id: "do-nothing",
      label: "Do nothing",
      reorderQty: 0,
      repositionQty: 0,
      demandScenario: "base",
      replacementStrategy: "reactive",
      baselineAogProbabilityPercent: 35,
      baselineAircraftAtRisk: 3,
      baselineFlightsAtRisk30d: 28,
      baselineCostExposure90dUsd: 145000,
      scenarioAogProbabilityPercent: 35,
      scenarioAircraftAtRisk: 3,
      scenarioFlightsAtRisk30d: 28,
      scenarioCostExposure90dUsd: 145000,
      savings90dUsd: 0,
      summary: "Maintaining current position with no intervention. AOG probability remains at 35%, with 3 aircraft and 28 flights at risk over 30 days. 90-day cost exposure unchanged at $145,000."
    },
    {
      id: "reorder-reposition",
      label: "Reorder 2, reposition 1 from BOM to DXB",
      reorderQty: 2,
      repositionFrom: "BOM",
      repositionTo: "DXB",
      repositionQty: 1,
      demandScenario: "base",
      replacementStrategy: "predictive",
      baselineAogProbabilityPercent: 35,
      baselineAircraftAtRisk: 3,
      baselineFlightsAtRisk30d: 28,
      baselineCostExposure90dUsd: 145000,
      scenarioAogProbabilityPercent: 12,
      scenarioAircraftAtRisk: 1,
      scenarioFlightsAtRisk30d: 9,
      scenarioCostExposure90dUsd: 92000,
      savings90dUsd: 53000,
      summary: "Reordering 2 units and repositioning 1 unit from BOM to DXB under base case demand reduces AOG probability from 35% to 12% and lowers 90-day cost exposure by $53,000."
    },
    {
      id: "stress-demand",
      label: "Stress demand, heavy utilisation",
      reorderQty: 4,
      repositionQty: 0,
      demandScenario: "stress",
      replacementStrategy: "predictive",
      baselineAogProbabilityPercent: 35,
      baselineAircraftAtRisk: 3,
      baselineFlightsAtRisk30d: 28,
      baselineCostExposure90dUsd: 145000,
      scenarioAogProbabilityPercent: 18,
      scenarioAircraftAtRisk: 2,
      scenarioFlightsAtRisk30d: 16,
      scenarioCostExposure90dUsd: 110000,
      savings90dUsd: 35000,
      summary: "Under stress demand with heavy fleet utilisation, reordering 4 units proactively reduces AOG probability to 18% and saves $35,000 over 90 days compared to baseline."
    }
  ],
  "PN-0048": [
    {
      id: "do-nothing",
      label: "Do nothing",
      reorderQty: 0,
      repositionQty: 0,
      demandScenario: "base",
      replacementStrategy: "reactive",
      baselineAogProbabilityPercent: 18,
      baselineAircraftAtRisk: 2,
      baselineFlightsAtRisk30d: 15,
      baselineCostExposure90dUsd: 72000,
      scenarioAogProbabilityPercent: 18,
      scenarioAircraftAtRisk: 2,
      scenarioFlightsAtRisk30d: 15,
      scenarioCostExposure90dUsd: 72000,
      savings90dUsd: 0,
      summary: "No changes to current inventory position. AOG probability stays at 18% with exposure of $72,000 over 90 days."
    },
    {
      id: "reorder-small",
      label: "Reorder 1 unit",
      reorderQty: 1,
      repositionQty: 0,
      demandScenario: "base",
      replacementStrategy: "predictive",
      baselineAogProbabilityPercent: 18,
      baselineAircraftAtRisk: 2,
      baselineFlightsAtRisk30d: 15,
      baselineCostExposure90dUsd: 72000,
      scenarioAogProbabilityPercent: 8,
      scenarioAircraftAtRisk: 1,
      scenarioFlightsAtRisk30d: 6,
      scenarioCostExposure90dUsd: 48000,
      savings90dUsd: 24000,
      summary: "Reordering 1 unit reduces AOG probability from 18% to 8% and saves $24,000 in potential disruption costs."
    }
  ],
  "PN-5512": [
    {
      id: "do-nothing",
      label: "Do nothing",
      reorderQty: 0,
      repositionQty: 0,
      demandScenario: "base",
      replacementStrategy: "reactive",
      baselineAogProbabilityPercent: 45,
      baselineAircraftAtRisk: 4,
      baselineFlightsAtRisk30d: 42,
      baselineCostExposure90dUsd: 320000,
      scenarioAogProbabilityPercent: 45,
      scenarioAircraftAtRisk: 4,
      scenarioFlightsAtRisk30d: 42,
      scenarioCostExposure90dUsd: 320000,
      savings90dUsd: 0,
      summary: "Critical APU Starter shortage continues. High AOG risk at 45% with 4 aircraft affected."
    },
    {
      id: "expedite-aog",
      label: "Expedite AOG procurement",
      reorderQty: 2,
      repositionQty: 0,
      demandScenario: "base",
      replacementStrategy: "predictive",
      baselineAogProbabilityPercent: 45,
      baselineAircraftAtRisk: 4,
      baselineFlightsAtRisk30d: 42,
      baselineCostExposure90dUsd: 320000,
      scenarioAogProbabilityPercent: 15,
      scenarioAircraftAtRisk: 1,
      scenarioFlightsAtRisk30d: 12,
      scenarioCostExposure90dUsd: 180000,
      savings90dUsd: 140000,
      summary: "Expedited procurement of 2 APU Starters reduces AOG probability from 45% to 15%, saving $140,000 in disruption costs."
    },
    {
      id: "conservative",
      label: "Conservative demand scenario",
      reorderQty: 1,
      repositionFrom: "DEL",
      repositionTo: "BOM",
      repositionQty: 1,
      demandScenario: "conservative",
      replacementStrategy: "predictive",
      baselineAogProbabilityPercent: 45,
      baselineAircraftAtRisk: 4,
      baselineFlightsAtRisk30d: 42,
      baselineCostExposure90dUsd: 320000,
      scenarioAogProbabilityPercent: 22,
      scenarioAircraftAtRisk: 2,
      scenarioFlightsAtRisk30d: 18,
      scenarioCostExposure90dUsd: 210000,
      savings90dUsd: 110000,
      summary: "Under conservative demand assumptions with 1 reorder and repositioning from DEL to BOM, AOG risk drops to 22% with $110,000 savings."
    }
  ]
};

export function getSimulationProfiles(partNumber: string): InventorySimulationProfile[] {
  return simulationProfiles[partNumber] || simulationProfiles["PN-7734"];
}
