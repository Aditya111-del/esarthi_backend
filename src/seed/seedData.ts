export interface SeedShop {
  _id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  status: "active" | "inactive";
  stationType: string;
  powerCapacityKw: number;
  totalBays: number;
  activeBays: number;
  supportedConnectors: string[];
  uptimePercent: number;
  dailyEnergyKwh: number;
}

export interface SeedRole {
  _id: string;
  title: string;
  department: string;
  level: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  status: "active" | "archived";
}

export interface SeedEmployee {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  shopId: string;
  shopName: string;
  department: string;
  roleTitle: string;
  roleId: string;
  level: string;
  status: "Active" | "Onboarding" | "Review" | "On Leave";
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  salary?: string;
  joiningDate: string;
  dateOfBirth?: string;
  address?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  skills: string[];
  certifications: string[];
  assignedBay: string;
  shift: string;
  safetyEquipmentCleared: boolean;
  bio: string;
  image?: string;
}

export interface SeedDepartment {
  _id: string;
  name: string;
  code: string;
  lead: string;
  description: string;
}

export const initialShops: SeedShop[] = [
  {
    _id: "shp-del-01",
    name: "ESARTHI Connaught Plaza EV Superhub — Delhi",
    code: "EV-DEL-01",
    city: "New Delhi",
    address: "Radial Road 3, Inner Circle, Connaught Place, New Delhi, DL 110001",
    contactEmail: "delhi.superhub@esarthi.com",
    contactPhone: "+91 11 2345 6789",
    adminName: "Rajesh Kumar",
    adminEmail: "delhi.admin@esarthi.com",
    adminPhone: "+91 98100 12345",
    status: "active",
    stationType: "Ultra-Fast Highway & Urban Hub",
    powerCapacityKw: 360,
    totalBays: 12,
    activeBays: 10,
    supportedConnectors: ["CCS-2 (350kW)", "CHAdeMO (150kW)", "Type-2 AC (22kW)"],
    uptimePercent: 99.9,
    dailyEnergyKwh: 4850,
  },
  {
    _id: "shp-blr-01",
    name: "ESARTHI Silicon Expressway Charging Depot — Bengaluru",
    code: "EV-BLR-01",
    city: "Bengaluru",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038",
    contactEmail: "bengaluru.depot@esarthi.com",
    contactPhone: "+91 80 4123 4567",
    adminName: "Vikram Malhotra",
    adminEmail: "bengaluru.admin@esarthi.com",
    adminPhone: "+91 98450 67890",
    status: "active",
    stationType: "Hypercharger Matrix & Fleet Terminal",
    powerCapacityKw: 480,
    totalBays: 16,
    activeBays: 14,
    supportedConnectors: ["Liquid-Cooled CCS-2 (480kW)", "CCS-2 (180kW)", "GB/T"],
    uptimePercent: 99.8,
    dailyEnergyKwh: 6320,
  },
  {
    _id: "shp-mum-01",
    name: "ESARTHI BKC Green Fleet Supercharger — Mumbai",
    code: "EV-MUM-01",
    city: "Mumbai",
    address: "G Block, Bandra Kurla Complex (BKC), Mumbai, MH 400051",
    contactEmail: "mumbai.fleet@esarthi.com",
    contactPhone: "+91 22 6789 0123",
    adminName: "Sneha Patel",
    adminEmail: "mumbai.admin@esarthi.com",
    adminPhone: "+91 98200 54321",
    status: "active",
    stationType: "Dual-Cabinet Fleet Supercharger",
    powerCapacityKw: 300,
    totalBays: 10,
    activeBays: 8,
    supportedConnectors: ["CCS-2 (240kW)", "CHAdeMO (100kW)", "Type-2 AC (43kW)"],
    uptimePercent: 99.7,
    dailyEnergyKwh: 3940,
  },
  {
    _id: "shp-hyd-01",
    name: "ESARTHI HITEC City EV Transit Hub — Hyderabad",
    code: "EV-HYD-01",
    city: "Hyderabad",
    address: "Cyber Towers Road, Madhapur, HITEC City, Hyderabad, TG 500081",
    contactEmail: "hyderabad.transit@esarthi.com",
    contactPhone: "+91 40 4890 1122",
    adminName: "Karthik Reddy",
    adminEmail: "hyderabad.admin@esarthi.com",
    adminPhone: "+91 98711 33445",
    status: "active",
    stationType: "Metro Transit & Ride-Hail Hub",
    powerCapacityKw: 240,
    totalBays: 8,
    activeBays: 6,
    supportedConnectors: ["CCS-2 (150kW)", "Type-2 AC (22kW)"],
    uptimePercent: 99.9,
    dailyEnergyKwh: 2790,
  },
];

