import { useState } from "react";
import "../Css/Customers.css";

/* ── Seed data ── */
const SEED = [
  {
    id: "CUS-001", firstName: "Ravi",  lastName: "Krishnan",
    type: "Tenant", occupation: "Business",
    email: "ravi.k@email.com",  phone: "9840011111",
    idType: "Aadhaar", idNumber: "123456789012",
    address: "12 Anna Nagar, Chennai - 600040",
    countryCode: "+91",
  },
  {
    id: "CUS-002", firstName: "Priya", lastName: "Sundaram",
    type: "Owner",  occupation: "Self-Employed",
    email: "priya.s@email.com", phone: "9840022222",
    idType: "PAN",    idNumber: "ABCDE1234F",
    address: "45 T Nagar, Chennai - 600017",
    countryCode: "+91",
  },
  {
    id: "CUS-003", firstName: "Aarav", lastName: "Mehta",
    type: "Tenant", occupation: "Employee",
    email: "aarav.m@email.com", phone: "9840033333",
    idType: "Passport", idNumber: "P1234567",
    address: "78 Velachery, Chennai - 600042",
    countryCode: "+91",
  },
];

const OCCUPATIONS   = ["Business", "Self-Employed", "Employee", "Student", "Retired", "Other"];
const ID_TYPES      = ["Aadhaar", "PAN", "Passport", "Voter ID", "Driving Licence"];
const COUNTRY_CODES = [{ code: "+91", label: "IN +91" }, { code: "+1", label: "US +1" }, { code: "+44", label: "UK +44" }];

/* Mask ID for table display */
function maskId(type, num) {
  if (!type || !num) return "—";
  const tail = num.slice(-4);
  const dots  = "·".repeat(Math.max(num.length - 4, 4));
  return `${type} · ${dots}${tail}`;
}

/* Auto increment CUS id */
function nextId(list) {
  const max = list.reduce((acc, c) => {
    const n = parseInt(c.id.replace("CUS-", ""), 10);
    return n > acc ? n : acc;
  }, 0);
  return `CUS-${String(max + 1).padStart(3, "0")}`;
}

