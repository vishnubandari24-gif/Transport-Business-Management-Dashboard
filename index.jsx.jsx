import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";

/* ═══════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════ */
const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }
body { font-family: 'Baloo 2', 'Noto Sans Telugu', sans-serif; }
input, select, textarea, button { font-family: inherit; }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #F97316; border-radius: 4px; }
@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideIn { from { transform:translateX(-100%); } to { transform:translateX(0); } }
@keyframes slideRight { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.6; } }
@keyframes spin { to { transform:rotate(360deg); } }
@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
.fade-in { animation: fadeIn .35s ease forwards; }
.slide-in { animation: slideIn .25s ease forwards; }
.slide-right { animation: slideRight .3s ease forwards; }
.pulse { animation: pulse 2s infinite; }
.bounce { animation: bounce 1s ease infinite; }
@media print {
  .no-print { display: none !important; }
  body { background: white !important; }
}
`;

/* ═══════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════ */
const makeTheme = (dark) => ({
  bg:          dark ? "#0D1B2E" : "#F0F4F8",
  sidebar:     dark ? "#0A1628" : "#0F2A4A",
  sidebarText: dark ? "#94A3B8" : "#93B4CC",
  sidebarActive:"#F97316",
  card:        dark ? "#162233" : "#FFFFFF",
  cardBorder:  dark ? "#1E3448" : "#E2EBF3",
  text:        dark ? "#E8F0F8" : "#1A2B3C",
  textMuted:   dark ? "#7A9BB5" : "#607D96",
  accent:      "#F97316",
  accentDark:  "#C25A00",
  accentLight: "#FEE5CC",
  success:     "#10B981",
  successBg:   dark ? "#0D2E22" : "#D1FAE5",
  warning:     "#F59E0B",
  warningBg:   dark ? "#2D1F00" : "#FEF3C7",
  danger:      "#EF4444",
  dangerBg:    dark ? "#2D0A0A" : "#FEE2E2",
  info:        "#3B82F6",
  infoBg:      dark ? "#0D1D3A" : "#DBEAFE",
  input:       dark ? "#1A2E44" : "#F7FAFD",
  inputBorder: dark ? "#2A4060" : "#C8D8E8",
  inputFocus:  "#F97316",
  divider:     dark ? "#1E3448" : "#E0EAF3",
  hover:       dark ? "#1A2E44" : "#F0F7FF",
  chartGrid:   dark ? "#1E3448" : "#E8F0F8",
  glass:       dark ? "rgba(22,34,51,0.85)" : "rgba(255,255,255,0.85)",
  shadow:      dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(15,42,74,0.12)",
  pieColors:   ["#F97316","#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#14B8A6","#84CC16"],
});

/* ═══════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════ */
const T = {
  en: {
    appName: "Sri Venkateshwara Transports", appTagline: "Your Trusted Logistics Partner",
    login: "Login", loginBtn: "Sign In", loginWelcome: "Welcome Back!",
    username: "Username", password: "Password", loginHint: "Admin access only",
    dashboard: "Dashboard", trips: "Trips", expenses: "Expenses",
    vehicles: "Vehicles", drivers: "Drivers", analytics: "Analytics",
    notifications: "Alerts", reports: "Reports", invoice: "Invoice",
    logout: "Logout", settings: "Settings",
    totalIncome: "Total Income", totalExpenses: "Total Expenses",
    netProfit: "Net Profit", pendingEMI: "Pending EMI",
    dieselExpense: "Diesel Expense", thisMonth: "This Month",
    addTrip: "Add New Trip", editTrip: "Edit Trip",
    tripDate: "Trip Date", vehicle: "Vehicle", driver: "Driver",
    customer: "Customer Name", goodsType: "Goods Type",
    goodsWeight: "Goods Weight (kg)", pickup: "Pickup Location",
    destination: "Destination", tripIncome: "Trip Income (₹)",
    dieselCost: "Diesel Cost (₹)", tollCharges: "Toll Charges (₹)",
    driverBata: "Driver Bata (₹)", loadingCharges: "Loading/Unloading (₹)",
    otherExpenses: "Other Expenses (₹)", tripProfit: "Trip Profit",
    totalTripExp: "Total Trip Expenses",
    save: "Save", cancel: "Cancel", delete: "Delete", edit: "Edit",
    confirm: "Confirm", confirmDelete: "Delete this record?",
    addExpense: "Add Expense", editExpense: "Edit Expense",
    category: "Category", amount: "Amount (₹)", date: "Date",
    description: "Description / Notes",
    noData: "No records found", search: "Search...",
    filterBy: "Filter by", all: "All", export: "Export Excel",
    generatePDF: "Download PDF", print: "Print",
    vehicleNumber: "Vehicle Number", model: "Model",
    insuranceExpiry: "Insurance Expiry", permitExpiry: "Permit Expiry",
    pollutionExpiry: "Pollution Certificate", serviceDue: "Next Service",
    emiAmount: "Monthly EMI", totalTrips: "Total Trips",
    totalEarnings: "Total Earnings", totalExpVehicle: "Total Expenses",
    vehicleProfit: "Vehicle Profit", vehicleStatus: "Status",
    driverName: "Driver Name", phone: "Phone Number",
    licenseNo: "License Number", salary: "Monthly Salary (₹)",
    advance: "Advance Given (₹)", addDriver: "Add Driver",
    editDriver: "Edit Driver", assignedVehicle: "Assigned Vehicle",
    joinDate: "Join Date", driverStatus: "Status",
    monthlyProfits: "Monthly Income vs Expenses vs Profit",
    expenseBreakdown: "Expense Category Breakdown",
    vehicleComparison: "Vehicle Performance Comparison",
    dieselTrend: "Diesel Usage Trend",
    alertsTitle: "Document & Payment Alerts",
    daysLeft: "days left", expired: "EXPIRED", expiresToday: "Expires today",
    lightMode: "Light", darkMode: "Dark", language: "తెలుగు",
    active: "Active", inactive: "Inactive",
    recentTrips: "Recent Trips", quickAlerts: "Quick Alerts",
    viewAll: "View All", addNew: "Add New",
    income: "Income", profit: "Profit",
    monthlyReport: "Monthly Business Report", vehicleReport: "Vehicle-wise Report",
    expenseReport: "Expense Report", profitReport: "Profit & Loss Report",
    reportFor: "Report for", selectMonth: "Select Month",
    generateReport: "Generate Report",
    invoiceTitle: "Transport Invoice", selectTrip: "Select Trip",
    invoiceNo: "Invoice No", billTo: "Bill To",
    shipFrom: "Ship From", shipTo: "Ship To",
    goodsDetails: "Goods Details", charges: "Charges Breakdown",
    grandTotal: "Grand Total", authorizedSign: "Authorized Signature",
    printInvoice: "Print Invoice",
    attendance: "Attendance", bataHistory: "Bata History",
    totalBata: "Total Bata Paid", expiryStatus: "Expiry Status",
    urgent: "URGENT", warning: "WARNING", ok: "OK",
    noPendingAlerts: "No pending alerts! All documents are up to date.",
    dieselPerKm: "Diesel/KM", kmDriven: "KM Driven",
    weight: "Weight", route: "Route",
    kmField: "KM Driven", kmDrivenLabel: "KM Driven (optional)",
    searchFilter: "Search & Filter", clearFilter: "Clear",
    exportExcel: "Export Excel", downloadPDF: "Download PDF",
    tripSummary: "Trip Summary", expenseSummary: "Expense Summary",
    vehicleSummary: "Vehicle Summary", driverSummary: "Driver Summary",
    totalRecords: "Total Records", avgProfit: "Avg Trip Profit",
    bestTrip: "Best Trip", worstTrip: "Loss Trip",
    netBalance: "Net Balance", cashflow: "Cash Flow",
    markAttendance: "Mark Attendance", present: "Present", absent: "Absent",
    payAdvance: "Pay Advance", advanceHistory: "Advance History",
    kmTracking: "KM Tracking", fuelEfficiency: "Fuel Efficiency",
    perKm: "Per KM Cost", totalKm: "Total KM",
    settings: "Settings", language2: "Language", theme: "Theme",
    companyName: "Company Name", companyPhone: "Phone", companyAddress: "Address",
    saveSettings: "Save Settings",
  },
  te: {
    appName: "శ్రీ వెంకటేశ్వర ట్రాన్స్‌పోర్ట్స్", appTagline: "మీ విశ్వసనీయ లాజిస్టిక్స్ భాగస్వామి",
    login: "లాగిన్", loginBtn: "సైన్ ఇన్", loginWelcome: "స్వాగతం!",
    username: "వినియోగదారు పేరు", password: "పాస్‌వర్డ్", loginHint: "అడ్మిన్ యాక్సెస్ మాత్రమే",
    dashboard: "డ్యాష్‌బోర్డ్", trips: "ట్రిప్పులు", expenses: "ఖర్చులు",
    vehicles: "వాహనాలు", drivers: "డ్రైవర్లు", analytics: "విశ్లేషణలు",
    notifications: "హెచ్చరికలు", reports: "నివేదికలు", invoice: "ఇన్‌వాయిస్",
    logout: "లాగ్అవుట్", settings: "సెట్టింగ్స్",
    totalIncome: "మొత్తం ఆదాయం", totalExpenses: "మొత్తం ఖర్చులు",
    netProfit: "నికర లాభం", pendingEMI: "పెండింగ్ EMI",
    dieselExpense: "డీజిల్ ఖర్చు", thisMonth: "ఈ నెల",
    addTrip: "కొత్త ట్రిప్ జోడించు", editTrip: "ట్రిప్ సవరించు",
    tripDate: "ట్రిప్ తేదీ", vehicle: "వాహనం", driver: "డ్రైవర్",
    customer: "కస్టమర్ పేరు", goodsType: "సరుకు రకం",
    goodsWeight: "సరుకు బరువు (కి.గ్రా)", pickup: "ఎక్కడ నుండి",
    destination: "గమ్యస్థానం", tripIncome: "ట్రిప్ ఆదాయం (₹)",
    dieselCost: "డీజిల్ ఖర్చు (₹)", tollCharges: "టోల్ చార్జీలు (₹)",
    driverBata: "డ్రైవర్ బత్తా (₹)", loadingCharges: "లోడింగ్/అన్‌లోడింగ్ (₹)",
    otherExpenses: "ఇతర ఖర్చులు (₹)", tripProfit: "ట్రిప్ లాభం",
    totalTripExp: "మొత్తం ట్రిప్ ఖర్చులు",
    save: "సేవ్ చేయి", cancel: "రద్దు", delete: "తొలగించు", edit: "సవరించు",
    confirm: "నిర్ధారించు", confirmDelete: "ఈ రికార్డు తొలగించాలా?",
    addExpense: "ఖర్చు జోడించు", editExpense: "ఖర్చు సవరించు",
    category: "వర్గం", amount: "మొత్తం (₹)", date: "తేదీ",
    description: "వివరణ / గమనికలు",
    noData: "రికార్డులు కనుగొనబడలేదు", search: "వెతకండి...",
    filterBy: "వడపోత", all: "అన్నీ", export: "Excel ఎగుమతి",
    generatePDF: "PDF డౌన్‌లోడ్", print: "ప్రింట్",
    vehicleNumber: "వాహన నంబర్", model: "మోడల్",
    insuranceExpiry: "బీమా గడువు", permitExpiry: "పర్మిట్ గడువు",
    pollutionExpiry: "కాలుష్య ప్రమాణపత్రం", serviceDue: "తదుపరి సర్వీస్",
    emiAmount: "నెలవారీ EMI", totalTrips: "మొత్తం ట్రిప్పులు",
    totalEarnings: "మొత్తం సంపాదన", totalExpVehicle: "మొత్తం ఖర్చులు",
    vehicleProfit: "వాహన లాభం", vehicleStatus: "స్థితి",
    driverName: "డ్రైవర్ పేరు", phone: "ఫోన్ నంబర్",
    licenseNo: "లైసెన్స్ నంబర్", salary: "నెలవారీ జీతం (₹)",
    advance: "ఇచ్చిన అడ్వాన్స్ (₹)", addDriver: "డ్రైవర్ జోడించు",
    editDriver: "డ్రైవర్ సవరించు", assignedVehicle: "కేటాయించిన వాహనం",
    joinDate: "చేరిన తేదీ", driverStatus: "స్థితి",
    monthlyProfits: "నెలవారీ ఆదాయం vs ఖర్చు vs లాభం",
    expenseBreakdown: "ఖర్చుల వివరాలు",
    vehicleComparison: "వాహన పనితీరు పోలిక",
    dieselTrend: "డీజిల్ వినియోగ ట్రెండ్",
    alertsTitle: "డాక్యుమెంట్ & చెల్లింపు హెచ్చరికలు",
    daysLeft: "రోజులు మిగిలాయి", expired: "గడువు తీరింది", expiresToday: "నేడే గడువు",
    lightMode: "లైట్", darkMode: "డార్క్", language: "English",
    active: "చురుకుగా", inactive: "నిష్క్రియంగా",
    recentTrips: "ఇటీవలి ట్రిప్పులు", quickAlerts: "త్వరిత హెచ్చరికలు",
    viewAll: "అన్నీ చూడు", addNew: "కొత్తది జోడించు",
    income: "ఆదాయం", profit: "లాభం",
    monthlyReport: "నెలవారీ వ్యాపార నివేదిక", vehicleReport: "వాహన వారీ నివేదిక",
    expenseReport: "ఖర్చుల నివేదిక", profitReport: "లాభ & నష్ట నివేదిక",
    reportFor: "నివేదిక కోసం", selectMonth: "నెల ఎంచుకోండి",
    generateReport: "నివేదిక రూపొందించు",
    invoiceTitle: "ట్రాన్స్‌పోర్ట్ ఇన్‌వాయిస్", selectTrip: "ట్రిప్ ఎంచుకోండి",
    invoiceNo: "ఇన్‌వాయిస్ నం", billTo: "బిల్లు కు",
    shipFrom: "ఎక్కడ నుండి", shipTo: "ఎక్కడకు",
    goodsDetails: "సరుకు వివరాలు", charges: "చార్జీల వివరాలు",
    grandTotal: "మొత్తం మొత్తం", authorizedSign: "అధికారిక సంతకం",
    printInvoice: "ఇన్‌వాయిస్ ప్రింట్ చేయి",
    attendance: "హాజరు", bataHistory: "బత్తా చరిత్ర",
    totalBata: "చెల్లించిన మొత్తం బత్తా", expiryStatus: "గడువు స్థితి",
    urgent: "అత్యవసరం", warning: "హెచ్చరిక", ok: "సరే",
    noPendingAlerts: "పెండింగ్ హెచ్చరికలు లేవు! అన్ని పత్రాలు తాజాగా ఉన్నాయి.",
    dieselPerKm: "డీజిల్/KM", kmDriven: "KM నడిపారు",
    weight: "బరువు", route: "మార్గం",
    kmField: "KM నడిపారు", kmDrivenLabel: "KM నడిపారు (ఐచ్ఛికం)",
    searchFilter: "వెతకండి & వడపోత", clearFilter: "తొలగించు",
    exportExcel: "Excel ఎగుమతి", downloadPDF: "PDF డౌన్‌లోడ్",
    tripSummary: "ట్రిప్ సారాంశం", expenseSummary: "ఖర్చు సారాంశం",
    vehicleSummary: "వాహన సారాంశం", driverSummary: "డ్రైవర్ సారాంశం",
    totalRecords: "మొత్తం రికార్డులు", avgProfit: "సరాసరి ట్రిప్ లాభం",
    bestTrip: "అత్యుత్తమ ట్రిప్", worstTrip: "నష్ట ట్రిప్",
    netBalance: "నికర బ్యాలెన్స్", cashflow: "నగదు ప్రవాహం",
    markAttendance: "హాజరు గుర్తించు", present: "హాజరు", absent: "గైర్హాజరు",
    payAdvance: "అడ్వాన్స్ చెల్లించు", advanceHistory: "అడ్వాన్స్ చరిత్ర",
    kmTracking: "KM ట్రాకింగ్", fuelEfficiency: "ఇంధన సామర్థ్యం",
    perKm: "కి.మీ కి ఖర్చు", totalKm: "మొత్తం కి.మీ",
    settings: "సెట్టింగ్స్", language2: "భాష", theme: "థీమ్",
    companyName: "సంస్థ పేరు", companyPhone: "ఫోన్", companyAddress: "చిరునామా",
    saveSettings: "సెట్టింగ్స్ సేవ్ చేయి",
  }
};

/* ═══════════════════════════════════════════════
   SAMPLE DATA
═══════════════════════════════════════════════ */
const INIT_TRIPS = [
  { id:1, date:"2024-05-20", vehicle:"AP 16 T 8520", driver:"రమేష్ కుమార్", customer:"Sri Ram Traders", goodsType:"Cement Bags", weight:8000, pickup:"Guntur", destination:"Hyderabad", income:18000, diesel:3500, toll:800, bata:1500, loading:600, other:200, km:320 },
  { id:2, date:"2024-05-18", vehicle:"AP 16 T 9841", driver:"సురేష్ రెడ్డి", customer:"Bharat Steels", goodsType:"Steel Rods", weight:10000, pickup:"Vijayawada", destination:"Chennai", income:25000, diesel:5200, toll:1200, bata:2000, loading:800, other:300, km:680 },
  { id:3, date:"2024-05-14", vehicle:"AP 16 T 8520", driver:"రమేష్ కుమార్", customer:"Krishna Rice Mill", goodsType:"Rice Bags", weight:9000, pickup:"Nellore", destination:"Bengaluru", income:22000, diesel:4800, toll:1000, bata:1800, loading:700, other:150, km:580 },
  { id:4, date:"2024-05-10", vehicle:"AP 16 T 9841", driver:"సురేష్ రెడ్డి", customer:"Pavan Pharma", goodsType:"Medicine Boxes", weight:5000, pickup:"Vizag", destination:"Pune", income:32000, diesel:7000, toll:1800, bata:2500, loading:1000, other:400, km:1200 },
  { id:5, date:"2024-04-28", vehicle:"AP 16 T 8520", driver:"రమేష్ కుమార్", customer:"Sai Textiles", goodsType:"Cloth Bales", weight:6000, pickup:"Tirupati", destination:"Mumbai", income:35000, diesel:8000, toll:2000, bata:2500, loading:1200, other:500, km:1450 },
  { id:6, date:"2024-04-20", vehicle:"AP 16 T 9841", driver:"సురేష్ రెడ్డి", customer:"Raju Agro", goodsType:"Cotton Bags", weight:9500, pickup:"Kurnool", destination:"Delhi", income:45000, diesel:10000, toll:2500, bata:3000, loading:1500, other:600, km:1900 },
  { id:7, date:"2024-04-10", vehicle:"AP 16 T 8520", driver:"రమేష్ కుమార్", customer:"Lakshmi Foods", goodsType:"Food Grains", weight:8500, pickup:"Kakinada", destination:"Bengaluru", income:20000, diesel:4500, toll:900, bata:1600, loading:650, other:200, km:590 },
  { id:8, date:"2024-03-25", vehicle:"AP 16 T 9841", driver:"సురేష్ రెడ్డి", customer:"Star Cement", goodsType:"Cement Bags", weight:10000, pickup:"Vijayawada", destination:"Hyderabad", income:16000, diesel:3200, toll:700, bata:1400, loading:550, other:150, km:290 },
  { id:9, date:"2024-03-18", vehicle:"AP 16 T 8520", driver:"రమేష్ కుమార్", customer:"Durga Traders", goodsType:"Plastic Goods", weight:4500, pickup:"Guntur", destination:"Bengaluru", income:18500, diesel:4200, toll:850, bata:1600, loading:700, other:180, km:560 },
  { id:10, date:"2024-03-10", vehicle:"AP 16 T 9841", driver:"సురేష్ రెడ్డి", customer:"AP Constructions", goodsType:"Iron Bars", weight:11000, pickup:"Vizag", destination:"Hyderabad", income:19000, diesel:3800, toll:750, bata:1500, loading:600, other:200, km:580 },
];

const INIT_EXPENSES = [
  { id:1, date:"2024-05-20", category:"Diesel", amount:3500, description:"Diesel fill - Hyderabad trip", vehicle:"AP 16 T 8520" },
  { id:2, date:"2024-05-18", category:"Diesel", amount:5200, description:"Diesel fill - Chennai trip", vehicle:"AP 16 T 9841" },
  { id:3, date:"2024-05-15", category:"Repairs", amount:5000, description:"Brake pad replacement", vehicle:"AP 16 T 9841" },
  { id:4, date:"2024-05-10", category:"EMI", amount:22000, description:"Monthly vehicle EMI - May", vehicle:"AP 16 T 8520" },
  { id:5, date:"2024-05-10", category:"EMI", amount:18000, description:"Monthly vehicle EMI - May", vehicle:"AP 16 T 9841" },
  { id:6, date:"2024-05-12", category:"Driver Salary", amount:15000, description:"May salary - Ramesh Kumar", vehicle:"AP 16 T 8520" },
  { id:7, date:"2024-05-12", category:"Driver Salary", amount:14000, description:"May salary - Suresh Reddy", vehicle:"AP 16 T 9841" },
  { id:8, date:"2024-05-16", category:"Tire", amount:8000, description:"2 front tires replaced", vehicle:"AP 16 T 9841" },
  { id:9, date:"2024-05-18", category:"Servicing", amount:3500, description:"Regular service + oil change", vehicle:"AP 16 T 8520" },
  { id:10, date:"2024-04-10", category:"Insurance", amount:12000, description:"Annual insurance premium", vehicle:"AP 16 T 8520" },
  { id:11, date:"2024-04-25", category:"Permit", amount:4500, description:"All-India permit renewal", vehicle:"AP 16 T 9841" },
  { id:12, date:"2024-04-05", category:"Parking", amount:500, description:"Truck parking - Hyderabad", vehicle:"AP 16 T 8520" },
  { id:13, date:"2024-03-20", category:"Police Fine", amount:2000, description:"Minor traffic violation", vehicle:"AP 16 T 9841" },
];

const INIT_VEHICLES = [
  { id:1, number:"AP 16 T 8520", model:"Eicher 1114 DCM", year:2021, color:"Orange", insuranceExpiry:"2025-01-15", permitExpiry:"2024-07-20", pollutionExpiry:"2024-08-10", serviceDue:"2024-06-15", emi:22000, status:"active", totalKm:85400 },
  { id:2, number:"AP 16 T 9841", model:"Eicher 1114 DCM", year:2022, color:"White", insuranceExpiry:"2024-12-30", permitExpiry:"2024-06-05", pollutionExpiry:"2025-02-28", serviceDue:"2024-07-01", emi:18000, status:"active", totalKm:62100 },
];

const INIT_DRIVERS = [
  { id:1, name:"రమేష్ కుమార్", nameEn:"Ramesh Kumar", phone:"9876543210", salary:15000, advance:5000, license:"AP14 20103456", vehicle:"AP 16 T 8520", status:"active", joinDate:"2022-03-01", bata:12500,
    attendance:{ "2024-05-01":"present","2024-05-02":"present","2024-05-03":"absent","2024-05-06":"present","2024-05-07":"present" },
    advanceHistory:[{ date:"2024-04-15", amount:2000, reason:"Personal" },{ date:"2024-05-01", amount:3000, reason:"Emergency" }]
  },
  { id:2, name:"సురేష్ రెడ్డి", nameEn:"Suresh Reddy", phone:"9898765432", salary:14000, advance:0, license:"AP15 20204567", vehicle:"AP 16 T 9841", status:"active", joinDate:"2023-01-15", bata:15800,
    attendance:{ "2024-05-01":"present","2024-05-02":"present","2024-05-06":"present","2024-05-07":"absent" },
    advanceHistory:[]
  },
];

const MONTHLY_CHART = [
  { month:"Jan", income:85000, expenses:62000, profit:23000, diesel:18000 },
  { month:"Feb", income:92000, expenses:67000, profit:25000, diesel:19500 },
  { month:"Mar", income:78000, expenses:58000, profit:20000, diesel:16000 },
  { month:"Apr", income:105000, expenses:72000, profit:33000, diesel:22000 },
  { month:"May", income:112000, expenses:89000, profit:23000, diesel:28500 },
];

const EXP_CATEGORIES = ["Diesel","Repairs","Tire","Insurance","EMI","Driver Salary","Parking","Police Fine","Permit","Servicing","Other"];
const VEHICLES_LIST = ["AP 16 T 8520","AP 16 T 9841"];
const DRIVERS_LIST = ["రమేష్ కుమార్","సురేష్ రెడ్డి"];

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const fmt = (n) => `₹${Number(n||0).toLocaleString("en-IN")}`;
const tripProfit = (t) => t.income - (t.diesel + t.toll + t.bata + t.loading + t.other);
const getDaysUntil = (dateStr) => Math.ceil((new Date(dateStr) - new Date()) / 86400000);
const fmtDate = (d) => { if (!d) return ""; return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }); };
const getMonthData = (trips, expenses) => {
  const now = new Date(); const mo = now.getMonth(); const yr = now.getFullYear();
  const mTrips = trips.filter(t=>{ const d=new Date(t.date); return d.getMonth()===mo&&d.getFullYear()===yr; });
  const mExp = expenses.filter(e=>{ const d=new Date(e.date); return d.getMonth()===mo&&d.getFullYear()===yr; });
  const income = mTrips.reduce((s,t)=>s+t.income,0);
  const tripExp = mTrips.reduce((s,t)=>s+t.diesel+t.toll+t.bata+t.loading+t.other,0);
  const standaloneExp = mExp.reduce((s,e)=>s+e.amount,0);
  const emi = mExp.filter(e=>e.category==="EMI").reduce((s,e)=>s+e.amount,0);
  const diesel = mTrips.reduce((s,t)=>s+t.diesel,0)+mExp.filter(e=>e.category==="Diesel").reduce((s,e)=>s+e.amount,0);
  return { income, totalExp:tripExp+standaloneExp, profit:income-(tripExp+standaloneExp), emi, diesel };
};
let nextId = 200;
const uid = () => nextId++;

/* ═══════════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
═══════════════════════════════════════════════ */
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const colors = { success:"#10B981", error:"#EF4444", info:"#3B82F6", warning:"#F59E0B" };
  const icons = { success:"✅", error:"❌", info:"ℹ️", warning:"⚠️" };
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, background:"#1E293B", border:`1px solid ${colors[type]||colors.info}`, borderRadius:12, padding:"14px 20px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 20px 60px rgba(0,0,0,0.5)", maxWidth:320, animation:"slideRight .3s ease" }}>
      <span style={{ fontSize:20 }}>{icons[type]||icons.info}</span>
      <span style={{ fontSize:14, color:"#E2E8F0", fontWeight:500 }}>{message}</span>
      <button onClick={onClose} style={{ background:"none", border:"none", color:"#94A3B8", cursor:"pointer", fontSize:16, marginLeft:"auto" }}>✕</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════ */
function Modal({ open, onClose, title, children, th, wide }) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:200, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"20px 16px", overflowY:"auto" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:th.card, borderRadius:16, border:`1px solid ${th.cardBorder}`, width:"100%", maxWidth:wide?740:580, boxShadow:"0 30px 80px rgba(0,0,0,0.5)" }} className="fade-in">
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${th.divider}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h3 style={{ fontSize:17, fontWeight:700, color:th.text }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:th.textMuted, cursor:"pointer", fontSize:20, lineHeight:1 }}>✕</button>
        </div>
        <div style={{ padding:"22px" }}>{children}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FORM HELPERS
═══════════════════════════════════════════════ */
function FormGroup({ label, children, col }) {
  return (
    <div style={{ marginBottom:14, gridColumn:col }}>
      <label style={{ fontSize:12, fontWeight:600, color:"#7A9BB5", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:.4 }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle = (th) => ({ width:"100%", padding:"10px 13px", borderRadius:8, border:`1.5px solid ${th.inputBorder}`, background:th.input, color:th.text, fontSize:14, outline:"none", transition:"border .2s" });
const selectStyle = (th) => ({ ...inputStyle(th), cursor:"pointer" });
const btnStyle = (color, outline=false, small=false) => ({ padding:small?"7px 14px":"10px 20px", borderRadius:9, border:outline?`1.5px solid ${color}`:"none", background:outline?"transparent":color, color:outline?color:"#fff", fontWeight:700, fontSize:small?12:14, cursor:"pointer", transition:"all .15s", display:"inline-flex", alignItems:"center", gap:6 });

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */
function StatCard({ label, value, icon, color, sub, trend }) {
  return (
    <div style={{ background:color+"11", borderRadius:14, padding:"18px 20px", border:`1px solid ${color}33`, position:"relative", overflow:"hidden" }} className="fade-in">
      <div style={{ position:"absolute", top:-10, right:-10, width:68, height:68, borderRadius:"50%", background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{icon}</div>
      <div style={{ fontSize:11, color:color, fontWeight:700, textTransform:"uppercase", letterSpacing:.6, marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:800, color:color, lineHeight:1.1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:`${color}99`, marginTop:5 }}>{sub}</div>}
      {trend!==undefined && <div style={{ fontSize:11, marginTop:5, color:trend>=0?"#10B981":"#EF4444", fontWeight:600 }}>{trend>=0?"▲":"▼"} {Math.abs(trend)}% vs last month</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════ */
function LoginPage({ onLogin, t, dark, setDark, lang, setLang }) {
  const th = makeTheme(dark);
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const inp = { width:"100%", padding:"12px 16px", borderRadius:10, border:`1.5px solid ${th.inputBorder}`, background:th.input, color:th.text, fontSize:15, outline:"none" };
  const handleLogin = () => {
    if (!u||!p) { setErr("Please enter both fields"); return; }
    const creds = { admin:"admin123", father:"father123", son:"son123" };
    if (creds[u]===p) { setLoading(true); setTimeout(()=>onLogin(u), 1200); }
    else setErr("Invalid credentials. Try admin / admin123");
  };
  return (
    <div style={{ minHeight:"100vh", background:dark?"#071020":"#0F2A4A", display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:-100, right:-100, width:400, height:400, borderRadius:"50%", background:"rgba(249,115,22,0.08)" }}/>
        <div style={{ position:"absolute", bottom:-150, left:-100, width:500, height:500, borderRadius:"50%", background:"rgba(59,130,246,0.06)" }}/>
        <svg style={{ position:"absolute", bottom:20, right:20, opacity:.06 }} width="600" height="200" viewBox="0 0 600 200">
          <rect x="10" y="80" width="380" height="90" rx="8" fill="white"/>
          <rect x="390" y="50" width="180" height="120" rx="8" fill="white"/>
          <circle cx="80" cy="178" r="22" fill="white"/><circle cx="280" cy="178" r="22" fill="white"/>
          <circle cx="480" cy="178" r="22" fill="white"/><circle cx="540" cy="178" r="22" fill="white"/>
        </svg>
      </div>
      <div style={{ background:dark?"rgba(22,34,51,0.97)":"rgba(255,255,255,0.97)", borderRadius:20, padding:"40px 36px", width:"100%", maxWidth:420, boxShadow:"0 25px 60px rgba(0,0,0,0.4)", border:`1px solid ${th.cardBorder}` }} className="fade-in">
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg,#F97316,#C25A00)", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🚚</div>
          <h1 style={{ fontSize:22, fontWeight:800, color:th.accent }}>{t.appName}</h1>
          <p style={{ fontSize:13, color:th.textMuted, marginTop:4 }}>{t.appTagline}</p>
        </div>
        <h2 style={{ fontSize:18, fontWeight:700, color:th.text, marginBottom:20, textAlign:"center" }}>{t.loginWelcome}</h2>
        {err && <div style={{ background:th.dangerBg, border:`1px solid ${th.danger}`, borderRadius:8, padding:"10px 14px", marginBottom:16, color:th.danger, fontSize:13 }}>⚠ {err}</div>}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:13, color:th.textMuted, display:"block", marginBottom:6, fontWeight:600 }}>{t.username}</label>
          <input value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={inp} placeholder="admin" />
        </div>
        <div style={{ marginBottom:22 }}>
          <label style={{ fontSize:13, color:th.textMuted, display:"block", marginBottom:6, fontWeight:600 }}>{t.password}</label>
          <input type="password" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={inp} placeholder="••••••••" />
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ width:"100%", padding:13, borderRadius:10, background:"linear-gradient(135deg,#F97316,#C25A00)", border:"none", color:"#fff", fontWeight:700, fontSize:16, cursor:loading?"wait":"pointer", opacity:loading?.8:1 }}>
          {loading?"⏳ Signing in...":`🔑 ${t.loginBtn}`}
        </button>
        <p style={{ textAlign:"center", fontSize:12, color:th.textMuted, marginTop:16 }}>
          🔒 {t.loginHint}<br/>
          <span style={{ opacity:.6 }}>admin / admin123 &nbsp;|&nbsp; father / father123 &nbsp;|&nbsp; son / son123</span>
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:20 }}>
          <button onClick={()=>setDark(!dark)} style={{ background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"6px 14px", color:th.textMuted, cursor:"pointer", fontSize:12 }}>{dark?"☀️ Light":"🌙 Dark"}</button>
          <button onClick={()=>setLang(lang==="en"?"te":"en")} style={{ background:th.accent, border:"none", borderRadius:8, padding:"6px 14px", color:"#fff", cursor:"pointer", fontSize:12, fontWeight:600 }}>{t.language}</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id:"dashboard", icon:"📊" }, { id:"trips", icon:"🚛" }, { id:"expenses", icon:"💸" },
  { id:"vehicles", icon:"🚚" }, { id:"drivers", icon:"👤" }, { id:"analytics", icon:"📈" },
  { id:"notifications", icon:"🔔" }, { id:"reports", icon:"📋" }, { id:"invoice", icon:"🧾" },
  { id:"settings", icon:"⚙️" },
];

function Sidebar({ t, th, active, setActive, isOpen, onClose, onLogout, lang, setLang, dark, setDark, alertCount }) {
  return (
    <div style={{ position:"fixed", top:0, left:0, height:"100vh", width:240, background:th.sidebar, zIndex:50, display:"flex", flexDirection:"column", transition:"transform .25s ease", transform:isOpen?"translateX(0)":"translateX(-100%)", boxShadow:"4px 0 20px rgba(0,0,0,0.3)" }}>
      <div style={{ padding:"20px 16px", borderBottom:`1px solid rgba(255,255,255,0.07)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#F97316,#C25A00)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🚚</div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"#fff", lineHeight:1.2 }}>SVT</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)" }}>{lang==="en"?"Transports":"ట్రాన్స్‌పోర్ట్"}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:18 }}>✕</button>
        </div>
      </div>
      <nav style={{ flex:1, overflowY:"auto", padding:"10px 8px" }}>
        {NAV_ITEMS.map(item => {
          const isAct = active===item.id;
          return (
            <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:10, border:"none", background:isAct?"rgba(249,115,22,0.18)":"transparent", color:isAct?"#F97316":"rgba(255,255,255,0.55)", cursor:"pointer", textAlign:"left", marginBottom:2, fontWeight:isAct?700:400, fontSize:14, transition:"all .15s", borderLeft:isAct?"3px solid #F97316":"3px solid transparent", position:"relative" }}>
              <span style={{ fontSize:17 }}>{item.icon}</span>
              <span>{t[item.id]}</span>
              {item.id==="notifications"&&alertCount>0&&<span style={{ marginLeft:"auto", background:"#EF4444", color:"#fff", borderRadius:"50%", fontSize:10, fontWeight:800, width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center" }}>{alertCount}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"12px 8px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={()=>setLang(lang==="en"?"te":"en")} style={{ width:"100%", padding:"9px 14px", borderRadius:8, background:"rgba(249,115,22,0.15)", border:"1px solid rgba(249,115,22,0.3)", color:"#F97316", cursor:"pointer", fontSize:13, fontWeight:600, marginBottom:6, textAlign:"center" }}>🌐 {t.language}</button>
        <button onClick={()=>setDark(!dark)} style={{ width:"100%", padding:"9px 14px", borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:13, marginBottom:6, textAlign:"center" }}>{dark?"☀️ Light Mode":"🌙 Dark Mode"}</button>
        <button onClick={onLogout} style={{ width:"100%", padding:"9px 14px", borderRadius:8, background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)", color:"#EF4444", cursor:"pointer", fontSize:13, fontWeight:600, textAlign:"center" }}>🚪 {t.logout}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD VIEW
═══════════════════════════════════════════════ */
function DashboardView({ t, th, trips, expenses, vehicles, setActive }) {
  const md = useMemo(()=>getMonthData(trips,expenses),[trips,expenses]);
  const recent = useMemo(()=>[...trips].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5),[trips]);
  const allDocs = [];
  vehicles.forEach(v=>{
    allDocs.push({ label:`${v.number} - Insurance`, date:v.insuranceExpiry });
    allDocs.push({ label:`${v.number} - Permit`, date:v.permitExpiry });
    allDocs.push({ label:`${v.number} - Pollution`, date:v.pollutionExpiry });
    allDocs.push({ label:`${v.number} - Service`, date:v.serviceDue });
  });
  const urgentAlerts = allDocs.filter(d=>getDaysUntil(d.date)<=30).sort((a,b)=>getDaysUntil(a.date)-getDaysUntil(b.date));

  return (
    <div className="fade-in">
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:th.text }}>{t.dashboard}</h2>
        <p style={{ fontSize:13, color:th.textMuted }}>{t.thisMonth} • {new Date().toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:20 }}>
        <StatCard label={t.totalIncome} value={fmt(md.income)} icon="💰" color={th.success} trend={8} />
        <StatCard label={t.totalExpenses} value={fmt(md.totalExp)} icon="📤" color={th.danger} trend={-3} />
        <StatCard label={t.netProfit} value={fmt(md.profit)} icon="📈" color={md.profit>=0?th.accent:th.danger} />
        <StatCard label={t.pendingEMI} value={fmt(md.emi)} icon="🏦" color={th.info} />
        <StatCard label={t.dieselExpense} value={fmt(md.diesel)} icon="⛽" color={th.warning} />
      </div>
      {/* Vehicle Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:14, marginBottom:18 }}>
        {vehicles.map((v,i)=>{
          const vt = trips.filter(tr=>tr.vehicle===v.number);
          const vp = vt.reduce((s,tr)=>s+tripProfit(tr),0);
          const vi = vt.reduce((s,tr)=>s+tr.income,0);
          const accent = i===0?th.accent:th.info;
          return (
            <div key={v.id} style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, padding:"18px 20px", borderTop:`3px solid ${accent}` }} className="fade-in">
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <span style={{ fontSize:24 }}>🚚</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:th.text }}>{v.number}</div>
                  <div style={{ fontSize:11, color:th.textMuted }}>{v.model}</div>
                </div>
                <div style={{ marginLeft:"auto", background:th.successBg, color:th.success, fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:6 }}>{t.active}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[{l:t.totalTrips,v:vt.length},{l:t.totalEarnings,v:fmt(vi)},{l:t.vehicleProfit,v:fmt(vp)}].map(s=>(
                  <div key={s.l} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:10, color:th.textMuted, marginBottom:2 }}>{s.l}</div>
                    <div style={{ fontWeight:700, color:accent, fontSize:13 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Recent + Alerts */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14, marginBottom:14 }}>
        <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:th.text }}>🚛 {t.recentTrips}</h3>
            <button onClick={()=>setActive("trips")} style={{ fontSize:12, color:th.accent, background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>{t.viewAll} →</button>
          </div>
          {recent.map(tr=>(
            <div key={tr.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${th.divider}` }}>
              <div style={{ width:36, height:36, borderRadius:10, background:tr.vehicle===vehicles[0]?.number?"rgba(249,115,22,0.15)":"rgba(59,130,246,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🚛</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tr.customer}</div>
                <div style={{ fontSize:11, color:th.textMuted }}>{tr.pickup} → {tr.destination}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:tripProfit(tr)>=0?th.success:th.danger }}>{fmt(tripProfit(tr))}</div>
                <div style={{ fontSize:10, color:th.textMuted }}>{fmtDate(tr.date)}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:th.text }}>🔔 {t.quickAlerts}</h3>
            <button onClick={()=>setActive("notifications")} style={{ fontSize:12, color:th.accent, background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>{t.viewAll} →</button>
          </div>
          {urgentAlerts.length===0
            ? <div style={{ textAlign:"center", padding:"20px 0", color:th.success }}>✅ {t.noPendingAlerts}</div>
            : urgentAlerts.slice(0,5).map((a,i)=>{
                const days = getDaysUntil(a.date);
                const color = days<0?th.danger:days<=7?th.danger:th.warning;
                const bg = days<0?th.dangerBg:days<=7?th.dangerBg:th.warningBg;
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:9, background:bg, marginBottom:8 }}>
                    <span style={{ fontSize:16 }}>{days<0?"❌":days<=7?"🚨":"⚠️"}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color }}>{a.label}</div>
                      <div style={{ fontSize:11, color }}>{days<0?t.expired:days===0?t.expiresToday:`${days} ${t.daysLeft}`}</div>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>
      {/* Mini chart */}
      <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, padding:"18px 20px" }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:th.text, marginBottom:14 }}>📊 {t.monthlyProfits}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={MONTHLY_CHART}>
            <defs>
              <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#F97316" stopOpacity={0}/></linearGradient>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={th.chartGrid}/>
            <XAxis dataKey="month" tick={{ fontSize:12, fill:th.textMuted }}/>
            <YAxis tick={{ fontSize:11, fill:th.textMuted }} tickFormatter={v=>`₹${v/1000}k`}/>
            <Tooltip formatter={(v,n)=>[fmt(v),n]} contentStyle={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:8, color:th.text }}/>
            <Area type="monotone" dataKey="income" stroke="#F97316" fill="url(#ig)" strokeWidth={2} name="Income"/>
            <Area type="monotone" dataKey="profit" stroke="#10B981" fill="url(#pg)" strokeWidth={2} name="Profit"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TRIPS VIEW
═══════════════════════════════════════════════ */
function TripsView({ t, th, trips, setTrips, toast }) {
  const empty = { date:"", vehicle:VEHICLES_LIST[0], driver:DRIVERS_LIST[0], customer:"", goodsType:"", weight:"", pickup:"", destination:"", income:"", diesel:"", toll:"", bata:"", loading:"", other:"", km:"" };
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterVeh, setFilterVeh] = useState("all");
  const [filterMonth, setFilterMonth] = useState("");
  const [delId, setDelId] = useState(null);

  const n = v=>Number(v)||0;
  const calcProfit = f=>n(f.income)-(n(f.diesel)+n(f.toll)+n(f.bata)+n(f.loading)+n(f.other));

  const filtered = useMemo(()=>trips.filter(tr=>{
    const ms = search.toLowerCase();
    const matchS = !search||(tr.customer+tr.pickup+tr.destination+tr.goodsType+tr.driver).toLowerCase().includes(ms);
    const matchV = filterVeh==="all"||tr.vehicle===filterVeh;
    const matchM = !filterMonth||tr.date.startsWith(filterMonth);
    return matchS&&matchV&&matchM;
  }).sort((a,b)=>new Date(b.date)-new Date(a.date)),[trips,search,filterVeh,filterMonth]);

  const totalIncome = filtered.reduce((s,tr)=>s+tr.income,0);
  const totalProfit = filtered.reduce((s,tr)=>s+tripProfit(tr),0);
  const totalKm = filtered.reduce((s,tr)=>s+(tr.km||0),0);

  const openAdd = ()=>{ setForm({...empty,date:new Date().toISOString().slice(0,10)}); setEditId(null); setShowModal(true); };
  const openEdit = tr=>{ setForm({...tr,weight:String(tr.weight),income:String(tr.income),diesel:String(tr.diesel),toll:String(tr.toll),bata:String(tr.bata),loading:String(tr.loading),other:String(tr.other),km:String(tr.km||"")}); setEditId(tr.id); setShowModal(true); };
  const saveTrip = ()=>{
    if(!form.date||!form.customer||!form.income) return;
    const entry = {...form, id:editId||uid(), weight:n(form.weight), income:n(form.income), diesel:n(form.diesel), toll:n(form.toll), bata:n(form.bata), loading:n(form.loading), other:n(form.other), km:n(form.km)};
    setTrips(editId?trips.map(tr=>tr.id===editId?entry:tr):[entry,...trips]);
    setShowModal(false);
    toast(editId?"Trip updated successfully!":"Trip added successfully!", "success");
  };
  const deleteTrip = id=>{ setTrips(trips.filter(tr=>tr.id!==id)); setDelId(null); toast("Trip deleted","error"); };

  const exportCSV = ()=>{
    const rows = [["Date","Vehicle","Driver","Customer","Route","Goods","Weight(kg)","Income","Diesel","Toll","Bata","Loading","Other","Profit","KM"],...filtered.map(tr=>[tr.date,tr.vehicle,tr.driver,tr.customer,`${tr.pickup}-${tr.destination}`,tr.goodsType,tr.weight,tr.income,tr.diesel,tr.toll,tr.bata,tr.loading,tr.other,tripProfit(tr),tr.km||0])];
    const csv = rows.map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download="svt_trips.csv"; a.click();
    toast("Trips exported to CSV!","success");
  };

  const F = (key, label, type="text", opts=null) => (
    <FormGroup label={label}>
      {opts ? <select value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={selectStyle(th)}>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>
             : <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={inputStyle(th)}/>}
    </FormGroup>
  );

  return (
    <div className="fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:800, color:th.text }}>🚛 {t.trips}</h2>
          <p style={{ fontSize:13, color:th.textMuted }}>{filtered.length} records • {fmt(totalIncome)} earned • {fmt(totalProfit)} profit • {totalKm.toLocaleString()} km</p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={exportCSV} style={{ ...btnStyle(th.success,true,true) }}>📊 {t.exportExcel}</button>
          <button onClick={openAdd} style={{ ...btnStyle(th.accent) }}>➕ {t.addTrip}</button>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:16 }}>
        {[
          { l:t.totalRecords, v:filtered.length, c:th.info, i:"📋" },
          { l:t.totalIncome, v:fmt(totalIncome), c:th.success, i:"💰" },
          { l:t.netProfit, v:fmt(totalProfit), c:totalProfit>=0?th.accent:th.danger, i:"📈" },
          { l:t.kmDriven, v:`${totalKm.toLocaleString()} km`, c:th.warning, i:"🛣️" },
        ].map(s=>(
          <div key={s.l} style={{ background:s.c+"11", border:`1px solid ${s.c}33`, borderRadius:12, padding:"12px 14px", textAlign:"center" }}>
            <div style={{ fontSize:20 }}>{s.i}</div>
            <div style={{ fontSize:11, color:s.c, fontWeight:600, marginTop:4 }}>{s.l}</div>
            <div style={{ fontSize:16, fontWeight:800, color:s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{ ...inputStyle(th), maxWidth:240 }}/>
        <select value={filterVeh} onChange={e=>setFilterVeh(e.target.value)} style={{ ...selectStyle(th), width:"auto" }}>
          <option value="all">{t.all} Vehicles</option>
          {VEHICLES_LIST.map(v=><option key={v} value={v}>{v}</option>)}
        </select>
        <input type="month" value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ ...inputStyle(th), width:"auto" }}/>
        {(search||filterVeh!=="all"||filterMonth)&&<button onClick={()=>{setSearch("");setFilterVeh("all");setFilterMonth("");}} style={{ ...btnStyle(th.danger,true,true) }}>✕ {t.clearFilter}</button>}
      </div>

      {/* Table */}
      <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:th.input }}>
                {["Date","Vehicle","Route","Customer","Goods","Income","Expenses","Profit","KM","Actions"].map(h=>(
                  <th key={h} style={{ padding:"12px 14px", textAlign:"left", color:th.textMuted, fontWeight:700, whiteSpace:"nowrap", fontSize:12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={10} style={{ padding:30, textAlign:"center", color:th.textMuted }}>📭 {t.noData}</td></tr>
                : filtered.map(tr=>{
                  const tp = tripProfit(tr);
                  const totalExp = tr.diesel+tr.toll+tr.bata+tr.loading+tr.other;
                  return (
                    <tr key={tr.id} style={{ borderBottom:`1px solid ${th.divider}` }} onMouseEnter={e=>e.currentTarget.style.background=th.hover} onMouseLeave={e=>e.currentTarget.style.background=""}>
                      <td style={{ padding:"11px 14px", color:th.textMuted, whiteSpace:"nowrap" }}>{fmtDate(tr.date)}</td>
                      <td style={{ padding:"11px 14px" }}><span style={{ fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:5, background:tr.vehicle===VEHICLES_LIST[0]?"rgba(249,115,22,0.18)":"rgba(59,130,246,0.18)", color:tr.vehicle===VEHICLES_LIST[0]?th.accent:th.info }}>{tr.vehicle}</span></td>
                      <td style={{ padding:"11px 14px", color:th.text, whiteSpace:"nowrap" }}>{tr.pickup} → {tr.destination}</td>
                      <td style={{ padding:"11px 14px", color:th.text }}>{tr.customer}</td>
                      <td style={{ padding:"11px 14px", color:th.textMuted, whiteSpace:"nowrap" }}>{tr.goodsType} <span style={{ fontSize:10 }}>({tr.weight}kg)</span></td>
                      <td style={{ padding:"11px 14px", fontWeight:600, color:th.success, whiteSpace:"nowrap" }}>{fmt(tr.income)}</td>
                      <td style={{ padding:"11px 14px", color:th.danger, whiteSpace:"nowrap" }}>{fmt(totalExp)}</td>
                      <td style={{ padding:"11px 14px", fontWeight:700, color:tp>=0?th.success:th.danger, whiteSpace:"nowrap" }}>{fmt(tp)}</td>
                      <td style={{ padding:"11px 14px", color:th.textMuted, fontSize:12 }}>{tr.km||"-"}</td>
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={()=>openEdit(tr)} style={{ background:th.infoBg, border:"none", borderRadius:6, padding:"5px 10px", cursor:"pointer", color:th.info, fontSize:12 }}>✏️</button>
                          <button onClick={()=>setDelId(tr.id)} style={{ background:th.dangerBg, border:"none", borderRadius:6, padding:"5px 10px", cursor:"pointer", color:th.danger, fontSize:12 }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showModal} onClose={()=>setShowModal(false)} title={editId?t.editTrip:t.addTrip} th={th} wide>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
          {F("date",t.tripDate,"date")} {F("vehicle",t.vehicle,"text",VEHICLES_LIST)}
          {F("driver",t.driver,"text",DRIVERS_LIST)} {F("customer",t.customer)}
          {F("goodsType",t.goodsType)} {F("weight",t.goodsWeight,"number")}
          {F("pickup",t.pickup)} {F("destination",t.destination)}
          {F("income",t.tripIncome,"number")} {F("diesel",t.dieselCost,"number")}
          {F("toll",t.tollCharges,"number")} {F("bata",t.driverBata,"number")}
          {F("loading",t.loadingCharges,"number")} {F("other",t.otherExpenses,"number")}
          {F("km",t.kmDrivenLabel,"number")}
        </div>
        <div style={{ background:calcProfit(form)>=0?th.successBg:th.dangerBg, borderRadius:10, padding:"12px 16px", marginBottom:18 }}>
          <div style={{ fontSize:12, color:th.textMuted }}>{t.tripProfit}</div>
          <div style={{ fontSize:22, fontWeight:800, color:calcProfit(form)>=0?th.success:th.danger }}>{fmt(calcProfit(form))}</div>
          <div style={{ fontSize:11, color:th.textMuted }}>{t.totalTripExp}: {fmt(n(form.diesel)+n(form.toll)+n(form.bata)+n(form.loading)+n(form.other))}</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={saveTrip} style={btnStyle(th.accent)}>💾 {t.save}</button>
          <button onClick={()=>setShowModal(false)} style={btnStyle(th.textMuted,true)}>✕ {t.cancel}</button>
        </div>
      </Modal>

      <Modal open={!!delId} onClose={()=>setDelId(null)} title={t.confirm} th={th}>
        <p style={{ color:th.text, marginBottom:18 }}>⚠️ {t.confirmDelete}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>deleteTrip(delId)} style={btnStyle(th.danger)}>🗑️ {t.delete}</button>
          <button onClick={()=>setDelId(null)} style={btnStyle(th.textMuted,true)}>✕ {t.cancel}</button>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   EXPENSES VIEW
═══════════════════════════════════════════════ */
function ExpensesView({ t, th, expenses, setExpenses, toast }) {
  const empty = { date:"", category:EXP_CATEGORIES[0], amount:"", description:"", vehicle:VEHICLES_LIST[0] };
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterVeh, setFilterVeh] = useState("all");
  const [filterMonth, setFilterMonth] = useState("");
  const [delId, setDelId] = useState(null);

  const filtered = useMemo(()=>expenses.filter(e=>{
    const ms = search.toLowerCase();
    return (!search||(e.description+e.category).toLowerCase().includes(ms))&&(filterCat==="all"||e.category===filterCat)&&(filterVeh==="all"||e.vehicle===filterVeh)&&(!filterMonth||e.date.startsWith(filterMonth));
  }).sort((a,b)=>new Date(b.date)-new Date(a.date)),[expenses,search,filterCat,filterVeh,filterMonth]);

  const totalAmt = filtered.reduce((s,e)=>s+e.amount,0);
  const catColors = { Diesel:"#F97316",Repairs:"#EF4444",Tire:"#F59E0B",Insurance:"#3B82F6",EMI:"#8B5CF6","Driver Salary":"#10B981",Parking:"#14B8A6","Police Fine":"#EC4899",Permit:"#84CC16",Servicing:"#06B6D4",Other:"#94A3B8" };
  const catTotals = EXP_CATEGORIES.map(cat=>({ name:cat, value:filtered.filter(e=>e.category===cat).reduce((s,e)=>s+e.amount,0) })).filter(c=>c.value>0);

  const openAdd = ()=>{ setForm({...empty,date:new Date().toISOString().slice(0,10)}); setEditId(null); setShowModal(true); };
  const openEdit = e=>{ setForm({...e,amount:String(e.amount)}); setEditId(e.id); setShowModal(true); };
  const saveExp = ()=>{
    if(!form.date||!form.amount) return;
    const entry = {...form, id:editId||uid(), amount:Number(form.amount)||0};
    setExpenses(editId?expenses.map(e=>e.id===editId?entry:e):[entry,...expenses]);
    setShowModal(false);
    toast(editId?"Expense updated!":"Expense added!","success");
  };
  const delExp = id=>{ setExpenses(expenses.filter(e=>e.id!==id)); setDelId(null); toast("Expense deleted","error"); };

  const exportCSV = ()=>{
    const rows = [["Date","Category","Vehicle","Amount","Description"],...filtered.map(e=>[e.date,e.category,e.vehicle,e.amount,e.description])];
    const csv = rows.map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download="svt_expenses.csv"; a.click();
  };

  return (
    <div className="fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:800, color:th.text }}>💸 {t.expenses}</h2>
          <p style={{ fontSize:13, color:th.textMuted }}>{filtered.length} records • Total: {fmt(totalAmt)}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={exportCSV} style={{ ...btnStyle(th.success,true,true) }}>📊 {t.exportExcel}</button>
          <button onClick={openAdd} style={{ ...btnStyle(th.accent) }}>➕ {t.addExpense}</button>
        </div>
      </div>

      {/* Category chips */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
        {catTotals.map(c=>(
          <div key={c.name} onClick={()=>setFilterCat(filterCat===c.name?"all":c.name)} style={{ background:filterCat===c.name?catColors[c.name]+"33":th.card, border:`1px solid ${catColors[c.name]||th.accent}44`, borderRadius:8, padding:"5px 12px", display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:catColors[c.name]||th.accent, flexShrink:0 }}/>
            <span style={{ fontSize:12, color:th.textMuted }}>{c.name}:</span>
            <span style={{ fontSize:12, fontWeight:700, color:catColors[c.name]||th.accent }}>{fmt(c.value)}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{ ...inputStyle(th), maxWidth:220 }}/>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{ ...selectStyle(th), width:"auto" }}>
          <option value="all">{t.all}</option>
          {EXP_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterVeh} onChange={e=>setFilterVeh(e.target.value)} style={{ ...selectStyle(th), width:"auto" }}>
          <option value="all">{t.all} Vehicles</option>
          {VEHICLES_LIST.map(v=><option key={v} value={v}>{v}</option>)}
        </select>
        <input type="month" value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ ...inputStyle(th), width:"auto" }}/>
      </div>

      <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:th.input }}>
                {["Date","Category","Vehicle","Amount","Description",""].map(h=>(
                  <th key={h} style={{ padding:"12px 14px", textAlign:"left", color:th.textMuted, fontWeight:700, fontSize:12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={6} style={{ padding:30, textAlign:"center", color:th.textMuted }}>📭 {t.noData}</td></tr>
                : filtered.map(e=>(
                  <tr key={e.id} style={{ borderBottom:`1px solid ${th.divider}` }} onMouseEnter={ev=>ev.currentTarget.style.background=th.hover} onMouseLeave={ev=>ev.currentTarget.style.background=""}>
                    <td style={{ padding:"11px 14px", color:th.textMuted, whiteSpace:"nowrap" }}>{fmtDate(e.date)}</td>
                    <td style={{ padding:"11px 14px" }}><span style={{ fontSize:12, fontWeight:700, padding:"3px 8px", borderRadius:5, background:`${catColors[e.category]||th.accent}22`, color:catColors[e.category]||th.accent }}>{e.category}</span></td>
                    <td style={{ padding:"11px 14px", color:th.textMuted, fontSize:12 }}>{e.vehicle}</td>
                    <td style={{ padding:"11px 14px", fontWeight:700, color:th.danger, whiteSpace:"nowrap" }}>{fmt(e.amount)}</td>
                    <td style={{ padding:"11px 14px", color:th.textMuted }}>{e.description}</td>
                    <td style={{ padding:"11px 14px" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={()=>openEdit(e)} style={{ background:th.infoBg, border:"none", borderRadius:6, padding:"5px 10px", cursor:"pointer", color:th.info, fontSize:12 }}>✏️</button>
                        <button onClick={()=>setDelId(e.id)} style={{ background:th.dangerBg, border:"none", borderRadius:6, padding:"5px 10px", cursor:"pointer", color:th.danger, fontSize:12 }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={()=>setShowModal(false)} title={editId?t.editExpense:t.addExpense} th={th}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
          <FormGroup label={t.date}><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inputStyle(th)}/></FormGroup>
          <FormGroup label={t.category}><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={selectStyle(th)}>{EXP_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></FormGroup>
          <FormGroup label={t.amount}><input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} style={inputStyle(th)}/></FormGroup>
          <FormGroup label={t.vehicle}><select value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} style={selectStyle(th)}>{VEHICLES_LIST.map(v=><option key={v} value={v}>{v}</option>)}</select></FormGroup>
        </div>
        <FormGroup label={t.description}><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{ ...inputStyle(th), height:80, resize:"vertical" }}/></FormGroup>
        <div style={{ display:"flex", gap:10, marginTop:4 }}>
          <button onClick={saveExp} style={btnStyle(th.accent)}>💾 {t.save}</button>
          <button onClick={()=>setShowModal(false)} style={btnStyle(th.textMuted,true)}>✕ {t.cancel}</button>
        </div>
      </Modal>
      <Modal open={!!delId} onClose={()=>setDelId(null)} title={t.confirm} th={th}>
        <p style={{ color:th.text, marginBottom:18 }}>⚠️ {t.confirmDelete}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>delExp(delId)} style={btnStyle(th.danger)}>🗑️ {t.delete}</button>
          <button onClick={()=>setDelId(null)} style={btnStyle(th.textMuted,true)}>✕ {t.cancel}</button>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VEHICLES VIEW  (Add / Edit / Delete)
═══════════════════════════════════════════════ */
function VehiclesView({ t, th, vehicles, setVehicles, trips, expenses, toast }) {
  const ACCENT_COLORS = ["#F97316","#3B82F6","#10B981","#8B5CF6","#EC4899","#F59E0B"];
  const emptyVehicle = { number:"", model:"Eicher 1114 DCM", year:new Date().getFullYear(), color:"White", insuranceExpiry:"", permitExpiry:"", pollutionExpiry:"", serviceDue:"", emi:"", status:"active", totalKm:0 };
  const [showModal, setShowModal] = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState(emptyVehicle);
  const [delId,     setDelId]     = useState(null);

  const openAdd  = () => { setForm({...emptyVehicle}); setEditId(null); setShowModal(true); };
  const openEdit = v  => { setForm({...v, emi:String(v.emi), totalKm:String(v.totalKm)}); setEditId(v.id); setShowModal(true); };

  const saveVehicle = () => {
    if (!form.number.trim()) return;
    const entry = { ...form, id: editId||uid(), emi: Number(form.emi)||0, totalKm: Number(form.totalKm)||0 };
    if (editId) { setVehicles(vehicles.map(v => v.id===editId ? entry : v)); toast("Vehicle updated!", "success"); }
    else        { setVehicles([...vehicles, entry]); toast("Vehicle added!", "success"); }
    setShowModal(false);
  };

  const deleteVehicle = id => { setVehicles(vehicles.filter(v => v.id!==id)); setDelId(null); toast("Vehicle removed", "error"); };

  const DocRow = ({ label, date }) => {
    if (!date) return null;
    const days  = getDaysUntil(date);
    const color = days<0?th.danger:days<=30?th.warning:th.success;
    return (
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${th.divider}` }}>
        <span style={{ fontSize:13, color:th.textMuted }}>{label}</span>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:13, fontWeight:600, color }}>{days<0?"❌":days<=7?"🚨":days<=30?"⚠️":"✅"} {fmtDate(date)}</div>
          <div style={{ fontSize:11, color }}>{days<0?t.expired:days===0?t.expiresToday:`${days} ${t.daysLeft}`}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:800, color:th.text }}>🚚 {t.vehicles}</h2>
          <p style={{ fontSize:13, color:th.textMuted }}>{vehicles.length} vehicle{vehicles.length!==1?"s":""} registered</p>
        </div>
        <button onClick={openAdd} style={{ ...btnStyle(th.accent) }}>➕ Add Vehicle</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:18 }}>
        {vehicles.map((v,i)=>{
          const accent      = ACCENT_COLORS[i % ACCENT_COLORS.length];
          const vTrips      = trips.filter(tr=>tr.vehicle===v.number);
          const vIncome     = vTrips.reduce((s,tr)=>s+tr.income,0);
          const vTripExp    = vTrips.reduce((s,tr)=>s+tr.diesel+tr.toll+tr.bata+tr.loading+tr.other,0);
          const vStdExp     = expenses.filter(e=>e.vehicle===v.number).reduce((s,e)=>s+e.amount,0);
          const vProfit     = vIncome-vTripExp-vStdExp;
          const vKm         = vTrips.reduce((s,tr)=>s+(tr.km||0),0);
          const dieselTotal = vTrips.reduce((s,tr)=>s+tr.diesel,0);
          const fuelEff     = vKm>0?(dieselTotal/(vKm/100)).toFixed(1):"N/A";
          return (
            <div key={v.id} style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:16, overflow:"hidden" }}>
              <div style={{ background:`linear-gradient(135deg,${accent}22,${accent}08)`, borderBottom:`1px solid ${th.cardBorder}`, padding:"18px 20px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
                  <div style={{ fontSize:38 }}>🚚</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:19, fontWeight:800, color:accent }}>{v.number}</div>
                    <div style={{ fontSize:12, color:th.textMuted }}>{v.model} • {v.year} • {v.color}</div>
                  </div>
                  <div style={{ background:v.status==="active"?th.successBg:th.dangerBg, color:v.status==="active"?th.success:th.danger, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6 }}>
                    {v.status==="active"?t.active:t.inactive}
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>openEdit(v)} style={{ flex:1, background:th.infoBg, border:`1px solid ${th.info}44`, borderRadius:8, padding:"7px", cursor:"pointer", color:th.info, fontSize:13, fontWeight:600 }}>✏️ Edit Vehicle</button>
                  <button onClick={()=>setDelId(v.id)} style={{ background:th.dangerBg, border:`1px solid ${th.danger}44`, borderRadius:8, padding:"7px 14px", cursor:"pointer", color:th.danger, fontSize:13 }}>🗑️</button>
                </div>
              </div>
              <div style={{ padding:"18px 20px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
                  {[
                    {l:t.totalTrips,    v:vTrips.length,              c:accent},
                    {l:t.totalEarnings, v:fmt(vIncome),               c:th.success},
                    {l:t.vehicleProfit, v:fmt(vProfit),               c:vProfit>=0?th.success:th.danger},
                    {l:t.totalKm,       v:`${vKm.toLocaleString()} km`,c:th.warning},
                    {l:t.fuelEfficiency,v:`${fuelEff} L/100km`,       c:th.info},
                    {l:t.emiAmount,     v:fmt(v.emi),                 c:"#8B5CF6"},
                  ].map(s=>(
                    <div key={s.l} style={{ background:th.input, borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
                      <div style={{ fontSize:10, color:th.textMuted, marginBottom:2 }}>{s.l}</div>
                      <div style={{ fontSize:12, fontWeight:800, color:s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <h4 style={{ fontSize:11, fontWeight:700, color:th.textMuted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>{t.expiryStatus}</h4>
                <DocRow label={`🛡️ ${t.insuranceExpiry}`} date={v.insuranceExpiry}/>
                <DocRow label={`📜 ${t.permitExpiry}`}    date={v.permitExpiry}/>
                <DocRow label={`🌿 ${t.pollutionExpiry}`} date={v.pollutionExpiry}/>
                <DocRow label={`🔧 ${t.serviceDue}`}      date={v.serviceDue}/>
              </div>
            </div>
          );
        })}

        {/* Placeholder add card */}
        <div onClick={openAdd} style={{ background:th.card, border:`2px dashed ${th.cardBorder}`, borderRadius:16, minHeight:200, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, cursor:"pointer", opacity:.65, transition:"opacity .2s" }}
          onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.65}>
          <div style={{ fontSize:40 }}>➕</div>
          <div style={{ fontSize:14, fontWeight:700, color:th.textMuted }}>Add New Vehicle</div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal open={showModal} onClose={()=>setShowModal(false)} title={editId?"✏️ Edit Vehicle":"➕ Add New Vehicle"} th={th} wide>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
          <FormGroup label="Vehicle Number (e.g. AP 16 T 8520)">
            <input value={form.number} onChange={e=>setForm({...form,number:e.target.value.toUpperCase()})} style={inputStyle(th)} placeholder="AP 16 T 8520"/>
          </FormGroup>
          <FormGroup label={t.model}>
            <input value={form.model} onChange={e=>setForm({...form,model:e.target.value})} style={inputStyle(th)} placeholder="Eicher 1114 DCM"/>
          </FormGroup>
          <FormGroup label="Year">
            <input type="number" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} style={inputStyle(th)} placeholder="2022"/>
          </FormGroup>
          <FormGroup label="Color">
            <input value={form.color} onChange={e=>setForm({...form,color:e.target.value})} style={inputStyle(th)} placeholder="White"/>
          </FormGroup>
          <FormGroup label={`${t.emiAmount} (₹)`}>
            <input type="number" value={form.emi} onChange={e=>setForm({...form,emi:e.target.value})} style={inputStyle(th)} placeholder="20000"/>
          </FormGroup>
          <FormGroup label="Total KM Reading">
            <input type="number" value={form.totalKm} onChange={e=>setForm({...form,totalKm:e.target.value})} style={inputStyle(th)} placeholder="55000"/>
          </FormGroup>
          <FormGroup label={`🛡️ ${t.insuranceExpiry}`}>
            <input type="date" value={form.insuranceExpiry} onChange={e=>setForm({...form,insuranceExpiry:e.target.value})} style={inputStyle(th)}/>
          </FormGroup>
          <FormGroup label={`📜 ${t.permitExpiry}`}>
            <input type="date" value={form.permitExpiry} onChange={e=>setForm({...form,permitExpiry:e.target.value})} style={inputStyle(th)}/>
          </FormGroup>
          <FormGroup label={`🌿 ${t.pollutionExpiry}`}>
            <input type="date" value={form.pollutionExpiry} onChange={e=>setForm({...form,pollutionExpiry:e.target.value})} style={inputStyle(th)}/>
          </FormGroup>
          <FormGroup label={`🔧 ${t.serviceDue}`}>
            <input type="date" value={form.serviceDue} onChange={e=>setForm({...form,serviceDue:e.target.value})} style={inputStyle(th)}/>
          </FormGroup>
          <FormGroup label={t.vehicleStatus}>
            <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={selectStyle(th)}>
              <option value="active">{t.active}</option>
              <option value="inactive">{t.inactive}</option>
            </select>
          </FormGroup>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:10 }}>
          <button onClick={saveVehicle} style={btnStyle(th.accent)}>💾 {t.save}</button>
          <button onClick={()=>setShowModal(false)} style={btnStyle(th.textMuted,true)}>✕ {t.cancel}</button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!delId} onClose={()=>setDelId(null)} title={t.confirm} th={th}>
        <p style={{ color:th.text, marginBottom:8 }}>⚠️ {t.confirmDelete}</p>
        <p style={{ color:th.textMuted, fontSize:13, marginBottom:18 }}>Trip & expense records linked to this vehicle will remain but show an unmatched vehicle number.</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>deleteVehicle(delId)} style={btnStyle(th.danger)}>🗑️ {t.delete}</button>
          <button onClick={()=>setDelId(null)} style={btnStyle(th.textMuted,true)}>✕ {t.cancel}</button>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DRIVERS VIEW
═══════════════════════════════════════════════ */
function DriversView({ t, th, drivers, setDrivers, trips, toast }) {
  const empty = { name:"", nameEn:"", phone:"", salary:"", advance:"0", license:"", vehicle:VEHICLES_LIST[0], joinDate:"", status:"active", bata:"0", attendance:{}, advanceHistory:[] };
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [attendModal, setAttendModal] = useState(null);
  const [advModal, setAdvModal] = useState(null);
  const [advAmount, setAdvAmount] = useState("");
  const [advReason, setAdvReason] = useState("");

  const openAdd = ()=>{ setForm({...empty}); setEditId(null); setShowModal(true); };
  const openEdit = d=>{ setForm({...d,salary:String(d.salary),advance:String(d.advance),bata:String(d.bata)}); setEditId(d.id); setShowModal(true); };
  const saveDriver = ()=>{
    if(!form.name) return;
    const entry = {...form, id:editId||uid(), salary:Number(form.salary)||0, advance:Number(form.advance)||0, bata:Number(form.bata)||0};
    setDrivers(editId?drivers.map(d=>d.id===editId?entry:d):[...drivers,entry]);
    setShowModal(false);
    toast(editId?"Driver updated!":"Driver added!","success");
  };

  const markDay = (driverId, date, status) => {
    setDrivers(drivers.map(d=>d.id===driverId?{...d, attendance:{...d.attendance,[date]:status}}:d));
  };

  const payAdvance = (driverId)=>{
    if(!advAmount) return;
    const amt = Number(advAmount);
    setDrivers(drivers.map(d=>d.id===driverId?{...d, advance:d.advance+amt, advanceHistory:[{date:new Date().toISOString().slice(0,10), amount:amt, reason:advReason},...(d.advanceHistory||[])]}:d));
    setAdvModal(null); setAdvAmount(""); setAdvReason("");
    toast(`Advance of ${fmt(amt)} paid!`,"success");
  };

  return (
    <div className="fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:800, color:th.text }}>👤 {t.drivers}</h2>
          <p style={{ fontSize:13, color:th.textMuted }}>{drivers.length} drivers registered</p>
        </div>
        <button onClick={openAdd} style={{ ...btnStyle(th.accent) }}>➕ {t.addDriver}</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:16 }}>
        {drivers.map(d=>{
          const dTrips = trips.filter(tr=>tr.driver===d.name);
          const presentDays = Object.values(d.attendance||{}).filter(v=>v==="present").length;
          const totalDays = Object.keys(d.attendance||{}).length;
          return (
            <div key={d.id} style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:16, padding:"22px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
                <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#F97316,#C25A00)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, color:"#fff", flexShrink:0 }}>{d.name.slice(0,1)}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:17, fontWeight:800, color:th.text }}>{d.name}</div>
                  <div style={{ fontSize:12, color:th.textMuted }}>{d.nameEn||d.name}</div>
                  <div style={{ fontSize:11, color:th.textMuted, marginTop:2 }}>📱 {d.phone}</div>
                </div>
                <div>
                  <div style={{ background:d.status==="active"?th.successBg:th.dangerBg, color:d.status==="active"?th.success:th.danger, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6, marginBottom:4 }}>{d.status==="active"?t.active:t.inactive}</div>
                  <button onClick={()=>openEdit(d)} style={{ background:th.infoBg, border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", color:th.info, fontSize:12, width:"100%" }}>✏️ {t.edit}</button>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                {[
                  {l:"💼 "+t.salary,v:fmt(d.salary),c:th.success},
                  {l:"💰 "+t.advance,v:fmt(d.advance),c:th.warning},
                  {l:"🚛 Trips",v:dTrips.length,c:th.info},
                  {l:"💵 "+t.totalBata,v:fmt(d.bata),c:th.accent},
                  {l:"📅 "+t.attendance,v:`${presentDays}/${totalDays} days`,c:"#8B5CF6"},
                ].map(s=>(
                  <div key={s.l} style={{ background:th.input, borderRadius:10, padding:"10px 12px" }}>
                    <div style={{ fontSize:10, color:th.textMuted, marginBottom:2 }}>{s.l}</div>
                    <div style={{ fontSize:15, fontWeight:800, color:s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:th.textMuted, marginBottom:10 }}>🚚 {d.vehicle} &nbsp;|&nbsp; 🪪 {d.license}</div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setAttendModal(d)} style={{ ...btnStyle(th.success,true,true), flex:1 }}>📅 {t.attendance}</button>
                <button onClick={()=>{ setAdvModal(d); setAdvAmount(""); setAdvReason(""); }} style={{ ...btnStyle(th.warning,true,true), flex:1 }}>💰 {t.payAdvance}</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Driver Form Modal */}
      <Modal open={showModal} onClose={()=>setShowModal(false)} title={editId?t.editDriver:t.addDriver} th={th}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
          <FormGroup label={t.driverName+" (Telugu)"}><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inputStyle(th)} placeholder="రమేష్ కుమార్"/></FormGroup>
          <FormGroup label={t.driverName+" (English)"}><input value={form.nameEn} onChange={e=>setForm({...form,nameEn:e.target.value})} style={inputStyle(th)} placeholder="Ramesh Kumar"/></FormGroup>
          <FormGroup label={t.phone}><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={inputStyle(th)}/></FormGroup>
          <FormGroup label={t.licenseNo}><input value={form.license} onChange={e=>setForm({...form,license:e.target.value})} style={inputStyle(th)}/></FormGroup>
          <FormGroup label={t.salary}><input type="number" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} style={inputStyle(th)}/></FormGroup>
          <FormGroup label={t.advance}><input type="number" value={form.advance} onChange={e=>setForm({...form,advance:e.target.value})} style={inputStyle(th)}/></FormGroup>
          <FormGroup label={t.assignedVehicle}><select value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} style={selectStyle(th)}>{VEHICLES_LIST.map(v=><option key={v} value={v}>{v}</option>)}</select></FormGroup>
          <FormGroup label={t.joinDate}><input type="date" value={form.joinDate} onChange={e=>setForm({...form,joinDate:e.target.value})} style={inputStyle(th)}/></FormGroup>
          <FormGroup label={t.driverStatus}><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={selectStyle(th)}><option value="active">{t.active}</option><option value="inactive">{t.inactive}</option></select></FormGroup>
          <FormGroup label={t.totalBata}><input type="number" value={form.bata} onChange={e=>setForm({...form,bata:e.target.value})} style={inputStyle(th)}/></FormGroup>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:8 }}>
          <button onClick={saveDriver} style={btnStyle(th.accent)}>💾 {t.save}</button>
          <button onClick={()=>setShowModal(false)} style={btnStyle(th.textMuted,true)}>✕ {t.cancel}</button>
        </div>
      </Modal>

      {/* Attendance Modal */}
      {attendModal && (
        <Modal open={!!attendModal} onClose={()=>setAttendModal(null)} title={`📅 ${attendModal.name} - ${t.attendance}`} th={th}>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:13, color:th.textMuted, marginBottom:10 }}>Mark attendance for today ({new Date().toLocaleDateString("en-IN")})</div>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              <button onClick={()=>{ markDay(attendModal.id,new Date().toISOString().slice(0,10),"present"); toast("Marked Present ✅","success"); }} style={{ ...btnStyle(th.success), flex:1 }}>✅ {t.present}</button>
              <button onClick={()=>{ markDay(attendModal.id,new Date().toISOString().slice(0,10),"absent"); toast("Marked Absent ❌","error"); }} style={{ ...btnStyle(th.danger), flex:1 }}>❌ {t.absent}</button>
            </div>
          </div>
          <div style={{ fontSize:13, fontWeight:600, color:th.text, marginBottom:8 }}>Recent Attendance:</div>
          <div style={{ maxHeight:200, overflowY:"auto" }}>
            {Object.entries(attendModal.attendance||{}).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,10).map(([date,status])=>(
              <div key={date} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", borderRadius:8, marginBottom:4, background:status==="present"?th.successBg:th.dangerBg }}>
                <span style={{ fontSize:13, color:th.text }}>{fmtDate(date)}</span>
                <span style={{ fontSize:12, fontWeight:700, color:status==="present"?th.success:th.danger }}>{status==="present"?"✅ Present":"❌ Absent"}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Advance Modal */}
      {advModal && (
        <Modal open={!!advModal} onClose={()=>setAdvModal(null)} title={`💰 ${t.payAdvance} - ${advModal.name}`} th={th}>
          <div style={{ marginBottom:12 }}>
            <div style={{ background:th.warningBg, border:`1px solid ${th.warning}44`, borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:13, color:th.warning }}>Current advance outstanding: {fmt(advModal.advance)}</div>
            <FormGroup label="Advance Amount (₹)"><input type="number" value={advAmount} onChange={e=>setAdvAmount(e.target.value)} style={inputStyle(th)} placeholder="Enter amount"/></FormGroup>
            <FormGroup label="Reason"><input value={advReason} onChange={e=>setAdvReason(e.target.value)} style={inputStyle(th)} placeholder="Personal / Emergency / Other"/></FormGroup>
            <button onClick={()=>payAdvance(advModal.id)} style={{ ...btnStyle(th.warning), width:"100%", justifyContent:"center" }}>💰 Pay Advance</button>
          </div>
          {advModal.advanceHistory?.length>0&&(
            <>
              <div style={{ fontSize:13, fontWeight:600, color:th.text, marginBottom:8 }}>{t.advanceHistory}:</div>
              {advModal.advanceHistory.slice(0,5).map((h,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", borderRadius:8, background:th.input, marginBottom:4 }}>
                  <div><div style={{ fontSize:12, color:th.text }}>{fmtDate(h.date)}</div><div style={{ fontSize:11, color:th.textMuted }}>{h.reason}</div></div>
                  <div style={{ fontSize:14, fontWeight:700, color:th.warning }}>{fmt(h.amount)}</div>
                </div>
              ))}
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ANALYTICS VIEW
═══════════════════════════════════════════════ */
function AnalyticsView({ t, th, trips, expenses }) {
  const PIE_COLORS = ["#F97316","#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#14B8A6","#84CC16"];
  const catData = EXP_CATEGORIES.map((cat,i)=>({ name:cat, value:expenses.filter(e=>e.category===cat).reduce((s,e)=>s+e.amount,0), fill:PIE_COLORS[i%9] })).filter(c=>c.value>0);
  const vData = VEHICLES_LIST.map(v=>{
    const vt = trips.filter(tr=>tr.vehicle===v);
    return { name:v.split(" ").slice(-2).join(" "), trips:vt.length, income:vt.reduce((s,tr)=>s+tr.income,0), profit:vt.reduce((s,tr)=>s+tripProfit(tr),0), km:vt.reduce((s,tr)=>s+(tr.km||0),0) };
  });
  const radarData = [
    { subject:"Trips", A:vData[0]?.trips||0, B:vData[1]?.trips||0, fullMark:20 },
    { subject:"Income", A:Math.round((vData[0]?.income||0)/10000), B:Math.round((vData[1]?.income||0)/10000), fullMark:50 },
    { subject:"Profit", A:Math.round((vData[0]?.profit||0)/5000), B:Math.round((vData[1]?.profit||0)/5000), fullMark:30 },
    { subject:"KM", A:Math.round((vData[0]?.km||0)/1000), B:Math.round((vData[1]?.km||0)/1000), fullMark:10 },
  ];
  const CustomTooltip = ({ active, payload, label })=>{
    if(!active||!payload?.length) return null;
    return <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:10, padding:"12px 16px" }}><div style={{ fontSize:13, fontWeight:700, color:th.text, marginBottom:6 }}>{label}</div>{payload.map((p,i)=><div key={i} style={{ fontSize:12, color:p.color }}>{p.name}: {typeof p.value==="number"&&p.value>1000?fmt(p.value):p.value}</div>)}</div>;
  };
  const CC = ({ title, children })=>(
    <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, padding:"20px" }}>
      <h3 style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:14 }}>{title}</h3>{children}
    </div>
  );
  const totalAllIncome = MONTHLY_CHART.reduce((s,m)=>s+m.income,0);
  const totalAllProfit = MONTHLY_CHART.reduce((s,m)=>s+m.profit,0);
  const bestMonth = MONTHLY_CHART.reduce((best,m)=>m.profit>best.profit?m:best,MONTHLY_CHART[0]);
  const bestTrip = [...trips].sort((a,b)=>tripProfit(b)-tripProfit(a))[0];
  const totalKm = trips.reduce((s,tr)=>s+(tr.km||0),0);

  return (
    <div className="fade-in">
      <h2 style={{ fontSize:22, fontWeight:800, color:th.text, marginBottom:6 }}>📈 {t.analytics}</h2>
      <p style={{ fontSize:13, color:th.textMuted, marginBottom:18 }}>Year-to-date performance overview</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:11, marginBottom:18 }}>
        <StatCard label="YTD Income" value={fmt(totalAllIncome)} icon="💰" color={th.success}/>
        <StatCard label="YTD Profit" value={fmt(totalAllProfit)} icon="📈" color={th.accent}/>
        <StatCard label="Best Month" value={bestMonth.month} icon="🏆" color={th.warning} sub={`Profit: ${fmt(bestMonth.profit)}`}/>
        <StatCard label="Total Trips" value={trips.length} icon="🚛" color={th.info}/>
        <StatCard label="Total KM" value={`${totalKm.toLocaleString()} km`} icon="🛣️" color="#8B5CF6"/>
        {bestTrip&&<StatCard label="Best Trip" value={fmt(tripProfit(bestTrip))} icon="⭐" color={th.success} sub={bestTrip.customer}/>}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:14 }}>
        <CC title={`📊 ${t.monthlyProfits}`}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY_CHART}>
              <defs>
                <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F97316" stopOpacity={0.25}/><stop offset="95%" stopColor="#F97316" stopOpacity={0}/></linearGradient>
                <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                <linearGradient id="ag3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/><stop offset="95%" stopColor="#EF4444" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={th.chartGrid}/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:th.textMuted }}/>
              <YAxis tick={{ fontSize:10, fill:th.textMuted }} tickFormatter={v=>`₹${v/1000}k`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend wrapperStyle={{ fontSize:12 }}/>
              <Area type="monotone" dataKey="income" stroke="#F97316" fill="url(#ag1)" strokeWidth={2} name="Income"/>
              <Area type="monotone" dataKey="profit" stroke="#10B981" fill="url(#ag2)" strokeWidth={2} name="Profit"/>
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="url(#ag3)" strokeWidth={2} name="Expenses"/>
            </AreaChart>
          </ResponsiveContainer>
        </CC>
        <CC title={`🥧 ${t.expenseBreakdown}`}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" outerRadius={85} innerRadius={42} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} fontSize={10}>
                {catData.map((entry,i)=><Cell key={i} fill={entry.fill}/>)}
              </Pie>
              <Tooltip formatter={v=>[fmt(v),"Amount"]} contentStyle={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:8, color:th.text }}/>
            </PieChart>
          </ResponsiveContainer>
        </CC>
        <CC title={`🚚 ${t.vehicleComparison}`}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={vData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={th.chartGrid}/>
              <XAxis dataKey="name" tick={{ fontSize:11, fill:th.textMuted }}/>
              <YAxis tick={{ fontSize:10, fill:th.textMuted }} tickFormatter={v=>`₹${v/1000}k`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend wrapperStyle={{ fontSize:12 }}/>
              <Bar dataKey="income" name="Income" fill="#F97316" radius={[4,4,0,0]}/>
              <Bar dataKey="profit" name="Profit" fill="#10B981" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </CC>
        <CC title={`⛽ ${t.dieselTrend}`}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke={th.chartGrid}/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:th.textMuted }}/>
              <YAxis tick={{ fontSize:10, fill:th.textMuted }} tickFormatter={v=>`₹${v/1000}k`}/>
              <Tooltip formatter={v=>[fmt(v),"Diesel"]} contentStyle={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:8, color:th.text }}/>
              <Line type="monotone" dataKey="diesel" stroke="#F59E0B" strokeWidth={3} dot={{ fill:"#F59E0B",r:5 }} name="Diesel"/>
            </LineChart>
          </ResponsiveContainer>
        </CC>
        <CC title="🕸️ Vehicle Radar Comparison">
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke={th.chartGrid}/>
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:11, fill:th.textMuted }}/>
              <PolarRadiusAxis angle={30} domain={[0,'auto']} tick={false}/>
              <Radar name={VEHICLES_LIST[0].split(" ").slice(-2).join(" ")} dataKey="A" stroke="#F97316" fill="#F97316" fillOpacity={0.3}/>
              <Radar name={VEHICLES_LIST[1].split(" ").slice(-2).join(" ")} dataKey="B" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3}/>
              <Legend wrapperStyle={{ fontSize:12 }}/>
            </RadarChart>
          </ResponsiveContainer>
        </CC>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NOTIFICATIONS VIEW
