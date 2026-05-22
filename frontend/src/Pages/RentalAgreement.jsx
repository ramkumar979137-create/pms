// Pages/RentalAgreement.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Css/Global.css";

const API            = `api/rental-agreements`;
const periodOptions  = ["Monthly", "Quarterly", "Half-Year", "Annual"];
const paymentOptions = ["Bank Transfer", "UPI", "Cash", "Cheque"];
const statusColor    = { Active:"success", Expired:"warning", Cancelled:"danger" };

const emptyForm = {
  tenant:"", property:"", propertyUnit:"", propertyType:"Residential",
  start:"", end:"", periodType:"Monthly",
  rent:"", deposit:"", maintenanceCharge:"", rentDueDay:"1",
  paymentMode:"Bank Transfer", status:"Active",
  specialTerms:"", notes:"", autoRenew:false,
};

/* ── File icon helper ── */
function fileIcon(name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf")                      return { icon:"bi-file-earmark-pdf-fill",  color:"#c0392b" };
  if (["jpg","jpeg","png"].includes(ext)) return { icon:"bi-file-earmark-image-fill", color:"#1565a0" };
  if (["doc","docx"].includes(ext))       return { icon:"bi-file-earmark-word-fill",  color:"#2980b9" };
  return                                         { icon:"bi-file-earmark-fill",        color:"#6b7a90" };
}

