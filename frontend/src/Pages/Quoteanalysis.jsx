// Pages/QuoteAnalysis.jsx
import { useState } from "react";
import "../Css/Global.css";

const mockData = [
  { id:"QA001", item:"AC Unit 1.5 Ton",      pr:"PR006", vendor:"CoolAir AC",       amount:38000, validTill:"30 Apr 2025", compared:3, selected:true,  status:"Selected"  },
  { id:"QA002", item:"AC Unit 1.5 Ton",      pr:"PR006", vendor:"AirCool India",    amount:41000, validTill:"30 Apr 2025", compared:3, selected:false, status:"Rejected"  },
  { id:"QA003", item:"AC Unit 1.5 Ton",      pr:"PR006", vendor:"FrostTech",        amount:39500, validTill:"30 Apr 2025", compared:3, selected:false, status:"Rejected"  },
  { id:"QA004", item:"Exterior Paint 20L",   pr:"PR002", vendor:"PaintPro",         amount:4500,  validTill:"15 Apr 2025", compared:2, selected:false, status:"Pending"   },
  { id:"QA005", item:"Exterior Paint 20L",   pr:"PR002", vendor:"ColorMix Co",      amount:5200,  validTill:"15 Apr 2025", compared:2, selected:false, status:"Pending"   },
];

const empty = { item:"", pr:"", vendor:"", amount:"", validTill:"" };
const statusColor = { Selected:"success", Pending:"warning", Rejected:"danger" };

export default function QuoteAnalysis() {
  const [items, setItems]   = useState(mockData);
  const [showForm, setShow] = useState(false);
  const [form, setForm]     = useState(empty);
  const [search, setSearch] = useState("");

  const filtered = items.filter(i=>
    i.item.toLowerCase().includes(search.toLowerCase())||
    i.vendor.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    setItems([...items, { ...form, id:"QA"+String(items.length+1).padStart(3,"0"), amount:Number(form.amount), compared:1, selected:false, status:"Pending" }]);
    setForm(empty); setShow(false);
  };

  const selectQuote = (id) => {
    const selected = items.find(i=>i.id===id);
    setItems(items.map(i=>
      i.pr===selected.pr ? { ...i, selected:i.id===id, status:i.id===id?"Selected":"Rejected" } : i
    ));
  };

  return (
    <>
      <div className="page-header">
        <h2><i className="bi bi-clipboard-data-fill" style={{ marginRight:8, color:"var(--maroon-main)" }}></i>Quote Analysis</h2>
        <p>Compare vendor quotes and select the best option for procurement.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-icon maroon"><i className="bi bi-clipboard-data-fill"></i></div><div><div className="stat-label">Total Quotes</div><div className="stat-value">{items.length}</div></div></div>
        <div className="stat-card"><div className="stat-icon success"><i className="bi bi-check-circle-fill"></i></div><div><div className="stat-label">Selected</div><div className="stat-value">{items.filter(i=>i.status==="Selected").length}</div></div></div>
        <div className="stat-card"><div className="stat-icon warning"><i className="bi bi-hourglass-split"></i></div><div><div className="stat-label">Pending</div><div className="stat-value">{items.filter(i=>i.status==="Pending").length}</div></div></div>
        <div className="stat-card"><div className="stat-icon gold"><i className="bi bi-currency-rupee"></i></div><div><div className="stat-label">Best Savings</div><div className="stat-value">₹3,500</div></div></div>
      </div>

      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
        <input style={{ flex:1, minWidth:180, border:"1.5px solid var(--border)", borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.88rem", background:"var(--white)", fontFamily:"DM Sans,sans-serif", color:"var(--text-dark)" }}
          placeholder="🔍  Search item or vendor..." value={search} onChange={e=>setSearch(e.target.value)} />
        <button className="btn-pms gold" style={{ marginLeft:"auto" }} onClick={()=>setShow(!showForm)}>
          <i className="bi bi-plus-lg"></i> Add Quote
        </button>
      </div>

      {showForm && (
        <div className="pms-card" style={{ marginBottom:"1.25rem" }}>
          <h3 style={{ fontSize:"1rem", marginBottom:"1rem" }}>Add Vendor Quote</h3>
          <form onSubmit={handleAdd}>
            <div className="form-grid" style={{ marginBottom:"1rem" }}>
              <div className="field-group"><label>Item / Description *</label><input required value={form.item} onChange={e=>setForm({...form,item:e.target.value})} /></div>
              <div className="field-group"><label>PR Reference</label><input value={form.pr} onChange={e=>setForm({...form,pr:e.target.value})} placeholder="PR001" /></div>
              <div className="field-group"><label>Vendor Name *</label><input required value={form.vendor} onChange={e=>setForm({...form,vendor:e.target.value})} /></div>
              <div className="field-group"><label>Quote Amount (₹) *</label><input required type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} /></div>
              <div className="field-group"><label>Valid Till</label><input type="date" value={form.validTill} onChange={e=>setForm({...form,validTill:e.target.value})} /></div>
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
            <thead><tr><th>ID</th><th>Item</th><th>PR Ref</th><th>Vendor</th><th>Quote Amount</th><th>Valid Till</th><th>Compared</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(i=>(
                <tr key={i.id} style={{ background:i.selected?"rgba(46,125,50,0.04)":"" }}>
                  <td style={{ fontWeight:600, color:"var(--maroon-main)" }}>{i.id}</td>
                  <td style={{ fontWeight:500, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{i.item}</td>
                  <td><span className="badge-pms info">{i.pr}</span></td>
                  <td>{i.vendor}</td>
                  <td style={{ fontWeight:700, color:i.selected?"var(--success)":"var(--text-dark)" }}>₹{i.amount.toLocaleString("en-IN")}</td>
                  <td style={{ fontSize:"0.82rem", color:"var(--text-muted)" }}>{i.validTill}</td>
                  <td style={{ textAlign:"center" }}>{i.compared} vendors</td>
                  <td><span className={`badge-pms ${statusColor[i.status]}`}>{i.status}</span></td>
                  <td>
                    {i.status==="Pending"&&<button className="btn-pms sm success" onClick={()=>selectQuote(i.id)}><i className="bi bi-check-lg"></i> Select</button>}
                    {i.selected&&<span style={{ fontSize:"0.8rem", color:"var(--success)", fontWeight:600 }}>✓ Best Quote</span>}
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