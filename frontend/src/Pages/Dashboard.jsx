// Components/Dashboard.jsx
import "../Css/Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ── Sample data ───────────────────────────────────────── */
const STATS_ROW1 = [
  { label: "Total Properties",  value: "0",       sub: "0 occupied" },
  { label: "Active Leases",     value: "0",       sub: "0 total" },
  { label: "Active Rentals",    value: "0",       sub: "0 total" },
  { label: "Open Maintenance",  value: "0",       sub: "across 0 requests" },
  { label: "Active Vendors",    value: "0",       sub: "0 service types" },
];
const STATS_ROW2 = [
  { label: "Cancellations", value: "0",      sub: "0 lease · 0 rental" },
  { label: "Outstanding",   value: "₹ 0.00", sub: "across 0 invoices" },
];

const QUICK_ACTIONS = [
  { icon: "+", name: "Add Customer",     tag: "MASTER",  desc: "Register a new tenant or owner", path: "/customers" },
  { icon: "+", name: "Add Property",     tag: "MASTER",  desc: "Onboard a new property unit", path: "/properties" },
  { icon: "+", name: "Add Vendor",       tag: "MASTER",  desc: "Onboard a new service vendor", path: "/vendors" },
  { icon: "+", name: "New Lease",        tag: "AGREE",   desc: "Create a lease agreement", path: "/lease-agreement" },
  { icon: "+", name: "New Rental",       tag: "AGREE",   desc: "Create a rental agreement", path: "/rental-agreement" },
  { icon: "+", name: "Raise Maintenance",tag: "OPS",     desc: "Log a service request", path: "/maintenance" },
  { icon: "+", name: "Create Invoice",   tag: "OPS",     desc: "Issue and track payments", path: "/invoicing" },
  { icon: "+", name: "Generate Report",  tag: "REPORTS", desc: "Export consolidated PDF reports", path: "/quotation-request" },
];

const MAINTENANCE = [
  { id:"MNT-002", property:"Green Villa",       customer:"Aarav Mehta",    issue:"Living room ceiling light flickering intermittently", priority:"MEDIUM", status:"IN PROGRESS" },
  { id:"MNT-001", property:"Lotus Residency 3B", customer:"Ravi Krishnan",  issue:"Kitchen sink leakage causing water damage to cabinet",  priority:"HIGH",   status:"OPEN" },
];

const SAMPLE_LEASES = [
  { id:"LSE-001", tenant:"Aarav Mehta",    property:"Green Villa",        rent:"₹ 28,000", start:"01 Jan 2025", end:"31 Dec 2025", status:"ACTIVE" },
  { id:"LSE-002", tenant:"Ravi Krishnan",  property:"Lotus Residency 3B", rent:"₹ 22,500", start:"15 Feb 2025", end:"14 Aug 2025", status:"EXPIRING" },
];

/* ── Badge helpers ─────────────────────────────────────── */
function PriorityBadge({ p }) {
  const map = { HIGH:"badge badge-high", MEDIUM:"badge badge-medium", LOW:"badge badge-low" };
  return <span className={map[p] || "badge"}>{p}</span>;
}
function StatusBadge({ s }) {
  const map = {
    "IN PROGRESS":"badge badge-progress",
    "OPEN":"badge badge-open",
    "RESOLVED":"badge badge-resolved",
    "CLOSED":"badge badge-closed",
  };
  return <span className={map[s] || "badge"}>{s}</span>;
}
function LeaseStatusText({ s }) {
  const map = { ACTIVE:"db-lease-status-active", EXPIRING:"db-lease-status-expiring", EXPIRED:"db-lease-status-expired" };
  return <span className={map[s]}>{s}</span>;
}