/* ── Doc chip ── */
function DocChip({ name, onRemove }) {
  const { icon, color } = fileIcon(name);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", background:"var(--cream-dark)", border:"1.5px solid var(--border)", borderRadius:8, padding:"0.3rem 0.65rem", fontSize:"0.78rem", color:"var(--text-mid)", maxWidth:210 }}>
      <i className={`bi ${icon}`} style={{ color, fontSize:"0.95rem", flexShrink:0 }}></i>
      <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{name}</span>
      {onRemove && (
        <button onClick={onRemove} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--danger)", padding:0, fontSize:"0.8rem", flexShrink:0 }}>
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
}

export default function RentalAgreement() {
  const [rentals,  setRentals]  = useState([]);
  const [showForm, setShow]     = useState(false);
  const [form,     setForm]     = useState(emptyForm);
  const [files,    setFiles]    = useState([]);
  const [filter,   setFilter]   = useState("All");
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  /* ── Fetch ── */
  const fetchRentals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "All") params.status = filter;
      if (search)           params.tenant  = search;
      const res = await axios.get('http://localhost:5000/api/rental-agreements', { params });
      setRentals(res.data.rentals || []);
    } catch {
      setError("Failed to load rentals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRentals(); }, [filter]);

  /* ── File helpers ── */
  const addFiles  = (list) => {
    const arr    = Array.from(list);
    const unique = arr.filter(f => !files.find(x => x.name === f.name));
    setFiles(p => [...p, ...unique]);
  };
  const removeFile = (name) => setFiles(p => p.filter(f => f.name !== name));
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const fd   = new FormData();
      const user = JSON.parse(localStorage.getItem("pms_user") || "{}");

      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append("userId", String(user.id || 1));
      files.forEach(f => fd.append("docs", f));

      await axios.post("http://localhost:5000/api/rental-agreements", fd, { headers: { "Content-Type": "multipart/form-data" } });

      setForm(emptyForm); setFiles([]); setShow(false);
      fetchRentals();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete rental ── */
 const handleDelete = async (id) => {
  if (!window.confirm("Delete this rental agreement?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/rental-agreements/${id}`);
    fetchRentals();
  } catch {
    setError("Failed to delete.");
  }
};

  /* ── Remove a doc from existing record ── */
  const handleRemoveDoc = async (id, fileName) => {
    try { await axios.delete(`http://localhost:5000/api/rental-agreements/${id}/doc`, { data: { fileName } }); fetchRentals(); }
    catch { setError("Failed to remove document."); }
  };

  const filtered = rentals.filter(r =>
    r.tenant?.toLowerCase().includes(search.toLowerCase()) ||
    r.property?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h2><i className="bi bi-house-fill" style={{ marginRight:8, color:"var(--maroon-main)" }}></i>Rental Agreement</h2>
        <p>Manage short-term and periodic rental agreements with supporting documents.</p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {["Active","Expired","Cancelled"].map(s => (
          <div className="stat-card" key={s}>
            <div className={`stat-icon ${statusColor[s]}`}><i className="bi bi-house-fill"></i></div>
            <div>
              <div className="stat-label">{s}</div>
              <div className="stat-value">{rentals.filter(r => r.status === s).length}</div>
            </div>
          </div>
        ))}
        <div className="stat-card">
          <div className="stat-icon maroon"><i className="bi bi-cash-stack"></i></div>
          <div>
            <div className="stat-label">Active Revenue</div>
            <div className="stat-value">₹{(rentals.filter(r=>r.status==="Active").reduce((a,r)=>a+Number(r.rent),0)/1000).toFixed(0)}K</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
        <input
          style={{ flex:1, minWidth:180, border:"1.5px solid var(--border)", borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.88rem", background:"var(--white)", fontFamily:"DM Sans,sans-serif", color:"var(--text-dark)" }}
          placeholder="🔍  Search tenant or property..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchRentals()}
        />
        {["All","Active","Expired","Cancelled"].map(f => (
          <button key={f} className={`btn-pms ${filter===f?"primary":"secondary"}`}
            style={{ padding:"0.4rem 0.9rem", fontSize:"0.82rem" }}
            onClick={() => setFilter(f)}>{f}
          </button>
        ))}
        <button className="btn-pms gold" onClick={() => setShow(!showForm)}>
          <i className="bi bi-plus-lg"></i> New Rental
        </button>
      </div>

      {error && (
        <div style={{ background:"#fdf0f0", border:"1.5px solid #e8b0b0", borderRadius:10, padding:"0.7rem 1rem", marginBottom:"1rem", fontSize:"0.87rem", color:"var(--maroon-dark)" }}>
          <i className="bi bi-exclamation-circle me-2"></i>{error}
          <button onClick={()=>setError("")} style={{ float:"right", background:"none", border:"none", cursor:"pointer", fontSize:"0.9rem" }}>✕</button>
        </div>
      )}

      {/* ══ Form ══ */}
      {showForm && (
        <div className="pms-card" style={{ marginBottom:"1.25rem" }}>
          <h3 style={{ fontSize:"1rem", marginBottom:"1.25rem" }}>New Rental Agreement</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ marginBottom:"1rem" }}>

              <div className="field-group">
                <label>Tenant Name *</label>
                <input required value={form.tenant} onChange={e=>setForm({...form,tenant:e.target.value})} placeholder="Amit Kumar" />
              </div>
              <div className="field-group">
                <label>Property Name *</label>
                <input required value={form.property} onChange={e=>setForm({...form,property:e.target.value})} placeholder="City Hub" />
              </div>
              <div className="field-group">
                <label>Unit No</label>
                <input value={form.propertyUnit} onChange={e=>setForm({...form,propertyUnit:e.target.value})} placeholder="1A" />
              </div>
              <div className="field-group">
                <label>Property Type</label>
                <select value={form.propertyType} onChange={e=>setForm({...form,propertyType:e.target.value})}>
                  {["Residential","Commercial","Villa","Hotel","Hostel"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Start Date *</label>
                <input required type="date" value={form.start} onChange={e=>setForm({...form,start:e.target.value})} />
              </div>
              <div className="field-group">
                <label>End Date *</label>
                <input required type="date" value={form.end} onChange={e=>setForm({...form,end:e.target.value})} />
              </div>
              <div className="field-group">
                <label>Period Type</label>
                <select value={form.periodType} onChange={e=>setForm({...form,periodType:e.target.value})}>
                  {periodOptions.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Monthly Rent (₹) *</label>
                <input required type="number" value={form.rent} onChange={e=>setForm({...form,rent:e.target.value})} placeholder="12000" />
              </div>
              <div className="field-group">
                <label>Security Deposit (₹)</label>
                <input type="number" value={form.deposit} onChange={e=>setForm({...form,deposit:e.target.value})} placeholder="24000" />
              </div>
              <div className="field-group">
                <label>Maintenance Charge (₹)</label>
                <input type="number" value={form.maintenanceCharge} onChange={e=>setForm({...form,maintenanceCharge:e.target.value})} placeholder="500" />
              </div>
              <div className="field-group">
                <label>Rent Due Day (1–28)</label>
                <input type="number" min="1" max="28" value={form.rentDueDay} onChange={e=>setForm({...form,rentDueDay:e.target.value})} />
              </div>
              <div className="field-group">
                <label>Payment Mode</label>
                <select value={form.paymentMode} onChange={e=>setForm({...form,paymentMode:e.target.value})}>
                  {paymentOptions.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Status</label>
                <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                  <option>Active</option><option>Expired</option><option>Cancelled</option>
                </select>
              </div>
              <div className="field-group" style={{ justifyContent:"flex-end" }}>
                <label style={{ display:"flex", alignItems:"center", gap:"0.5rem", cursor:"pointer", marginTop:"1.5rem" }}>
                  <input type="checkbox" checked={form.autoRenew} onChange={e=>setForm({...form,autoRenew:e.target.checked})} />
                  Auto Renew
                </label>
              </div>
              <div className="field-group form-full">
                <label>Special Terms</label>
                <textarea value={form.specialTerms} onChange={e=>setForm({...form,specialTerms:e.target.value})} placeholder="Any special clauses or conditions..." />
              </div>
              <div className="field-group form-full">
                <label>Notes / Remarks</label>
                <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Internal remarks..." />
              </div>
            </div>

            {/* ── Document Upload ── */}
            <div style={{ marginBottom:"1.25rem" }}>
              <label style={{ fontSize:"0.82rem", fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:"0.5rem" }}>
                <i className="bi bi-paperclip" style={{ marginRight:5, color:"var(--maroon-main)" }}></i>
                Supporting Documents
                <span style={{ fontSize:"0.74rem", fontWeight:400, color:"var(--text-muted)", marginLeft:6 }}>
                  Agreement, ID proof, NOC, photos…
                </span>
              </label>

              <div
                onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={handleDrop}
                onClick={()=>fileRef.current.click()}
                style={{
                  border:`2px dashed ${dragOver?"var(--maroon-main)":"var(--border)"}`,
                  borderRadius:12, padding:"1.5rem 1rem",
                  background:dragOver?"rgba(139,32,32,0.04)":"var(--cream)",
                  cursor:"pointer", textAlign:"center", transition:"all 0.2s",
                  marginBottom:"0.75rem",
                }}
              >
                <i className="bi bi-cloud-upload-fill" style={{ fontSize:"2rem", color:dragOver?"var(--maroon-main)":"var(--text-muted)", display:"block", marginBottom:"0.4rem" }}></i>
                <div style={{ fontSize:"0.86rem", fontWeight:600, color:"var(--text-mid)" }}>
                  Drag & drop, or <span style={{ color:"var(--maroon-main)", textDecoration:"underline" }}>click to browse</span>
                </div>
                <div style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginTop:"0.25rem" }}>
                  PDF, JPG, PNG, DOC, DOCX — Max 10MB each
                </div>
              </div>

              <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                style={{ display:"none" }} onChange={e=>{addFiles(e.target.files);e.target.value="";}} />

              {files.length > 0 ? (
                <div>
                  <div style={{ fontSize:"0.78rem", color:"var(--text-muted)", marginBottom:"0.4rem" }}>
                    {files.length} file{files.length>1?"s":""} ready to upload
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
                    {files.map(f => <DocChip key={f.name} name={f.name} onRemove={()=>removeFile(f.name)} />)}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize:"0.78rem", color:"var(--text-muted)", textAlign:"center" }}>No files selected</div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:"0.75rem", paddingTop:"0.75rem", borderTop:"1px solid var(--border)" }}>
              <button className="btn-pms primary" type="submit" disabled={saving}>
                {saving
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                  : <><i className="bi bi-check-lg"></i> Save Rental</>}
              </button>
              <button className="btn-pms secondary" type="button"
                onClick={()=>{setShow(false);setForm(emptyForm);setFiles([]);}}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ══ Table ══ */}
      <div className="pms-card">
        {loading ? (
          <div style={{ textAlign:"center", padding:"2rem", color:"var(--text-muted)" }}>
            <span className="spinner-border spinner-border-sm me-2"></span>Loading...
          </div>
        ) : (
          <div className="pms-table-wrap">
            <table className="pms-table">
              <thead>
                <tr>
                  <th>Rental ID</th><th>Tenant</th><th>Property</th>
                  <th>Period</th><th>Rent</th><th>Start</th><th>End</th>
                  <th>Documents</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight:600, color:"var(--maroon-main)", fontSize:"0.78rem" }}>{r.rentalId}</td>
                    <td style={{ fontWeight:500 }}>{r.tenant}</td>
                    <td style={{ color:"var(--text-muted)", fontSize:"0.82rem" }}>{r.property} {r.propertyUnit}</td>
                    <td><span className="badge-pms neutral">{r.periodType}</span></td>
                    <td style={{ fontWeight:600 }}>₹{Number(r.rent).toLocaleString("en-IN")}</td>
                    <td style={{ fontSize:"0.82rem" }}>{r.start}</td>
                    <td style={{ fontSize:"0.82rem" }}>{r.end}</td>
                    <td>
                      {r.docs && r.docs.length > 0 ? (
                        <div style={{ display:"flex", flexDirection:"column", gap:"0.3rem" }}>
                          {r.docs.map(d => (
                            <DocChip key={d.name} name={d.name} onRemove={()=>handleRemoveDoc(r.id, d.name)} />
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize:"0.78rem", color:"var(--text-muted)" }}>— No docs</span>
                      )}
                    </td>
                    <td><span className={`badge-pms ${statusColor[r.status]}`}>{r.status}</span></td>
                    <td>
                      <div style={{ display:"flex", gap:"0.4rem" }}>
                        <button className="btn-pms sm secondary"><i className="bi bi-pencil"></i></button>
                        <button className="btn-pms sm danger" onClick={()=>handleDelete(r.id)}><i className="bi bi-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={10} style={{ textAlign:"center", padding:"2rem", color:"var(--text-muted)" }}>
                      No rental agreements found.
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