// Components/Layout.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../Css/Global.css";

const pageTitles = {
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
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const user     = JSON.parse(localStorage.getItem("pms_user") || "{}");
  const title    = pageTitles[location.pathname] || "PMS";

  return (
    <div className="pms-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="pms-main">
        {/* Topbar */}
        <header className="pms-topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>
              <i className="bi bi-list"></i>
            </button>
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-right">
            <span style={{ fontSize:"0.8rem", color:"var(--text-muted)" }}>
              {new Date().toLocaleDateString("en-IN", { dateStyle:"medium" })}
            </span>
            <div className="avatar">
              {(user.firstName?.[0] || "U").toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="pms-content">{children}</main>
      </div>
    </div>
  );
}