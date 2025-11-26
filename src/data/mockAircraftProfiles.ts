export interface MockAircraftProfile {
  id: string;
  registration: string;
  fleetType: string;
  serialNumber: string;
  operatorName: string;
  baseAirport: string;
  country: string;
  readinessStatus: 'ready' | 'in_maintenance' | 'scheduled';
  airworthinessState: string;
  healthIndex: number;
  isAog: boolean;
  nextMaintenanceDays: number;
  nextComplianceDays: number;
  lastSeenMinutes: number;
  lastPosition: {
    lat: number;
    lon: number;
    source: string;
    altitude: number;
    speed: number;
  };
  aiStatusSummary: string;
  
  signals: Array<{
    severity: 'high' | 'medium' | 'low';
    source: string;
    title: string;
    description: string;
    recommendedAction: string;
  }>;
  
  impact: {
    totalSavings90d: number;
    aogMinutesAvoided: number;
    delayReduction: string;
    forecastImpactRisk: 'low' | 'medium' | 'high';
    weeklyTrend: Array<{ week: string; value: number }>;
  };
  
  opsProfile: {
    utilization7d: number;
    utilization30d: number;
    dispatchReliability: string;
    recurringDelays: Array<{
      route: string;
      avgDelay: string;
      cause: string;
    }>;
    flights: Array<{
      date: string;
      from: string;
      to: string;
      blockTime: string;
      flightTime: string;
    }>;
    fuelEfficiency: string;
  };
  
  maintenanceSnapshot: {
    nextDue: Array<{
      task: string;
      dueIn: string;
      risk: 'low' | 'medium' | 'high';
    }>;
    abnormalPatterns: Array<{
      title: string;
      description: string;
    }>;
    lifedPartWarnings: Array<{
      part: string;
      remaining: string;
    }>;
  };
  
  airworthiness: {
    upcomingCompliance: Array<{
      title: string;
      dueIn: string;
      type: 'AD' | 'SB' | 'Certificate';
    }>;
    overdue: Array<{
      title: string;
      overdueBy: string;
    }>;
    melItems: Array<{
      item: string;
      deferredUntil: string;
    }>;
  };
  
  inventory: {
    blockingParts: Array<{
      part: string;
      leadTime: string;
      risk: 'low' | 'medium' | 'high';
    }>;
    reservedParts: Array<{
      part: string;
      location: string;
    }>;
  };
  
  financial: {
    maintenanceCost90d: number;
    partCostBreakdown: Array<{
      part: string;
      cost: number;
    }>;
    forecastCost30d: number;
  };
  
  crew: {
    recurringIssues: Array<{
      issue: string;
      count: number;
    }>;
    fatigueRisk: 'low' | 'medium' | 'high';
    observations: Array<{
      date: string;
      note: string;
    }>;
  };
  
  timeline: Array<{
    timestamp: string;
    type: 'flight' | 'maintenance' | 'defect' | 'compliance' | 'aog' | 'insight';
    description: string;
    actor?: string;
  }>;
  
  actions: Array<{
    title: string;
    description: string;
    type: 'task' | 'playbook' | 'alert';
  }>;
}