export const initialDepartments: SeedDepartment[] = [
  {
    _id: "dept-eng",
    name: "Field Engineering & HV Diagnostics",
    code: "FIELD-HV",
    lead: "Marcus Webb",
    description: "High-voltage rectifier servicing, liquid-cooled dispenser maintenance, and emergency power cut-off audits.",
  },
  {
    _id: "dept-grid",
    name: "Grid Operations & Power Telemetry",
    code: "GRID-OPS",
    lead: "Sofia Reyes",
    description: "Substation load balancing, peak-demand curtailment, solar canopy integration, and dynamic power distribution.",
  },
  {
    _id: "dept-station",
    name: "Station Management & Fleet Operations",
    code: "STATION",
    lead: "Sneha Patel",
    description: "Multi-station charging bay allocation, commercial fleet contractual SLAs, and on-site customer experience.",
  },
  {
    _id: "dept-safety",
    name: "EV Safety, PPE & Regulatory Compliance",
    code: "SAFETY",
    lead: "Priya Nair",
    description: "NFPA 70E / IEC 61851 compliance, technician arc-flash PPE certifications, and fire suppression protocols.",
  },
  {
    _id: "dept-tech",
    name: "OCPP Cloud & Embedded Firmware",
    code: "CLOUD-IOT",
    lead: "Dane Okafor",
    description: "OCPP 2.0.1 cloud gateways, ISO 15118 Plug & Charge cryptographic handshakes, and OTA station firmware patches.",
  },
];

