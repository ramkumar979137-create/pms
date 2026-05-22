// Pages/ContractCreation.jsx
import { useState } from "react";
import "../Css/Global.css";

const mockData = [
  { id:"CC001", name:"AC Maintenance 2025",    vendor:"CoolAir AC",        value:120000, start:"01 Jan 2025", end:"31 Dec 2025", createdBy:"Ravi Kumar",  status:"Active"  },
  { id:"CC002", name:"Exterior Painting",      vendor:"PaintPro",           value:45000,  start:"15 Apr 2025", end:"30 Apr 2025", createdBy:"Priya M",     status:"Draft"   },
  { id:"CC003", name:"Plumbing AMC",           vendor:"AquaFix Plumbing",   value:85000,  start:"01 Mar 2025", end:"28 Feb 2026", createdBy:"Suresh K",    status:"Active"  },
  { id:"CC004", name:"Electrical Maintenance", vendor:"RK Electricals",     value:60000,  start:"01 Apr 2025", end:"31 Mar 2026", createdBy:"Deepa R",     status:"Draft"   },
];

const empty = { name:"", vendor:"", value:"", start:"", end:"", createdBy:"", scope:"" };
const statusColor = { Active:"success", Draft:"neutral", Expired:"danger", Cancelled:"danger" };

export default function ContractCreation() {
  const [items, setItems]   = useState(mockData);
  const [showForm, setShow] = useState(false);
  const [form, setForm]     = useState(empty);
  const [filter, setFilter] = useState("All");

  const filtered = filter==="All" ? items : items.filter(i=>i.status===filter);

  const handleAdd = (e) => {
    e.preventDefault();
    setItems([...items, { ...form, id:"CC"+String(items.length+1).padStart(3,"0"), value:Number(form.value), status:"Draft" }]);
    setForm(empty); setShow(false);
  };

  const activate = (id) => setItems(items.map(i=>i.id===id?{...i,status:"Active"}:i));

  return (
    <>
      <div className="page-header">
        <h2><i className="bi bi-pen-fill" style={{ marginRight:8, color:"var(--maroon-main)" }}></i>Contract Creation</h2>
        <p>Draft and manage vendor service contracts.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-icon maroon"><i className="bi bi-pen-fill"></i></div><div><div className="stat-label">Total Contracts</div><div className="stat-value">{items.length}</div></div></div>
        <div className="stat-card"><div className="stat-icon success"><i className="bi bi-check-circle-fill"></i></div><div><div className="stat-label">Active</div><div className="stat-value">{items.filter(i=>i.status==="Active").length}</div></div></div>
        <div className="stat-card"><div className="stat-icon neutral"><i className="bi bi-file-earmark-text"></i></div><div><div className="stat-label">Drafts</div><div className="stat-value">{items.filter(i=>i.status==="Draft").length}</div></div></div>
        <div className="stat-card"><div className="stat-icon gold"><i className="bi bi-currency-rupee"></i></div><div><div className="stat-label">Total Value</div><div className="stat-value">₹{(items.filter(i=>i.status==="Active").reduce((a,i)=>a+i.value,0)/1000).toFixed(0)}K</div></div></div>
      </div>

      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
        {["All","Active","Draft","Expired"].map(f=>(
          <button key={f} className={`btn-pms ${filter===f?"primary":"secondary"}`} style={{ padding:"0.4rem 0.9rem", fontSize:"0.82rem" }} onClick={()=>setFilter(f)}>{f}</button>
        ))}
        <button className="btn-pms gold" style={{ marginLeft:"auto" }} onClick={()=>setShow(!showForm)}>
          <i className="bi bi-plus-lg"></i> Create Contract
        </button>
      </div>

      {showForm && (
        <div className="pms-card" style={{ marginBottom:"1.25rem" }}>
          <h3 style={{ fontSize:"1rem", marginBottom:"1rem" }}>New Contract</h3>
          <form onSubmit={handleAdd}>
            <div className="form-grid" style={{ marginBottom:"1rem" }}>
              <div className="field-group form-full"><label>Contract Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="AC Maintenance 2025" /></div>
              <div className="field-group"><label>Vendor *</label><input required value={form.vendor} onChange={e=>setForm({...form,vendor:e.target.value})} /></div>
              <div className="field-group"><label>Contract Value (₹) *</label><input required type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})} /></div>
              <div className="field-group"><label>Start Date</label><input type="date" value={form.start} onChange={e=>setForm({...form,start:e.target.value})} /></div>
              <div className="field-group"><label>End Date</label><input type="date" value={form.end} onChange={e=>setForm({...form,end:e.target.value})} /></div>
              <div className="field-group"><label>Created By</label><input value={form.createdBy} onChange={e=>setForm({...form,createdBy:e.target.value})} /></div>
              <div className="field-group form-full"><label>Scope of Work</label><textarea value={form.scope} onChange={e=>setForm({...form,scope:e.target.value})} placeholder="Describe the scope of work..." /></div>
            </div>
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button className="btn-pms primary" type="submit"><i className="bi bi-check-lg"></i> Save Draft</button>
              <button className="btn-pms secondary" type="button" onClick={()=>setShow(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="pms-card">
        <div className="pms-table-wrap">
          <table className="pms-table">
            <thead><tr><th>ID</th><th>Contract Name</th><th>Vendor</th><th>Value</th><th>Start</th><th>End</th><th>Created By</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(i=>(
                <tr key={i.id}>
                  <td style={{ fontWeight:600, color:"var(--maroon-main)" }}>{i.id}</td>
                  <td style={{ fontWeight:500 }}>{i.name}</td>
                  <td style={{ color:"var(--text-muted)" }}>{i.vendor}</td>
                  <td style={{ fontWeight:600 }}>₹{i.value.toLocaleString("en-IN")}</td>
                  <td style={{ fontSize:"0.82rem" }}>{i.start}</td>
                  <td style={{ fontSize:"0.82rem" }}>{i.end}</td>
                  <td style={{ fontSize:"0.82rem", color:"var(--text-muted)" }}>{i.createdBy}</td>
                  <td><span className={`badge-pms ${statusColor[i.status]}`}>{i.status}</span></td>
                  <td><div style={{ display:"flex", gap:"0.4rem" }}>
                    {i.status==="Draft"&&<button className="btn-pms sm success" onClick={()=>activate(i.id)}><i className="bi bi-send"></i> Submit</button>}
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