/* ── Dashboard Component ───────────────────────────────── */
export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const apiBase = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;
        const res = await axios.get(`${apiBase}/api/dashboard`);
        console.debug("/api/dashboard response:", res && res.data);
        console.log("Dashboard data loaded successfully",res.data);
        setDashboard(res.data || null);
      } catch (err) {
        console.debug("Failed to load dashboard data, using defaults", err);
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday:"long", year:"numeric", month:"long", day:"numeric"
  });

  return (
    <div className="dashboard-page">
      <div className="db-breadcrumb">Home</div>
      <h1 className="db-title">Dashboard</h1>

      {/* Welcome Banner */}
      <div className="db-banner">
        <div className="db-banner-logo">A</div>
        <div>
          <div className="db-banner-sub">Welcome to</div>
          <h2 className="db-banner-title">AUM Sol Corp Property Management</h2>
          <div className="db-banner-date">A Unite for Multiple Solutions · {today}</div>
        </div>
      </div>

      {/* Stats row 1 */}
      <div className="db-stats-row row5">
        {(dashboard ? [
          { label: "Total Properties", value: String(dashboard?.stats[0]?.value ?? 0), sub: `${dashboard?.stats?.occupiedProperties ?? 0} occupied` },
          { label: "Active Leases", value: String(dashboard?.stats[1]?.value ?? 0), sub: `${dashboard?.stats?.activeLeases ?? 0} total` },
          { label: "Active Rentals", value: String(dashboard?.stats[2]?.value ?? 0), sub: `${dashboard?.stats?.activeRentals ?? 0} total` },
          { label: "Open Maintenance", value: String(dashboard?.stats[3]?.value ?? 0), sub: `across ${dashboard?.stats?.openMaintenance ?? 0} requests` },
          { label: "Active Vendors", value: String(dashboard?.stats[4]?.value ?? 0), sub: `${dashboard?.stats?.activeVendors ?? 0} service types` },
        ] : STATS_ROW1).map(s => (
          <div key={s.label} className="db-stat-card">
            <div className="db-stat-label">{s.label}</div>
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Stats row 2 */}
      <div className="db-stats-row row2" style={{ marginBottom: 28 }}>
        {((dashboard ? [
          { label: "Cancellations", value: String(dashboard?.stats?.cancellations ?? 0), sub: `${dashboard?.stats?.cancellations ?? 0} lease · 0 rental` },
          { label: "Outstanding", value: `₹ ${dashboard?.stats?.outstandingAmount ?? 0}`, sub: `across ${dashboard?.stats?.invoices ?? 0} invoices` },
        ] : STATS_ROW2)).map(s => (
          <div key={s.label} className="db-stat-card">
            <div className="db-stat-label">{s.label}</div>
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="db-section-title">Quick Actions</div>
      <div className="db-actions-grid">
        {QUICK_ACTIONS.map(a => (
          <ActionCard key={a.name} action={a} />
        ))}
      </div>

      {/* Maintenance Table */}
      <div className="db-section-title">Recent Maintenance Activity</div>
      <div className="db-table-wrap" style={{ marginBottom: 32 }}>
        <table className="db-table">
          <thead>
            <tr>
              <th>Request</th><th>Property</th><th>Customer</th>
              <th>Issue</th><th>Priority</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MAINTENANCE.map(m => (
              <tr key={m.id}>
                <td data-label="Request"><strong>{m.id}</strong></td>
                <td data-label="Property">{m.property}</td>
                <td data-label="Customer">{m.customer}</td>
                <td data-label="Issue" className="muted">{m.issue}</td>
                <td data-label="Priority"><PriorityBadge p={m.priority} /></td>
                <td data-label="Status"><StatusBadge s={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active Leases Table */}
      <div className="db-section-title">Active Leases</div>
      <div className="db-table-wrap">
        <table className="db-table">
          <thead>
            <tr>
              <th>Lease ID</th><th>Tenant</th><th>Property</th>
              <th>Monthly Rent</th><th>Start</th><th>End</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(dashboard && Array.isArray(dashboard.recentLeases) ? dashboard.recentLeases : SAMPLE_LEASES).map(l => (
              <tr key={l.id}>
                <td data-label="Lease ID"><strong>{l.id}</strong></td>
                <td data-label="Tenant">{l.tenant}</td>
                <td data-label="Property">{l.property}</td>
                <td data-label="Monthly Rent">{l.monthlyRent ? `₹ ${Number(l.monthlyRent).toLocaleString('en-IN')}` : (l.rent || '—')}</td>
                <td data-label="Start" className="muted">{l.start ? new Date(l.start).toLocaleDateString('en-GB') : l.start}</td>
                <td data-label="End" className="muted">{l.end ? new Date(l.end).toLocaleDateString('en-GB') : l.end}</td>
                <td data-label="Status"><LeaseStatusText s={l.status || 'ACTIVE'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionCard({ action }) {
  const navigate = useNavigate();
  const go = () => {
    if (action.path) navigate(action.path);
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') go(); }}
      className="db-action-card"
      style={{ cursor: 'pointer' }}
    >
      <div className="db-action-icon">{action.icon}</div>
      <div>
        <div className="db-action-name">
          {action.name}
          <span className="db-action-tag">{action.tag}</span>
        </div>
        <div className="db-action-desc">{action.desc}</div>
      </div>
    </div>
  );
}