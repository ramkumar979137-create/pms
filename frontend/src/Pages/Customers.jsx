// Pages/Customers.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "../Css/Global.css";



const empty = { name: "", email: "", phone: "", company: "", address: "", status: "Active" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (err) {
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/customers", form);
      setForm(empty);
      setShowForm(false);
      fetchCustomers();
    } catch (err) {
      setError("Failed to add customer");
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Customer Details</h2>
        <p>Manage all property owners, tenants, and companies.</p>
        {error && <div style={{ color: "var(--danger)", marginBottom: 10 }}>{error}</div>}
      </div>

      {/* Toolbar */}
      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap" }}>
        <input
          className="field-group"
          style={{ flex:1, minWidth:200, border:"1.5px solid var(--border)", borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.88rem", background:"var(--white)", fontFamily:"DM Sans,sans-serif", color:"var(--text-dark)" }}
          placeholder="🔍  Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn-pms primary" onClick={() => setShowForm(!showForm)}>
          <i className="bi bi-plus-lg"></i> Add Customer
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="pms-card" style={{ marginBottom:"1.25rem" }}>
          <h3 style={{ fontSize:"1rem", marginBottom:"1rem" }}>New Customer</h3>
          <form onSubmit={handleAdd}>
            <div className="form-grid" style={{ marginBottom:"1rem" }}>
              <div className="field-group"><label>Full Name *</label><input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Rajesh Kumar" /></div>
              <div className="field-group"><label>Email *</label><input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="rajesh@email.com" /></div>
              <div className="field-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="9876543210" /></div>
              <div className="field-group"><label>Company</label><input value={form.company} onChange={e => setForm({...form, company:e.target.value})} placeholder="Company name" /></div>
              <div className="field-group form-full"><label>Address</label><textarea value={form.address} onChange={e => setForm({...form, address:e.target.value})} placeholder="Full address..." /></div>
            </div>
            <div style={{ display:"flex", gap:"0.75rem" }}>
              <button className="btn-pms primary" type="submit"><i className="bi bi-check-lg"></i> Save</button>
              <button className="btn-pms secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="pms-card">
        <div className="pms-table-wrap">
          <table className="pms-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Type</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight:600, color:"var(--maroon-main)" }}>{c.id}</td>
                  <td>{c.name}</td>
                  <td style={{ color:"var(--text-muted)" }}>{c.email}</td>
                  <td>{c.phone}</td>
                  <td><span className="badge-pms neutral">{c.type}</span></td>
                  <td><span className={`badge-pms ${c.status === "Active" ? "success" : "danger"}`}>{c.status}</span></td>
                  <td>
                    <div style={{ display:"flex", gap:"0.4rem" }}>
                      <button className="btn-pms sm secondary"><i className="bi bi-pencil"></i></button>
                      <button className="btn-pms sm danger"><i className="bi bi-trash"></i></button>
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