export const mockAircraftProfiles: MockAircraftProfile[] = [
  {
    id: '1',
    registration: 'VT-AVR',
    fleetType: 'A320neo',
    serialNumber: 'MSN-4523',
    operatorName: 'AVIR Airlines',
    baseAirport: 'DXB',
    country: 'UAE',
    readinessStatus: 'ready',
    airworthinessState: 'Airworthy',
    healthIndex: 91,
    isAog: false,
    nextMaintenanceDays: 18,
    nextComplianceDays: 45,
    lastSeenMinutes: 14,
    lastPosition: {
      lat: 25.2532,
      lon: 55.3657,
      source: 'FR24',
      altitude: 35000,
      speed: 450,
    },
    aiStatusSummary: 'Stable condition. Two medium risk signals for the next 7 days.',
    
    signals: [
      {
        severity: 'high',
        source: 'Maintenance Health',
        title: 'Engine 1 Vibration Trending Above Baseline',
        description: 'ENG1 vibration levels have increased 5% above baseline over the last 10 flights. Early inspection recommended.',
        recommendedAction: 'Schedule borescope inspection within 48 hours',
      },
      {
        severity: 'high',
        source: 'Inventory',
        title: 'Critical AOG Risk - No Backup for Key Component',
        description: 'Hydraulic actuator PN-7734 has zero inventory across network. Single failure could ground aircraft.',
        recommendedAction: 'Emergency procurement and expedited shipping required',
      },
      {
        severity: 'medium',
        source: 'Airworthiness',
        title: 'AD 2024-05 Due in 36 Days',
        description: 'Airworthiness Directive 2024-05 requiring fan blade inspection is approaching due date.',
        recommendedAction: 'Coordinate with MRO to schedule compliance check',
      },
      {
        severity: 'medium',
        source: 'Inventory',
        title: 'Critical Spare Lead Time Risk',
        description: 'Oil Pump PN-0048 has 7-day lead time and no stock available. Risk to unscheduled maintenance.',
        recommendedAction: 'Expedite order or coordinate with other bases',
      },
      {
        severity: 'medium',
        source: 'Financial',
        title: 'Maintenance Cost Trending 18% Above Budget',
        description: 'Unscheduled repairs driving cost overruns. APU and hydraulic system driving 60% of variance.',
        recommendedAction: 'Review root cause and adjust maintenance planning',
      },
      {
        severity: 'low',
        source: 'Ops',
        title: 'Recurring Gate Delays on DXB-DOH',
        description: 'Route DXB-DOH shows consistent 14-minute delays due to gate congestion.',
        recommendedAction: 'Review departure slot planning with Ops',
      },
      {
        severity: 'low',
        source: 'Crew',
        title: 'Galley Equipment Reliability Issues',
        description: 'Coffee maker and oven intermittent failures reported on 4 recent flights.',
        recommendedAction: 'Schedule galley equipment inspection',
      },
      {
        severity: 'low',
        source: 'Maintenance Health',
        title: 'APU Oil Consumption Slightly Elevated',
        description: 'APU oil consumption increased 12% over last 30 days. Still within limits but monitoring advised.',
        recommendedAction: 'Continue monitoring, schedule oil analysis',
      },
    ],
    
    impact: {
      totalSavings90d: 45200,
      aogMinutesAvoided: 380,
      delayReduction: '12%',
      forecastImpactRisk: 'low',
      weeklyTrend: [
        { week: 'W1', value: 8200 },
        { week: 'W2', value: 11500 },
        { week: 'W3', value: 9800 },
        { week: 'W4', value: 15700 },
      ],
    },
    
    opsProfile: {
      utilization7d: 42,
      utilization30d: 163,
      dispatchReliability: '98.4%',
      recurringDelays: [
        { route: 'DXB-DOH', avgDelay: '14m', cause: 'Gate congestion' },
        { route: 'DXB-BOM', avgDelay: '8m', cause: 'ATC holding' },
      ],
      flights: [
        { date: '2025-11-25', from: 'DXB', to: 'DOH', blockTime: '1:05', flightTime: '0:55' },
        { date: '2025-11-25', from: 'DOH', to: 'DXB', blockTime: '1:10', flightTime: '1:00' },
        { date: '2025-11-24', from: 'DXB', to: 'BOM', blockTime: '2:45', flightTime: '2:35' },
        { date: '2025-11-24', from: 'BOM', to: 'DXB', blockTime: '2:50', flightTime: '2:40' },
        { date: '2025-11-23', from: 'DXB', to: 'DEL', blockTime: '3:15', flightTime: '3:05' },
        { date: '2025-11-23', from: 'DEL', to: 'DXB', blockTime: '3:20', flightTime: '3:10' },
        { date: '2025-11-22', from: 'DXB', to: 'MCT', blockTime: '0:55', flightTime: '0:45' },
        { date: '2025-11-22', from: 'MCT', to: 'DXB', blockTime: '1:00', flightTime: '0:50' },
        { date: '2025-11-21', from: 'DXB', to: 'RUH', blockTime: '2:10', flightTime: '2:00' },
        { date: '2025-11-21', from: 'RUH', to: 'DXB', blockTime: '2:15', flightTime: '2:05' },
      ],
      fuelEfficiency: '2.8% below fleet average',
    },
    
    maintenanceSnapshot: {
      nextDue: [
        { task: 'Oil Filter Replacement', dueIn: '22h', risk: 'low' },
        { task: 'SB 643 Fan Blade Inspection', dueIn: '14 days', risk: 'medium' },
        { task: 'A-Check Package', dueIn: '18 days', risk: 'medium' },
        { task: 'Landing Gear Lubrication', dueIn: '28 days', risk: 'low' },
        { task: 'ELT Battery Replacement', dueIn: '42 days', risk: 'low' },
        { task: 'Hydraulic System Service', dueIn: '55 days', risk: 'low' },
      ],
      abnormalPatterns: [
        { title: 'Engine 1 Vibration Trend', description: '5% above baseline last 10 flights. Monitoring required.' },
        { title: 'APU Start Reliability', description: '2 failed starts in last 30 days. Investigate starter motor.' },
        { title: 'Brake Wear Accelerating', description: 'Left main brake wear 15% faster than right. Possible dragging issue.' },
        { title: 'Hydraulic Fluid Consumption', description: 'System 2 fluid top-ups more frequent. Check for minor leaks.' },
      ],
      lifedPartWarnings: [
        { part: 'ENG1 LP Turbine Module', remaining: '450 cycles to limit' },
        { part: 'ENG2 Fan Module', remaining: '820 cycles to limit' },
        { part: 'Nose Landing Gear', remaining: '1,200 cycles to overhaul' },
        { part: 'Main Landing Gear Left', remaining: '1,450 cycles to overhaul' },
        { part: 'APU Gearbox', remaining: '3,200 hours to overhaul' },
      ],
    },
    
    airworthiness: {
      upcomingCompliance: [
        { title: 'AD 2024-05 Fan Blade Inspection', dueIn: '36 days', type: 'AD' },
        { title: 'AD 2024-12 Winglet Bolt Inspection', dueIn: '48 days', type: 'AD' },
        { title: 'SB A320-52-1234 Door Mod', dueIn: '65 days', type: 'SB' },
        { title: 'Certificate of Airworthiness Renewal', dueIn: '89 days', type: 'Certificate' },
        { title: 'SB A320-28-5678 Hydraulic Hose Replacement', dueIn: '120 days', type: 'SB' },
      ],
      overdue: [],
      melItems: [
        { item: 'IFE System Rows 15-18', deferredUntil: '2025-12-05' },
        { item: 'PA System Aft Cabin', deferredUntil: '2025-11-30' },
      ],
    },
    
    inventory: {
      blockingParts: [
        { part: 'Oil Pump PN-0048', leadTime: '7 days', risk: 'medium' },
        { part: 'Hydraulic Actuator PN-7734', leadTime: '14 days', risk: 'high' },
        { part: 'Hydraulic Filter PN-2341', leadTime: '3 days', risk: 'low' },
        { part: 'Fan Blade Set PN-1123', leadTime: '10 days', risk: 'medium' },
      ],
      reservedParts: [
        { part: 'Brake Pack PN-9822', location: 'DXB Stores' },
        { part: 'APU Starter PN-5512', location: 'BOM Hub' },
        { part: 'Main Landing Gear Actuator PN-6643', location: 'DXB Stores' },
        { part: 'Engine Oil Filter PN-3321', location: 'DEL Hub' },
      ],
    },
    
    financial: {
      maintenanceCost90d: 83000,
      partCostBreakdown: [
        { part: 'Hydraulic Pump', cost: 12000 },
        { part: 'Brake Assembly', cost: 8500 },
        { part: 'APU Components', cost: 6200 },
        { part: 'Cabin Interior', cost: 4800 },
        { part: 'Engine Oil & Filters', cost: 3200 },
        { part: 'Landing Gear Parts', cost: 2900 },
        { part: 'Avionics Spares', cost: 2100 },
      ],
      forecastCost30d: 31000,
    },
    
    crew: {
      recurringIssues: [
        { issue: 'Cabin noise in rows 20-25', count: 3 },
        { issue: 'Galley coffee maker intermittent', count: 2 },
        { issue: 'Seat recline issue row 12F', count: 2 },
        { issue: 'Overhead bin latch sticky 18C', count: 1 },
      ],
      fatigueRisk: 'low',
      observations: [
        { date: '2025-11-24', note: 'Flight attendant reported galley oven not heating properly' },
        { date: '2025-11-22', note: 'Crew reported unusual smell in cabin during descent' },
        { date: '2025-11-20', note: 'Captain noted slight rudder trim issue' },
        { date: '2025-11-19', note: 'Cabin crew reported PA system intermittent in rear cabin' },
      ],
    },
    
    timeline: [
      { timestamp: '2025-11-25 14:35', type: 'flight', description: 'Departed DXB for DOH' },
      { timestamp: '2025-11-25 08:20', type: 'maintenance', description: 'A-Check scheduled for 2025-12-15' },
      { timestamp: '2025-11-24 16:05', type: 'insight', description: 'AI flagged ENG1 vibration trend', actor: 'System' },
      { timestamp: '2025-11-24 09:30', type: 'compliance', description: 'AD 2024-05 compliance reminder sent to planning' },
      { timestamp: '2025-11-23 18:45', type: 'flight', description: 'Landed DXB from DEL, no defects reported' },
      { timestamp: '2025-11-23 11:30', type: 'defect', description: 'Defect D-456 closed (IFE issue)', actor: 'Tech Team' },
      { timestamp: '2025-11-22 15:20', type: 'defect', description: 'New defect D-458 opened (Galley oven)', actor: 'Crew' },
      { timestamp: '2025-11-22 09:15', type: 'maintenance', description: 'Oil service completed', actor: 'Line Maintenance' },
      { timestamp: '2025-11-21 14:00', type: 'compliance', description: 'Certificate of Airworthiness renewed' },
      { timestamp: '2025-11-20 10:30', type: 'insight', description: 'Predictive alert: brake wear accelerating', actor: 'System' },
      { timestamp: '2025-11-19 16:45', type: 'maintenance', description: 'Landing gear inspection completed', actor: 'Base Maintenance' },
      { timestamp: '2025-11-18 08:00', type: 'flight', description: 'First flight after overnight maintenance' },
    ],
    
    actions: [
      { title: 'Open Central Task Board', description: 'Load tasks filtered to this aircraft', type: 'task' },
      { title: 'Trigger Early Check Prep', description: 'Start predictive maintenance playbook', type: 'playbook' },
      { title: 'Run AOG Risk Assessment', description: 'Analyze critical spares and upcoming maintenance', type: 'playbook' },
      { title: 'Notify Ops Team', description: 'Send tail-specific operational alert', type: 'alert' },
      { title: 'Schedule MRO Coordination', description: 'Book slots for upcoming AD compliance', type: 'playbook' },
      { title: 'Generate Cost Forecast Report', description: 'Project 90-day maintenance spend', type: 'playbook' },
    ],
  },
  {
    id: 'default',
    registration: 'VT-DEF',
    fleetType: 'B737-800',
    serialNumber: 'MSN-3421',
    operatorName: 'AVIR Airlines',
    baseAirport: 'BOM',
    country: 'India',
    readinessStatus: 'in_maintenance',
    airworthinessState: 'Airworthy',
    healthIndex: 72,
    isAog: false,
    nextMaintenanceDays: 5,
    nextComplianceDays: 15,
    lastSeenMinutes: 240,
    lastPosition: {
      lat: 19.0896,
      lon: 72.8656,
      source: 'OpenSky',
      altitude: 0,
      speed: 0,
    },
    aiStatusSummary: 'Aircraft in C-Check. Return to service expected in 5 days.',
    
    signals: [
      { severity: 'medium', source: 'Maintenance', title: 'C-Check In Progress', description: 'Scheduled C-Check underway at BOM MRO facility.', recommendedAction: 'Monitor progress daily' },
    ],
    
    impact: { totalSavings90d: 18000, aogMinutesAvoided: 0, delayReduction: '0%', forecastImpactRisk: 'low', weeklyTrend: [] },
    opsProfile: { utilization7d: 0, utilization30d: 42, dispatchReliability: '100%', recurringDelays: [], flights: [], fuelEfficiency: 'N/A' },
    maintenanceSnapshot: { nextDue: [{ task: 'C-Check Completion', dueIn: 'In progress', risk: 'low' }], abnormalPatterns: [], lifedPartWarnings: [] },
    airworthiness: { upcomingCompliance: [], overdue: [], melItems: [] },
    inventory: { blockingParts: [], reservedParts: [] },
    financial: { maintenanceCost90d: 125000, partCostBreakdown: [], forecastCost30d: 5000 },
    crew: { recurringIssues: [], fatigueRisk: 'low', observations: [] },
    timeline: [
      { timestamp: '2025-11-20 08:00', type: 'maintenance', description: 'Aircraft entered C-Check', actor: 'System' },
    ],
    actions: [],
  },
];

export function getAircraftProfile(id: string): MockAircraftProfile {
  return (
    mockAircraftProfiles.find((a) => a.id === id) ||
    mockAircraftProfiles.find((a) => a.id === 'default')!
  );
}