export const initialRoles: SeedRole[] = [
  {
    _id: "role-1",
    title: "High-Voltage EV Systems Field Engineer",
    department: "Field Engineering & HV Diagnostics",
    level: "L4",
    description: "Diagnose and service 400V/800V DC fast chargers, power converter modules, and liquid-cooled cable assemblies.",
    responsibilities: [
      "Perform scheduled insulation and dielectric tests across 350kW DC dispensers",
      "Diagnose OCPP 1.6J/2.0.1 transaction handshake dropouts with hardware oscilloscopes",
      "Execute safe lock-out/tag-out (LOTO) procedures during power cabinet servicing",
    ],
    skills: ["High-Voltage Safety", "CCS-2 Diagnostics", "PLC/CAN Bus", "Multimeter & Scope", "LOTO"],
    status: "active",
  },
  {
    _id: "role-2",
    title: "Lead OCPP Cloud & Telemetry Architect",
    department: "OCPP Cloud & Embedded Firmware",
    level: "L5",
    description: "Architect the resilient real-time WebSocket backend connecting thousands of EVSE dispensers across India.",
    responsibilities: [
      "Design zero-loss telemetry ingestion pipelines handling 50k+ OCPP messages/second",
      "Implement ISO 15118-20 Plug & Charge certificate management & PKI encryption",
      "Coordinate automated load balancing commands sent to station microgrids",
    ],
    skills: ["OCPP 2.0.1", "WebSockets", "Node.js", "MongoDB", "ISO 15118", "System Architecture"],
    status: "active",
  },
  {
    _id: "role-3",
    title: "EV Station Safety & Compliance Inspector",
    department: "EV Safety, PPE & Regulatory Compliance",
    level: "L4",
    description: "Lead field audits for electrical safety compliance, emergency cutoffs, and technician high-voltage gear.",
    responsibilities: [
      "Conduct bi-weekly site inspections verifying ground fault interrupters (GFIs) and RCDs",
      "Certify technician PPE, 1000V rated insulated toolkits, and arc-flash face shields",
      "Ensure adherence to Central Electricity Authority (CEA) and IEC 61851 charging standards",
    ],
    skills: ["IEC 61851 Standards", "CEA EV Regulations", "Arc Flash Safety", "LOTO Certification", "Site Auditing"],
    status: "active",
  },
  {
    _id: "role-4",
    title: "Grid Load & Charging Telemetry Analyst",
    department: "Grid Operations & Power Telemetry",
    level: "L3",
    description: "Monitor real-time energy throughput, station peak-demand spikes, and dynamic tariff optimization.",
    responsibilities: [
      "Analyze MWh consumption curves to avoid utility maximum demand penalties",
      "Model station queue wait-times and recommend automated power-sharing profiles",
      "Generate monthly CO₂ offset and green energy displacement reports",
    ],
    skills: ["Time Series Analytics", "Python", "SQL", "Power Factor Modeling", "Smart Grid Telemetry"],
    status: "active",
  },
  {
    _id: "role-5",
    title: "Station Operations & Technician Coordinator",
    department: "Station Management & Fleet Operations",
    level: "L2",
    description: "Manage bay availability, technician shift rosters, and emergency rapid-dispatch for faulty charging guns.",
    responsibilities: [
      "Coordinate on-site technician shift handovers across 24/7 supercharging operations",
      "Triage motorist charging stall issues via live station camera and telemetry feeds",
      "Track spare parts inventory (charging cables, contactors, emergency push buttons)",
    ],
    skills: ["Station Operations", "Workforce Dispatch", "Incident Triage", "Customer Experience"],
    status: "active",
  },
  {
    _id: "role-6",
    title: "Principal EV Fleet Operations Manager",
    department: "Station Management & Fleet Operations",
    level: "L5",
    description: "Oversee commercial fleet partnerships, guaranteed charging turnaround SLAs, and station capacity expansion.",
    responsibilities: [
      "Manage dedicated charging window contracts for logistics and taxi fleet operators",
      "Ensure 99.8%+ fleet charger uptime compliance across multi-city hubs",
      "Oversee new station commissioning and grid interconnect approvals",
    ],
    skills: ["Fleet Strategy", "SLA Monitoring", "Utility Interconnection", "Commercial Contracts"],
    status: "active",
  },
];

