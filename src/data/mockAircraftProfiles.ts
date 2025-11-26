export interface MockAircraftProfile {
  id: string;
  registration: string;
  fleetType: string;
  serialNumber: string;
  operatorName: string;
  baseAirport: string;
  country: string;
  readinessStatus: 'ready' | 'in_maintenance' | 'restricted' | 'aog' | 'at_risk';
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
    id: string;
    severity: 'high' | 'medium' | 'low';
    source: 'Maintenance' | 'Ops' | 'Airworthiness' | 'Inventory' | 'Finance';
    title: string;
    description: string;
    recommendation: string;
  }>;
  
  impact: {
    totalSavings90d: number;
    aogMinutesAvoided: number;
    delayReductionPercent: number;
    fuelImpactUsd: number;
    forecastRisk: 'low' | 'medium' | 'high';
    weeklyTrend: Array<{ week: string; value: number }>;
  };
  
  opsProfile: {
    utilization7dHours: number;
    utilization30dHours: number;
    utilization90dHours: number;
    dispatchReliabilityPercent: number;
    recurringDelays: Array<{
      route: string;
      avgDelayMinutes: number;
      cause: string;
    }>;
    recentFlights: Array<{
      date: string;
      from: string;
      to: string;
      blockTime: string;
      delayMinutes: number;
      fuelDeviationPercent: number;
    }>;
    fuelEfficiency: string;
  };
  
  maintenanceSnapshot: {
    nextDueTasks: Array<{
      task: string;
      basis: string;
      dueIn: string;
      risk: 'low' | 'medium' | 'high';
    }>;
    abnormalPatterns: Array<{
      title: string;
      description: string;
    }>;
    lifedPartWarnings: Array<{
      part: string;
      remainingPercent: number;
      note: string;
    }>;
  };
  
  airworthinessSnapshot: {
    upcomingCompliance: Array<{
      title: string;
      reference: string;
      dueInDays: number;
      risk: 'low' | 'medium' | 'high';
    }>;
    overdueCompliance: Array<{
      title: string;
      reference: string;
      overdueDays: number;
    }>;
    melItems: Array<{
      code: string;
      description: string;
      impact: string;
    }>;
    coaExpiresInDays: number;
  };
  
  inventory: {
    blockingParts: Array<{
      partNumber: string;
      description: string;
      leadTimeDays: number;
      risk: 'low' | 'medium' | 'high';
    }>;
    reservedParts: Array<{
      partNumber: string;
      description: string;
      location: string;
    }>;
    shortageRisks: Array<{
      partNumber: string;
      description: string;
      when: string;
    }>;
  };
  
  financial: {
    maintenanceCost90d: number;
    forecastCost30d: number;
    partCostBreakdown: Array<{
      part: string;
      cost: number;
    }>;
    fuelWasteUsd30d: number;
  };
  
  crew: {
    recurringIssues: Array<{
      issue: string;
      count: number;
    }>;
    fatigueRisk: 'low' | 'medium' | 'high';
    notes: string;
  };
  
  timeline: Array<{
    timestamp: string;
    type: 'flight' | 'maintenance' | 'defect' | 'compliance' | 'aog' | 'insight';
    title: string;
    description: string;
  }>;
  
  actions: Array<{
    id: string;
    title: string;
    description: string;
    label: 'Playbook' | 'Task' | 'Notification';
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
        id: 'sig-001',
        severity: 'high',
        source: 'Maintenance',
        title: 'Engine 1 Vibration Trending Above Baseline',
        description: 'ENG1 vibration levels have increased 5% above baseline over the last 10 flights. Early inspection recommended.',
        recommendation: 'Schedule borescope inspection within 48 hours',
      },
      {
        id: 'sig-002',
        severity: 'high',
        source: 'Inventory',
        title: 'Critical AOG Risk - No Backup for Key Component',
        description: 'Hydraulic actuator PN-7734 has zero inventory across network. Single failure could ground aircraft.',
        recommendation: 'Emergency procurement and expedited shipping required',
      },
      {
        id: 'sig-003',
        severity: 'medium',
        source: 'Airworthiness',
        title: 'AD 2024-05 Due in 36 Days',
        description: 'Airworthiness Directive 2024-05 requiring fan blade inspection is approaching due date.',
        recommendation: 'Coordinate with MRO to schedule compliance check',
      },
      {
        id: 'sig-004',
        severity: 'medium',
        source: 'Inventory',
        title: 'Critical Spare Lead Time Risk',
        description: 'Oil Pump PN-0048 has 7-day lead time and no stock available. Risk to unscheduled maintenance.',
        recommendation: 'Expedite order or coordinate with other bases',
      },
      {
        id: 'sig-005',
        severity: 'medium',
        source: 'Finance',
        title: 'Maintenance Cost Trending 18% Above Budget',
        description: 'Unscheduled repairs driving cost overruns. APU and hydraulic system driving 60% of variance.',
        recommendation: 'Review root cause and adjust maintenance planning',
      },
      {
        id: 'sig-006',
        severity: 'low',
        source: 'Ops',
        title: 'Recurring Gate Delays on DXB-DOH',
        description: 'Route DXB-DOH shows consistent 14-minute delays due to gate congestion.',
        recommendation: 'Review departure slot planning with Ops',
      },
      {
        id: 'sig-007',
        severity: 'low',
        source: 'Maintenance',
        title: 'APU Oil Consumption Slightly Elevated',
        description: 'APU oil consumption increased 12% over last 30 days. Still within limits but monitoring advised.',
        recommendation: 'Continue monitoring, schedule oil analysis',
      },
    ],
    
    impact: {
      totalSavings90d: 45200,
      aogMinutesAvoided: 380,
      delayReductionPercent: 12,
      fuelImpactUsd: -2840,
      forecastRisk: 'low',
      weeklyTrend: [
        { week: 'W1', value: 8200 },
        { week: 'W2', value: 11500 },
        { week: 'W3', value: 9800 },
        { week: 'W4', value: 15700 },
      ],
    },
    
    opsProfile: {
      utilization7dHours: 42,
      utilization30dHours: 163,
      utilization90dHours: 487,
      dispatchReliabilityPercent: 98.4,
      recurringDelays: [
        { route: 'DXB-DOH', avgDelayMinutes: 14, cause: 'Gate congestion' },
        { route: 'DXB-BOM', avgDelayMinutes: 8, cause: 'ATC holding' },
        { route: 'DXB-DEL', avgDelayMinutes: 6, cause: 'Catering delay' },
      ],
      recentFlights: [
        { date: '2025-11-25', from: 'DXB', to: 'DOH', blockTime: '1:05', delayMinutes: 12, fuelDeviationPercent: 2.1 },
        { date: '2025-11-25', from: 'DOH', to: 'DXB', blockTime: '1:10', delayMinutes: 0, fuelDeviationPercent: -1.2 },
        { date: '2025-11-24', from: 'DXB', to: 'BOM', blockTime: '2:45', delayMinutes: 8, fuelDeviationPercent: 3.4 },
        { date: '2025-11-24', from: 'BOM', to: 'DXB', blockTime: '2:50', delayMinutes: 5, fuelDeviationPercent: 1.8 },
        { date: '2025-11-23', from: 'DXB', to: 'DEL', blockTime: '3:15', delayMinutes: 0, fuelDeviationPercent: -0.5 },
        { date: '2025-11-23', from: 'DEL', to: 'DXB', blockTime: '3:20', delayMinutes: 15, fuelDeviationPercent: 4.2 },
        { date: '2025-11-22', from: 'DXB', to: 'MCT', blockTime: '0:55', delayMinutes: 0, fuelDeviationPercent: 0.3 },
        { date: '2025-11-22', from: 'MCT', to: 'DXB', blockTime: '1:00', delayMinutes: 0, fuelDeviationPercent: -0.8 },
        { date: '2025-11-21', from: 'DXB', to: 'RUH', blockTime: '2:10', delayMinutes: 3, fuelDeviationPercent: 1.1 },
        { date: '2025-11-21', from: 'RUH', to: 'DXB', blockTime: '2:15', delayMinutes: 0, fuelDeviationPercent: -1.5 },
      ],
      fuelEfficiency: '2.8% below fleet average',
    },
    
    maintenanceSnapshot: {
      nextDueTasks: [
        { task: 'Oil Filter Replacement', basis: 'Flight Hours', dueIn: '22h', risk: 'low' },
        { task: 'SB 643 Fan Blade Inspection', basis: 'Calendar', dueIn: '14 days', risk: 'medium' },
        { task: 'A-Check Package', basis: 'Flight Hours', dueIn: '18 days', risk: 'medium' },
        { task: 'Landing Gear Lubrication', basis: 'Cycles', dueIn: '28 days', risk: 'low' },
        { task: 'ELT Battery Replacement', basis: 'Calendar', dueIn: '42 days', risk: 'low' },
      ],
      abnormalPatterns: [
        { title: 'Engine 1 Vibration Trend', description: '5% above baseline last 10 flights. Monitoring required.' },
        { title: 'APU Start Reliability', description: '2 failed starts in last 30 days. Investigate starter motor.' },
        { title: 'Brake Wear Accelerating', description: 'Left main brake wear 15% faster than right. Possible dragging issue.' },
      ],
      lifedPartWarnings: [
        { part: 'ENG1 LP Turbine Module', remainingPercent: 18, note: '450 cycles to shop visit limit' },
        { part: 'ENG2 Fan Module', remainingPercent: 34, note: '820 cycles to overhaul' },
        { part: 'Nose Landing Gear', remainingPercent: 52, note: '1,200 cycles to overhaul' },
      ],
    },
    
    airworthinessSnapshot: {
      upcomingCompliance: [
        { title: 'AD 2024-05 Fan Blade Inspection', reference: 'AD 2024-05-21', dueInDays: 36, risk: 'medium' },
        { title: 'AD 2024-12 Winglet Bolt Inspection', reference: 'AD 2024-12-08', dueInDays: 48, risk: 'low' },
        { title: 'SB A320-52-1234 Door Mod', reference: 'SB A320-52-1234', dueInDays: 65, risk: 'low' },
      ],
      overdueCompliance: [
        { title: 'Annual Weight & Balance Update', reference: 'OM-A 8.3.2', overdueDays: 3 },
      ],
      melItems: [
        { code: 'MEL 23-15-02', description: 'IFE System Rows 15-18 U/S', impact: 'Category C - Fix within 10 days' },
        { code: 'MEL 25-62-01', description: 'PA System Aft Cabin Inoperative', impact: 'Category C - Fix within 10 days' },
      ],
      coaExpiresInDays: 89,
    },
    
    inventory: {
      blockingParts: [
        { partNumber: 'PN-0048', description: 'Oil Pump Assembly', leadTimeDays: 7, risk: 'medium' },
        { partNumber: 'PN-7734', description: 'Hydraulic Actuator (Main)', leadTimeDays: 14, risk: 'high' },
        { partNumber: 'PN-2341', description: 'Hydraulic Filter Element', leadTimeDays: 3, risk: 'low' },
        { partNumber: 'PN-1123', description: 'Fan Blade Set (8pc)', leadTimeDays: 10, risk: 'medium' },
      ],
      reservedParts: [
        { partNumber: 'PN-9822', description: 'Brake Pack Assembly', location: 'DXB Main Stores' },
        { partNumber: 'PN-5512', description: 'APU Starter Motor', location: 'BOM Regional Hub' },
        { partNumber: 'PN-6643', description: 'MLG Actuator Assembly', location: 'DXB Main Stores' },
        { partNumber: 'PN-3321', description: 'Engine Oil Filter (Pack of 6)', location: 'DEL Regional Hub' },
      ],
      shortageRisks: [
        { partNumber: 'PN-8891', description: 'IDG Heat Exchanger', when: 'If unscheduled removal occurs within 30 days' },
        { partNumber: 'PN-4425', description: 'Landing Gear Door Actuator', when: 'Next scheduled maintenance check' },
      ],
    },
    
    financial: {
      maintenanceCost90d: 83000,
      forecastCost30d: 31000,
      partCostBreakdown: [
        { part: 'Hydraulic Pump', cost: 12000 },
        { part: 'Brake Assembly', cost: 8500 },
        { part: 'APU Components', cost: 6200 },
        { part: 'Cabin Interior', cost: 4800 },
        { part: 'Engine Oil & Filters', cost: 3200 },
      ],
      fuelWasteUsd30d: 2840,
    },
    
    crew: {
      recurringIssues: [
        { issue: 'Cabin noise in rows 20-25', count: 3 },
        { issue: 'Galley coffee maker intermittent', count: 2 },
        { issue: 'Seat recline issue row 12F', count: 2 },
      ],
      fatigueRisk: 'low',
      notes: 'Recent crew feedback indicates minor cabin comfort issues but no safety concerns. Galley equipment requires inspection.',
    },
    
    timeline: [
      { timestamp: '2025-11-25 14:35', type: 'flight', title: 'Flight Departure', description: 'Departed DXB for DOH - On-time departure' },
      { timestamp: '2025-11-25 08:20', type: 'maintenance', title: 'Check Scheduled', description: 'A-Check scheduled for 2025-12-15 at DXB MRO' },
      { timestamp: '2025-11-24 16:05', type: 'insight', title: 'AI Alert Generated', description: 'System flagged ENG1 vibration trend above baseline' },
      { timestamp: '2025-11-24 09:30', type: 'compliance', title: 'Compliance Reminder', description: 'AD 2024-05 compliance reminder sent to planning team' },
      { timestamp: '2025-11-23 18:45', type: 'flight', title: 'Flight Arrival', description: 'Landed DXB from DEL - No defects reported' },
      { timestamp: '2025-11-23 11:30', type: 'defect', title: 'Defect Cleared', description: 'Defect D-456 closed - IFE system repaired' },
      { timestamp: '2025-11-22 15:20', type: 'defect', title: 'New Defect', description: 'Defect D-458 opened - Galley oven not heating' },
      { timestamp: '2025-11-22 09:15', type: 'maintenance', title: 'Routine Service', description: 'Oil filter service completed by line maintenance' },
      { timestamp: '2025-11-21 14:00', type: 'compliance', title: 'CoA Renewed', description: 'Certificate of Airworthiness renewed for 12 months' },
      { timestamp: '2025-11-20 10:30', type: 'insight', title: 'Predictive Alert', description: 'System detected brake wear accelerating on left main gear' },
      { timestamp: '2025-11-19 16:45', type: 'maintenance', title: 'Inspection Complete', description: 'Landing gear inspection completed - No findings' },
      { timestamp: '2025-11-18 08:00', type: 'flight', title: 'Return to Service', description: 'First flight after overnight maintenance check' },
    ],
    
    actions: [
      { id: 'act-001', title: 'Open Central Task Board', description: 'View all tasks filtered to VT-AVR', label: 'Task' },
      { id: 'act-002', title: 'Trigger Early Check Prep', description: 'Start predictive maintenance playbook workflow', label: 'Playbook' },
      { id: 'act-003', title: 'Run AOG Risk Assessment', description: 'Analyze critical spares vs. upcoming maintenance events', label: 'Playbook' },
      { id: 'act-004', title: 'Notify Ops Team', description: 'Send tail-specific operational alert to dispatch', label: 'Notification' },
      { id: 'act-005', title: 'Schedule MRO Coordination', description: 'Book MRO slots for upcoming AD compliance checks', label: 'Playbook' },
      { id: 'act-006', title: 'Generate Cost Forecast', description: 'Project 90-day maintenance spend and variance', label: 'Playbook' },
    ],
  },
  {
    id: '2',
    registration: 'VT-BLU',
    fleetType: 'B737-800',
    serialNumber: 'MSN-3421',
    operatorName: 'AVIR Airlines',
    baseAirport: 'BOM',
    country: 'India',
    readinessStatus: 'at_risk',
    airworthinessState: 'Airworthy',
    healthIndex: 68,
    isAog: false,
    nextMaintenanceDays: 5,
    nextComplianceDays: 8,
    lastSeenMinutes: 45,
    lastPosition: {
      lat: 19.0896,
      lon: 72.8656,
      source: 'OpenSky',
      altitude: 37000,
      speed: 465,
    },
    aiStatusSummary: 'High risk detected. Multiple compliance items approaching due date and critical spares shortage.',
    
    signals: [
      {
        id: 'sig-101',
        severity: 'high',
        source: 'Airworthiness',
        title: 'AD 2024-17 Overdue by 2 Days',
        description: 'Critical airworthiness directive for engine mount inspection is now overdue. Aircraft should be grounded until compliance.',
        recommendation: 'Ground aircraft immediately and schedule emergency MRO inspection',
      },
      {
        id: 'sig-102',
        severity: 'high',
        source: 'Maintenance',
        title: 'Multiple Hydraulic System Faults',
        description: 'System A and B showing abnormal pressure fluctuations. Three incidents in last 72 hours.',
        recommendation: 'Schedule immediate hydraulic system inspection before next flight',
      },
      {
        id: 'sig-103',
        severity: 'high',
        source: 'Inventory',
        title: 'Zero Stock on Critical Brake Components',
        description: 'Brake assemblies showing accelerated wear with no replacements available across network.',
        recommendation: 'Emergency procurement from OEM with AOG shipping',
      },
      {
        id: 'sig-104',
        severity: 'medium',
        source: 'Finance',
        title: 'Unscheduled Maintenance Cost Spike',
        description: 'Last 30 days show 145% increase vs. budget due to recurring hydraulic repairs.',
        recommendation: 'Conduct root cause analysis with engineering team',
      },
      {
        id: 'sig-105',
        severity: 'medium',
        source: 'Ops',
        title: 'Poor Dispatch Reliability - 92.1%',
        description: 'Below fleet average of 97%. Main driver: recurring hydraulic delays on BOM-DEL route.',
        recommendation: 'Review MEL usage and coordinate with maintenance planning',
      },
      {
        id: 'sig-106',
        severity: 'low',
        source: 'Maintenance',
        title: 'Cabin Air Quality Complaints',
        description: 'Crew reported stale air smell on 2 recent flights. ECS filter may be saturated.',
        recommendation: 'Schedule ECS filter replacement at next available slot',
      },
    ],
    
    impact: {
      totalSavings90d: 12400,
      aogMinutesAvoided: 180,
      delayReductionPercent: -8,
      fuelImpactUsd: 4200,
      forecastRisk: 'high',
      weeklyTrend: [
        { week: 'W1', value: 3200 },
        { week: 'W2', value: 2800 },
        { week: 'W3', value: 3100 },
        { week: 'W4', value: 3300 },
      ],
    },
    
    opsProfile: {
      utilization7dHours: 28,
      utilization30dHours: 118,
      utilization90dHours: 342,
      dispatchReliabilityPercent: 92.1,
      recurringDelays: [
        { route: 'BOM-DEL', avgDelayMinutes: 28, cause: 'Hydraulic system delays' },
        { route: 'BOM-BLR', avgDelayMinutes: 18, cause: 'MEL deferrals' },
        { route: 'DEL-BOM', avgDelayMinutes: 12, cause: 'Late crew boarding' },
      ],
      recentFlights: [
        { date: '2025-11-25', from: 'BOM', to: 'DEL', blockTime: '2:05', delayMinutes: 32, fuelDeviationPercent: 5.2 },
        { date: '2025-11-25', from: 'DEL', to: 'BOM', blockTime: '2:10', delayMinutes: 15, fuelDeviationPercent: 3.1 },
        { date: '2025-11-24', from: 'BOM', to: 'BLR', blockTime: '1:35', delayMinutes: 22, fuelDeviationPercent: 4.5 },
        { date: '2025-11-24', from: 'BLR', to: 'BOM', blockTime: '1:40', delayMinutes: 8, fuelDeviationPercent: 2.3 },
        { date: '2025-11-23', from: 'BOM', to: 'HYD', blockTime: '1:15', delayMinutes: 0, fuelDeviationPercent: 1.2 },
        { date: '2025-11-23', from: 'HYD', to: 'BOM', blockTime: '1:20', delayMinutes: 45, fuelDeviationPercent: 6.8 },
        { date: '2025-11-22', from: 'BOM', to: 'CCU', blockTime: '2:25', delayMinutes: 18, fuelDeviationPercent: 3.9 },
        { date: '2025-11-22', from: 'CCU', to: 'BOM', blockTime: '2:30', delayMinutes: 0, fuelDeviationPercent: -0.3 },
      ],
      fuelEfficiency: '7.2% above fleet average (poor)',
    },
    
    maintenanceSnapshot: {
      nextDueTasks: [
        { task: 'A-Check Package', basis: 'Flight Hours', dueIn: '5 days', risk: 'high' },
        { task: 'Hydraulic System Deep Inspection', basis: 'Unscheduled', dueIn: 'ASAP', risk: 'high' },
        { task: 'AD 2024-17 Engine Mount', basis: 'Overdue', dueIn: 'OVERDUE', risk: 'high' },
        { task: 'Landing Gear Overhaul', basis: 'Cycles', dueIn: '8 days', risk: 'medium' },
        { task: 'Galley Equipment Service', basis: 'Calendar', dueIn: '22 days', risk: 'low' },
      ],
      abnormalPatterns: [
        { title: 'Hydraulic Pressure Fluctuations', description: 'Both System A and B showing recurring faults. Immediate attention required.' },
        { title: 'Brake Wear Rate Excessive', description: 'Main gear brakes at 85% wear after only 60% of expected cycle life.' },
        { title: 'APU Reliability Degrading', description: '4 failed starts in last 45 days. Starter and fuel control system suspect.' },
      ],
      lifedPartWarnings: [
        { part: 'ENG1 HPT Module', remainingPercent: 8, note: '180 cycles to mandatory shop visit' },
        { part: 'ENG2 Fan Module', remainingPercent: 12, note: '320 cycles to overhaul limit' },
        { part: 'Main Landing Gear (Both)', remainingPercent: 22, note: '550 cycles to overhaul - expedite planning' },
      ],
    },
    
    airworthinessSnapshot: {
      upcomingCompliance: [
        { title: 'AD 2024-22 Slat Track Inspection', reference: 'AD 2024-22-11', dueInDays: 8, risk: 'high' },
        { title: 'SB 737-28-1245 Flap Actuator Mod', reference: 'SB 737-28-1245', dueInDays: 15, risk: 'medium' },
        { title: 'AD 2024-28 Rudder Hinge Inspection', reference: 'AD 2024-28-05', dueInDays: 32, risk: 'medium' },
      ],
      overdueCompliance: [
        { title: 'AD 2024-17 Engine Mount Inspection', reference: 'AD 2024-17-09', overdueDays: 2 },
        { title: 'Annual Weight & Balance Audit', reference: 'OM-A 8.3.2', overdueDays: 12 },
      ],
      melItems: [
        { code: 'MEL 29-12-01', description: 'Hydraulic System B Quantity Low Indication', impact: 'Category D - Fix within 3 days' },
        { code: 'MEL 34-11-02', description: 'TCAS Resolution Advisory Degraded', impact: 'Category C - Fix within 10 days' },
        { code: 'MEL 21-31-01', description: 'Pack 2 Temperature Control', impact: 'Category C - Fix within 10 days' },
      ],
      coaExpiresInDays: 42,
    },
    
    inventory: {
      blockingParts: [
        { partNumber: 'PN-5583', description: 'Brake Assembly Main Gear', leadTimeDays: 21, risk: 'high' },
        { partNumber: 'PN-9201', description: 'Hydraulic Pump (System B)', leadTimeDays: 14, risk: 'high' },
        { partNumber: 'PN-7712', description: 'Landing Gear Actuator', leadTimeDays: 18, risk: 'high' },
        { partNumber: 'PN-3348', description: 'ENG1 HPT Module (Shop Visit)', leadTimeDays: 45, risk: 'medium' },
      ],
      reservedParts: [
        { partNumber: 'PN-4421', description: 'APU Starter Assembly', location: 'BOM Main Stores' },
        { partNumber: 'PN-6612', description: 'Hydraulic Filter Pack', location: 'DEL Regional Hub' },
        { partNumber: 'PN-8834', description: 'Pack Valve Assembly', location: 'BOM Main Stores' },
      ],
      shortageRisks: [
        { partNumber: 'PN-5583', description: 'Brake Assembly - CRITICAL', when: 'Required for A-Check in 5 days - ZERO STOCK' },
        { partNumber: 'PN-9201', description: 'Hydraulic Pump System B', when: 'If current fault escalates - 14 day lead time' },
        { partNumber: 'PN-3348', description: 'Engine HPT Module', when: 'Mandatory removal in 180 cycles (~15 days)' },
      ],
    },
    
    financial: {
      maintenanceCost90d: 142000,
      forecastCost30d: 68000,
      partCostBreakdown: [
        { part: 'Hydraulic System Repairs', cost: 28500 },
        { part: 'Brake Components', cost: 18200 },
        { part: 'Engine HPT Lease Cost', cost: 15000 },
        { part: 'APU Components', cost: 9800 },
        { part: 'Landing Gear Parts', cost: 8200 },
        { part: 'ECS & Pneumatic', cost: 6500 },
      ],
      fuelWasteUsd30d: 4200,
    },
    
    crew: {
      recurringIssues: [
        { issue: 'Hydraulic LOW caution light intermittent', count: 7 },
        { issue: 'Pack temperature control erratic', count: 4 },
        { issue: 'Brake pedal feel abnormal', count: 3 },
        { issue: 'Unusual vibration during taxi', count: 2 },
      ],
      fatigueRisk: 'medium',
      notes: 'Crew expressing concern about recurring hydraulic issues. Multiple write-ups indicate loss of confidence in aircraft reliability. Engineering review recommended.',
    },
    
    timeline: [
      { timestamp: '2025-11-25 16:20', type: 'defect', title: 'New Defect Opened', description: 'D-889: Hydraulic System A pressure fluctuation during approach' },
      { timestamp: '2025-11-25 09:15', type: 'flight', title: 'Delayed Departure', description: 'BOM to DEL delayed 32 minutes due to hydraulic system check' },
      { timestamp: '2025-11-24 18:30', type: 'maintenance', title: 'MEL Application', description: 'MEL 29-12-01 applied for Hydraulic System B quantity indication' },
      { timestamp: '2025-11-24 14:05', type: 'compliance', title: 'AD Overdue Alert', description: 'System flagged AD 2024-17 now overdue by 2 days' },
      { timestamp: '2025-11-23 22:45', type: 'defect', title: 'Defect Closed', description: 'D-856 closed: Pack 2 temperature sensor replaced' },
      { timestamp: '2025-11-23 16:30', type: 'aog', title: 'AOG Risk Alert', description: 'Engineering flagged high AOG risk due to brake parts shortage' },
      { timestamp: '2025-11-22 11:20', type: 'insight', title: 'AI Prediction', description: 'System predicted hydraulic system failure within 72 hours' },
      { timestamp: '2025-11-21 19:40', type: 'maintenance', title: 'Unscheduled Work', description: 'Emergency hydraulic fluid top-up performed at BOM' },
      { timestamp: '2025-11-21 08:00', type: 'compliance', title: 'CoA Expiry Warning', description: 'Certificate expiring in 42 days - renewal process initiated' },
      { timestamp: '2025-11-20 15:25', type: 'defect', title: 'Multiple Defects', description: 'Crew reported 3 separate hydraulic-related issues on BOM-BLR' },
      { timestamp: '2025-11-19 12:10', type: 'maintenance', title: 'Inspection Started', description: 'Deep dive hydraulic system inspection commenced' },
      { timestamp: '2025-11-18 09:30', type: 'insight', title: 'Cost Alert', description: 'AI detected 145% maintenance cost overrun vs. budget' },
    ],
    
    actions: [
      { id: 'act-101', title: 'Ground Aircraft for Compliance', description: 'Immediate grounding required for overdue AD 2024-17 compliance', label: 'Notification' },
      { id: 'act-102', title: 'Emergency Parts Procurement', description: 'Initiate AOG procurement for brake assemblies and hydraulic components', label: 'Playbook' },
      { id: 'act-103', title: 'Schedule Emergency MRO Slot', description: 'Book urgent MRO capacity for hydraulic system overhaul', label: 'Playbook' },
      { id: 'act-104', title: 'Escalate to Engineering', description: 'Request engineering task force for recurring hydraulic issues', label: 'Task' },
      { id: 'act-105', title: 'Notify Dispatch & Planning', description: 'Alert operations of likely extended downtime', label: 'Notification' },
      { id: 'act-106', title: 'Generate Financial Impact Report', description: 'Forecast impact of grounding and urgent repairs on budget', label: 'Playbook' },
    ],
  },
];

export function getAircraftProfile(id: string): MockAircraftProfile {
  return (
    mockAircraftProfiles.find((a) => a.id === id) ||
    mockAircraftProfiles[0]
  );
}
