// Pages/LeaseAgreement.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Css/Global.css";

const API = "http://localhost:5000/api/lease-agreements";
const leaseTermOptions = ["6", "12", "24", "36"];
const paymentOptions = ["Bank Transfer", "UPI", "Cash", "Cheque"];
const statusColor = { Active: "success", Expired: "danger", Terminated: "danger", "Renewal Pending": "warning" };

const emptyForm = {
  tenant: "",
  landlord: "",
  property: "",
  propertyUnit: "",
  propertyType: "Residential",
  propertyAddress: "",
  startDate: "",
  endDate: "",
  leaseTerm: "12",
  monthlyRent: "",
  securityDeposit: "",
  maintenanceCharge: "",
  utilityCharge: "",
  rentDueDay: "1",
  paymentMode: "Bank Transfer",
  increasePercentage: "",
  terms: "",
  notes: "",
  autoRenewal: false,
  status: "Active",
  userId: 1,
};

/* ── File icon helper ── */
function fileIcon(name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return { icon: "bi-file-earmark-pdf-fill", color: "#c0392b" };
  if (["jpg", "jpeg", "png"].includes(ext)) return { icon: "bi-file-earmark-image-fill", color: "#1565a0" };
  if (["doc", "docx"].includes(ext)) return { icon: "bi-file-earmark-word-fill", color: "#2980b9" };
  return { icon: "bi-file-earmark-fill", color: "#6b7a90" };
}