export const initialEmployees: SeedEmployee[] = [
  {
    _id: "emp-1",
    name: "Marcus Webb",
    firstName: "Marcus",
    lastName: "Webb",
    email: "m.webb@esarthi-ev.internal",
    phone: "+91 98111 22334",
    employeeId: "EV-TECH-1088",
    shopId: "shp-del-01",
    shopName: "ESARTHI Connaught Plaza EV Superhub — Delhi",
    department: "Field Engineering & HV Diagnostics",
    roleTitle: "High-Voltage EV Systems Field Engineer",
    roleId: "role-1",
    level: "L4",
    status: "Active",
    employmentType: "Full-time",
    salary: "₹1,35,000/mo",
    joiningDate: "2023-04-10",
    dateOfBirth: "1992-11-14",
    address: "Sector 42, Cyber Hub Residences, Gurugram, HR",
    emergencyName: "Sarah Webb",
    emergencyPhone: "+91 98111 88990",
    skills: ["High-Voltage Safety", "CCS-2 Diagnostics", "PLC/CAN Bus", "LOTO Procedures"],
    certifications: ["HV Safety Certified (Level 4)", "OCPP 2.0.1 Hardware Specialist", "Arc Flash NFPA 70E"],
    assignedBay: "Bays 01-06 (350kW DC Ultra-Fast)",
    shift: "Morning Shift (06:00 - 14:00)",
    safetyEquipmentCleared: true,
    bio: "Specialized in 800V silicon-carbide power modules and high-speed DC liquid-cooled dispenser maintenance.",
    image: "/src/assets/marcus-webb.jpg",
  },
  {
    _id: "emp-2",
    name: "Priya Nair",
    firstName: "Priya",
    lastName: "Nair",
    email: "p.nair@esarthi-ev.internal",
    phone: "+91 98765 43210",
    employeeId: "EV-SAFE-1042",
    shopId: "shp-blr-01",
    shopName: "ESARTHI Silicon Expressway Charging Depot — Bengaluru",
    department: "EV Safety, PPE & Regulatory Compliance",
    roleTitle: "EV Station Safety & Compliance Inspector",
    roleId: "role-3",
    level: "L4",
    status: "Active",
    employmentType: "Full-time",
    salary: "₹1,45,000/mo",
    joiningDate: "2023-02-15",
    dateOfBirth: "1994-06-20",
    address: "Block B, Tech Park Enclave, Indiranagar, Bengaluru, KA",
    emergencyName: "Rohan Nair",
    emergencyPhone: "+91 98765 00112",
    skills: ["IEC 61851 Standards", "Ground Fault Auditing", "Arc Flash Protection", "LOTO Verification"],
    certifications: ["National Electrical Safety Auditor", "High-Voltage PPE Examiner", "ISO 14001 Compliance"],
    assignedBay: "All 16 Hypercharger Matrix Bays",
    shift: "General Day Inspection (09:00 - 17:30)",
    safetyEquipmentCleared: true,
    bio: "Conducts multi-station safety verifications, dielectric testing, and technician gear audits across South India.",
    image: "/src/assets/priya-nair.jpg",
  },
  {
    _id: "emp-3",
    name: "Dane Okafor",
    firstName: "Dane",
    lastName: "Okafor",
    email: "d.okafor@esarthi-ev.internal",
    phone: "+91 98222 33445",
    employeeId: "EV-TECH-1015",
    shopId: "shp-mum-01",
    shopName: "ESARTHI BKC Green Fleet Supercharger — Mumbai",
    department: "OCPP Cloud & Embedded Firmware",
    roleTitle: "Lead OCPP Cloud & Telemetry Architect",
    roleId: "role-2",
    level: "L5",
    status: "Active",
    employmentType: "Full-time",
    salary: "₹1,85,000/mo",
    joiningDate: "2022-09-01",
    dateOfBirth: "1990-08-18",
    address: "Hiranandani Gardens, Powai, Mumbai, MH",
    emergencyName: "Ada Okafor",
    emergencyPhone: "+91 98222 77889",
    skills: ["OCPP 2.0.1", "WebSockets", "Node.js", "MongoDB", "ISO 15118 PKI"],
    certifications: ["Open Charge Alliance OCPP Certified", "Cloud Security Professional", "Embedded Linux Dev"],
    assignedBay: "Central Telemetry & Cloud Controller",
    shift: "Core Operations (10:00 - 18:30)",
    safetyEquipmentCleared: true,
    bio: "Architected ESARTHI's low-latency OCPP broker handling live power control packets with 99.99% reliability.",
    image: "/src/assets/dane-okafor.jpg",
  },
  {
    _id: "emp-4",
    name: "Sofia Reyes",
    firstName: "Sofia",
    lastName: "Reyes",
    email: "s.reyes@esarthi-ev.internal",
    phone: "+91 98444 55667",
    employeeId: "EV-GRID-1104",
    shopId: "shp-blr-01",
    shopName: "ESARTHI Silicon Expressway Charging Depot — Bengaluru",
    department: "Grid Operations & Power Telemetry",
    roleTitle: "Grid Load & Charging Telemetry Analyst",
    roleId: "role-4",
    level: "L3",
    status: "Active",
    employmentType: "Full-time",
    salary: "₹98,000/mo",
    joiningDate: "2024-01-10",
    dateOfBirth: "1996-03-05",
    address: "Koramangala 4th Block, Bengaluru, KA",
    emergencyName: "Elena Reyes",
    emergencyPhone: "+91 98444 99001",
    skills: ["Grid Telemetry", "Python", "SQL", "Peak Shaving Analysis", "Power Modeling"],
    certifications: ["Smart Grid Energy Analyst", "Industrial IoT Telemetry Specialist"],
    assignedBay: "Grid Transformer Feeders 1 & 2",
    shift: "Peak Demand Monitoring (12:00 - 20:00)",
    safetyEquipmentCleared: true,
    bio: "Monitors real-time energy flow, mitigating grid strain through smart load balancing and dynamic charging rates.",
    image: "/src/assets/sofia-reyes.jpg",
  },
  {
    _id: "emp-5",
    name: "Lena Fischer",
    firstName: "Lena",
    lastName: "Fischer",
    email: "l.fischer@esarthi-ev.internal",
    phone: "+91 98333 44556",
    employeeId: "EV-OPS-1055",
    shopId: "shp-del-01",
    shopName: "ESARTHI Connaught Plaza EV Superhub — Delhi",
    department: "Station Management & Fleet Operations",
    roleTitle: "Station Operations & Technician Coordinator",
    roleId: "role-5",
    level: "L2",
    status: "Active",
    employmentType: "Full-time",
    salary: "₹75,000/mo",
    joiningDate: "2023-05-18",
    dateOfBirth: "1995-12-09",
    address: "Barakhamba Road, Connaught Place, New Delhi, DL",
    emergencyName: "Karl Fischer",
    emergencyPhone: "+91 98333 88990",
    skills: ["Shift Dispatch", "Bay Queue Management", "First Responder Coordination", "Station Inventory"],
    certifications: ["EVSE Station Field Controller", "CPR & High-Voltage First Aid"],
    assignedBay: "Bays 07-12 & Fast-Queue Staging",
    shift: "Evening Peak Shift (14:00 - 22:00)",
    safetyEquipmentCleared: true,
    bio: "Coordinates high-turnover station bay operations, emergency cable swaps, and on-ground technician rotas.",
    image: "/src/assets/lena-fischer.jpg",
  },
  {
    _id: "emp-6",
    name: "Arjun Sharma",
    firstName: "Arjun",
    lastName: "Sharma",
    email: "a.sharma@esarthi-ev.internal",
    phone: "+91 98555 66778",
    employeeId: "EV-MGR-1002",
    shopId: "shp-mum-01",
    shopName: "ESARTHI BKC Green Fleet Supercharger — Mumbai",
    department: "Station Management & Fleet Operations",
    roleTitle: "Principal EV Fleet Operations Manager",
    roleId: "role-6",
    level: "L5",
    status: "Active",
    employmentType: "Full-time",
    salary: "₹1,95,000/mo",
    joiningDate: "2022-04-12",
    dateOfBirth: "1988-02-28",
    address: "Bandra West, Mumbai, MH",
    emergencyName: "Pooja Sharma",
    emergencyPhone: "+91 98555 11223",
    skills: ["Fleet Electrification", "SLA Guarantees", "Utility Liaison", "Network Expansion"],
    certifications: ["Fleet Electrification Executive", "Project Management Professional (PMP)"],
    assignedBay: "Dedicated Commercial Fleet Terminal",
    shift: "Executive Operations (09:00 - 18:00)",
    safetyEquipmentCleared: true,
    bio: "Oversees commercial enterprise fleet charging contracts, guaranteed turnaround times, and uptime excellence.",
  },
];
