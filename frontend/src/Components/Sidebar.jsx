// Components/Sidebar.jsx
import "../Css/Sidebar.css";

/* ── Nav data ─────────────────────────────────────────── */
const NAV = [
  {
    key: "overview", label: "Overview", dot: "dot-overview",
    items: [
      { path: "/dashboard",  label: "Dashboard",
        icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
    ],
  },
  {
    key: "master", label: "Master (Core)", dot: "dot-master",
    items: [
      { path: "/customers", label: "Customer Module",
        icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
      { path: "/properties", label: "Property Module",
        icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
      { path: "/vendors", label: "Vendor Management Module",
        icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" },
    ],
  },
  {
    key: "agreements", label: "Agreements", dot: "dot-agreements",
    items: [
      { path: "/lease-agreement",     label: "Lease Agreement Module",
        icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
      { path: "/lease-cancellation",  label: "Lease Cancellation Module",
        icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 15l6-6 M15 15L9 9" },
      { path: "/rental-agreement",    label: "Rental Agreement Module",
        icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
      { path: "/rental-cancellation", label: "Rental Agreement Cancellation Module",
        icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M9 15l6-6 M15 15L9 9" },
    ],
  },
  {
    key: "operations", label: "Operations", dot: "dot-operations",
    items: [
      { path: "/maintenance",      label: "Maintenance Request Module",
        icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" },
      { path: "/purchase-request", label: "Quotation Request Module",
        icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" },
      { path: "/quote-analysis",   label: "Quote Analysis Module",
        icon: "M18 20V10 M12 20V4 M6 20v-6" },
      { path: "/contract-approval", label: "Contract Approval Module",
        icon: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" },
      { path: "/invoicing", label: "Invoicing & Payment Module",
        icon: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
    ],
  },
  {
    key: "reports", label: "Reports", dot: "dot-reports",
    items: [
      { path: "/reports", label: "All Module Reports",
        icon: "M18 20V10 M12 20V4 M6 20v-6 M22 20H2" },
    ],
  },
];

function NavIcon({ d }) {
  return (
    <svg className="sidebar-icon" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function Sidebar({ activePath = "/dashboard", onNavigate, open, onClose }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`pms-sidebar${open ? " sidebar--open" : ""}`}>
        <nav className="sidebar-nav">
          {NAV.map(section => (
            <div key={section.key} className="sidebar-section">
              <div className="sidebar-section-label">
                <span className={`sidebar-dot ${section.dot}`} />
                {section.label}
              </div>
              {section.items.map(item => (
                <button
                  key={item.path}
                  className={`sidebar-item${activePath === item.path ? " active" : ""}`}
                  onClick={() => { onNavigate?.(item.path); onClose?.(); }}
                >
                  <NavIcon d={item.icon} />
                  <span className="sidebar-item-text">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}