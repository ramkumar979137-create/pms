// Pages/RentalCancellation.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Css/Global.css";

const API = "http://localhost:5000/api/rental-cancellations";
const reasonOptions = ["Tenant Request", "Landlord Request", "Mutual Agreement", "Non-Payment", "Property Issues"];
const statusOptions = ["Pending", "Approved", "Rejected", "Completed"];
const statusColor = { Pending: "warning", Approved: "success", Rejected: "danger", Completed: "info" };

const emptyForm = {
  rentalId: "",
  tenant: "",
  property: "",
  propertyUnit: "",
  originalEndDate: "",
  cancellationDate: "",
  noticeDaysGiven: "",
  reason: "Tenant Request",
  refundAmount: "",
  deductionAmount: "",
  remarks: "",
  status: "Pending",
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

export default function RentalCancellation() {
  const [cancellations, setCancellations] = useState([]);
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

  /* ── Fetch Cancellations ── */
  const fetchCancellations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "All") params.status = filter;
      if (search) params.tenant = search;
      const res = await axios.get(API, { params });
      setCancellations(res.data.cancellations || []);
    } catch {
      setError("Failed to load cancellations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCancellations(); }, [filter]);

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
      fetchCancellations();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Edit Cancellation ── */
  const handleEdit = (cancellation) => {
    setForm({
      rentalId: cancellation.rentalId || "",
      tenant: cancellation.tenant || "",
      property: cancellation.property || "",
      propertyUnit: cancellation.propertyUnit || "",
      originalEndDate: cancellation.originalEndDate || "",
      cancellationDate: cancellation.cancellationDate || "",
      noticeDaysGiven: cancellation.noticeDaysGiven || "",
      reason: cancellation.reason || "Tenant Request",
      refundAmount: cancellation.refundAmount || "",
      deductionAmount: cancellation.deductionAmount || "",
      remarks: cancellation.remarks || "",
      status: cancellation.status || "Pending",
      userId: cancellation.userId || 1,
    });
    setEditingId(cancellation.id);
    setShow(true);
  };

  /* ── Delete Cancellation ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this cancellation request?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchCancellations();
    } catch {
      setError("Failed to delete.");
    }
  };

  /* ── Remove Doc ── */
  const handleRemoveDoc = async (id, fileName) => {
    try {
      await axios.delete(`${API}/${id}/doc`, { data: { fileName } });
      fetchCancellations();
    } catch {
      setError("Failed to remove document.");
    }
  };

  const filtered = cancellations.filter(c =>
    c.tenant?.toLowerCase().includes(search.toLowerCase()) ||
    c.property?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h2><i className="bi bi-x-circle-fill" style={{ marginRight: 8, color: "var(--danger)" }}></i>Rental Cancellations</h2>
        <p>Manage rental cancellation requests with refund calculations and documentation.</p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {["Pending", "Approved", "Rejected", "Completed"].map(s => (
          <div className="stat-card" key={s}>
            <div className={`stat-icon ${statusColor[s]}`}><i className="bi bi-clipboard-check"></i></div>
            <div>
              <div className="stat-label">{s}</div>
              <div className="stat-value">{cancellations.filter(c => c.status === s).length}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={{ flex: 1, minWidth: 180, border: "1.5px solid var(--border)", borderRadius: 9, padding: "0.55rem 0.85rem", fontSize: "0.88rem", background: "var(--white)", fontFamily: "DM Sans,sans-serif", color: "var(--text-dark)" }}
          placeholder="🔍  Search tenant or property..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchCancellations()}
        />
        {["All", "Pending", "Approved", "Rejected", "Completed"].map(f => (
          <button key={f} className={`btn-pms ${filter === f ? "primary" : "secondary"}`}
            style={{ padding: "0.4rem 0.9rem", fontSize: "0.82rem" }}
            onClick={() => setFilter(f)}>{f}
          </button>
        ))}
        <button className="btn-pms gold" onClick={() => { setShow(!showForm); setEditingId(null); setForm(emptyForm); setFiles([]); }}>
          <i className="bi bi-plus-lg"></i> New Cancellation
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
            {editingId ? "Edit Cancellation Request" : "New Cancellation Request"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ marginBottom: "1rem" }}>

              <div className="field-group">
                <label>Rental ID *</label>
                <input required value={form.rentalId} onChange={e => setForm({ ...form, rentalId: e.target.value })} placeholder="RNT_xxxxx" />
              </div>
              <div className="field-group">
                <label>Tenant Name *</label>
                <input required value={form.tenant} onChange={e => setForm({ ...form, tenant: e.target.value })} placeholder="Amit Kumar" />
              </div>
              <div className="field-group">
                <label>Property Name *</label>
                <input required value={form.property} onChange={e => setForm({ ...form, property: e.target.value })} placeholder="City Hub" />
              </div>
              <div className="field-group">
                <label>Unit No</label>
                <input value={form.propertyUnit} onChange={e => setForm({ ...form, propertyUnit: e.target.value })} placeholder="1A" />
              </div>
              <div className="field-group">
                <label>Original End Date *</label>
                <input required type="date" value={form.originalEndDate} onChange={e => setForm({ ...form, originalEndDate: e.target.value })} />
              </div>
              <div className="field-group">
                <label>Cancellation Date *</label>
                <input required type="date" value={form.cancellationDate} onChange={e => setForm({ ...form, cancellationDate: e.target.value })} />
              </div>
              <div className="field-group">
                <label>Notice Days Given</label>
                <input type="number" value={form.noticeDaysGiven} onChange={e => setForm({ ...form, noticeDaysGiven: e.target.value })} placeholder="30" />
              </div>
              <div className="field-group">
                <label>Reason *</label>
                <select required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}>
                  {reasonOptions.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Refund Amount (₹)</label>
                <input type="number" step="0.01" value={form.refundAmount} onChange={e => setForm({ ...form, refundAmount: e.target.value })} placeholder="10000" />
              </div>
              <div className="field-group">
                <label>Deduction Amount (₹)</label>
                <input type="number" step="0.01" value={form.deductionAmount} onChange={e => setForm({ ...form, deductionAmount: e.target.value })} placeholder="500" />
              </div>
              <div className="field-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {statusOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field-group form-full">
                <label>Remarks / Notes</label>
                <textarea value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Any additional remarks..." />
              </div>
            </div>

            {/* ── Document Upload ── */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-mid)", display: "block", marginBottom: "0.5rem" }}>
                <i className="bi bi-paperclip" style={{ marginRight: 5, color: "var(--danger)" }}></i>
                Supporting Documents
                <span style={{ fontSize: "0.74rem", fontWeight: 400, color: "var(--text-muted)", marginLeft: 6 }}>
                  Cancellation notice, proof, bank details…
                </span>
              </label>

              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
                style={{
                  border: `2px dashed ${dragOver ? "var(--danger)" : "var(--border)"}`,
                  borderRadius: 12,
                  padding: "1.5rem 1rem",
                  background: dragOver ? "rgba(192,57,43,0.04)" : "var(--cream)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                  marginBottom: "0.75rem",
                }}
              >
                <i className="bi bi-cloud-upload-fill" style={{ fontSize: "2rem", color: dragOver ? "var(--danger)" : "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}></i>
                <div style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-mid)" }}>
                  Drag & drop, or <span style={{ color: "var(--danger)", textDecoration: "underline" }}>click to browse</span>
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
                  : <><i className="bi bi-check-lg"></i> {editingId ? "Update" : "Save"} Cancellation</>}
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
                  <th>Cancellation ID</th>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Reason</th>
                  <th>Cancellation Date</th>
                  <th>Refund</th>
                  <th>Documents</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: "var(--danger)", fontSize: "0.78rem" }}>{c.cancellationId}</td>
                    <td style={{ fontWeight: 500 }}>{c.tenant}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{c.property} {c.propertyUnit}</td>
                    <td><span className="badge-pms neutral">{c.reason}</span></td>
                    <td style={{ fontSize: "0.82rem" }}>{c.cancellationDate}</td>
                    <td style={{ fontWeight: 600 }}>₹{Number(c.refundAmount || 0).toLocaleString("en-IN")}</td>
                    <td>
                      {c.docs && c.docs.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                          {c.docs.map(d => (
                            <DocChip key={d.name} name={d.name} onRemove={() => handleRemoveDoc(c.id, d.name)} />
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>— No docs</span>
                      )}
                    </td>
                    <td><span className={`badge-pms ${statusColor[c.status]}`}>{c.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button className="btn-pms sm secondary" onClick={() => handleEdit(c)}><i className="bi bi-pencil"></i></button>
                        <button className="btn-pms sm danger" onClick={() => handleDelete(c.id)}><i className="bi bi-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                      No cancellation requests found.
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