import { useState } from "react";
import { createPortal } from "react-dom";
import "../Css/Customers.css";

const INITIAL_CUSTOMERS = [
  {
    id: "CUS-001",
    name: "Ravi Krishnan",
    type: "TENANT",
    occupation: "Business",
    email: "ravi.k@email.com",
    phone: "+91 9840011111",
    idProofType: "Aadhaar",
    idProofNumber: "••••••••••••9012",
  },
  {
    id: "CUS-002",
    name: "Priya Sundaram",
    type: "OWNER",
    occupation: "Self-Employed",
    email: "priya.s@email.com",
    phone: "+91 9840022222",
    idProofType: "PAN",
    idProofNumber: "••••••234F",
  },
  {
    id: "CUS-003",
    name: "Aarav Mehta",
    type: "TENANT",
    occupation: "Employee",
    email: "aarav.m@email.com",
    phone: "+91 9840033333",
    idProofType: "Passport",
    idProofNumber: "•••••4567",
  },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  type: "",
  occupation: "",
  gender: "",
  dob: "",
  address: "",
  countryCode: "+91",
  phone: "",
  email: "",
  idProofType: "",
  idProofNumber: "",
  documents: [],
};

function maskId(num) {
  if (!num) return "";
  const visible = num.slice(-4);
  return "•".repeat(Math.max(0, num.length - 4)) + visible;
}

function NewCustomerModal({ onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fileNames, setFileNames] = useState([]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setFileNames(files.map((f) => f.name));
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.type || !form.phone) {
      alert("Please fill in required fields: First Name, Type, Phone.");
      return;
    }
    const nextNum = Date.now();
    const newCustomer = {
      id: `CUS-${String(nextNum).slice(-3).padStart(3, "0")}`,
      name: `${form.firstName} ${form.lastName}`.trim(),
      type: form.type,
      occupation: form.occupation,
      email: form.email,
      phone: `${form.countryCode} ${form.phone}`,
      idProofType: form.idProofType,
      idProofNumber: form.idProofNumber ? maskId(form.idProofNumber) : "—",
    };
    onSave(newCustomer);
    onClose();
  };

  return createPortal(
    <div className="customer-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box customer-modal-large" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">New Customer</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-form">
          {/* BASIC INFO */}
          <div className="section-heading">
            <span>Basic Information</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name <span className="req">*</span></label>
              <input
                className="form-input"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                className="form-input"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type <span className="req">*</span></label>
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                <option value="">— Select —</option>
                <option value="TENANT">Tenant</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Occupation</label>
              <select
                className="form-select"
                value={form.occupation}
                onChange={(e) => set("occupation", e.target.value)}
              >
                <option value="">— Select —</option>
                <option value="Business">Business</option>
                <option value="Employee">Employee</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Student">Student</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
              >
                <option value="">— Select —</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                className="form-input"
                type="date"
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row single">
            <div className="form-group">
              <label className="form-label">Address <span className="req">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="Full address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
          </div>

          {/* CONTACT & IDENTITY */}
          <div className="section-heading">
            <span>Contact &amp; Identity</span>
          </div>

          <div className="form-row single">
            <div className="form-group">
              <label className="form-label">Mobile Number <span className="req">*</span></label>
              <div className="phone-row">
                <select
                  className="country-code-select"
                  value={form.countryCode}
                  onChange={(e) => set("countryCode", e.target.value)}
                >
                  <option value="+91">IN +91</option>
                  <option value="+1">US +1</option>
                  <option value="+44">GB +44</option>
                  <option value="+971">AE +971</option>
                  <option value="+65">SG +65</option>
                </select>
                <input
                  className="phone-input"
                  placeholder="Mobile number"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">ID Proof Type</label>
              <select
                className="form-select"
                value={form.idProofType}
                onChange={(e) => set("idProofType", e.target.value)}
              >
                <option value="">— Select —</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Driving Licence">Driving Licence</option>
              </select>
            </div>
          </div>

          <div className="form-row single">
            <div className="form-group">
              <label className="form-label">ID Proof Number</label>
              <input
                className="form-input"
                placeholder="ID number (will be masked in lists)"
                value={form.idProofNumber}
                onChange={(e) => set("idProofNumber", e.target.value)}
              />
            </div>
          </div>

          {/* SUPPORTING DOCUMENTS */}
          <div className="section-heading">
            <span>Supporting Documents</span>
          </div>

          <label className="upload-area" htmlFor="doc-upload">
            <div className="upload-icon">📎</div>
            <div className="upload-text">
              <strong>Upload Documents</strong>
            </div>
            <div className="upload-sub">ID copy, address proof, etc. — multiple files allowed</div>
            <input
              id="doc-upload"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFile}
            />
          </label>

          {fileNames.length === 0 ? (
            <p className="no-docs-text">No documents uploaded yet.</p>
          ) : (
            <ul style={{ marginTop: "0.75rem", paddingLeft: "1.2rem" }}>
              {fileNames.map((n, i) => (
                <li key={i} style={{ fontSize: "13px", color: "#4a4843", marginBottom: "4px" }}>
                  {n}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSubmit}>Save Customer</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [showModal, setShowModal] = useState(false);

  const filtered = customers.filter((c) => {
    const matchType =
      typeFilter === "All Types" || c.type === typeFilter.toUpperCase();
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.phone.includes(q);
    return matchType && matchSearch;
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete this customer?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSave = (newCustomer) => {
    setCustomers((prev) => [...prev, newCustomer]);
  };

  return (
    <div className="page-wrapper">
      <div className="breadcrumb">Master / Customer Module</div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
        </div>
        <span className="page-subtitle">Tenants and property owners</span>
      </div>

      <div className="card">
        <div className="toolbar">
          <button type="button" className="btn-add" onClick={() => setShowModal(true)}>
            + Add Customer
          </button>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search by name, email, ID, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>All Types</option>
            <option>Tenant</option>
            <option>Owner</option>
          </select>
        </div>

        <div className="record-count">{filtered.length} record(s)</div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Occupation</th>
                <th>Email</th>
                <th>Phone</th>
                <th>ID Proof</th>
                <th style={{ width: 120 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="id-cell">{c.id}</td>
                    <td>{c.name}</td>
                    <td>
                      <span className={`badge ${c.type === "TENANT" ? "badge-tenant" : "badge-owner"}`}>
                        {c.type}
                      </span>
                    </td>
                    <td>{c.occupation}</td>
                    <td style={{ color: "#555" }}>{c.email}</td>
                    <td>{c.phone}</td>
                    <td style={{ color: "#555", fontSize: "13px" }}>
                      {c.idProofType} · {c.idProofNumber}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-edit">Edit</button>
                        <button className="action-delete" onClick={() => handleDelete(c.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <NewCustomerModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}