// Pages/LeaseAgreement.jsx
import { useState, useEffect, useRef } from "react";
import Modal from "../Components/Modal";
import axios from "axios";
// using native controls for currency + amount
import "../Css/Global.css";
import "../Css/LeaseAgreement.css";


const API = "http://localhost:5000/api/lease-agreements";
const currencyOptions = ["₹ INR", "$ USD", "€ EUR"];
// currencyOptions used for native <select>
const statusColor = { Active: "success", Expired: "danger", Terminated: "danger", "Renewal Pending": "warning" };
const emptyForm = {
  customerId: "",
  customerIdentifier: "",
  customerName: "",
  property: "",
  propertyId: "",
  propertyUnit: "",
  propertyAddress: "",
  startDate: "",
  endDate: "",
  leaseValueCurrency: "₹ INR",
  leaseValueAmount: "",
  advanceCurrency: "₹ INR",
  advanceAmount: "",
  paymentDate: "",
  exceptionDate: "",
  delayPenaltyCurrency: "₹ INR",
  delayPenaltyAmount: "",
  status: "Active",
  userId: 1,
  userIdentifier: "",
  petsAllowed: false,
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
function calculateTenure(startDate, endDate) {
  if (!startDate || !endDate) return "";
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months <= 0) return "";
  return `${months} month${months === 1 ? "" : "s"}`;
}

