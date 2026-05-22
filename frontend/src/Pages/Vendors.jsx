// Pages/Vendors.jsx
import { useState } from "react";
import "../Css/Global.css";

const mockData = [
  { id:"V001", name:"RK Electricals",  service:"Electrical", contact:"Ramesh Kumar",  phone:"9876512345", city:"Chennai",    rating:4.5, jobs:12, status:"Active"   },
  { id:"V002", name:"AquaFix Plumbing",service:"Plumbing",   contact:"Ajay Verma",    phone:"9765432198", city:"Bangalore",  rating:4.8, jobs:8,  status:"Active"   },
  { id:"V003", name:"PaintPro",        service:"Painting",   contact:"Pradeep Singh", phone:"9654321089", city:"Chennai",    rating:4.2, jobs:5,  status:"Inactive" },
  { id:"V004", name:"CoolAir AC",      service:"HVAC",       contact:"Sunil Mehta",   phone:"9543210978", city:"Hyderabad",  rating:4.7, jobs:15, status:"Active"   },
  { id:"V005", name:"FixIt Services",  service:"Carpentry",  contact:"Ravi Das",      phone:"9432109867", city:"Mumbai",     rating:4.0, jobs:3,  status:"Active"   },
  { id:"V006", name:"CivilPro Builders",service:"Civil",     contact:"Arun Nair",     phone:"9321098756", city:"Chennai",    rating:4.6, jobs:7,  status:"Active"   },
];

const empty = { name:"", service:"Electrical", contact:"", phone:"", city:"", rating:"", status:"Active" };
const services = ["Electrical","Plumbing","HVAC","Painting","Carpentry","Civil","General","Security"];
const statusColor = { Active:"success", Inactive:"danger" };

export default function Vendors() {
  const [items, setItems]   = useState(mockData);
  const [showForm, setShow] = useState(false);
  const [form, setForm]     = useState(empty);
  const [search, setSearch] = useState("");
  const [filterSvc, setFilterSvc] = useState("All");

  const allServices = ["All", ...new Set(items.map(i=>i.service))];
  const filtered = items
    .filter(i=>filterSvc==="All"||i.service===filterSvc)
    .filter(i=>i.name.toLowerCase().includes(search.toLowerCase())||i.city.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (e) => {
    e.preventDefault();
    setItems([...items, { ...form, id:"V"+String(items.length+1).padStart(3,"0"), rating:Number(form.rating)||0, jobs:0 }]);
    setForm(empty); setShow(false);
  };

  const RatingStars = ({ r }) => {
    const stars = Math.round(r);
    return (
      <span style={{ color:"var(--gold)", fontSize:"0.82rem" }}>
        {"★".repeat(stars)}{"☆".repeat(5-stars)} <span style={{ color:"var(--text-muted)", marginLeft:2 }}>{r}</span>
      </span>
    );
  };

  return (
    <>
      <div className="page-header">
        <h2><i className="bi bi-truck" style={{ marginRight:8, color:"var(--maroon-main)" }}></i>Vendor Management</h2>
        <p>Manage service vendors, contractors, and their performance.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-icon maroon"><i className="bi bi-truck"></i></div><div><div className="stat-label">Total Vendors</div><div className="stat-value">{items.length}</div></div></div>
        <div className="stat-card"><div className="stat-icon success"><i className="bi bi-check-circle-fill"></i></div><div><div className="stat-label">Active</div><div className="stat-value">{items.filter(i=>i.status==="Active").length}</div></div></div>
        <div className="stat-card"><div className="stat-icon gold"><i className="bi bi-star-fill"></i></div><div><div className="stat-label">Avg Rating</div><div className="stat-value">{(items.reduce((a,i)=>a+i.rating,0)/items.length).toFixed(1)}★</div></div></div>
        <div className="stat-card"><div className="stat-icon info"><i className="bi bi-clipboard-check-fill"></i></div><div><div className="stat-label">Total Jobs</div><div className="stat-value">{items.reduce((a,i)=>a+i.jobs,0)}</div></div></div>
      </div>

      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
        <input style={{ flex:1, minWidth:180, border:"1.5px solid var(--border)", borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.88rem", background:"var(--white)", fontFamily:"DM Sans,sans-serif", color:"var(--text-dark)" }}
          placeholder="🔍  Search vendor or city..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select style={{ border:"1.5px solid var(--border)", borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.88rem", background:"var(--white)", fontFamily:"DM Sans,sans-serif", color:"var(--text-dark)" }}
          value={filterSvc} onChange={e=>setFilterSvc(e.target.value)}>
          {allServices.map(s=><option key={s}>{s}</option>)}
        </select>
        <button className="btn-pms gold" onClick={()=>setShow(!showForm)}>
          <i className="bi bi-plus-lg"></i> Add Vendor
        </button>
      </div>

      {showForm && (
        <div className="pms-card" style={{ marginBottom:"1.25rem" }}>
          <h3 style={{ fontSize:"1rem", marginBottom:"1rem" }}>New Vendor</h3>
          <form onSubmit={handleAdd}>
            <div className="form-grid" style={{ marginBottom:"1rem" }}>
              <div className="field-group"><label>Vendor Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="field-group"><label>Service Type</label>
                <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                  {services.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field-group"><label>Contact Person</label><input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} /></div>
              <div className="field-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div className="field-group"><label>City</label><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></div>
              <div className="field-group"><label>Initial Rating (1-5)</label><input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})} /></div>
              <div className="field-group"><label>Status</label>
                <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button className="btn-pms primary" type="submit"><i className="bi bi-check-lg"></i> Save</button>
              <button className="btn-pms secondary" type="button" onClick={()=>setShow(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="pms-card">
        <div className="pms-table-wrap">
          <table className="pms-table">
            <thead><tr><th>ID</th><th>Vendor Name</th><th>Service</th><th>Contact</th><th>Phone</th><th>City</th><th>Rating</th><th>Jobs</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(i=>(
                <tr key={i.id}>
                  <td style={{ fontWeight:600, color:"var(--maroon-main)" }}>{i.id}</td>
                  <td style={{ fontWeight:600 }}>{i.name}</td>
                  <td><span className="badge-pms neutral">{i.service}</span></td>
                  <td style={{ fontSize:"0.82rem" }}>{i.contact}</td>
                  <td style={{ color:"var(--text-muted)", fontSize:"0.82rem" }}>{i.phone}</td>
                  <td>{i.city}</td>
                  <td><RatingStars r={i.rating} /></td>
                  <td style={{ fontWeight:600, textAlign:"center" }}>{i.jobs}</td>
                  <td><span className={`badge-pms ${statusColor[i.status]}`}>{i.status}</span></td>
                  <td><div style={{ display:"flex", gap:"0.4rem" }}>
                    <button className="btn-pms sm secondary"><i className="bi bi-pencil"></i></button>
                    <button className="btn-pms sm danger"><i className="bi bi-trash"></i></button>
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