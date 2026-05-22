// Pages/Maintenance.jsx
import { useState } from "react";
import "../Css/Global.css";

const mockData = [
  { id:"MR001", property:"Sunrise Apt", unit:"2A", issue:"AC not cooling",       category:"HVAC",        priority:"High",     assignedTo:"CoolAir AC",      reported:"01 Apr 2025", status:"Open"        },
  { id:"MR002", property:"Royal Residency", unit:"5B", issue:"Plumbing leak",   category:"Plumbing",    priority:"Critical", assignedTo:"AquaFix",         reported:"02 Apr 2025", status:"In Progress" },
  { id:"MR003", property:"Green Villa",  unit:"3",   issue:"Interior painting",  category:"Painting",    priority:"Low",      assignedTo:"PaintPro",        reported:"28 Mar 2025", status:"Completed"   },
  { id:"MR004", property:"Tech Park",    unit:"1A",  issue:"Electrical fault",   category:"Electrical",  priority:"High",     assignedTo:"RK Electricals",  reported:"03 Apr 2025", status:"Open"        },
  { id:"MR005", property:"City Hub",     unit:"4B",  issue:"Door lock broken",   category:"Carpentry",   priority:"Medium",   assignedTo:"FixIt Services",  reported:"04 Apr 2025", status:"In Progress" },
];

const empty = { property:"", unit:"", issue:"", category:"Electrical", priority:"Medium", assignedTo:"", reported:"" };
const statusColor   = { Open:"warning", "In Progress":"info", Completed:"success", Cancelled:"danger" };
const priorityColor = { Critical:"danger", High:"warning", Medium:"info", Low:"neutral" };
const categories    = ["Electrical","Plumbing","HVAC","Painting","Carpentry","Civil","Other"];
const priorities    = ["Critical","High","Medium","Low"];

export default function Maintenance() {
  const [items, setItems]   = useState(mockData);
  const [showForm, setShow] = useState(false);
  const [form, setForm]     = useState(empty);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = items
    .filter(i=>filter==="All"||i.status===filter)
    .filter(i=>i.issue.toLowerCase().includes(search.toLowerCase())||i.property.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (e) => {
    e.preventDefault();
    setItems([...items, { ...form, id:"MR"+String(items.length+1).padStart(3,"0"), status:"Open" }]);
    setForm(empty); setShow(false);
  };

  const markDone = (id) => setItems(items.map(i=>i.id===id?{...i,status:"Completed"}:i));

  return (
    <>
      <div className="page-header">
        <h2><i className="bi bi-tools" style={{ marginRight:8, color:"var(--maroon-main)" }}></i>Maintenance Requests</h2>
        <p>Track and manage all property maintenance work orders.</p>
      </div>

      <div className="stat-grid">
        {["Open","In Progress","Completed"].map(s=>(
          <div className="stat-card" key={s}>
            <div className={`stat-icon ${statusColor[s]}`}><i className="bi bi-tools"></i></div>
            <div><div className="stat-label">{s}</div><div className="stat-value">{items.filter(i=>i.status===s).length}</div></div>
          </div>
        ))}
        <div className="stat-card">
          <div className="stat-icon danger"><i className="bi bi-exclamation-triangle-fill"></i></div>
          <div><div className="stat-label">Critical</div><div className="stat-value">{items.filter(i=>i.priority==="Critical").length}</div></div>
        </div>
      </div>

      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
        <input style={{ flex:1, minWidth:180, border:"1.5px solid var(--border)", borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.88rem", background:"var(--white)", fontFamily:"DM Sans,sans-serif", color:"var(--text-dark)" }}
          placeholder="🔍  Search issue or property..." value={search} onChange={e=>setSearch(e.target.value)} />
        {["All","Open","In Progress","Completed"].map(f=>(
          <button key={f} className={`btn-pms ${filter===f?"primary":"secondary"}`} style={{ padding:"0.4rem 0.9rem", fontSize:"0.82rem" }} onClick={()=>setFilter(f)}>{f}</button>
        ))}
        <button className="btn-pms gold" onClick={()=>setShow(!showForm)}>
          <i className="bi bi-plus-lg"></i> New Request
        </button>
      </div>

      {showForm && (
        <div className="pms-card" style={{ marginBottom:"1.25rem" }}>
          <h3 style={{ fontSize:"1rem", marginBottom:"1rem" }}>New Maintenance Request</h3>
          <form onSubmit={handleAdd}>
            <div className="form-grid" style={{ marginBottom:"1rem" }}>
              <div className="field-group"><label>Property *</label><input required value={form.property} onChange={e=>setForm({...form,property:e.target.value})} /></div>
              <div className="field-group"><label>Unit No</label><input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} /></div>
              <div className="field-group"><label>Category</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {categories.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field-group"><label>Priority</label>
                <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                  {priorities.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="field-group"><label>Assigned To</label><input value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})} placeholder="Vendor / Team" /></div>
              <div className="field-group"><label>Reported Date</label><input type="date" value={form.reported} onChange={e=>setForm({...form,reported:e.target.value})} /></div>
              <div className="field-group form-full"><label>Issue Description *</label><textarea required value={form.issue} onChange={e=>setForm({...form,issue:e.target.value})} placeholder="Describe the issue..." /></div>
            </div>
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button className="btn-pms primary" type="submit"><i className="bi bi-check-lg"></i> Submit</button>
              <button className="btn-pms secondary" type="button" onClick={()=>setShow(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="pms-card">
        <div className="pms-table-wrap">
          <table className="pms-table">
            <thead><tr><th>ID</th><th>Property</th><th>Unit</th><th>Issue</th><th>Category</th><th>Priority</th><th>Assigned To</th><th>Reported</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(i=>(
                <tr key={i.id}>
                  <td style={{ fontWeight:600, color:"var(--maroon-main)" }}>{i.id}</td>
                  <td style={{ fontWeight:500 }}>{i.property}</td>
                  <td style={{ color:"var(--text-muted)" }}>{i.unit}</td>
                  <td style={{ maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{i.issue}</td>
                  <td><span className="badge-pms neutral">{i.category}</span></td>
                  <td><span className={`badge-pms ${priorityColor[i.priority]}`}>{i.priority}</span></td>
                  <td style={{ fontSize:"0.82rem" }}>{i.assignedTo}</td>
                  <td style={{ fontSize:"0.82rem", color:"var(--text-muted)" }}>{i.reported}</td>
                  <td><span className={`badge-pms ${statusColor[i.status]}`}>{i.status}</span></td>
                  <td><div style={{ display:"flex", gap:"0.4rem" }}>
                    {i.status!=="Completed"&&<button className="btn-pms sm success" onClick={()=>markDone(i.id)}><i className="bi bi-check-lg"></i></button>}
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