/* ══════════════════════════════════
   DIALOG COMPONENT
══════════════════════════════════ */
function CustomerDialog({ onClose, onSave, existing, newId }) {
  const isEdit = !!existing;
  const blank = {
    id: newId, type: "Tenant",
    firstName: "", lastName: "", occupation: "",
    address: "", countryCode: "+91",
    phone: "", email: "", idType: "", idNumber: "",
  };
  const [form, setForm] = useState(isEdit ? { ...existing } : blank);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() || !form.address.trim()) {
      alert("பெயர், Phone, Address — இவை மூன்றும் அவசியம்.");
      return;
    }
    onSave(form);
  };

  /* Close on overlay click */
  const handleOverlay = e => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div className="cm-overlay" onClick={handleOverlay}>
      <div className="cm-dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title">

        {/* ── Header ── */}
        <div className="cm-dialog-header">
          <h2 id="dlg-title">{isEdit ? "Edit Customer" : "New Customer"}</h2>
          <button className="cm-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="cm-dialog-body">

          {/* ── BASIC INFORMATION ── */}
          <p className="cm-section-title">Basic Information</p>
          <div className="cm-form-grid g4">
            <div className="cm-field">
              <label>Customer ID</label>
              <input value={form.id} readOnly />
            </div>
            <div className="cm-field">
              <label>Type <span className="req">*</span></label>
              <select value={form.type} onChange={e => set("type", e.target.value)}>
                <option>Tenant</option>
                <option>Owner</option>
              </select>
            </div>
            <div className="cm-field">
              <label>First Name <span className="req">*</span></label>
              <input placeholder="First name" value={form.firstName} onChange={e => set("firstName", e.target.value)} />
            </div>
            <div className="cm-field">
              <label>Last Name <span className="req">*</span></label>
              <input placeholder="Last name" value={form.lastName} onChange={e => set("lastName", e.target.value)} />
            </div>
          </div>

          {/* Occupation */}
          <div className="cm-form-grid g2">
            <div className="cm-field">
              <label>Occupation</label>
              <select value={form.occupation} onChange={e => set("occupation", e.target.value)}>
                <option value="">— Select —</option>
                {OCCUPATIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="cm-form-grid g1">
            <div className="cm-field">
              <label>Address <span className="req">*</span></label>
              <textarea
                placeholder="Full address"
                value={form.address}
                onChange={e => set("address", e.target.value)}
              />
            </div>
          </div>

          <hr className="cm-divider" />

          {/* ── CONTACT & IDENTITY ── */}
          <p className="cm-section-title">Contact &amp; Identity</p>

          {/* Mobile */}
          <div className="cm-form-grid g1" style={{ marginBottom: 14 }}>
            <div className="cm-field">
              <label>Mobile Number <span className="req">*</span></label>
              <div className="cm-phone-row">
                <select value={form.countryCode} onChange={e => set("countryCode", e.target.value)}>
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <input
                  placeholder="Mobile number"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="cm-form-grid g2">
            <div className="cm-field">
              <label>Email</label>
              <input type="email" placeholder="email@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div className="cm-field">
              <label>ID Proof Type</label>
              <select value={form.idType} onChange={e => set("idType", e.target.value)}>
                <option value="">— Select —</option>
                {ID_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="cm-form-grid g2" style={{ marginTop: 14 }}>
            <div className="cm-field">
              <label>ID Proof Number</label>
              <input
                placeholder="ID number (will be masked in lists)"
                value={form.idNumber}
                onChange={e => set("idNumber", e.target.value)}
              />
            </div>
          </div>

          <hr className="cm-divider" />

          {/* ── SUPPORTING DOCUMENTS ── */}
          <p className="cm-section-title">Supporting Documents</p>
          <div className="cm-upload-zone">
            <input type="file" id="doc-upload" multiple accept=".pdf,.jpg,.jpeg,.png" />
            <label className="cm-upload-label" htmlFor="doc-upload">Choose Files</label>
            <p className="cm-upload-note">ID copy, address proof, etc. — multiple files allowed</p>
            <p style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>No documents uploaded yet.</p>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="cm-dialog-footer">
          <button className="cm-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="cm-save-btn" onClick={handleSave}>Save Customer</button>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
export default function CustomerModule() {
  const [customers, setCustomers] = useState(SEED);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("All Types");
  const [dialog, setDialog]       = useState(null); // null | "add" | customer-object

  /* Filtered list */
  const visible = customers.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q
      || `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
      || c.email.toLowerCase().includes(q)
      || c.id.toLowerCase().includes(q)
      || c.phone.includes(q);
    const matchF = filter === "All Types" || c.type === filter;
    return matchQ && matchF;
  });

  const handleSave = (form) => {
    setCustomers(prev => {
      const idx = prev.findIndex(c => c.id === form.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = form;
        return updated;
      }
      return [...prev, form];
    });
    setDialog(null);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete customer ${id}?`)) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const SearchIcon = () => (
    <svg width="14" height="14" fill="none" stroke="#7b91b0" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  return (
    <div className="cm-page">

      {/* Breadcrumb */}
      <div className="cm-breadcrumb">Master / <em>Customer Module</em></div>

      {/* Heading */}
      <div className="cm-heading-row">
        <h1>Customers</h1>
        <span className="cm-subtitle">Tenants and property owners</span>
      </div>

      {/* Toolbar */}
      <div className="cm-toolbar">
        <div className="cm-search">
          <SearchIcon />
          <input
            placeholder="Search by name, email, ID, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="cm-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All Types</option>
          <option>Tenant</option>
          <option>Owner</option>
        </select>
        <div className="cm-spacer" />
        <button className="cm-add-btn" onClick={() => setDialog("add")}>+ Add Customer</button>
      </div>

      {/* Count */}
      <div className="cm-record-count">{visible.length} record(s)</div>

      {/* ── DESKTOP TABLE ── */}
      <div className="cm-table-wrap">
        <div className="cm-table-scroll">
          <table className="cm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Occupation</th>
                <th>Email</th>
                <th>Phone</th>
                <th>ID Proof</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 40, color: "#7b91b0" }}>
                    No customers found.
                  </td>
                </tr>
              )}
              {visible.map(c => (
                <tr key={c.id}>
                  <td><span className="cm-id">{c.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{c.firstName} {c.lastName}</td>
                  <td>
                    <span className={`cm-badge ${c.type.toLowerCase()}`}>{c.type}</span>
                  </td>
                  <td style={{ color: "#7b91b0" }}>{c.occupation || "—"}</td>
                  <td style={{ color: "#7b91b0", fontSize: 13 }}>{c.email || "—"}</td>
                  <td style={{ color: "#7b91b0" }}>{c.phone ? `${c.countryCode} ${c.phone}` : "—"}</td>
                  <td style={{ fontSize: 12, color: "#7b91b0" }}>{maskId(c.idType, c.idNumber)}</td>
                  <td style={{ width: 60 }}>
                    <button className="cm-edit-btn" onClick={() => setDialog(c)}>Edit</button>
                  </td>
                  <td style={{ width: 70 }}>
                    <button className="cm-del-btn" onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MOBILE CARD LIST ── */}
      <div className="cm-mobile-list">
        {visible.length === 0 && (
          <p style={{ textAlign: "center", color: "#7b91b0", padding: "32px 0" }}>
            No customers found.
          </p>
        )}
        {visible.map(c => (
          <div className="cm-mobile-card" key={c.id}>
            <div className="cm-mc-top">
              <div>
                <div className="cm-mc-name">{c.firstName} {c.lastName}</div>
                <div className="cm-mc-id">{c.id}</div>
              </div>
              <span className={`cm-badge ${c.type.toLowerCase()}`}>{c.type}</span>
            </div>

            {c.occupation && (
              <div className="cm-mc-row">Occupation: <span>{c.occupation}</span></div>
            )}
            {c.email && (
              <div className="cm-mc-row">Email: <span>{c.email}</span></div>
            )}
            {c.phone && (
              <div className="cm-mc-row">Phone: <span>{c.countryCode} {c.phone}</span></div>
            )}
            {c.idType && (
              <div className="cm-mc-row">ID: <span>{maskId(c.idType, c.idNumber)}</span></div>
            )}

            <div className="cm-mc-actions">
              <button className="cm-edit-btn" onClick={() => setDialog(c)}>Edit</button>
              <button className="cm-del-btn" onClick={() => handleDelete(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── DIALOG ── */}
      {dialog && (
        <CustomerDialog
          onClose={() => setDialog(null)}
          onSave={handleSave}
          existing={dialog === "add" ? null : dialog}
          newId={nextId(customers)}
        />
      )}

    </div>
  );
}