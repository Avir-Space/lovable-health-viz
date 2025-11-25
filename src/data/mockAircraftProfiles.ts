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
  nextMaintenance: string;
  nextCompliance: string;
  lastPosition: {
    lat: number;
    lon: number;
    source: string;
    lastSeenMinutesAgo: number;
    altitude: number;
    speed: number;
  };
  overviewStats: {
    utilizationLast7Days: number;
    flightsLast30Days: number;
    openWorkOrders: number;
    openDefects: number;
  };
  keyCounters: {
    ttaf: number;
    landings: number;
    eng1Tsn: number;
    eng2Tsn: number;
  };
  aiSummary: string;
  flightActivity: Array<{
    date: string;
    from: string;
    to: string;
    blockTime: string;
    flightTime: string;
    source: 'Auto' | 'Manual';
  }>;
  maintenanceTasks: Array<{
    name: string;
    basis: string;
    dueIn: string;
    status: string;
  }>;
  counterProjections: Array<{
    counterName: string;
    currentValue: number;
    growthPerDay: number;
    projectedDueDate: string;
  }>;
  workOrders: Array<{
    woNumber: string;
    status: 'Open' | 'In-progress' | 'Closed';
    title: string;
    openedDate: string;
    assignedWorkshop: string;
  }>;
  defects: Array<{
    title: string;
    ataChapter: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    openedDate: string;
    status: 'Open' | 'Deferred' | 'Closed';
    isMel: boolean;
  }>;
  complianceDocs: Array<{
    category: string;
    title: string;
    referenceNumber: string;
    issueDate: string;
    effectiveDate: string;
    status: 'Compliant' | 'Pending' | 'Overdue';
  }>;
  configurationItems: Array<{
    modNumber: string;
    name: string;
    status: 'Installed' | 'Removed';
    effectiveDate: string;
  }>;
  weightBalance: {
    reportDate: string;
    emptyWeight: number;
    maxTakeoffWeight: number;
  };
  activityLog: Array<{
    time: string;
    actor: string;
    eventType: string;
    description: string;
  }>;
  aiInsights: Array<{
    title: string;
    description: string;
    label: 'Prediction' | 'Recommendation' | 'Anomaly';
  }>;
}

