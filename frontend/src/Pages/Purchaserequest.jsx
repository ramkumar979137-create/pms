// Pages/PurchaseRequest.jsx
import { useState } from "react";
import "../Css/Global.css";

const mockData = [
  { id:"PR001", item:"Plumbing Pipes 1 inch",  qty:10, unit:"Nos",  property:"Sunrise Apt",     reqBy:"Ravi Kumar",  reqDate:"01 Apr 2025", estCost:5000,  status:"Approved" },
  { id:"PR002", item:"Paint - White 20L",       qty:5,  unit:"Cans", property:"Royal Residency", reqBy:"Priya M",     reqDate:"02 Apr 2025", estCost:12500, status:"Pending"  },
  { id:"PR003", item:"Electrical Cables 4mm",   qty:30, unit:"Mtr",  property:"Tech Park",       reqBy:"Suresh K",    reqDate:"03 Apr 2025", estCost:4500,  status:"Rejected" },
  { id:"PR004", item:"Door Locks (Heavy Duty)",  qty:8,  unit:"Nos",  property:"Green Villa",     reqBy:"Deepa R",     reqDate:"04 Apr 2025", estCost:9600,  status:"Pending"  },
  { id:"PR005", item:"Ceramic Floor Tiles",      qty:200,unit:"SqFt", property:"City Hub",        reqBy:"Anand S",     reqDate:"05 Apr 2025", estCost:28000, status:"Approved" },
];

const empty = { item:"", qty:"", unit:"Nos", property:"", reqBy:"", reqDate:"", estCost:"" };
const statusColor = { Approved:"success", Pending:"warning", Rejected:"danger" };
const units = ["Nos","Mtr","Kg","Ltr","SqFt","Bags","Cans","Rolls","Sets"];

export default function PurchaseRequest() {
  const [items, setItems]   = useState(mockData);
  const [showForm, setShow] = useState(false);
  const [form, setForm]     = useState(empty);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = items
    .filter(i=>filter==="All"||i.status===filter)
    .filter(i=>i.item.toLowerCase().includes(search.toLowerCase())||i.property.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (e) => {
    e.preventDefault();
    setItems([...items, { ...form, id:"PR"+String(items.length+1).padStart(3,"0"), qty:Number(form.qty), estCost:Number(form.estCost), status:"Pending" }]);
    setForm(empty); setShow(false);
  };

  const updateStatus = (id, status) => setItems(items.map(i=>i.id===id?{...i,status}:i));

  return (
    <>
      <div className="page-header">
        <h2><i className="bi bi-cart-fill" style={{ marginRight:8, color:"var(--maroon-main)" }}></i>Purchase Request</h2>
        <p>Raise and manage material purchase requests for properties.</p>
      </div>

      <div className="stat-grid">
        {["Approved","Pending","Rejected"].map(s=>(
          <div className="stat-card" key={s}>
            <div className={`stat-icon ${statusColor[s]}`}><i className="bi bi-cart-fill"></i></div>
            <div><div className="stat-label">{s}</div><div className="stat-value">{items.filter(i=>i.status===s).length}</div></div>
          </div>
        ))}
        <div className="stat-card">
          <div className="stat-icon gold"><i className="bi bi-currency-rupee"></i></div>
          <div><div className="stat-label">Total Est. Cost</div><div className="stat-value">₹{(items.filter(i=>i.status==="Approved").reduce((a,i)=>a+i.estCost,0)/1000).toFixed(1)}K</div></div>
        </div>
      </div>

      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
        <input style={{ flex:1, minWidth:180, border:"1.5px solid var(--border)", borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.88rem", background:"var(--white)", fontFamily:"DM Sans,sans-serif", color:"var(--text-dark)" }}
          placeholder="🔍  Search item or property..." value={search} onChange={e=>setSearch(e.target.value)} />
        {["All","Pending","Approved","Rejected"].map(f=>(
          <button key={f} className={`btn-pms ${filter===f?"primary":"secondary"}`} style={{ padding:"0.4rem 0.9rem", fontSize:"0.82rem" }} onClick={()=>setFilter(f)}>{f}</button>
        ))}
        <button className="btn-pms gold" onClick={()=>setShow(!showForm)}>
          <i className="bi bi-plus-lg"></i> Raise Request
        </button>
      </div>

      {showForm && (
        <div className="pms-card" style={{ marginBottom:"1.25rem" }}>
          <h3 style={{ fontSize:"1rem", marginBottom:"1rem" }}>New Purchase Request</h3>
          <form onSubmit={handleAdd}>
            <div className="form-grid" style={{ marginBottom:"1rem" }}>
              <div className="field-group form-full"><label>Item Description *</label><input required value={form.item} onChange={e=>setForm({...form,item:e.target.value})} placeholder="Plumbing Pipes 1 inch" /></div>
              <div className="field-group"><label>Quantity *</label><input required type="number" value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})} /></div>
              <div className="field-group"><label>Unit</label>
                <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>
                  {units.map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="field-group"><label>Property *</label><input required value={form.property} onChange={e=>setForm({...form,property:e.target.value})} /></div>
              <div className="field-group"><label>Requested By</label><input value={form.reqBy} onChange={e=>setForm({...form,reqBy:e.target.value})} /></div>
              <div className="field-group"><label>Required Date</label><input type="date" value={form.reqDate} onChange={e=>setForm({...form,reqDate:e.target.value})} /></div>
              <div className="field-group"><label>Estimated Cost (₹)</label><input type="number" value={form.estCost} onChange={e=>setForm({...form,estCost:e.target.value})} /></div>
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
            <thead><tr><th>ID</th><th>Item</th><th>Qty</th><th>Unit</th><th>Property</th><th>Req By</th><th>Date</th><th>Est. Cost</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(i=>(
                <tr key={i.id}>
                  <td style={{ fontWeight:600, color:"var(--maroon-main)" }}>{i.id}</td>
                  <td style={{ fontWeight:500, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{i.item}</td>
                  <td style={{ textAlign:"center", fontWeight:600 }}>{i.qty}</td>
                  <td><span className="badge-pms neutral">{i.unit}</span></td>
                  <td style={{ color:"var(--text-muted)", fontSize:"0.82rem" }}>{i.property}</td>
                  <td style={{ fontSize:"0.82rem" }}>{i.reqBy}</td>
                  <td style={{ fontSize:"0.82rem", color:"var(--text-muted)" }}>{i.reqDate}</td>
                  <td style={{ fontWeight:600 }}>₹{i.estCost.toLocaleString("en-IN")}</td>
                  <td><span className={`badge-pms ${statusColor[i.status]}`}>{i.status}</span></td>
                  <td><div style={{ display:"flex", gap:"0.4rem" }}>
                    {i.status==="Pending"&&<>
                      <button className="btn-pms sm success" onClick={()=>updateStatus(i.id,"Approved")}><i className="bi bi-check-lg"></i></button>
                      <button className="btn-pms sm danger"  onClick={()=>updateStatus(i.id,"Rejected")}><i className="bi bi-x-lg"></i></button>
                    </>}
                    {i.status!=="Pending"&&<button className="btn-pms sm secondary"><i className="bi bi-eye"></i></button>}
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