// Pages/LeaseCancellation.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Css/Global.css";

const API = "http://localhost:5000/api/lease-cancellations";
const statusOptions = ["Pending", "Approved", "Rejected"];
const statusColor = { Pending: "warning", Approved: "success", Rejected: "danger" };

const emptyForm = {
  leaseId: "",
  tenant: "",
  property: "",
  propertyUnit: "",
  requestDate: "",
  vacateDate: "",
  reason: "",
  penaltyAmount: "",
  status: "Pending",
  userId: 1,
};

function fileIcon(name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return { icon: "bi-file-earmark-pdf-fill", color: "#c0392b" };
  if (["jpg", "jpeg", "png"].includes(ext)) return { icon: "bi-file-earmark-image-fill", color: "#1565a0" };
  if (["doc", "docx"].includes(ext)) return { icon: "bi-file-earmark-word-fill", color: "#2980b9" };
  return { icon: "bi-file-earmark-fill", color: "#6b7a90" };
}

function DocChip({ name, onRemove }) {
  const { icon, color } = fileIcon(name);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--cream-dark)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "0.3rem 0.65rem", fontSize: "0.78rem", color: "var(--text-mid)", maxWidth: 220 }}>
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

export default function LeaseCancellation() {
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

  const fetchCancellations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "All") params.status = filter;
      if (search) params.tenant = search;
      const res = await axios.get(API, { params });
      setCancellations(res.data || []);
    } catch {
      setError("Unable to load lease cancellations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCancellations(); }, [filter]);

  const addFiles = (list) => {
    const arr = Array.from(list);
    const unique = arr.filter((file) => !files.find((x) => x.name === file.name));
    setFiles((prev) => [...prev, ...unique]);
  };

  const removeFile = (name) => setFiles((prev) => prev.filter((file) => file.name !== name));
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      const user = JSON.parse(localStorage.getItem("pms_user") || "{}");
      Object.entries(form).forEach(([key, value]) => fd.append(key, String(value)));
      fd.append("userId", String(user.id || 1));
      files.forEach((file) => fd.append("docs", file));

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
      setError(err?.response?.data?.message || "Unable to save lease cancellation.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      leaseId: item.leaseId || "",
      tenant: item.tenant || "",
      property: item.property || "",
      propertyUnit: item.propertyUnit || "",
      requestDate: item.requestDate || "",
      vacateDate: item.vacateDate || "",
      reason: item.reason || "",
      penaltyAmount: item.penaltyAmount ?? "",
      status: item.status || "Pending",
      userId: item.userId || 1,
    });
    setEditingId(item.id);
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lease cancellation request?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchCancellations();
    } catch {
      setError("Failed to delete.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API}/${id}`, { status });
      fetchCancellations();
    } catch {
      setError("Unable to update status.");
    }
  };

  const handleRemoveDoc = async (id, fileName) => {
    try {
      await axios.delete(`${API}/${id}/doc/${encodeURIComponent(fileName)}`);
      fetchCancellations();
    } catch {
      setError("Unable to remove document.");
    }
  };

  const filtered = cancellations.filter((item) =>
    item.tenant?.toLowerCase().includes(search.toLowerCase()) ||
    item.property?.toLowerCase().includes(search.toLowerCase()) ||
    item.leaseId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h2><i className="bi bi-file-earmark-x-fill" style={{ marginRight: 8, color: "var(--maroon-main)" }}></i>Lease Cancellations</h2>
        <p>Track lease cancellation requests, penalty amounts and supporting documents.</p>
      </div>

      <div className="stat-grid">
        {statusOptions.map((status) => (
          <div className="stat-card" key={status}>
            <div className={`stat-icon ${statusColor[status]}`}><i className="bi bi-file-earmark-x-fill"></i></div>
            <div>
              <div className="stat-label">{status}</div>
              <div className="stat-value">{cancellations.filter((item) => item.status === status).length}</div>
            </div>
          </div>
        ))}
        <div className="stat-card">
          <div className="stat-icon gold"><i className="bi bi-cash-stack"></i></div>
          <div>
            <div className="stat-label">Total Penalty</div>
            <div className="stat-value">₹{cancellations.filter((item) => item.status === "Approved").reduce((sum, item) => sum + Number(item.penaltyAmount || 0), 0).toLocaleString("en-IN")}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={{ flex: 1, minWidth: 180, border: "1.5px solid var(--border)", borderRadius: 9, padding: "0.55rem 0.85rem", fontSize: "0.88rem", background: "var(--white)", fontFamily: "DM Sans,sans-serif", color: "var(--text-dark)" }}
          placeholder="🔍 Search lease, tenant or property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchCancellations()}
        />
        {['All', ...statusOptions].map((status) => (
          <button key={status} className={`btn-pms ${filter === status ? "primary" : "secondary"}`} style={{ padding: "0.4rem 0.9rem", fontSize: "0.82rem" }} onClick={() => setFilter(status)}>{status}</button>
        ))}
        <button className="btn-pms gold" onClick={() => { setShow(!showForm); setEditingId(null); setForm(emptyForm); setFiles([]); }}>
          <i className="bi bi-plus-lg"></i> New Request
        </button>
      </div>

      {error && (
        <div style={{ background: "#fdf0f0", border: "1.5px solid #e8b0b0", borderRadius: 10, padding: "0.7rem 1rem", marginBottom: "1rem", fontSize: "0.87rem", color: "var(--maroon-dark)" }}>
          <i className="bi bi-exclamation-circle me-2"></i>{error}
          <button onClick={() => setError("")} style={{ float: "right", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
        </div>
      )}

      {showForm && (
        <div className="pms-card" style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1.25rem" }}>{editingId ? "Edit Lease Cancellation" : "New Lease Cancellation"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ marginBottom: "1rem" }}>
              <div className="field-group"><label>Lease ID *</label><input required value={form.leaseId} onChange={(e) => setForm({ ...form, leaseId: e.target.value })} placeholder="LA003" /></div>
              <div className="field-group"><label>Tenant *</label><input required value={form.tenant} onChange={(e) => setForm({ ...form, tenant: e.target.value })} placeholder="Kiran Mehta" /></div>
              <div className="field-group"><label>Property *</label><input required value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })} placeholder="Green Villa 3" /></div>
              <div className="field-group"><label>Unit</label><input value={form.propertyUnit} onChange={(e) => setForm({ ...form, propertyUnit: e.target.value })} placeholder="102" /></div>
              <div className="field-group"><label>Request Date *</label><input required type="date" value={form.requestDate} onChange={(e) => setForm({ ...form, requestDate: e.target.value })} /></div>
              <div className="field-group"><label>Vacate Date *</label><input required type="date" value={form.vacateDate} onChange={(e) => setForm({ ...form, vacateDate: e.target.value })} /></div>
              <div className="field-group"><label>Penalty Amount</label><input type="number" value={form.penaltyAmount} onChange={(e) => setForm({ ...form, penaltyAmount: e.target.value })} placeholder="0" /></div>
              <div className="field-group"><label>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></div>
              <div className="field-group form-full"><label>Reason *</label><textarea required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason for cancellation" /></div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <label style={{ fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>Supporting Documents</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  style={{ minHeight: 120, border: `2px dashed ${dragOver ? "var(--primary)" : "var(--border)"}`, borderRadius: 14, padding: "1rem", background: dragOver ? "rgba(45, 93, 252, 0.05)" : "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer" }}
                  onClick={() => fileRef.current?.click()}
                >
                  <div>
                    <p style={{ marginBottom: 8, fontWeight: 600 }}>Drag files here or click to upload</p>
                    <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)" }}>PDF, JPG, PNG, DOC, DOCX</p>
                  </div>
                </div>
                <input ref={fileRef} type="file" multiple hidden onChange={(e) => addFiles(e.target.files)} />
              </div>
              <div style={{ flex: 1, minWidth: 260, display: "grid", gap: "0.65rem" }}>
                {files.map((file) => <DocChip key={file.name} name={file.name} onRemove={() => removeFile(file.name)} />)}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="btn-pms primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              <button className="btn-pms secondary" type="button" onClick={() => { setShow(false); setEditingId(null); setForm(emptyForm); setFiles([]); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="pms-card">
        <div className="pms-table-wrap">
          <table className="pms-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Lease ID</th>
                <th>Tenant</th>
                <th>Property</th>
                <th>Request</th>
                <th>Vacate</th>
                <th>Penalty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: "var(--maroon-main)" }}>{item.cancellationId || item.id}</td>
                  <td><span className="badge-pms info">{item.leaseId}</span></td>
                  <td style={{ fontWeight: 500 }}>{item.tenant}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{item.property}</td>
                  <td style={{ fontSize: "0.82rem" }}>{item.requestDate}</td>
                  <td style={{ fontSize: "0.82rem" }}>{item.vacateDate}</td>
                  <td style={{ fontWeight: 600, color: item.penaltyAmount > 0 ? "var(--danger)" : "var(--text-muted)" }}>{item.penaltyAmount ? `₹${Number(item.penaltyAmount).toLocaleString("en-IN")}` : "—"}</td>
                  <td><span className={`badge-pms ${statusColor[item.status]}`}>{item.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      <button className="btn-pms sm secondary" onClick={() => handleEdit(item)}><i className="bi bi-pencil"></i></button>
                      <button className="btn-pms sm danger" onClick={() => handleDelete(item.id)}><i className="bi bi-trash"></i></button>
                      {item.status === "Pending" && (
                        <>
                          <button className="btn-pms sm success" onClick={() => handleStatusChange(item.id, "Approved")}><i className="bi bi-check-lg"></i></button>
                          <button className="btn-pms sm danger" onClick={() => handleStatusChange(item.id, "Rejected")}><i className="bi bi-x-lg"></i></button>
                        </>
                      )}
                    </div>
                    {item.docs?.length > 0 && (
                      <div style={{ marginTop: "0.6rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                        {item.docs.map((doc) => (
                          <span key={doc.name} style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0.55rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--cream-dark)", fontSize: "0.78rem" }}>
                            <i className={`bi ${fileIcon(doc.name).icon}`} style={{ color: fileIcon(doc.name).color }}></i>
                            <a href={doc.url} target="_blank" rel="noreferrer" style={{ color: "var(--text-dark)", textDecoration: "none" }}>{doc.name}</a>
                            <button onClick={() => handleRemoveDoc(item.id, doc.name)} style={{ border: "none", background: "none", color: "var(--danger)", cursor: "pointer" }}><i className="bi bi-x"></i></button>
                          </span>
                        ))}
                      </div>
                    )}
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
