// Mock data for Admin module

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  iaamRole: "Admin" | "User";
  avirRole: string;
  avirRoleAccesses: string[];
  isActive: boolean;
}

export interface Invoice {
  id: string;
  period: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
}

export interface BillingInfo {
  planName: string;
  status: "Active" | "Inactive";
  seatsUsed: number;
  totalSeats: number;
  monthlyPrice: number;
  nextBillingDate: string;
  invoices: Invoice[];
  billingContacts: { name: string; email: string }[];
}

export interface RolePermission {
  view: boolean;
  edit: boolean;
  admin: boolean;
}

export interface RolePermissions {
  [module: string]: RolePermission;
}

export interface Integration {
  id: string;
  name: string;
  category: "MRO" | "ERP" | "Ops" | "Tracking";
  status: "Connected" | "Not configured" | "Sandbox";
  lastSync: string | null;
  apiKey?: string;
  environment: "Production" | "Sandbox";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
  actionType: "User" | "Role" | "Integration" | "Billing" | "Login";
}

// Mock Users
export const mockAdminUsers: AdminUser[] = [
  {
    id: "1",
    name: "Laman",
    email: "laman@avir.space",
    iaamRole: "Admin",
    avirRole: "Executive",
    avirRoleAccesses: [
      "Maintenance Health Overview",
      "Inventory & Spares Visibility",
      "Airworthiness Management",
      "Ops & Dispatch Reliability",
      "Fuel & Efficiency",
      "Financial & Procurement",
      "Crew & Duty Snapshot",
      "Central Tasks",
      "Aircraft Management",
      "Inventory Forecasting",
      "Settings",
      "Admin",
    ],
    isActive: true,
  },
  {
    id: "2",
    name: "Rahul Mahajan",
    email: "rahul@avir.space",
    iaamRole: "User",
    avirRole: "Air Ops",
    avirRoleAccesses: [
      "Maintenance Health Overview",
      "Ops & Dispatch Reliability",
      "Crew & Duty Snapshot",
      "Central Tasks",
      "Aircraft Management",
    ],
    isActive: true,
  },
  {
    id: "3",
    name: "Udit Narayan",
    email: "udit@avir.space",
    iaamRole: "User",
    avirRole: "Finance",
    avirRoleAccesses: [
      "Financial & Procurement",
      "Inventory & Spares Visibility",
      "Inventory Forecasting",
      "Central Tasks",
    ],
    isActive: false,
  },
];

// Mock Billing
export const mockBillingInfo: BillingInfo = {
  planName: "AVIR Pilot",
  status: "Active",
  seatsUsed: 3,
  totalSeats: 10,
  monthlyPrice: 4500,
  nextBillingDate: "Dec 15, 2025",
  invoices: [
    { id: "INV-2025-11", period: "Nov 2025", amount: 4500, status: "Pending", date: "2025-11-15" },
    { id: "INV-2025-10", period: "Oct 2025", amount: 4500, status: "Paid", date: "2025-10-15" },
    { id: "INV-2025-09", period: "Sep 2025", amount: 4500, status: "Paid", date: "2025-09-15" },
    { id: "INV-2025-08", period: "Aug 2025", amount: 4500, status: "Paid", date: "2025-08-15" },
    { id: "INV-2025-07", period: "Jul 2025", amount: 4500, status: "Paid", date: "2025-07-15" },
  ],
  billingContacts: [
    { name: "Laman", email: "laman@avir.space" },
    { name: "Finance Team", email: "finance@avir.space" },
  ],
};

// AVIR Modules list
export const avirModules = [
  "Maintenance Health Overview",
  "Inventory & Spares Visibility",
  "Airworthiness Management",
  "Ops & Dispatch Reliability",
  "Fuel & Efficiency",
  "Financial & Procurement",
  "Crew & Duty Snapshot",
  "Central Tasks",
  "Aircraft Management",
  "Inventory Forecasting",
  "Settings",
  "Admin",
];

// AVIR Roles list
export const avirRoles = ["Air Ops", "Maintenance", "Finance", "Executive"];