function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return "";
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  const ms = end.getTime() - start.getTime();
  if (ms <= 0) return "";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return String(days);
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
  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileRef = useRef();
  const storedUser = localStorage.getItem("pms_user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};
  // Prefer the string user identifier (userId like 'USR_xxx') stored at login,
  // fall back to numeric id if necessary.
  
  const currentUserId =parsedUser?.id;
  console.log("Parsed user from localStorage:", currentUserId,customers);
  const currentCustomers = customers.filter(c => String(c.createdByUserId) === String(currentUserId));
  const currentProperties = properties.filter(p => String(p.createdByUserId) === String(currentUserId));
  // Ensure that when editing a lease, its customer appears in the dropdown
  // even if it's not part of `currentCustomers` (e.g. different creator).
  const displayedCustomers = (() => {
    // Show all customers by default in dropdown so options are visible;
    // still include an edit-time fallback if needed.
    const arr = Array.isArray(customers) ? [...customers] : [];
    if (editingId && form.customerId) {
      const exists = arr.find(c => String(c.id) === String(form.customerId));
      if (!exists) {
        arr.push({ id: form.customerId, name: form.customerName || "Customer", createdByUserId: parsedUser?.id });
      }
    }
    return arr;
  })();
  // Ensure that when editing a lease, its property appears in the dropdown
  // even if it's not part of `currentProperties` (e.g. different creator).
  const displayedProperties = (() => {
    // Show all properties by default in dropdown so options are visible;
    // still include an edit-time fallback if needed.
    const arr = Array.isArray(properties) ? [...properties] : [];
    if (editingId && form.propertyId) {
      const exists = arr.find(p => String(p.id) === String(form.propertyId));
      if (!exists) {
        arr.push({ id: form.propertyId, name: form.property || "Property", address: form.propertyAddress || "", createdByUserId: parsedUser?.id });
      }
    }
    return arr;
  })();
  const handleCustomerSelect = (customerId) => {
    // customerId may come as string from the select; normalize to number when possible
    const id = customerId === "" ? "" : Number(customerId);
    const customer = displayedCustomers.find(c => (typeof c.id === "number" ? c.id === id : String(c.id) === String(customerId)));
    setForm(prev => ({
      ...prev,
      customerId: customer ? customer.id : "",
      customerIdentifier: customer ? customer.customerId || "" : "",
      customerName: customer ? customer.name : "",
      userId: customer && typeof customer.createdByUserId === 'number' ? customer.createdByUserId : prev.userId,
      userIdentifier: customer && typeof customer.createdByUserId === 'string' ? customer.createdByUserId : prev.userIdentifier,
    }));
    console.log("Selected customer:", customer, "from ID:", customerId);
  };
  const handlePropertySelect = (propertyId) => {
    const id = propertyId === "" ? "" : Number(propertyId);
    const property = displayedProperties.find(p => (typeof p.id === "number" ? p.id === id : String(p.id) === String(propertyId)));
    setForm(prev => ({
      ...prev,
      propertyId: property ? property.id : "",
      property: property ? property.name : "",
      propertyAddress: property ? property.address : "",
      propertyUnit: "",
    }));
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [custRes, propRes] = await Promise.all([
          axios.get("http://localhost:5000/api/customers?limit=200"),
          axios.get("http://localhost:5000/api/properties?limit=200"),
        ]);
        const loadedCustomers = Array.isArray(custRes.data.items)
          ? custRes.data.items
          : Array.isArray(custRes.data)
          ? custRes.data
          : [];
        const loadedProperties = Array.isArray(propRes.data.items)
          ? propRes.data.items
          : Array.isArray(propRes.data)
          ? propRes.data
          : [];
        setCustomers(loadedCustomers.map(c => ({
          ...c,
          name: `${c.firstName || ""} ${c.lastName || ""}`.trim() || c.phone || c.email || "Customer",
        })));
        setProperties(loadedProperties);
      } catch (err) {
        console.error("Failed to load lease dropdown data", err);
      }
    };
    fetchLists();
  }, []);
  // Show tenure as duration in days (auto-calculated)
  const tenure = calculateDays(form.startDate, form.endDate);

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
      setLeases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, [filter]);

  const addFiles = (list) => {
    const arr = Array.from(list);
    const unique = arr.filter(f => !files.find(x => x.name === f.name));
    setFiles(p => [...p, ...unique]);
  };

  const removeFile = (name) => setFiles(p => p.filter(f => f.name !== name));
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      const user = JSON.parse(localStorage.getItem("pms_user") || "{}") || {};

      // append form fields
      Object.entries(form).forEach(([k, v]) => {
        // do not append undefined values
        if (v !== undefined) fd.append(k, String(v));
      });

      // append identifiers from logged-in user when available
      if (user && typeof user.id !== "undefined" && Number.isFinite(Number(user.id))) {
        fd.append("userId", String(user.id));
      }
      if (user && typeof user.userId !== "undefined") {
        fd.append("userIdentifier", String(user.userId));
      }

      // Note: form may also contain `userIdentifier` populated from selected customer; form entries were appended above.

      files.forEach(f => fd.append("docs", f));

      // Build headers; include Authorization header when token exists
      const headers = { "Content-Type": "multipart/form-data" };
      if (user && user.token) headers.Authorization = `Bearer ${user.token}`;

      if (editingId) {
        await axios.put(`${API}/${editingId}`, fd, { headers });
      } else {
        await axios.post(API, fd, { headers });
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

  const handleEdit = (lease) => {
    const selectedCustomer = customers.find(c => c.id === lease.customerId) || currentCustomers.find(c => c.id === lease.customerId);
    const selectedProperty = properties.find(p => p.id === lease.propertyId) || currentProperties.find(p => p.id === lease.propertyId);
    setForm({
      customerId: lease.customerId || "",
      customerIdentifier: lease.customerIdentifier || selectedCustomer?.customerId || "",
      customerName: lease.customerName || selectedCustomer?.name || "",
      property: lease.property || selectedProperty?.name || "",
      propertyId: lease.propertyId || "",
      propertyUnit: lease.propertyUnit || "",
      propertyAddress: lease.propertyAddress || selectedProperty?.address || "",
      startDate: lease.startDate || "",
      endDate: lease.endDate || "",
      leaseValueCurrency: lease.leaseValueCurrency || "₹ INR",
      leaseValueAmount: lease.leaseValueAmount || "",
      advanceCurrency: lease.advanceCurrency || "₹ INR",
      advanceAmount: lease.advanceAmount || "",
      paymentDate: lease.paymentDate || "",
      exceptionDate: lease.exceptionDate || "",
      delayPenaltyCurrency: lease.delayPenaltyCurrency || "₹ INR",
      delayPenaltyAmount: lease.delayPenaltyAmount || "",
      status: lease.status || "Active",
      petsAllowed: typeof lease.petsAllowed === "boolean" ? lease.petsAllowed : false,
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
    <div className="lease-page">
      <div className="lease-page-top">
        <div>
          <div className="lease-page-meta">AGREEMENTS / LEASE AGREEMENT MODULE</div>
          <h1>Lease Agreements</h1>
        </div>
        <div className="lease-page-note">Long-term lease contracts</div>
      </div>

      <div className="lease-panel-card">
        <div className="lease-panel-row">
          <input
            className="lease-search"
            placeholder="Search leases..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchLeases()}
          />
          <select className="lease-status-select" value={filter} onChange={e => setFilter(e.target.value)}>
            {['All', 'Active', 'Expired', 'Terminated', 'Renewal Pending'].map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <button className="lease-btn primary" onClick={() => { setShow(!showForm); setEditingId(null); setForm(emptyForm); setFiles([]); }}>
            + New Lease
          </button>
        </div>
        <div className="lease-record-count">{filtered.length} record{filtered.length === 1 ? '' : 's'}</div>
      </div>

      {error && (
        <div style={{ background: "#fdf0f0", border: "1.5px solid #e8b0b0", borderRadius: 10, padding: "0.7rem 1rem", marginBottom: "1rem", fontSize: "0.87rem", color: "var(--maroon-dark)" }}>
          <i className="bi bi-exclamation-circle me-2"></i>{error}
          <button onClick={() => setError("")} style={{ float: "right", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
        </div>
      )}

      {/* ══ Form Dialog ══ */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => { setShow(false); setForm(emptyForm); setFiles([]); setEditingId(null); }}
          title={editingId ? "Edit Lease Agreement" : "New Lease Agreement"}
          size="large"
          className="lease-modal"
          footer={
            <>
              <button className="btn-pms secondary" type="button" onClick={() => { setShow(false); setForm(emptyForm); setFiles([]); setEditingId(null); }}>
                Cancel
              </button>
              <button className="btn-pms primary" type="submit" form="lease-form" disabled={saving}>
                {saving ? <>Saving...</> : <>{editingId ? "Update Lease" : "Save Lease"}</>}
              </button>
            </>
          }
        >
          <form id="lease-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-section-title">Customer & Property</div>
              <div className="lease-grid-4">
                
                <div className="field-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option>Active</option>
                    <option>Expired</option>
                    <option>Terminated</option>
                    <option>Renewal Pending</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Customer *</label>
                  <select required value={form.customerId} onChange={e => handleCustomerSelect(e.target.value)}>
                    <option value="">— Select Customer —</option>
                    {displayedCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>Customer Name</label>
                  <input value={form.customerName} placeholder="Customer name" readOnly />
                </div>
              </div>
              <div className="lease-grid-4">
                <div className="field-group">
                  <label>Property *</label>
                  <select required value={form.propertyId} onChange={e => handlePropertySelect(e.target.value)}>
                    <option value="">— Select Property —</option>
                    {displayedProperties.map(p => <option key={p.id} value={p.id}>{`${p.name} — ${p.address || ''}`}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>Property Unit</label>
                  <input value={form.propertyUnit} onChange={e => setForm({ ...form, propertyUnit: e.target.value })} placeholder="Unit / Apartment / Office" />
                </div>
                <div className="field-group form-full">
                  <label>Property Address</label>
                  <textarea value={form.propertyAddress} onChange={e => setForm({ ...form, propertyAddress: e.target.value })} placeholder="Full property address" />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Lease Duration</div>
              <div className="lease-grid-4">
                <div className="field-group">
                  <label>Start Date *</label>
                  <input required type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="field-group">
                  <label>End Date *</label>
                  <input required type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
                <div className="field-group form-full">
                  <label>Tenure (auto-calculated)</label>
                  <div className="split-input">
                    <select disabled style={{ width: 120 }}>
                      <option>Days</option>
                    </select>
                    <input readOnly value={tenure} placeholder="Auto-calculated from dates" />
                  </div>
                </div>
              </div>
              {/* Duration (days) is shown in the Tenure field above */}
            </div>

            <div className="form-section">
              <div className="form-section-title">Financial Details</div>
              <div className="lease-grid-3">
                <div className="field-group">
                  <label>Lease Value *</label>
                  
                  <div className="split-input-currency">
                    <select value={form.leaseValueCurrency} onChange={e => setForm({ ...form, leaseValueCurrency: e.target.value })} style={{ width: 120,borderRadius:"0px" }}>
                      {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input style={{backgroundColor:"white",borderRadius:"0px"}} type="number" value={form.leaseValueAmount} onChange={e => setForm({ ...form, leaseValueAmount: e.target.value })} placeholder="0.00" />
                  </div>
                </div>
                <div className="field-group">
                  <label>Advance Amount</label>
                  <div className="split-input" style={{gap:"0px"}}>
                    <select value={form.advanceCurrency} onChange={e => setForm({ ...form, advanceCurrency: e.target.value })} style={{ width: 120,borderRadius:"0px" }}>
                      {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" style={{backgroundColor:"white",borderRadius:"0px"}} value={form.advanceAmount} onChange={e => setForm({ ...form, advanceAmount: e.target.value })} placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Payment & Penalty</div>
              <div className="lease-grid-4">
                <div className="field-group">
                  <label>Payment Date</label>
                  <input type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} />
                </div>
                <div className="field-group">
                  <label>Exception Date</label>
                  <input type="date" value={form.exceptionDate} onChange={e => setForm({ ...form, exceptionDate: e.target.value })} />
                </div>
                <div className="field-group form-full">
                  <label>Delay Penalty</label>
                  <div className="split-input">
                    <select style={{borderRadius:"0px", width:"10%"}}  value={form.delayPenaltyCurrency} onChange={e => setForm({ ...form, delayPenaltyCurrency: e.target.value })}>
                      {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input style={{backgroundColor:"white",borderRadius:"0px"}} type="number" value={form.delayPenaltyAmount} onChange={e => setForm({ ...form, delayPenaltyAmount: e.target.value })} placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Pet Policy</div>
              <div className="field-group">
                <label>Pets Allowed</label>
                <div className="pet-toggle">
                  <button type="button" className={form.petsAllowed ? "active" : ""} onClick={() => setForm({ ...form, petsAllowed: true })}>Yes</button>
                  <button type="button" className={!form.petsAllowed ? "active" : ""} onClick={() => setForm({ ...form, petsAllowed: false })}>No</button>
                </div>
              </div>
            </div>

            {/* Agreement Details removed per request */}

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
              <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style={{ display: "none" }} onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />
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
          </form>
        </Modal>
      )}

      {/* ══ Table ══ */}
      <div className="lease-table-card">
        {loading ? (
          <div className="lease-empty-state">Loading...</div>
        ) : (
          <div className="table-wrap lease-table-wrap">
            <table className="lease-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  {/* <th>Property</th> */}
                  <th>Start</th>
                  <th>End</th>
                  <th>Tenure</th>
                  <th>Lease Value</th>
                  <th>Advance</th>
                  <th>Status</th>
                  <th>PDF</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, idx) => (
                  <tr key={l.id}>
                    <td className="lease-cell-id">{idx + 1}</td>
                    <td>{l.tenant}</td>
                    {/* <td>{l.property} {l.propertyUnit}</td> */}
                    <td>{l.startDate}</td>
                    <td>{l.endDate}</td>
                    <td>{l.leaseTerm} months</td>
                    <td className="lease-cell-amount">₹{(l.leaseValueAmount ? Number(l.leaseValueAmount) : Number(l.monthlyRent || 0)).toLocaleString('en-IN')}.00</td>
                    <td className="lease-cell-amount">₹{(l.advanceAmount ? Number(l.advanceAmount) : Number(l.securityDeposit || 0)).toLocaleString('en-IN')}.00</td>
                    <td><span className={`badge-lease ${statusColor[l.status]}`}>{l.status.toUpperCase()}</span></td>
                    <td>
                      <button className="lease-pdf-btn" type="button">
                        <i className="bi bi-file-earmark-text"></i> PDF
                      </button>
                    </td>
                    <td className="lease-action-cell">
                      <button className="lease-link-btn" onClick={() => handleEdit(l)} title="Edit">
                        <i className="bi bi-pencil" aria-hidden="true"></i>
                      </button>
                      <button className="lease-link-btn" onClick={() => handleDelete(l.id)} title="Delete" style={{ marginLeft: 8 }}>
                        <i className="bi bi-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={11} className="lease-empty-state">No lease agreements found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}