export const mockAircraftProfiles: MockAircraftProfile[] = [
  {
    id: '1',
    registration: 'VT-AVR',
    fleetType: 'A320-214',
    serialNumber: 'MSN-4523',
    operatorName: 'AVIR Airlines',
    baseAirport: 'DEL',
    country: 'India',
    readinessStatus: 'ready',
    airworthinessState: 'Airworthy',
    healthIndex: 87,
    isAog: false,
    nextMaintenance: '2025-12-15',
    nextCompliance: '2025-12-28',
    lastPosition: {
      lat: 28.5562,
      lon: 77.1,
      source: 'FR24',
      lastSeenMinutesAgo: 15,
      altitude: 35000,
      speed: 450,
    },
    overviewStats: {
      utilizationLast7Days: 42.5,
      flightsLast30Days: 87,
      openWorkOrders: 3,
      openDefects: 1,
    },
    keyCounters: {
      ttaf: 24567,
      landings: 12456,
      eng1Tsn: 8934,
      eng2Tsn: 9123,
    },
    aiSummary:
      'This aircraft is in good health. Next major maintenance is due in 18 days. No critical compliance risks identified. Engine 2 is showing slightly higher utilization than Engine 1.',
    flightActivity: [
      {
        date: '2025-11-24',
        from: 'DEL',
        to: 'BOM',
        blockTime: '2:15',
        flightTime: '2:05',
        source: 'Auto',
      },
      {
        date: '2025-11-24',
        from: 'BOM',
        to: 'DEL',
        blockTime: '2:20',
        flightTime: '2:10',
        source: 'Auto',
      },
      {
        date: '2025-11-23',
        from: 'DEL',
        to: 'BLR',
        blockTime: '2:45',
        flightTime: '2:35',
        source: 'Auto',
      },
      {
        date: '2025-11-23',
        from: 'BLR',
        to: 'DEL',
        blockTime: '2:50',
        flightTime: '2:40',
        source: 'Auto',
      },
    ],
    maintenanceTasks: [
      {
        name: 'A-Check',
        basis: '450 FH / 90 Days',
        dueIn: '18 days',
        status: 'Scheduled',
      },
      {
        name: 'Landing Gear Inspection',
        basis: '1200 Cycles',
        dueIn: '45 days',
        status: 'Planned',
      },
      {
        name: 'APU Service',
        basis: '600 FH',
        dueIn: '67 days',
        status: 'Planned',
      },
    ],
    counterProjections: [
      {
        counterName: 'Flight Hours',
        currentValue: 24567,
        growthPerDay: 6.2,
        projectedDueDate: '2025-12-15',
      },
      {
        counterName: 'Cycles',
        currentValue: 12456,
        growthPerDay: 3.1,
        projectedDueDate: '2025-12-28',
      },
    ],
    workOrders: [
      {
        woNumber: 'WO-2345',
        status: 'Open',
        title: 'Replace cabin PA system speaker',
        openedDate: '2025-11-20',
        assignedWorkshop: 'DEL Line Maintenance',
      },
      {
        woNumber: 'WO-2338',
        status: 'In-progress',
        title: 'Repair seat 12A armrest',
        openedDate: '2025-11-18',
        assignedWorkshop: 'BOM Base',
      },
      {
        woNumber: 'WO-2301',
        status: 'Closed',
        title: 'Replace galley coffee maker',
        openedDate: '2025-11-10',
        assignedWorkshop: 'DEL Line Maintenance',
      },
    ],
    defects: [
      {
        title: 'IFE system intermittent on rows 15-18',
        ataChapter: '23',
        severity: 'Low',
        openedDate: '2025-11-22',
        status: 'Open',
        isMel: false,
      },
      {
        title: 'Lavatory flush button sticky',
        ataChapter: '38',
        severity: 'Low',
        openedDate: '2025-11-19',
        status: 'Deferred',
        isMel: true,
      },
    ],
    complianceDocs: [
      {
        category: 'AD',
        title: 'Engine Fan Blade Inspection',
        referenceNumber: 'AD 2023-0245-E',
        issueDate: '2023-03-15',
        effectiveDate: '2023-04-01',
        status: 'Compliant',
      },
      {
        category: 'SB',
        title: 'Cabin Door Modification',
        referenceNumber: 'SB A320-52-1234',
        issueDate: '2024-06-10',
        effectiveDate: '2024-12-31',
        status: 'Pending',
      },
      {
        category: 'Certificate',
        title: 'Certificate of Airworthiness',
        referenceNumber: 'C-AVR-2024',
        issueDate: '2024-01-15',
        effectiveDate: '2025-01-15',
        status: 'Compliant',
      },
    ],
    configurationItems: [
      {
        modNumber: 'STC-A320-INT-001',
        name: 'Upgraded cabin interior',
        status: 'Installed',
        effectiveDate: '2023-08-12',
      },
      {
        modNumber: 'MOD-A320-NAV-002',
        name: 'Enhanced navigation system',
        status: 'Installed',
        effectiveDate: '2024-02-20',
      },
    ],
    weightBalance: {
      reportDate: '2024-11-01',
      emptyWeight: 42600,
      maxTakeoffWeight: 78000,
    },
    activityLog: [
      {
        time: '2025-11-20 14:32',
        actor: 'John Smith',
        eventType: 'Work Order',
        description: 'Work order WO-2345 created',
      },
      {
        time: '2025-11-18 09:05',
        actor: 'Sarah Johnson',
        eventType: 'Defect',
        description: 'Defect D-456 closed',
      },
      {
        time: '2025-11-15 16:20',
        actor: 'Mike Chen',
        eventType: 'Maintenance',
        description: 'A-Check scheduled for 2025-12-15',
      },
      {
        time: '2025-11-12 11:45',
        actor: 'System',
        eventType: 'Position Update',
        description: 'Last position updated via FR24',
      },
    ],
    aiInsights: [
      {
        title: 'Engine 1 Shop Visit Projection',
        description:
          'Based on the last 60 days of utilization and counters, ENG1 may reach its shop visit threshold 12 days earlier than scheduled.',
        label: 'Prediction',
      },
      {
        title: 'Optimize Maintenance Schedule',
        description:
          'Consider combining A-Check with landing gear inspection to reduce aircraft downtime by 2 days.',
        label: 'Recommendation',
      },
      {
        title: 'Unusual Fuel Consumption',
        description:
          'Fuel consumption on flights to BOM is 3.2% higher than fleet average. Recommend performance monitoring.',
        label: 'Anomaly',
      },
    ],
  },
  // Add a default aircraft for when ID doesn't match
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
    nextMaintenance: '2025-11-30',
    nextCompliance: '2025-12-10',
    lastPosition: {
      lat: 19.0896,
      lon: 72.8656,
      source: 'OpenSky',
      lastSeenMinutesAgo: 240,
      altitude: 0,
      speed: 0,
    },
    overviewStats: {
      utilizationLast7Days: 0,
      flightsLast30Days: 42,
      openWorkOrders: 5,
      openDefects: 2,
    },
    keyCounters: {
      ttaf: 18234,
      landings: 9876,
      eng1Tsn: 6543,
      eng2Tsn: 6789,
    },
    aiSummary:
      'Aircraft currently undergoing scheduled C-Check. Expected return to service in 5 days.',
    flightActivity: [],
    maintenanceTasks: [
      {
        name: 'C-Check',
        basis: 'Calendar',
        dueIn: 'In progress',
        status: 'In-progress',
      },
    ],
    counterProjections: [],
    workOrders: [
      {
        woNumber: 'WO-3456',
        status: 'In-progress',
        title: 'C-Check inspection',
        openedDate: '2025-11-20',
        assignedWorkshop: 'BOM MRO',
      },
    ],
    defects: [],
    complianceDocs: [],
    configurationItems: [],
    weightBalance: {
      reportDate: '2024-09-15',
      emptyWeight: 41413,
      maxTakeoffWeight: 79010,
    },
    activityLog: [
      {
        time: '2025-11-20 08:00',
        actor: 'System',
        eventType: 'Maintenance',
        description: 'Aircraft entered C-Check maintenance',
      },
    ],
    aiInsights: [
      {
        title: 'On Schedule',
        description: 'C-Check progressing as planned. No delays anticipated.',
        label: 'Recommendation',
      },
    ],
  },
];

export function getAircraftProfile(id: string): MockAircraftProfile {
  return (
    mockAircraftProfiles.find((a) => a.id === id) ||
    mockAircraftProfiles.find((a) => a.id === 'default')!
  );
}
