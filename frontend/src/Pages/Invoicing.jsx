// Pages/Invoicing.jsx
import { useState } from "react";
import "../Css/Global.css";

const mockInvoices = [
  { id:"INV001", tenant:"Priya Sharma",  property:"Sunrise 2A", type:"Rent",   amount:18000, due:"05 Apr 2025", status:"Paid"     },
  { id:"INV002", tenant:"Sunita Reddy",  property:"Royal 5B",   type:"Rent",   amount:22000, due:"05 Apr 2025", status:"Pending"  },
  { id:"INV003", tenant:"Amit Kumar",    property:"City Hub 1A", type:"Rent",  amount:12000, due:"01 Apr 2025", status:"Overdue"  },
  { id:"INV004", tenant:"RK Electricals",property:"Tech Park",  type:"Vendor", amount:15000, due:"10 Apr 2025", status:"Pending"  },
  { id:"INV005", tenant:"Deepa Nair",    property:"Sunrise 3B", type:"Rent",   amount:14500, due:"05 Apr 2025", status:"Paid"     },
];

const statusColor = { Paid:"success", Pending:"warning", Overdue:"danger" };

export default function Invoicing() {
  const [invoices] = useState(mockInvoices);
  const [filter, setFilter] = useState("All");
  const [showForm, setShow] = useState(false);

  const filtered = filter === "All" ? invoices : invoices.filter(i => i.status === filter);

  const totalPaid    = invoices.filter(i => i.status === "Paid").reduce((a,i) => a+i.amount,0);
  const totalPending = invoices.filter(i => i.status === "Pending").reduce((a,i) => a+i.amount,0);
  const totalOverdue = invoices.filter(i => i.status === "Overdue").reduce((a,i) => a+i.amount,0);

  return (
    <>
      <div className="page-header">
        <h2>Invoicing & Payment</h2>
        <p>Track rent collection, vendor payments, and outstanding dues.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon success"><i className="bi bi-check-circle-fill"></i></div>
          <div><div className="stat-label">Collected</div><div className="stat-value">₹{(totalPaid/1000).toFixed(1)}K</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><i className="bi bi-hourglass-split"></i></div>
          <div><div className="stat-label">Pending</div><div className="stat-value">₹{(totalPending/1000).toFixed(1)}K</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon maroon"><i className="bi bi-exclamation-triangle-fill"></i></div>
          <div><div className="stat-label">Overdue</div><div className="stat-value">₹{(totalOverdue/1000).toFixed(1)}K</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info"><i className="bi bi-receipt-cutoff"></i></div>
          <div><div className="stat-label">Total Invoices</div><div className="stat-value">{invoices.length}</div></div>
        </div>
      </div>

      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
        {["All","Paid","Pending","Overdue"].map(f => (
          <button key={f} className={`btn-pms ${filter===f?"primary":"secondary"}`}
            style={{ padding:"0.4rem 0.9rem", fontSize:"0.82rem" }} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <button className="btn-pms gold" style={{ marginLeft:"auto" }} onClick={() => setShow(!showForm)}>
          <i className="bi bi-plus-lg"></i> New Invoice
        </button>
      </div>

      {showForm && (
        <div className="pms-card" style={{ marginBottom:"1.25rem" }}>
          <h3 style={{ fontSize:"1rem", marginBottom:"1rem" }}>Create Invoice</h3>
          <form onSubmit={e => { e.preventDefault(); setShow(false); }}>
            <div className="form-grid" style={{ marginBottom:"1rem" }}>
              <div className="field-group"><label>Tenant / Vendor</label><input placeholder="Name" /></div>
              <div className="field-group"><label>Property</label><input placeholder="Property name" /></div>
              <div className="field-group"><label>Invoice Type</label>
                <select><option>Rent</option><option>Vendor</option><option>Maintenance</option></select>
              </div>
              <div className="field-group"><label>Amount (₹)</label><input type="number" placeholder="18000" /></div>
              <div className="field-group"><label>Due Date</label><input type="date" /></div>
              <div className="field-group"><label>Payment Mode</label>
                <select><option>Bank Transfer</option><option>Cash</option><option>UPI</option><option>Cheque</option></select>
              </div>
              <div className="field-group form-full"><label>Notes</label><textarea placeholder="Additional notes..." /></div>
            </div>
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button className="btn-pms primary" type="submit"><i className="bi bi-check-lg"></i> Create</button>
              <button className="btn-pms secondary" type="button" onClick={() => setShow(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="pms-card">
        <div className="pms-table-wrap">
          <table className="pms-table">
            <thead>
              <tr><th>Invoice ID</th><th>Tenant/Vendor</th><th>Property</th><th>Type</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontWeight:600, color:"var(--maroon-main)" }}>{inv.id}</td>
                  <td>{inv.tenant}</td>
                  <td style={{ color:"var(--text-muted)" }}>{inv.property}</td>
                  <td><span className="badge-pms neutral">{inv.type}</span></td>
                  <td style={{ fontWeight:600 }}>₹{inv.amount.toLocaleString("en-IN")}</td>
                  <td style={{ color:"var(--text-muted)", fontSize:"0.82rem" }}>{inv.due}</td>
                  <td><span className={`badge-pms ${statusColor[inv.status]}`}>{inv.status}</span></td>
                  <td>
                    <div style={{ display:"flex", gap:"0.4rem" }}>
                      {inv.status !== "Paid" && <button className="btn-pms sm success"><i className="bi bi-check-lg"></i> Pay</button>}
                      <button className="btn-pms sm secondary"><i className="bi bi-eye"></i></button>
                    </div>
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