═══════════════════════════════════════════════ */
function NotificationsView({ t, th, vehicles, expenses }) {
  const alerts = [];
  vehicles.forEach(v=>{
    [
      { label:`${v.number} - ${t.insuranceExpiry}`, date:v.insuranceExpiry, type:"Insurance", icon:"🛡️" },
      { label:`${v.number} - ${t.permitExpiry}`, date:v.permitExpiry, type:"Permit", icon:"📜" },
      { label:`${v.number} - ${t.pollutionExpiry}`, date:v.pollutionExpiry, type:"Pollution", icon:"🌿" },
      { label:`${v.number} - ${t.serviceDue}`, date:v.serviceDue, type:"Service", icon:"🔧" },
    ].forEach(a=>alerts.push({...a,vehicle:v.number}));
  });
  const today = new Date();
  if(today.getDate()<=10) {
    alerts.push({ label:"Monthly EMI Due - AP 16 T 8520", date:null, type:"EMI", icon:"🏦", vehicle:"AP 16 T 8520", daysMsg:"Due this month: ₹22,000" });
    alerts.push({ label:"Monthly EMI Due - AP 16 T 9841", date:null, type:"EMI", icon:"🏦", vehicle:"AP 16 T 9841", daysMsg:"Due this month: ₹18,000" });
  }
  const withDays = alerts.map(a=>({...a,days:a.date?getDaysUntil(a.date):0})).sort((a,b)=>a.days-b.days);
  const getStatus = days=>{
    if(days<0) return { label:t.expired, color:th.danger, bg:th.dangerBg };
    if(days<=7) return { label:t.urgent, color:th.danger, bg:th.dangerBg };
    if(days<=30) return { label:t.warning, color:th.warning, bg:th.warningBg };
    return { label:t.ok, color:th.success, bg:th.successBg };
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize:22, fontWeight:800, color:th.text, marginBottom:6 }}>🔔 {t.notifications}</h2>
      <p style={{ fontSize:13, color:th.textMuted, marginBottom:20 }}>{t.alertsTitle}</p>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20 }}>
        {[
          { label:t.expired, count:withDays.filter(a=>a.date&&a.days<0).length, color:th.danger, bg:th.dangerBg },
          { label:t.urgent, count:withDays.filter(a=>a.date&&a.days>=0&&a.days<=7).length, color:th.danger, bg:th.dangerBg },
          { label:t.warning, count:withDays.filter(a=>a.date&&a.days>7&&a.days<=30).length, color:th.warning, bg:th.warningBg },
          { label:t.ok, count:withDays.filter(a=>a.date&&a.days>30).length, color:th.success, bg:th.successBg },
        ].map(s=>(
          <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.color}44`, borderRadius:10, padding:"8px 16px" }}>
            <span style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.count}</span>
            <span style={{ fontSize:12, color:s.color, marginLeft:8 }}>{s.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {withDays.map((a,i)=>{
          const st = a.date?getStatus(a.days):{label:"EMI",color:th.info,bg:th.infoBg};
          return (
            <div key={i} style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderLeft:`4px solid ${st.color}`, borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:16 }} className="fade-in">
              <span style={{ fontSize:28, flexShrink:0 }}>{a.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:700, color:th.text }}>{a.label}</div>
                <div style={{ fontSize:12, color:th.textMuted, marginTop:2 }}>Vehicle: {a.vehicle} • Type: {a.type}</div>
                {a.date&&<div style={{ fontSize:12, color:th.textMuted }}>Date: {fmtDate(a.date)}</div>}
                {a.daysMsg&&<div style={{ fontSize:13, color:th.info }}>{a.daysMsg}</div>}
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ background:st.bg, border:`1px solid ${st.color}44`, borderRadius:8, padding:"4px 12px", color:st.color, fontSize:12, fontWeight:700 }}>{st.label}</div>
                {a.date&&<div style={{ fontSize:11, color:st.color, marginTop:4 }}>{a.days<0?t.expired:a.days===0?t.expiresToday:`${a.days} ${t.daysLeft}`}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REPORTS VIEW
═══════════════════════════════════════════════ */
function ReportsView({ t, th, trips, expenses, vehicles }) {
  const [selMonth, setSelMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`);
  const [yr, mo] = selMonth.split("-").map(Number);
  const mTrips = trips.filter(tr=>{ const d=new Date(tr.date); return d.getFullYear()===yr&&d.getMonth()+1===mo; });
  const mExp = expenses.filter(e=>{ const d=new Date(e.date); return d.getFullYear()===yr&&d.getMonth()+1===mo; });
  const mIncome = mTrips.reduce((s,tr)=>s+tr.income,0);
  const mTripExp = mTrips.reduce((s,tr)=>s+tr.diesel+tr.toll+tr.bata+tr.loading+tr.other,0);
  const mStandaloneExp = mExp.reduce((s,e)=>s+e.amount,0);
  const mProfit = mIncome-mTripExp-mStandaloneExp;

  return (
    <div className="fade-in">
      <h2 style={{ fontSize:22, fontWeight:800, color:th.text, marginBottom:6 }}>📋 {t.reports}</h2>
      <p style={{ fontSize:13, color:th.textMuted, marginBottom:20 }}>Generate and print business reports</p>
      <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, padding:"18px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
        <label style={{ fontSize:14, fontWeight:600, color:th.text }}>{t.selectMonth}:</label>
        <input type="month" value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{ ...inputStyle(th), width:"auto" }}/>
        <button onClick={()=>window.print()} style={{ ...btnStyle(th.accent), marginLeft:"auto" }}>🖨️ {t.print}</button>
      </div>
      <div style={{ background:th.card, border:`2px solid ${th.accent}44`, borderRadius:16, padding:"28px" }} id="report-preview">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:800, color:th.accent }}>🚚 Sri Venkateshwara Transports</div>
            <div style={{ fontSize:12, color:th.textMuted }}>Chilakalūrupet, Andhra Pradesh, India</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:16, fontWeight:700, color:th.text }}>{t.monthlyReport}</div>
            <div style={{ fontSize:13, color:th.textMuted }}>Period: {new Date(yr,mo-1).toLocaleString("en-IN",{month:"long",year:"numeric"})}</div>
            <div style={{ fontSize:12, color:th.textMuted }}>Generated: {new Date().toLocaleDateString("en-IN")}</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:12, marginBottom:24, padding:"18px", background:th.input, borderRadius:12 }}>
          {[{l:"Total Income",v:fmt(mIncome),c:th.success},{l:"Trip Expenses",v:fmt(mTripExp),c:th.warning},{l:"Other Expenses",v:fmt(mStandaloneExp),c:th.danger},{l:"Net Profit",v:fmt(mProfit),c:mProfit>=0?th.success:th.danger}].map(s=>(
            <div key={s.l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:11, color:th.textMuted, marginBottom:4 }}>{s.l}</div>
              <div style={{ fontSize:20, fontWeight:800, color:s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
        <h4 style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:10 }}>🚛 Trips ({mTrips.length})</h4>
        {mTrips.length===0?<p style={{ color:th.textMuted, fontSize:13 }}>No trips this period.</p>:
          <div style={{ overflowX:"auto", marginBottom:20 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead><tr style={{ background:th.input }}>{["Date","Vehicle","Route","Customer","Income","Expenses","Profit"].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", color:th.textMuted, fontWeight:700, fontSize:11 }}>{h}</th>)}</tr></thead>
              <tbody>{mTrips.map(tr=>{const tp=tripProfit(tr);const te=tr.diesel+tr.toll+tr.bata+tr.loading+tr.other;return(<tr key={tr.id} style={{ borderBottom:`1px solid ${th.divider}` }}><td style={{ padding:"8px 12px", color:th.textMuted }}>{fmtDate(tr.date)}</td><td style={{ padding:"8px 12px", color:th.text, fontSize:11 }}>{tr.vehicle}</td><td style={{ padding:"8px 12px", color:th.text }}>{tr.pickup}→{tr.destination}</td><td style={{ padding:"8px 12px", color:th.text }}>{tr.customer}</td><td style={{ padding:"8px 12px", color:th.success, fontWeight:600 }}>{fmt(tr.income)}</td><td style={{ padding:"8px 12px", color:th.danger }}>{fmt(te)}</td><td style={{ padding:"8px 12px", color:tp>=0?th.success:th.danger, fontWeight:700 }}>{fmt(tp)}</td></tr>);})}</tbody>
            </table>
          </div>
        }
        <h4 style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:10 }}>💸 Expenses ({mExp.length})</h4>
        {mExp.length===0?<p style={{ color:th.textMuted, fontSize:13 }}>No expenses this period.</p>:
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead><tr style={{ background:th.input }}>{["Date","Category","Vehicle","Amount","Description"].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", color:th.textMuted, fontWeight:700, fontSize:11 }}>{h}</th>)}</tr></thead>
              <tbody>{mExp.map(e=>(<tr key={e.id} style={{ borderBottom:`1px solid ${th.divider}` }}><td style={{ padding:"8px 12px", color:th.textMuted }}>{fmtDate(e.date)}</td><td style={{ padding:"8px 12px", color:th.text, fontWeight:600 }}>{e.category}</td><td style={{ padding:"8px 12px", color:th.textMuted, fontSize:11 }}>{e.vehicle}</td><td style={{ padding:"8px 12px", color:th.danger, fontWeight:700 }}>{fmt(e.amount)}</td><td style={{ padding:"8px 12px", color:th.textMuted }}>{e.description}</td></tr>))}</tbody>
            </table>
          </div>
        }
        <div style={{ marginTop:24, paddingTop:16, borderTop:`1px solid ${th.divider}`, display:"flex", justifyContent:"flex-end" }}>
          <div style={{ textAlign:"center", borderTop:`1px solid ${th.textMuted}`, paddingTop:8, paddingLeft:40 }}>
            <div style={{ fontSize:12, color:th.textMuted }}>{t.authorizedSign}</div>
            <div style={{ fontSize:13, color:th.text, fontWeight:600, marginTop:4 }}>Sri Venkateshwara Transports</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   INVOICE VIEW
═══════════════════════════════════════════════ */
function InvoiceView({ t, th, trips }) {
  const [selTripId, setSelTripId] = useState(trips[0]?.id||null);
  const trip = trips.find(tr=>tr.id===Number(selTripId))||trips[0];
  const invNo = `SVT-${new Date().getFullYear()}-${String(selTripId||"001").padStart(4,"0")}`;
  const totalExp = trip?trip.diesel+trip.toll+trip.bata+trip.loading+trip.other:0;
  const profit = trip?tripProfit(trip):0;

  return (
    <div className="fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:800, color:th.text }}>🧾 {t.invoiceTitle}</h2>
          <p style={{ fontSize:13, color:th.textMuted }}>Professional transport invoices</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <select value={selTripId} onChange={e=>setSelTripId(e.target.value)} style={{ ...selectStyle(th), minWidth:280 }}>
            {trips.map(tr=><option key={tr.id} value={tr.id}>{fmtDate(tr.date)} • {tr.customer} • {tr.pickup}→{tr.destination}</option>)}
          </select>
          <button onClick={()=>window.print()} style={{ ...btnStyle(th.accent), whiteSpace:"nowrap" }}>🖨️ {t.printInvoice}</button>
        </div>
      </div>
      {trip&&(
        <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:16, overflow:"hidden", maxWidth:760 }} id="invoice">
          <div style={{ background:"linear-gradient(135deg,#0D1B2E,#162233)", padding:"28px 32px", borderBottom:`3px solid ${th.accent}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:th.accent }}>🚚 Sri Venkateshwara Transports</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:4, lineHeight:1.8 }}>Chilakalūrupet, Andhra Pradesh, India<br/>GST: 37XXXXX1234Z1ZX • Phone: +91 99999 00000</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>INVOICE</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginTop:4 }}>{invNo}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:2 }}>Date: {fmtDate(trip.date)}</div>
              </div>
            </div>
          </div>
          <div style={{ padding:"24px 32px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, marginBottom:24 }}>
              <div><div style={{ fontSize:11, fontWeight:700, color:th.accent, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>{t.billTo}</div><div style={{ fontSize:15, fontWeight:700, color:th.text }}>{trip.customer}</div></div>
              <div><div style={{ fontSize:11, fontWeight:700, color:th.textMuted, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>{t.shipFrom}</div><div style={{ fontSize:14, color:th.text, fontWeight:600 }}>{trip.pickup}</div></div>
              <div><div style={{ fontSize:11, fontWeight:700, color:th.textMuted, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>{t.shipTo}</div><div style={{ fontSize:14, color:th.text, fontWeight:600 }}>{trip.destination}</div></div>
            </div>
            <div style={{ background:th.input, borderRadius:12, padding:"14px 18px", marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:12 }}>
              {[{l:t.vehicle,v:trip.vehicle},{l:t.driver,v:trip.driver},{l:t.goodsType,v:trip.goodsType},{l:t.goodsWeight,v:`${trip.weight} kg`},{l:t.kmField,v:`${trip.km||0} km`}].map(s=>(
                <div key={s.l}><div style={{ fontSize:11, color:th.textMuted, fontWeight:600 }}>{s.l}</div><div style={{ fontSize:13, color:th.text, fontWeight:700, marginTop:2 }}>{s.v}</div></div>
              ))}
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:20, fontSize:13 }}>
              <thead><tr style={{ background:th.input }}><th style={{ padding:"10px 14px", textAlign:"left", color:th.textMuted, fontSize:12 }}>Description</th><th style={{ padding:"10px 14px", textAlign:"right", color:th.textMuted, fontSize:12 }}>Amount</th></tr></thead>
              <tbody>
                {[{d:"Freight / Transport Charges",a:trip.income},{d:"Diesel Cost",a:-trip.diesel},{d:"Toll Charges",a:-trip.toll},{d:"Driver Bata",a:-trip.bata},{d:"Loading/Unloading",a:-trip.loading},{d:"Other Expenses",a:-trip.other}].filter(l=>l.a!==0).map((l,i)=>(
                  <tr key={i} style={{ borderBottom:`1px solid ${th.divider}` }}><td style={{ padding:"10px 14px", color:th.text }}>{l.d}</td><td style={{ padding:"10px 14px", textAlign:"right", fontWeight:600, color:l.a>=0?th.success:th.danger }}>{fmt(Math.abs(l.a))}</td></tr>
                ))}
              </tbody>
            </table>
            <div style={{ borderTop:`2px solid ${th.accent}`, paddingTop:16, display:"flex", justifyContent:"flex-end" }}>
              <div style={{ minWidth:240 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ fontSize:14, color:th.textMuted }}>Freight Charges:</span><span style={{ fontSize:14, fontWeight:600, color:th.success }}>{fmt(trip.income)}</span></div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ fontSize:14, color:th.textMuted }}>Total Expenses:</span><span style={{ fontSize:14, fontWeight:600, color:th.danger }}>{fmt(totalExp)}</span></div>
                <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderTop:`1px solid ${th.divider}` }}><span style={{ fontSize:16, fontWeight:700, color:th.text }}>{t.grandTotal} (Net):</span><span style={{ fontSize:22, fontWeight:800, color:profit>=0?th.success:th.danger }}>{fmt(profit)}</span></div>
              </div>
            </div>
            <div style={{ marginTop:24, paddingTop:16, borderTop:`1px solid ${th.divider}`, display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16 }}>
              <div style={{ fontSize:11, color:th.textMuted }}>Thank you for choosing Sri Venkateshwara Transports<br/>All amounts in Indian Rupees (₹)</div>
              <div style={{ textAlign:"center" }}><div style={{ width:120, borderTop:`1px solid ${th.textMuted}`, paddingTop:6 }}><div style={{ fontSize:11, color:th.textMuted }}>{t.authorizedSign}</div></div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SETTINGS VIEW
═══════════════════════════════════════════════ */
function SettingsView({ t, th, dark, setDark, lang, setLang, onLogout }) {
  const [company, setCompany] = useState({ name:"Sri Venkateshwara Transports", phone:"9999900000", address:"Chilakalūrupet, Andhra Pradesh", gst:"37XXXXX1234Z1ZX" });
  const [saved, setSaved] = useState(false);

  const save = ()=>{ setSaved(true); setTimeout(()=>setSaved(false),2500); };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize:22, fontWeight:800, color:th.text, marginBottom:20 }}>⚙️ {t.settings}</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16 }}>
        {/* Appearance */}
        <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, padding:"20px" }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:th.text, marginBottom:16 }}>🎨 Appearance</h3>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:13, color:th.textMuted, marginBottom:10, fontWeight:600 }}>Theme</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setDark(false)} style={{ flex:1, padding:"12px", borderRadius:10, border:`2px solid ${!dark?th.accent:th.cardBorder}`, background:!dark?th.accentLight:"transparent", color:!dark?th.accent:th.textMuted, cursor:"pointer", fontWeight:600, fontSize:13 }}>☀️ Light Mode</button>
              <button onClick={()=>setDark(true)} style={{ flex:1, padding:"12px", borderRadius:10, border:`2px solid ${dark?th.accent:th.cardBorder}`, background:dark?"rgba(249,115,22,0.15)":"transparent", color:dark?th.accent:th.textMuted, cursor:"pointer", fontWeight:600, fontSize:13 }}>🌙 Dark Mode</button>
            </div>
          </div>
          <div>
            <div style={{ fontSize:13, color:th.textMuted, marginBottom:10, fontWeight:600 }}>Language</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setLang("en")} style={{ flex:1, padding:"12px", borderRadius:10, border:`2px solid ${lang==="en"?th.accent:th.cardBorder}`, background:lang==="en"?"rgba(249,115,22,0.15)":"transparent", color:lang==="en"?th.accent:th.textMuted, cursor:"pointer", fontWeight:600, fontSize:13 }}>🇬🇧 English</button>
              <button onClick={()=>setLang("te")} style={{ flex:1, padding:"12px", borderRadius:10, border:`2px solid ${lang==="te"?th.accent:th.cardBorder}`, background:lang==="te"?"rgba(249,115,22,0.15)":"transparent", color:lang==="te"?th.accent:th.textMuted, cursor:"pointer", fontWeight:600, fontSize:13 }}>🇮🇳 తెలుగు</button>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, padding:"20px" }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:th.text, marginBottom:16 }}>🏢 Company Info</h3>
          {[{l:t.companyName,k:"name"},{l:t.companyPhone,k:"phone"},{l:t.companyAddress,k:"address"},{l:"GST Number",k:"gst"}].map(f=>(
            <FormGroup key={f.k} label={f.l}>
              <input value={company[f.k]} onChange={e=>setCompany({...company,[f.k]:e.target.value})} style={inputStyle(th)}/>
            </FormGroup>
          ))}
          <button onClick={save} style={{ ...btnStyle(saved?th.success:th.accent), width:"100%", justifyContent:"center" }}>{saved?"✅ Saved!":"💾 "+t.saveSettings}</button>
        </div>

        {/* Login Credentials Info */}
        <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, padding:"20px" }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:th.text, marginBottom:16 }}>🔐 Login Users</h3>
          {[{u:"admin",p:"admin123",role:"Super Admin"},{u:"father",p:"father123",role:"Owner (Father)"},{u:"son",p:"son123",role:"Manager (Son)"}].map(u=>(
            <div key={u.u} style={{ background:th.input, borderRadius:10, padding:"12px 16px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:th.text }}>{u.u}</div>
                  <div style={{ fontSize:11, color:th.textMuted }}>{u.role}</div>
                </div>
                <div style={{ background:th.successBg, color:th.success, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6 }}>Active</div>
              </div>
            </div>
          ))}
          <div style={{ background:th.warningBg, border:`1px solid ${th.warning}44`, borderRadius:10, padding:"10px 14px", marginTop:12 }}>
            <div style={{ fontSize:12, color:th.warning }}>⚠️ Contact your developer to change passwords or add new users.</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background:th.card, border:`1px solid ${th.cardBorder}`, borderRadius:14, padding:"20px" }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:th.text, marginBottom:16 }}>⚡ Quick Actions</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <button onClick={()=>window.print()} style={{ ...btnStyle(th.info,true), width:"100%", justifyContent:"center" }}>🖨️ Print Current Page</button>
            <button style={{ ...btnStyle(th.success,true), width:"100%", justifyContent:"center" }}>📊 Export All Data to Excel</button>
            <button style={{ ...btnStyle(th.warning,true), width:"100%", justifyContent:"center" }}>☁️ Backup Data</button>
            <button onClick={onLogout} style={{ ...btnStyle(th.danger), width:"100%", justifyContent:"center" }}>🚪 Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════ */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("en");
  const [dark, setDark] = useState(true);
  const [section, setSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trips, setTrips] = useState(INIT_TRIPS);
  const [expenses, setExpenses] = useState(INIT_EXPENSES);
  const [vehicles, setVehicles] = useState(INIT_VEHICLES);
  const [drivers, setDrivers] = useState(INIT_DRIVERS);
  const [toastQueue, setToastQueue] = useState([]);

  const t = T[lang];
  const th = makeTheme(dark);

  const toast = useCallback((msg, type="info")=>{
    const id = Date.now();
    setToastQueue(q=>[...q,{id,msg,type}]);
  },[]);

  const alertCount = useMemo(()=>{
    let c=0;
    vehicles.forEach(v=>[v.insuranceExpiry,v.permitExpiry,v.pollutionExpiry,v.serviceDue].forEach(d=>{ if(getDaysUntil(d)<=30) c++; }));
    return c;
  },[vehicles]);

  if(!isLoggedIn) return <LoginPage onLogin={u=>{setIsLoggedIn(true);setUser(u);}} t={t} dark={dark} setDark={setDark} lang={lang} setLang={setLang}/>;

  const pages = {
    dashboard: <DashboardView t={t} th={th} trips={trips} expenses={expenses} vehicles={vehicles} setActive={setSection}/>,
    trips: <TripsView t={t} th={th} trips={trips} setTrips={setTrips} toast={toast}/>,
    expenses: <ExpensesView t={t} th={th} expenses={expenses} setExpenses={setExpenses} toast={toast}/>,
    vehicles: <VehiclesView t={t} th={th} vehicles={vehicles} setVehicles={setVehicles} trips={trips} expenses={expenses} toast={toast}/>,
    drivers: <DriversView t={t} th={th} drivers={drivers} setDrivers={setDrivers} trips={trips} toast={toast}/>,
    analytics: <AnalyticsView t={t} th={th} trips={trips} expenses={expenses}/>,
    notifications: <NotificationsView t={t} th={th} vehicles={vehicles} expenses={expenses}/>,
    reports: <ReportsView t={t} th={th} trips={trips} expenses={expenses} vehicles={vehicles}/>,
    invoice: <InvoiceView t={t} th={th} trips={trips}/>,
    settings: <SettingsView t={t} th={th} dark={dark} setDark={setDark} lang={lang} setLang={setLang} onLogout={()=>{setIsLoggedIn(false);setUser(null);}}/>,
  };

  return (
    <div style={{ minHeight:"100vh", background:th.bg, fontFamily:"'Baloo 2','Noto Sans Telugu',sans-serif", color:th.text }}>
      <style>{FONT_IMPORT}</style>

      {/* Toast notifications */}
      {toastQueue.map(tst=>(
        <Toast key={tst.id} message={tst.msg} type={tst.type} onClose={()=>setToastQueue(q=>q.filter(x=>x.id!==tst.id))}/>
      ))}

      {/* Sidebar overlay */}
      {sidebarOpen&&<div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:45 }}/>}

      <Sidebar t={t} th={th} active={section} setActive={s=>{setSection(s);setSidebarOpen(false);}} isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)} onLogout={()=>{setIsLoggedIn(false);setUser(null);}} lang={lang} setLang={setLang} dark={dark} setDark={setDark} alertCount={alertCount}/>

      <div>
        {/* Top bar */}
        <div className="no-print" style={{ position:"sticky", top:0, zIndex:35, background:th.card, borderBottom:`1px solid ${th.cardBorder}`, padding:"0 16px", height:56, display:"flex", alignItems:"center", gap:12, boxShadow:th.shadow }}>
          <button onClick={()=>setSidebarOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", color:th.text, fontSize:22, lineHeight:1, padding:4, display:"flex", alignItems:"center" }}>☰</button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:20 }}>🚚</span>
            <span style={{ fontWeight:800, fontSize:16, color:th.accent }}>SVT</span>
          </div>
          <div style={{ flex:1, paddingLeft:8 }}>
            <span style={{ fontSize:14, fontWeight:600, color:th.text }}>{t[section]||"Dashboard"}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={()=>setSection("notifications")} style={{ position:"relative", background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:10, padding:"6px 10px", cursor:"pointer", color:th.text, fontSize:16 }}>
              🔔{alertCount>0&&<span style={{ position:"absolute", top:-4, right:-4, background:th.danger, color:"#fff", borderRadius:"50%", fontSize:10, fontWeight:800, width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center" }}>{alertCount}</span>}
            </button>
            <button onClick={()=>setDark(!dark)} style={{ background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:10, padding:"6px 10px", cursor:"pointer", fontSize:16 }}>{dark?"☀️":"🌙"}</button>
            <button onClick={()=>setLang(lang==="en"?"te":"en")} style={{ background:th.accent, border:"none", borderRadius:10, padding:"6px 14px", cursor:"pointer", color:"#fff", fontSize:12, fontWeight:700 }}>{t.language}</button>
            <div style={{ fontSize:12, color:th.textMuted, padding:"0 4px" }}>👤 {user}</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding:"20px 16px", maxWidth:1240, margin:"0 auto" }}>
          {pages[section]}
        </div>
      </div>
    </div>
  );
}
