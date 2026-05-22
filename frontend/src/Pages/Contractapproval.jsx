// Pages/ContractApproval.jsx
import { useState } from "react";
import "../Css/Global.css";

const mockData = [
  { id:"CA001", contractRef:"CC002", name:"Exterior Painting",      vendor:"PaintPro",        value:45000,  submittedBy:"Priya M",    submitDate:"04 Apr 2025", note:"",  status:"Pending"  },
  { id:"CA002", contractRef:"CC004", name:"Electrical Maintenance", vendor:"RK Electricals",  value:60000,  submittedBy:"Deepa R",    submitDate:"05 Apr 2025", note:"",  status:"Pending"  },
  { id:"CA003", contractRef:"CC001", name:"AC Maintenance 2025",    vendor:"CoolAir AC",      value:120000, submittedBy:"Ravi Kumar", submitDate:"02 Jan 2025", note:"Approved as per quote QA001", status:"Approved" },
  { id:"CA004", contractRef:"CC003", name:"Plumbing AMC",           vendor:"AquaFix Plumbing",value:85000,  submittedBy:"Suresh K",   submitDate:"01 Mar 2025", note:"Standard AMC approved", status:"Approved" },
];

const statusColor = { Approved:"success", Pending:"warning", Rejected:"danger" };

export default function ContractApproval() {
  const [items, setItems] = useState(mockData);
  const [filter, setFilter] = useState("All");
  const [noteModal, setNoteModal] = useState(null);
  const [note, setNote] = useState("");

  const filtered = filter==="All" ? items : items.filter(i=>i.status===filter);

  const handleApprove = (id) => {
    setItems(items.map(i=>i.id===id?{...i,status:"Approved",note}:i));
    setNoteModal(null); setNote("");
  };
  const handleReject = (id) => {
    setItems(items.map(i=>i.id===id?{...i,status:"Rejected",note}:i));
    setNoteModal(null); setNote("");
  };

  return (
    <>
      <div className="page-header">
        <h2><i className="bi bi-patch-check-fill" style={{ marginRight:8, color:"var(--maroon-main)" }}></i>Contract Approval</h2>
        <p>Review and approve submitted contracts before activation.</p>
      </div>

      <div className="stat-grid">
        {["Approved","Pending","Rejected"].map(s=>(
          <div className="stat-card" key={s}>
            <div className={`stat-icon ${statusColor[s]}`}><i className="bi bi-patch-check-fill"></i></div>
            <div><div className="stat-label">{s}</div><div className="stat-value">{items.filter(i=>i.status===s).length}</div></div>
          </div>
        ))}
        <div className="stat-card">
          <div className="stat-icon gold"><i className="bi bi-currency-rupee"></i></div>
          <div><div className="stat-label">Approved Value</div><div className="stat-value">₹{(items.filter(i=>i.status==="Approved").reduce((a,i)=>a+i.value,0)/1000).toFixed(0)}K</div></div>
        </div>
      </div>

      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap" }}>
        {["All","Pending","Approved","Rejected"].map(f=>(
          <button key={f} className={`btn-pms ${filter===f?"primary":"secondary"}`} style={{ padding:"0.4rem 0.9rem", fontSize:"0.82rem" }} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Approval note modal */}
      {noteModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div className="pms-card" style={{ maxWidth:440, width:"90%", zIndex:1000 }}>
            <h3 style={{ fontSize:"1rem", marginBottom:"0.75rem" }}>Approval Note</h3>
            <div className="field-group" style={{ marginBottom:"1rem" }}>
              <label>Add a note (optional)</label>
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Reason for approval or rejection..." />
            </div>
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button className="btn-pms success" onClick={()=>handleApprove(noteModal)}><i className="bi bi-check-lg"></i> Approve</button>
              <button className="btn-pms danger"  onClick={()=>handleReject(noteModal)}><i className="bi bi-x-lg"></i> Reject</button>
              <button className="btn-pms secondary" onClick={()=>{ setNoteModal(null); setNote(""); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="pms-card">
        <div className="pms-table-wrap">
          <table className="pms-table">
            <thead><tr><th>ID</th><th>Contract</th><th>Vendor</th><th>Value</th><th>Submitted By</th><th>Date</th><th>Note</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(i=>(
                <tr key={i.id}>
                  <td style={{ fontWeight:600, color:"var(--maroon-main)" }}>{i.id}</td>
                  <td>
                    <div style={{ fontWeight:500 }}>{i.name}</div>
                    <div style={{ fontSize:"0.75rem", color:"var(--text-muted)" }}>{i.contractRef}</div>
                  </td>
                  <td style={{ color:"var(--text-muted)" }}>{i.vendor}</td>
                  <td style={{ fontWeight:600 }}>₹{i.value.toLocaleString("en-IN")}</td>
                  <td style={{ fontSize:"0.82rem" }}>{i.submittedBy}</td>
                  <td style={{ fontSize:"0.82rem", color:"var(--text-muted)" }}>{i.submitDate}</td>
                  <td style={{ fontSize:"0.78rem", color:"var(--text-muted)", maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{i.note||"—"}</td>
                  <td><span className={`badge-pms ${statusColor[i.status]}`}>{i.status}</span></td>
                  <td>
                    {i.status==="Pending"
                      ? <button className="btn-pms sm primary" onClick={()=>setNoteModal(i.id)}><i className="bi bi-patch-check"></i> Review</button>
                      : <button className="btn-pms sm secondary"><i className="bi bi-eye"></i></button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}