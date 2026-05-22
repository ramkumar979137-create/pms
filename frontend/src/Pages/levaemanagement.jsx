// Pages/LeaveManagement.jsx
import { useState } from "react";
import "../Css/Global.css";

const mockLeaves = [
  { id:"LV001", employee:"Ravi Kumar",  type:"Casual",   from:"07 Apr 2025", to:"08 Apr 2025", days:2, reason:"Personal work",  status:"Approved" },
  { id:"LV002", employee:"Priya M",     type:"Sick",     from:"03 Apr 2025", to:"04 Apr 2025", days:2, reason:"Fever",          status:"Approved" },
  { id:"LV003", employee:"Suresh K",    type:"Annual",   from:"10 Apr 2025", to:"14 Apr 2025", days:5, reason:"Family vacation", status:"Pending"  },
  { id:"LV004", employee:"Deepa R",     type:"Casual",   from:"05 Apr 2025", to:"05 Apr 2025", days:1, reason:"Appointment",    status:"Pending"  },
  { id:"LV005", employee:"Anand S",     type:"Sick",     from:"02 Apr 2025", to:"02 Apr 2025", days:1, reason:"Headache",       status:"Rejected" },
];

const leaveTypes  = ["Casual","Sick","Annual","Maternity","Emergency"];
const statusColor = { Approved:"success", Pending:"warning", Rejected:"danger" };
const typeColor   = { Casual:"info", Sick:"danger", Annual:"success", Maternity:"neutral", Emergency:"warning" };

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState(mockLeaves);
  const [showForm, setShow] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = filterStatus === "All" ? leaves : leaves.filter(l => l.status === filterStatus);

  const handleApprove = (id) => setLeaves(leaves.map(l => l.id===id ? {...l, status:"Approved"} : l));
  const handleReject  = (id) => setLeaves(leaves.map(l => l.id===id ? {...l, status:"Rejected"} : l));

  return (
    <>
      <div className="page-header">
        <h2>Leave Management</h2>
        <p>Manage employee leave requests and notify team on approvals.</p>
      </div>

      <div className="stat-grid">
        {["Approved","Pending","Rejected"].map(s => (
          <div className="stat-card" key={s}>
            <div className={`stat-icon ${statusColor[s]}`}><i className="bi bi-calendar2-check-fill"></i></div>
            <div>
              <div className="stat-label">{s} Leaves</div>
              <div className="stat-value">{leaves.filter(l=>l.status===s).length}</div>
            </div>
          </div>
        ))}
        <div className="stat-card">
          <div className="stat-icon maroon"><i className="bi bi-calendar3"></i></div>
          <div>
            <div className="stat-label">Total Days</div>
            <div className="stat-value">{leaves.reduce((a,l)=>a+l.days,0)}</div>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
        {["All","Pending","Approved","Rejected"].map(f => (
          <button key={f} className={`btn-pms ${filterStatus===f?"primary":"secondary"}`}
            style={{ padding:"0.4rem 0.9rem", fontSize:"0.82rem" }} onClick={() => setFilterStatus(f)}>{f}</button>
        ))}
        <button className="btn-pms gold" style={{ marginLeft:"auto" }} onClick={() => setShow(!showForm)}>
          <i className="bi bi-plus-lg"></i> Apply Leave
        </button>
      </div>

      {showForm && (
        <div className="pms-card" style={{ marginBottom:"1.25rem" }}>
          <h3 style={{ fontSize:"1rem", marginBottom:"1rem" }}>Leave Application</h3>
          <form onSubmit={e => { e.preventDefault(); setShow(false); }}>
            <div className="form-grid" style={{ marginBottom:"1rem" }}>
              <div className="field-group"><label>Employee</label><input placeholder="Employee name" /></div>
              <div className="field-group"><label>Leave Type</label>
                <select>{leaveTypes.map(t=><option key={t}>{t}</option>)}</select>
              </div>
              <div className="field-group"><label>From Date</label><input type="date" /></div>
              <div className="field-group"><label>To Date</label><input type="date" /></div>
              <div className="field-group form-full"><label>Reason</label><textarea placeholder="Reason for leave..." /></div>
            </div>
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button className="btn-pms primary" type="submit"><i className="bi bi-send"></i> Submit</button>
              <button className="btn-pms secondary" type="button" onClick={() => setShow(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="pms-card">
        <div className="pms-table-wrap">
          <table className="pms-table">
            <thead>
              <tr><th>ID</th><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td style={{ fontWeight:600, color:"var(--maroon-main)" }}>{l.id}</td>
                  <td style={{ fontWeight:500 }}>{l.employee}</td>
                  <td><span className={`badge-pms ${typeColor[l.type]}`}>{l.type}</span></td>
                  <td style={{ fontSize:"0.82rem", color:"var(--text-muted)" }}>{l.from}</td>
                  <td style={{ fontSize:"0.82rem", color:"var(--text-muted)" }}>{l.to}</td>
                  <td style={{ fontWeight:600 }}>{l.days}</td>
                  <td style={{ maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.reason}</td>
                  <td><span className={`badge-pms ${statusColor[l.status]}`}>{l.status}</span></td>
                  <td><div style={{ display:"flex", gap:"0.4rem" }}>
                    {l.status === "Pending" && <>
                      <button className="btn-pms sm success" onClick={() => handleApprove(l.id)}><i className="bi bi-check-lg"></i></button>
                      <button className="btn-pms sm danger"  onClick={() => handleReject(l.id)}><i className="bi bi-x-lg"></i></button>
                    </>}
                    {l.status !== "Pending" && <button className="btn-pms sm secondary"><i className="bi bi-eye"></i></button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}