/* ── Doc chip ── */
function DocChip({ name, onRemove }) {
  const { icon, color } = fileIcon(name);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--cream-dark)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.3rem 0.65rem", fontSize: "0.78rem", color: "var(--text-mid)", maxWidth: 210 }}>
      <i className={`bi ${icon}`} style={{ color, fontSize: "0.95rem", flexShrink: 0 }}></i>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{name}</span>
      {onRemove && (
        <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", padding: 0, fontSize: "0.8rem", flexShrink: 0 }}>
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
}

export default function LeaseAgreement() {
  const [leases, setLeases] = useState([]);
  const [showForm, setShow] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileRef = useRef();

  /* ── Fetch Leases ── */
  const fetchLeases = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "All") params.status = filter;
      if (search) params.tenant = search;
      const res = await axios.get(API, { params });
      setLeases(res.data.leases || []);
    } catch {
      setError("Failed to load leases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeases(); }, [filter]);

  /* ── File helpers ── */
  const addFiles = (list) => {
    const arr = Array.from(list);
    const unique = arr.filter(f => !files.find(x => x.name === f.name));
    setFiles(p => [...p, ...unique]);
  };
  const removeFile = (name) => setFiles(p => p.filter(f => f.name !== name));
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };

  /* ── Submit (Create/Update) ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      const user = JSON.parse(localStorage.getItem("pms_user") || "{}");

      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append("userId", String(user.id || 1));
      files.forEach(f => fd.append("docs", f));

      if (editingId) {
        await axios.put(`${API}/${editingId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await axios.post(API, fd, { headers: { "Content-Type": "multipart/form-data" } });
      }

      setForm(emptyForm);
      setFiles([]);
      setShow(false);
      setEditingId(null);
      fetchLeases();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Edit Lease ── */
  const handleEdit = (lease) => {
    setForm({
      tenant: lease.tenant || "",
      landlord: lease.landlord || "",
      property: lease.property || "",
      propertyUnit: lease.propertyUnit || "",
      propertyType: lease.propertyType || "Residential",
      propertyAddress: lease.propertyAddress || "",
      startDate: lease.startDate || "",
      endDate: lease.endDate || "",
      leaseTerm: lease.leaseTerm || "12",
      monthlyRent: lease.monthlyRent || "",
      securityDeposit: lease.securityDeposit || "",
      maintenanceCharge: lease.maintenanceCharge || "",
      utilityCharge: lease.utilityCharge || "",
      rentDueDay: lease.rentDueDay || "1",
      paymentMode: lease.paymentMode || "Bank Transfer",
      increasePercentage: lease.increasePercentage || "",
      terms: lease.terms || "",
      notes: lease.notes || "",
      autoRenewal: lease.autoRenewal || false,
      status: lease.status || "Active",
      userId: lease.userId || 1,
    });
    setEditingId(lease.id);
    setShow(true);
  };

  /* ── Delete Lease ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lease agreement?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchLeases();
    } catch {
      setError("Failed to delete.");
    }
  };

  /* ── Remove Doc ── */
  const handleRemoveDoc = async (id, fileName) => {
    try {
      await axios.delete(`${API}/${id}/doc`, { data: { fileName } });
      fetchLeases();
    } catch {
      setError("Failed to remove document.");
    }
  };

  const filtered = leases.filter(l =>
    l.tenant?.toLowerCase().includes(search.toLowerCase()) ||
    l.property?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h2><i className="bi bi-file-earmark-text-fill" style={{ marginRight: 8, color: "var(--maroon-main)" }}></i>Lease Agreement</h2>
        <p>Create and manage all tenant lease agreements with supporting documents.</p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {["Active", "Expired", "Terminated"].map(s => (
          <div className="stat-card" key={s}>
            <div className={`stat-icon ${statusColor[s]}`}><i className="bi bi-file-earmark-text-fill"></i></div>
            <div>
              <div className="stat-label">{s} Leases</div>
              <div className="stat-value">{leases.filter(l => l.status === s).length}</div>
            </div>
          </div>
        ))}
        <div className="stat-card">
          <div className="stat-icon gold"><i className="bi bi-cash-coin"></i></div>
          <div>
            <div className="stat-label">Monthly Income</div>
            <div className="stat-value">₹{(leases.filter(l => l.status === "Active").reduce((a, l) => a + Number(l.monthlyRent), 0) / 1000).toFixed(0)}K</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={{ flex: 1, minWidth: 200, border: "1.5px solid var(--border)", borderRadius: 9, padding: "0.55rem 0.85rem", fontSize: "0.88rem", background: "var(--white)", fontFamily: "DM Sans,sans-serif", color: "var(--text-dark)" }}
          placeholder="🔍  Search tenant or property..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchLeases()}
        />
        {["All", "Active", "Expired", "Terminated", "Renewal Pending"].map(f => (
          <button key={f} className={`btn-pms ${filter === f ? "primary" : "secondary"}`}
            style={{ padding: "0.4rem 0.9rem", fontSize: "0.82rem" }}
            onClick={() => setFilter(f)}>{f}
          </button>
        ))}
        <button className="btn-pms gold" onClick={() => { setShow(!showForm); setEditingId(null); setForm(emptyForm); setFiles([]); }}>
          <i className="bi bi-plus-lg"></i> New Lease
        </button>
      </div>

      {error && (
        <div style={{ background: "#fdf0f0", border: "1.5px solid #e8b0b0", borderRadius: 10, padding: "0.7rem 1rem", marginBottom: "1rem", fontSize: "0.87rem", color: "var(--maroon-dark)" }}>
          <i className="bi bi-exclamation-circle me-2"></i>{error}
          <button onClick={() => setError("")} style={{ float: "right", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
        </div>
      )}

      {/* ══ Form ══ */}
      {showForm && (
        <div className="pms-card" style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1.25rem" }}>
            {editingId ? "Edit Lease Agreement" : "New Lease Agreement"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ marginBottom: "1rem" }}>

              <div className="field-group">
                <label>Tenant Name *</label>
                <input required value={form.tenant} onChange={e => setForm({ ...form, tenant: e.target.value })} placeholder="Priya Sharma" />
              </div>
              <div className="field-group">
                <label>Landlord Name *</label>
                <input required value={form.landlord} onChange={e => setForm({ ...form, landlord: e.target.value })} placeholder="John Doe" />
              </div>
              <div className="field-group">
                <label>Property Name *</label>
                <input required value={form.property} onChange={e => setForm({ ...form, property: e.target.value })} placeholder="Sunrise Apt 2A" />
              </div>
              <div className="field-group">
                <label>Unit No</label>
                <input value={form.propertyUnit} onChange={e => setForm({ ...form, propertyUnit: e.target.value })} placeholder="2A" />
              </div>
              <div className="field-group">
                <label>Property Type</label>
                <select value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })}>
                  {["Residential", "Commercial", "Villa", "Hotel", "Hostel"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Property Address</label>
                <input value={form.propertyAddress} onChange={e => setForm({ ...form, propertyAddress: e.target.value })} placeholder="Full address" />
              </div>
              <div className="field-group">
                <label>Start Date *</label>
                <input required type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="field-group">
                <label>End Date *</label>
                <input required type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
              </div>
              <div className="field-group">
                <label>Lease Term (months)</label>
                <select value={form.leaseTerm} onChange={e => setForm({ ...form, leaseTerm: e.target.value })}>
                  {leaseTermOptions.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Monthly Rent (₹) *</label>
                <input required type="number" value={form.monthlyRent} onChange={e => setForm({ ...form, monthlyRent: e.target.value })} placeholder="18000" />
              </div>
              <div className="field-group">
                <label>Security Deposit (₹)</label>
                <input type="number" value={form.securityDeposit} onChange={e => setForm({ ...form, securityDeposit: e.target.value })} placeholder="36000" />
              </div>
              <div className="field-group">
                <label>Maintenance Charge (₹)</label>
                <input type="number" value={form.maintenanceCharge} onChange={e => setForm({ ...form, maintenanceCharge: e.target.value })} placeholder="500" />
              </div>
              <div className="field-group">
                <label>Utility Charge (₹)</label>
                <input type="number" value={form.utilityCharge} onChange={e => setForm({ ...form, utilityCharge: e.target.value })} placeholder="200" />
              </div>
              <div className="field-group">
                <label>Rent Due Day (1–28)</label>
                <input type="number" min="1" max="28" value={form.rentDueDay} onChange={e => setForm({ ...form, rentDueDay: e.target.value })} />
              </div>
              <div className="field-group">
                <label>Payment Mode</label>
                <select value={form.paymentMode} onChange={e => setForm({ ...form, paymentMode: e.target.value })}>
                  {paymentOptions.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Annual Rent Increase (%)</label>
                <input type="number" value={form.increasePercentage} onChange={e => setForm({ ...form, increasePercentage: e.target.value })} placeholder="5" />
              </div>
              <div className="field-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Active</option>
                  <option>Expired</option>
                  <option>Terminated</option>
                  <option>Renewal Pending</option>
                </select>
              </div>
              <div className="field-group" style={{ justifyContent: "flex-end" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginTop: "1.5rem" }}>
                  <input type="checkbox" checked={form.autoRenewal} onChange={e => setForm({ ...form, autoRenewal: e.target.checked })} />
                  Auto Renewal
                </label>
              </div>
              <div className="field-group form-full">
                <label>Terms & Conditions</label>
                <textarea value={form.terms} onChange={e => setForm({ ...form, terms: e.target.value })} placeholder="Lease terms..." />
              </div>
              <div className="field-group form-full">
                <label>Notes / Remarks</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Internal remarks..." />
              </div>
            </div>

            {/* ── Document Upload ── */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-mid)", display: "block", marginBottom: "0.5rem" }}>
                <i className="bi bi-paperclip" style={{ marginRight: 5, color: "var(--maroon-main)" }}></i>
                Supporting Documents
                <span style={{ fontSize: "0.74rem", fontWeight: 400, color: "var(--text-muted)", marginLeft: 6 }}>
                  Lease deed, ID proof, NOC, photos…
                </span>
              </label>

              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
                style={{
                  border: `2px dashed ${dragOver ? "var(--maroon-main)" : "var(--border)"}`,
                  borderRadius: 12, padding: "1.5rem 1rem",
                  background: dragOver ? "rgba(139,32,32,0.04)" : "var(--cream)",
                  cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                  marginBottom: "0.75rem",
                }}
              >
                <i className="bi bi-cloud-upload-fill" style={{ fontSize: "2rem", color: dragOver ? "var(--maroon-main)" : "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}></i>
                <div style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-mid)" }}>
                  Drag & drop, or <span style={{ color: "var(--maroon-main)", textDecoration: "underline" }}>click to browse</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  PDF, JPG, PNG, DOC, DOCX — Max 10MB each
                </div>
              </div>

              <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                style={{ display: "none" }} onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />

              {files.length > 0 ? (
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                    {files.length} file{files.length > 1 ? "s" : ""} ready to upload
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {files.map(f => <DocChip key={f.name} name={f.name} onRemove={() => removeFile(f.name)} />)}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center" }}>No files selected</div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
              <button className="btn-pms primary" type="submit" disabled={saving}>
                {saving
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                  : <><i className="bi bi-check-lg"></i> {editingId ? "Update" : "Save"} Lease</>}
              </button>
              <button className="btn-pms secondary" type="button"
                onClick={() => { setShow(false); setForm(emptyForm); setFiles([]); setEditingId(null); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ══ Table ══ */}
      <div className="pms-card">
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            <span className="spinner-border spinner-border-sm me-2"></span>Loading...
          </div>
        ) : (
          <div className="pms-table-wrap">
            <table className="pms-table">
              <thead>
                <tr>
                  <th>Lease ID</th>
                  <th>Tenant</th>
                  <th>Landlord</th>
                  <th>Property</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Monthly Rent</th>
                  <th>Documents</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600, color: "var(--maroon-main)", fontSize: "0.78rem" }}>{l.leaseId}</td>
                    <td style={{ fontWeight: 500 }}>{l.tenant}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{l.landlord}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{l.property} {l.propertyUnit}</td>
                    <td style={{ fontSize: "0.82rem" }}>{l.startDate}</td>
                    <td style={{ fontSize: "0.82rem" }}>{l.endDate}</td>
                    <td style={{ fontWeight: 600 }}>₹{Number(l.monthlyRent).toLocaleString("en-IN")}</td>
                    <td>
                      {l.docs && l.docs.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                          {l.docs.map(d => (
                            <DocChip key={d.name} name={d.name} onRemove={() => handleRemoveDoc(l.id, d.name)} />
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>— No docs</span>
                      )}
                    </td>
                    <td><span className={`badge-pms ${statusColor[l.status]}`}>{l.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button className="btn-pms sm secondary" onClick={() => handleEdit(l)}><i className="bi bi-pencil"></i></button>
                        <button className="btn-pms sm danger" onClick={() => handleDelete(l.id)}><i className="bi bi-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                      No lease agreements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}