// Components/Layout.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../Css/Dashboard.css";

const PAGE_TITLES = {
  "/dashboard":           "Dashboard",
  "/customers":           "Customer Details",
  "/properties":          "Property Details",
  "/lease-agreement":     "Lease Agreement",
  "/lease-cancellation":  "Lease Cancellation",
  "/rental-agreement":    "Rental Agreement",
  "/rental-cancellation": "Rental Cancellation",
  "/maintenance":         "Maintenance Requests",
  "/vendors":             "Vendor Management",
  "/purchase-request":    "Purchase Request",
  "/quote-analysis":      "Quote Analysis",
  "/contract-creation":   "Contract Creation",
  "/contract-approval":   "Contract Approval",
  "/invoicing":           "Invoicing & Payment",
  "/time-reporting":      "Time Reporting",
  "/leave-management":    "Leave Management",
  "/reports":             "All Module Reports",
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("pms_user") || "{}");

  return (
    <div className="pms-layout">

      {/* ── TOP: Fixed Header (full width) ── */}
      <Header
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* ── LEFT: Fixed Sidebar (below header) ── */}
      <Sidebar
        activePath={location.pathname}
        onNavigate={(path) => { navigate(path); setSidebarOpen(false); }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── RIGHT: Scrollable main content ── */}
      <div className="pms-main">
        <main className="pms-content">
          {children}
        </main>
      </div>

    </div>
  );
}