// Mock Role Permissions
export const mockRolePermissions: Record<string, RolePermissions> = {
  "Air Ops": {
    "Maintenance Health Overview": { view: true, edit: false, admin: false },
    "Inventory & Spares Visibility": { view: true, edit: false, admin: false },
    "Airworthiness Management": { view: false, edit: false, admin: false },
    "Ops & Dispatch Reliability": { view: true, edit: true, admin: false },
    "Fuel & Efficiency": { view: true, edit: false, admin: false },
    "Financial & Procurement": { view: false, edit: false, admin: false },
    "Crew & Duty Snapshot": { view: true, edit: true, admin: false },
    "Central Tasks": { view: true, edit: true, admin: false },
    "Aircraft Management": { view: true, edit: true, admin: false },
    "Inventory Forecasting": { view: true, edit: false, admin: false },
    "Settings": { view: true, edit: false, admin: false },
    "Admin": { view: false, edit: false, admin: false },
  },
  "Maintenance": {
    "Maintenance Health Overview": { view: true, edit: true, admin: true },
    "Inventory & Spares Visibility": { view: true, edit: true, admin: false },
    "Airworthiness Management": { view: true, edit: true, admin: false },
    "Ops & Dispatch Reliability": { view: true, edit: false, admin: false },
    "Fuel & Efficiency": { view: false, edit: false, admin: false },
    "Financial & Procurement": { view: true, edit: false, admin: false },
    "Crew & Duty Snapshot": { view: false, edit: false, admin: false },
    "Central Tasks": { view: true, edit: true, admin: false },
    "Aircraft Management": { view: true, edit: true, admin: true },
    "Inventory Forecasting": { view: true, edit: true, admin: false },
    "Settings": { view: true, edit: false, admin: false },
    "Admin": { view: false, edit: false, admin: false },
  },
  "Finance": {
    "Maintenance Health Overview": { view: true, edit: false, admin: false },
    "Inventory & Spares Visibility": { view: true, edit: false, admin: false },
    "Airworthiness Management": { view: false, edit: false, admin: false },
    "Ops & Dispatch Reliability": { view: false, edit: false, admin: false },
    "Fuel & Efficiency": { view: true, edit: false, admin: false },
    "Financial & Procurement": { view: true, edit: true, admin: true },
    "Crew & Duty Snapshot": { view: false, edit: false, admin: false },
    "Central Tasks": { view: true, edit: true, admin: false },
    "Aircraft Management": { view: true, edit: false, admin: false },
    "Inventory Forecasting": { view: true, edit: true, admin: false },
    "Settings": { view: true, edit: false, admin: false },
    "Admin": { view: false, edit: false, admin: false },
  },
  "Executive": {
    "Maintenance Health Overview": { view: true, edit: true, admin: true },
    "Inventory & Spares Visibility": { view: true, edit: true, admin: true },
    "Airworthiness Management": { view: true, edit: true, admin: true },
    "Ops & Dispatch Reliability": { view: true, edit: true, admin: true },
    "Fuel & Efficiency": { view: true, edit: true, admin: true },
    "Financial & Procurement": { view: true, edit: true, admin: true },
    "Crew & Duty Snapshot": { view: true, edit: true, admin: true },
    "Central Tasks": { view: true, edit: true, admin: true },
    "Aircraft Management": { view: true, edit: true, admin: true },
    "Inventory Forecasting": { view: true, edit: true, admin: true },
    "Settings": { view: true, edit: true, admin: true },
    "Admin": { view: true, edit: true, admin: true },
  },
};

// Mock Integrations
export const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "AMOS",
    category: "MRO",
    status: "Connected",
    lastSync: "2025-11-27 09:15",
    apiKey: "••••••••••••ak7x",
    environment: "Production",
  },
  {
    id: "2",
    name: "TRAX",
    category: "MRO",
    status: "Not configured",
    lastSync: null,
    environment: "Sandbox",
  },
  {
    id: "3",
    name: "Ramco",
    category: "ERP",
    status: "Sandbox",
    lastSync: "2025-11-26 14:30",
    apiKey: "••••••••••••rm2q",
    environment: "Sandbox",
  },
  {
    id: "4",
    name: "SAP",
    category: "ERP",
    status: "Not configured",
    lastSync: null,
    environment: "Sandbox",
  },
  {
    id: "5",
    name: "Jeppesen",
    category: "Ops",
    status: "Connected",
    lastSync: "2025-11-27 08:45",
    apiKey: "••••••••••••jp9k",
    environment: "Production",
  },
  {
    id: "6",
    name: "FlightRadar24",
    category: "Tracking",
    status: "Connected",
    lastSync: "2025-11-27 10:02",
    apiKey: "••••••••••••fr4m",
    environment: "Production",
  },
];

// Mock Audit Logs
export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: "2025-11-27 10:32",
    user: "Laman",
    action: "Updated role",
    target: "Air Ops",
    details: "Gave edit access to Maintenance Health Overview",
    actionType: "Role",
  },
  {
    id: "2",
    timestamp: "2025-11-26 18:15",
    user: "Rahul",
    action: "Invited user",
    target: "udit@avir.space",
    details: "Role: Finance",
    actionType: "User",
  },
  {
    id: "3",
    timestamp: "2025-11-25 09:04",
    user: "System",
    action: "Integration sync",
    target: "AMOS",
    details: "Status: Success",
    actionType: "Integration",
  },
  {
    id: "4",
    timestamp: "2025-11-24 14:22",
    user: "Laman",
    action: "User login",
    target: "laman@avir.space",
    details: "IP: 192.168.1.45",
    actionType: "Login",
  },
  {
    id: "5",
    timestamp: "2025-11-23 11:30",
    user: "System",
    action: "Invoice generated",
    target: "INV-2025-11",
    details: "Amount: $4,500",
    actionType: "Billing",
  },
  {
    id: "6",
    timestamp: "2025-11-22 16:45",
    user: "Rahul",
    action: "Deactivated user",
    target: "udit@avir.space",
    details: "Reason: Account suspension",
    actionType: "User",
  },
  {
    id: "7",
    timestamp: "2025-11-21 08:15",
    user: "Laman",
    action: "Connected integration",
    target: "FlightRadar24",
    details: "Environment: Production",
    actionType: "Integration",
  },
  {
    id: "8",
    timestamp: "2025-11-20 13:00",
    user: "System",
    action: "Payment received",
    target: "INV-2025-10",
    details: "Amount: $4,500",
    actionType: "Billing",
  },
];
