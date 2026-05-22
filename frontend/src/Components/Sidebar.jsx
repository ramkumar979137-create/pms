// Components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import "../Css/sidebar.css";
import logo from "../Assets/AUM_Sol_Corp_symbol_with_bg.png";

const navItems = [
  { section: "Main" },
  { label: "Dashboard",            icon: "bi-grid-1x2-fill",          path: "/dashboard" },

  { section: "Phase 1 — Core" },
  { label: "Customers",            icon: "bi-people-fill",             path: "/customers" },
  { label: "Properties",           icon: "bi-building-fill",           path: "/properties" },

  { section: "Phase 2 — Leasing" },
  { label: "Lease Agreement",      icon: "bi-file-earmark-text-fill",  path: "/lease-agreement" },
  { label: "Lease Cancellation",   icon: "bi-file-earmark-x-fill",     path: "/lease-cancellation" },
  { label: "Rental Agreement",     icon: "bi-house-fill",              path: "/rental-agreement" },
  { label: "Rental Cancellation",  icon: "bi-house-x-fill",            path: "/rental-cancellation" },

  { section: "Phase 3 — Maintenance" },
  { label: "Maintenance",          icon: "bi-tools",                   path: "/maintenance" },
  { label: "Vendors",              icon: "bi-truck",                   path: "/vendors" },

  { section: "Phase 4 — Procurement" },
  { label: "Purchase Request",     icon: "bi-cart-fill",               path: "/purchase-request" },
  { label: "Quote Analysis",       icon: "bi-clipboard-data-fill",     path: "/quote-analysis" },
  { label: "Contract Creation",    icon: "bi-pen-fill",                path: "/contract-creation" },
  { label: "Contract Approval",    icon: "bi-patch-check-fill",        path: "/contract-approval" },

  { section: "Phase 5 — Finance & HR" },
  { label: "Invoicing & Payment",  icon: "bi-receipt-cutoff",          path: "/invoicing" },
  { label: "Time Reporting",       icon: "bi-clock-fill",              path: "/time-reporting" },
  { label: "Leave Management",     icon: "bi-calendar2-check-fill",    path: "/leave-management" },
];

export default function Sidebar({ open, onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = JSON.parse(localStorage.getItem("pms_user") || "{}");

  const handleNav = (path) => {
    navigate(path);
    onClose && onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("pms_user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile dark overlay — only when open */}
      {open && (
        <div className="sidebar-overlay visible" onClick={onClose} />
      )}

      <aside className={`sidebar${open ? " open" : ""}`}>

        {/* ── Logo ── */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src={logo} alt="Logo" />
          </div>
          <div className="logo-text">
            <span className="logo-name">AUM Sol Corp</span>
            <span className="logo-tagline">PMS Platform</span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            item.section ? (
              <div className="nav-section-label" key={i}>{item.section}</div>
            ) : (
              <button
                key={i}
                className={`nav-item${location.pathname === item.path ? " active" : ""}`}
                onClick={() => handleNav(item.path)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            )
          )}
        </nav>

        {/* ── User footer ── */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {(user.firstName?.[0] || "U").toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {user.firstName ? `${user.firstName} ${user.lastName}` : "User"}
              </div>
              <div className="sidebar-user-role">{user.role || "Member"}</div>
            </div>
            <button className="btn-logout" onClick={handleLogout} title="Logout">
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}