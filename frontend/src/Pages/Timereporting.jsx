// Pages/TimeReporting.jsx
import { useState } from "react";
import "../Css/Global.css";

const employees = ["Ravi Kumar","Priya M","Suresh K","Deepa R","Anand S"];
const mockTimesheets = [
  { id:"TR001", employee:"Ravi Kumar",  date:"01 Apr 2025", project:"Sunrise Maintenance", hours:8, overtime:1, status:"Approved" },
  { id:"TR002", employee:"Priya M",     date:"01 Apr 2025", project:"Royal Residency Admin",hours:7.5, overtime:0, status:"Approved" },
  { id:"TR003", employee:"Suresh K",    date:"02 Apr 2025", project:"Tech Park Electrical", hours:9, overtime:2, status:"Pending"  },
  { id:"TR004", employee:"Deepa R",     date:"02 Apr 2025", project:"Customer Support",     hours:8, overtime:0, status:"Pending"  },
  { id:"TR005", employee:"Anand S",     date:"03 Apr 2025", project:"Vendor Coordination",  hours:6, overtime:0, status:"Draft"    },
];

const statusColor = { Approved:"success", Pending:"warning", Draft:"neutral" };

export default function TimeReporting() {
  const [timesheets]     = useState(mockTimesheets);
  const [showForm, setShow] = useState(false);
  const [filterEmp, setFilterEmp] = useState("All");

  const filtered = filterEmp === "All" ? timesheets : timesheets.filter(t => t.employee === filterEmp);
  const totalHours = filtered.reduce((a,t) => a + t.hours, 0);
  const totalOT    = filtered.reduce((a,t) => a + t.overtime, 0);

  return (
    <>
      <div className="page-header">
        <h2>Time Reporting</h2>
        <p>Log and review daily & weekly employee timesheets.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon maroon"><i className="bi bi-clock-fill"></i></div>
          <div><div className="stat-label">Total Hours</div><div className="stat-value">{totalHours}h</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><i className="bi bi-clock-history"></i></div>
          <div><div className="stat-label">Overtime</div><div className="stat-value">{totalOT}h</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><i className="bi bi-person-check-fill"></i></div>
          <div><div className="stat-label">Approved</div><div className="stat-value">{filtered.filter(t=>t.status==="Approved").length}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info"><i className="bi bi-people-fill"></i></div>
          <div><div className="stat-label">Employees</div><div className="stat-value">{employees.length}</div></div>
        </div>
      </div>

      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
        <select
          style={{ border:"1.5px solid var(--border)", borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.88rem", background:"var(--white)", fontFamily:"DM Sans,sans-serif", color:"var(--text-dark)", minWidth:180 }}
          value={filterEmp} onChange={e => setFilterEmp(e.target.value)}
        >
          <option value="All">All Employees</option>
          {employees.map(e => <option key={e}>{e}</option>)}
        </select>
        <button className="btn-pms primary" style={{ marginLeft:"auto" }} onClick={() => setShow(!showForm)}>
          <i className="bi bi-plus-lg"></i> Log Hours
        </button>
      </div>

      {showForm && (
        <div className="pms-card" style={{ marginBottom:"1.25rem" }}>
          <h3 style={{ fontSize:"1rem", marginBottom:"1rem" }}>Log Timesheet</h3>
          <form onSubmit={e => { e.preventDefault(); setShow(false); }}>
            <div className="form-grid" style={{ marginBottom:"1rem" }}>
              <div className="field-group"><label>Employee</label>
                <select><option>Select...</option>{employees.map(e=><option key={e}>{e}</option>)}</select>
              </div>
              <div className="field-group"><label>Date</label><input type="date" /></div>
              <div className="field-group"><label>Project / Task</label><input placeholder="Sunrise Maintenance" /></div>
              <div className="field-group"><label>Regular Hours</label><input type="number" step="0.5" placeholder="8" /></div>
              <div className="field-group"><label>Overtime Hours</label><input type="number" step="0.5" placeholder="0" /></div>
              <div className="field-group"><label>Status</label>
                <select><option>Draft</option><option>Pending</option><option>Approved</option></select>
              </div>
              <div className="field-group form-full"><label>Remarks</label><textarea placeholder="Work done today..." /></div>
            </div>
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button className="btn-pms primary" type="submit"><i className="bi bi-check-lg"></i> Save</button>
              <button className="btn-pms secondary" type="button" onClick={() => setShow(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="pms-card">
        <div className="pms-table-wrap">
          <table className="pms-table">
            <thead>
              <tr><th>ID</th><th>Employee</th><th>Date</th><th>Project</th><th>Hours</th><th>Overtime</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight:600, color:"var(--maroon-main)" }}>{t.id}</td>
                  <td style={{ fontWeight:500 }}>{t.employee}</td>
                  <td style={{ color:"var(--text-muted)", fontSize:"0.82rem" }}>{t.date}</td>
                  <td>{t.project}</td>
                  <td><span style={{ fontWeight:600 }}>{t.hours}h</span></td>
                  <td>{t.overtime > 0 ? <span style={{ color:"var(--gold)", fontWeight:600 }}>+{t.overtime}h</span> : <span style={{ color:"var(--text-muted)" }}>—</span>}</td>
                  <td><span className={`badge-pms ${statusColor[t.status]}`}>{t.status}</span></td>
                  <td><div style={{ display:"flex", gap:"0.4rem" }}>
                    {t.status === "Pending" && <button className="btn-pms sm success"><i className="bi bi-check-lg"></i></button>}
                    <button className="btn-pms sm secondary"><i className="bi bi-pencil"></i></button>
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