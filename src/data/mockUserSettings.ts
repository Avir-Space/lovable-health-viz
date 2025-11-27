export const currentUser = {
  id: "user-001",
  name: "Laman A",
  initials: "LA",
  email: "laman@avir.space",
  jobTitle: "Founder, AVIR",
  department: "Executive",
  workPhone: "+971-55-123-4567",
  timeZone: "Asia/Dubai",
  preferredLanguage: "English",
  iaamRole: "Admin",
  avirRole: "Air Ops + Finance",
  createdAt: "2025-08-01",
  org: "AVIR Demo Airline",
};

export const departments = [
  "Operations",
  "Maintenance",
  "Engineering",
  "Finance",
  "Executive",
  "Safety",
  "Quality",
];

export const timeZones = [
  { value: "Asia/Dubai", label: "Asia/Dubai (UTC+4)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (UTC+5:30)" },
  { value: "Europe/London", label: "Europe/London (UTC+0)" },
  { value: "America/New_York", label: "America/New_York (UTC-5)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (UTC-8)" },
];

export const languages = ["English", "Arabic", "Hindi", "French", "German"];

export const accessibleModules = [
  { name: "My Dashboard", access: "View + Actions" },
  { name: "Overall Impact", access: "View + Actions" },
  { name: "Central Tasks", access: "View + Actions" },
  { name: "Aircraft Management", access: "View + Actions" },
  { name: "Inventory Forecasting", access: "View + Actions" },
  { name: "Maintenance Health Overview", access: "View + Actions" },
  { name: "Inventory & Spares Visibility", access: "View + Actions" },
  { name: "Airworthiness Management", access: "View + Actions" },
  { name: "Ops & Dispatch Reliability", access: "View + Actions" },
  { name: "Fuel & Efficiency", access: "View + Actions" },
  { name: "Financial & Procurement", access: "View + Actions" },
  { name: "Crew & Duty Snapshot", access: "View" },
];

export const defaultNotificationSettings = {
  predictiveMaintenance: true,
  aogAlerts: true,
  flightDelays: true,
  costVariance: true,
  taskAssignments: true,
  inAppNotifications: true,
  highSeverityOnly: false,
  digestFrequency: "daily" as "daily" | "weekly" | "high-severity",
};

export const mockSessions = [
  {
    id: "session-1",
    device: "MacBook Pro",
    browser: "Chrome",
    location: "Dubai, UAE",
    lastActive: "2 minutes ago",
    current: true,
  },
  {
    id: "session-2",
    device: "iPhone",
    browser: "Safari",
    location: "Dubai, UAE",
    lastActive: "3 hours ago",
    current: false,
  },
  {
    id: "session-3",
    device: "Windows Laptop",
    browser: "Edge",
    location: "Jaipur, India",
    lastActive: "4 days ago",
    current: false,
  },
];

export const defaultPersonalization = {
  theme: "light" as "light" | "dark" | "system",
  timeFormat: "24h" as "24h" | "12h",
  dateFormat: "DD-MM-YYYY" as "DD-MM-YYYY" | "MM-DD-YYYY",
  defaultLandingPage: "My Dashboard",
  collapseSidebar: false,
  gridViewAircraft: false,
};

export const landingPageOptions = [
  "My Dashboard",
  "Overall Impact",
  "Aircraft Management",
  "Inventory Forecasting",
];

export const mockUserLogs = [
  {
    id: "log-1",
    timestamp: "2025-11-26 19:42",
    type: "Playbook",
    description: 'Triggered "Expedite procurement" playbook for PN-7734.',
  },
  {
    id: "log-2",
    timestamp: "2025-11-26 19:15",
    type: "Insight",
    description:
      "Viewed predictive maintenance signal for VT-AVR (engine vibration trend).",
  },
  {
    id: "log-3",
    timestamp: "2025-11-26 18:50",
    type: "Task",
    description: "Created Central Task: Coordinate AD 2024-05 compliance.",
  },
  {
    id: "log-4",
    timestamp: "2025-11-25 10:30",
    type: "Export",
    description: "Exported Maintenance Health Overview dashboard as PDF.",
  },
  {
    id: "log-5",
    timestamp: "2025-11-24 14:20",
    type: "Task",
    description: "Completed task: Review fuel efficiency metrics for Q4.",
  },
  {
    id: "log-6",
    timestamp: "2025-11-23 09:15",
    type: "Insight",
    description: "Viewed AOG risk analysis for PN-0048 hydraulic pump.",
  },
  {
    id: "log-7",
    timestamp: "2025-11-22 16:45",
    type: "Playbook",
    description: 'Triggered "Reposition inventory" playbook for DXB base.',
  },
  {
    id: "log-8",
    timestamp: "2025-11-20 11:00",
    type: "Export",
    description: "Exported Aircraft Management fleet summary as CSV.",
  },
];
