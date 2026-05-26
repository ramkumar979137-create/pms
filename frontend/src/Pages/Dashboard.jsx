// Components/Dashboard.jsx
import "../Css/Dashboard.css";

/* ── Sample data ───────────────────────────────────────── */
const STATS_ROW1 = [
  { label: "Total Properties",  value: "3",       sub: "2 occupied" },
  { label: "Active Leases",     value: "2",       sub: "2 total" },
  { label: "Active Rentals",    value: "1",       sub: "1 total" },
  { label: "Open Maintenance",  value: "2",       sub: "across 2 requests" },
  { label: "Active Vendors",    value: "4",       sub: "9 service types" },
];
const STATS_ROW2 = [
  { label: "Cancellations", value: "0",      sub: "0 lease · 0 rental" },
  { label: "Outstanding",   value: "₹ 0.00", sub: "across 0 invoices" },
];

const QUICK_ACTIONS = [
  { icon: "+", name: "Add Customer",     tag: "MASTER",  desc: "Register a new tenant or owner" },
  { icon: "+", name: "Add Property",     tag: "MASTER",  desc: "Onboard a new property unit" },
  { icon: "+", name: "Add Vendor",       tag: "MASTER",  desc: "Onboard a new service vendor" },
  { icon: "+", name: "New Lease",        tag: "AGREE",   desc: "Create a lease agreement" },
  { icon: "+", name: "New Rental",       tag: "AGREE",   desc: "Create a rental agreement" },
  { icon: "+", name: "Raise Maintenance",tag: "OPS",     desc: "Log a service request" },
  { icon: "+", name: "Create Invoice",   tag: "OPS",     desc: "Issue and track payments" },
  { icon: "+", name: "Generate Report",  tag: "REPORTS", desc: "Export consolidated PDF reports" },
];

const MAINTENANCE = [
  { id:"MNT-002", property:"Green Villa",       customer:"Aarav Mehta",    issue:"Living room ceiling light flickering intermittently", priority:"MEDIUM", status:"IN PROGRESS" },
  { id:"MNT-001", property:"Lotus Residency 3B", customer:"Ravi Krishnan",  issue:"Kitchen sink leakage causing water damage to cabinet",  priority:"HIGH",   status:"OPEN" },
  { id:"MNT-003", property:"Sunrise Apartments", customer:"Priya Nair",     issue:"Air conditioner not cooling — compressor fault",         priority:"HIGH",   status:"OPEN" },
  { id:"MNT-004", property:"Green Villa",        customer:"Aarav Mehta",    issue:"Bathroom exhaust fan making loud noise",                 priority:"LOW",    status:"RESOLVED" },
];

const LEASES = [
  { id:"LSE-001", tenant:"Aarav Mehta",    property:"Green Villa",        rent:"₹ 28,000", start:"01 Jan 2025", end:"31 Dec 2025", status:"ACTIVE" },
  { id:"LSE-002", tenant:"Ravi Krishnan",  property:"Lotus Residency 3B", rent:"₹ 22,500", start:"15 Feb 2025", end:"14 Aug 2025", status:"EXPIRING" },
  { id:"LSE-003", tenant:"Deepa Sundar",   property:"Sunrise Apartments",  rent:"₹ 18,000", start:"01 Mar 2024", end:"28 Feb 2025", status:"EXPIRED" },
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
        {STATS_ROW1.map(s => (
          <div key={s.label} className="db-stat-card">
            <div className="db-stat-label">{s.label}</div>
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Stats row 2 */}
      <div className="db-stats-row row2" style={{ marginBottom: 28 }}>
        {STATS_ROW2.map(s => (
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
          <div key={a.name} className="db-action-card">
            <div className="db-action-icon">{a.icon}</div>
            <div>
              <div className="db-action-name">
                {a.name}
                <span className="db-action-tag">{a.tag}</span>
              </div>
              <div className="db-action-desc">{a.desc}</div>
            </div>
          </div>
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
            {LEASES.map(l => (
              <tr key={l.id}>
                <td data-label="Lease ID"><strong>{l.id}</strong></td>
                <td data-label="Tenant">{l.tenant}</td>
                <td data-label="Property">{l.property}</td>
                <td data-label="Monthly Rent">{l.rent}</td>
                <td data-label="Start" className="muted">{l.start}</td>
                <td data-label="End" className="muted">{l.end}</td>
                <td data-label="Status"><LeaseStatusText s={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}