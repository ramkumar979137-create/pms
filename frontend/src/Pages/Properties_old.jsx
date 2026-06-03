import { useState, useMemo, useEffect } from "react";
import Modal from "../Components/Modal";
import "../Css/Properties.css";

// ─── Initial Data ───
const INITIAL_DATA = [
  {
    id: "PRP-001",
    name: "Lotus Residency 3B",
    type: "APARTMENT",
    address: "12 KK Nagar, Madurai",
    occupancy: "Owned",
    owner: "Priya Sundaram",
    status: "OCCUPIED",
  },
  {
    id: "PRP-002",
    name: "Skyline Towers 7A",
    type: "APARTMENT",
    address: "88 OMR, Chennai",
    occupancy: "Owned",
    owner: "Priya Sundaram",
    status: "VACANT",
  },
  {
    id: "PRP-003",
    name: "Green Villa",
    type: "VILLA",
    address: "4 Whitefield, Bengaluru",
    occupancy: "Leased",
    owner: "Priya Sundaram",
    status: "OCCUPIED",
  },
];

const PROPERTY_TYPES = ["APARTMENT", "VILLA", "HOUSE", "COMMERCIAL", "PLOT"];
const OCCUPANCY_TYPES = ["Owned", "Leased", "Rented"];
const STATUSES = ["OCCUPIED", "VACANT"];

const EMPTY_FORM = {
  id: "",
  name: "",
  type: "APARTMENT",
  address: "",
  occupancy: "Owned",
  owner: "",
  status: "OCCUPIED",
  purchasedOn: "",
  purchaseValue: "",
  currency: "INR",
  occupancyType: "",
  maintenancePhone: "",
  maintenanceEmail: "",
  documents: [],
};

// ─── Search Icon ───
function SearchIcon() {
  return (
    <svg className="prop-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

// ─── Status Badge ───
function StatusBadge({ status }) {
  const cls = status === "OCCUPIED" ? "badge-status badge-occupied" : "badge-status badge-vacant";
  return <span className={cls}>{status}</span>;
}

// ─── Type Badge ───
function TypeBadge({ type }) {
  return <span className="badge-type">{type}</span>;
}

// ─── Add/Edit Modal ───
function PropertyModal({ property, onSave, onCancel }) {
  const isEdit = Boolean(property?.id);
  const [form, setForm] = useState(
    isEdit
      ? { ...property }
      : { ...EMPTY_FORM }
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.address.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    onSave(form);
  }

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={isEdit ? "Edit Property" : "New Property"}
      size="large"
      className="prop-modal-large"
      footer={
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-save" onClick={handleSubmit}>
            {isEdit ? "Save Property" : "Save Property"}
          </button>
        </div>
      }
    >
          <div className="modal-form">
            {/* ─── PROPERTY DETAILS ─── */}
            <div className="form-section">
              <h3 className="form-section-title">PROPERTY DETAILS</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Property ID</label>
                  <input
                    className="form-input"
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Auto-generated"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Property Name <span className="required">*</span></label>
                  <input
                    className="form-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Sunrise Apartments"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Property Type <span className="required">*</span></label>
                  <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group form-full">
                  <label className="form-label">Property Address <span className="required">*</span></label>
                  <textarea
                    className="form-input form-textarea"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full address with city, state, PIN"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* ─── OCCUPANCY & FINANCIAL ─── */}
            <div className="form-section">
              <h3 className="form-section-title">OCCUPANCY & FINANCIAL</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Occupancy Type</label>
                  <select className="form-select" name="occupancyType" value={form.occupancyType} onChange={handleChange}>
                    <option value="">-- Select --</option>
                    {OCCUPANCY_TYPES.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Purchased On</label>
                  <input
                    className="form-input"
                    name="purchasedOn"
                    type="date"
                    value={form.purchasedOn}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Purchase Value</label>
                  <div className="input-with-currency">
                    <select className="currency-select" name="currency" value={form.currency} onChange={handleChange}>
                      <option value="INR">₹ INR</option>
                      <option value="USD">$ USD</option>
                    </select>
                    <input
                      className="form-input"
                      name="purchaseValue"
                      type="number"
                      value={form.purchaseValue}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Linked Owner / Customer</label>
                  <select className="form-select" name="owner" value={form.owner} onChange={handleChange}>
                    <option value="">None</option>
                    <option value={form.owner}>{form.owner || "Owner"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ─── MAINTENANCE CONTACT ─── */}
            <div className="form-section">
              <h3 className="form-section-title">MAINTENANCE CONTACT</h3>
              
              <div className="form-row">
                <div className="form-group form-full">
                  <label className="form-label">Maintenance Phone</label>
                  <div className="phone-input">
                    <select className="country-code">
                      <option>IN +91</option>
                    </select>
                    <input
                      className="form-input"
                      name="maintenancePhone"
                      value={form.maintenancePhone}
                      onChange={handleChange}
                      placeholder="Maintenance contact"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group form-full">
                  <label className="form-label">Maintenance Email</label>
                  <input
                    className="form-input"
                    name="maintenanceEmail"
                    type="email"
                    value={form.maintenanceEmail}
                    onChange={handleChange}
                    placeholder="maintenance@example.com"
                  />
                </div>
              </div>
            </div>

            {/* ─── SUPPORTING DOCUMENTS ─── */}
            <div className="form-section">
              <h3 className="form-section-title">SUPPORTING DOCUMENTS</h3>
              
              <div className="form-row">
                <div className="form-group form-full">
                  <label className="form-label">Upload Documents
                    <span className="form-hint">(property documents, tax receipts, agreements, etc. — multiple files allowed)</span>
                  </label>
                  <div className="file-upload">
                    <button className="btn-choose-files">Choose Files</button>
                    <span className="file-status">No file chosen</span>
                  </div>
                  <p className="form-note">No documents uploaded yet.</p>
                </div>
              </div>
            </div>
          </div>

    </Modal>
  );
}

// ─── Confirm Delete Modal ───
function ConfirmModal({ property, onConfirm, onCancel }) {
  return (
    <Modal isOpen={true} onClose={onCancel} title={false} hideHeader>
      <div className="confirm-box">
        <div className="confirm-icon">🗑️</div>
        <h2 className="confirm-title">Delete Property?</h2>
        <p className="confirm-text">
          Are you sure you want to delete <strong>{property?.name}</strong>?<br />
          This action cannot be undone.
        </p>
        <div className="confirm-btns">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Component ───
export default function Properties() {
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deletingProperty, setDeletingProperty] = useState(null);

  // Toggle `modal-open` on body so header/sidebar can be blurred and made non-interactive
  useEffect(() => {
    const anyOpen = showAddModal || Boolean(editingProperty) || Boolean(deletingProperty);
    if (anyOpen) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [showAddModal, editingProperty, deletingProperty]);

  // ─── ID Generator ───
  function generateId(list) {
    const nums = list.map((p) => parseInt(p.id.replace("PRP-", ""), 10));
    const next = nums.length ? Math.max(...nums) + 1 : 1;
    return `PRP-${String(next).padStart(3, "0")}`;
  }

  // ─── Filtered Data ───
  const filtered = useMemo(() => {
    return data.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q);
      const matchType = typeFilter === "All Types" || p.type === typeFilter;
      const matchStatus = statusFilter === "All Status" || p.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [data, search, typeFilter, statusFilter]);

  // ─── CRUD ───
  function handleAdd(form) {
    const newProp = { ...form, id: generateId(data) };
    setData((prev) => [...prev, newProp]);
    setShowAddModal(false);
  }

  function handleEdit(form) {
    setData((prev) => prev.map((p) => (p.id === form.id ? form : p)));
    setEditingProperty(null);
  }

  function handleDelete() {
    setData((prev) => prev.filter((p) => p.id !== deletingProperty.id));
    setDeletingProperty(null);
  }

  // ─── Unique types in current data ───
  const allTypes = ["All Types", ...Array.from(new Set(data.map((p) => p.type)))];

  return (
    <div className="prop-page">
      {/* Header */}
      <header className="prop-header">
        <p className="prop-breadcrumb">Master / Property Module</p>
        <h1 className="prop-title">Properties</h1>
        <p className="prop-subtitle">Property inventory and occupancy</p>
      </header>

      {/* Main Card */}
      <div className="prop-card">
        {/* Toolbar */}
        <div className="prop-toolbar">
          <div className="prop-search-wrap">
            <SearchIcon />
            <input
              className="prop-search"
              type="text"
              placeholder="Search property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="prop-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {allTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            className="prop-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="OCCUPIED">OCCUPIED</option>
            <option value="VACANT">VACANT</option>
          </select>

          <button className="prop-add-btn" onClick={() => setShowAddModal(true)}>
            + Add Property
          </button>
        </div>

        {/* Record Count */}
        <p className="prop-count">{filtered.length} record(s)</p>

        {/* ── Desktop Table ── */}
        <div className="table-wrap prop-table-wrap">
          <table className="prop-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Address</th>
                <th>Occupancy</th>
                <th>Owner</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="prop-empty">No properties found.</div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td><span className="prop-id">{p.id}</span></td>
                    <td><span className="prop-name">{p.name}</span></td>
                    <td><TypeBadge type={p.type} /></td>
                    <td>{p.address}</td>
                    <td>{p.occupancy}</td>
                    <td>{p.owner}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>
                      <div className="prop-actions">
                        <button className="btn-edit" onClick={() => setEditingProperty(p)}>Edit</button>
                        <button className="btn-delete" onClick={() => setDeletingProperty(p)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Card List ── */}
        <div className="prop-mobile-list">
          {filtered.length === 0 ? (
            <div className="prop-empty">No properties found.</div>
          ) : (
            filtered.map((p) => (
              <div className="prop-mobile-card" key={p.id}>
                <div className="prop-mobile-top">
                  <div className="prop-mobile-id-name">
                    <span className="prop-mobile-id">{p.id}</span>
                    <span className="prop-mobile-name">{p.name}</span>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="prop-mobile-meta">
                  <div className="prop-mobile-meta-item">
                    <span className="prop-meta-label">Type</span>
                    <TypeBadge type={p.type} />
                  </div>
                  <div className="prop-mobile-meta-item">
                    <span className="prop-meta-label">Occupancy</span>
                    <span className="prop-meta-value">{p.occupancy}</span>
                  </div>
                  <div className="prop-mobile-meta-item">
                    <span className="prop-meta-label">Address</span>
                    <span className="prop-meta-value">{p.address}</span>
                  </div>
                  <div className="prop-mobile-meta-item">
                    <span className="prop-meta-label">Owner</span>
                    <span className="prop-meta-value">{p.owner}</span>
                  </div>
                </div>

                <div className="prop-mobile-footer">
                  <button className="btn-edit" onClick={() => setEditingProperty(p)}>Edit</button>
                  <button className="btn-delete" onClick={() => setDeletingProperty(p)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <PropertyModal
          property={null}
          onSave={handleAdd}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Modal */}
      {editingProperty && (
        <PropertyModal
          property={editingProperty}
          onSave={handleEdit}
          onCancel={() => setEditingProperty(null)}
        />
      )}

      {/* Delete Confirm Modal */}
      {deletingProperty && (
        <ConfirmModal
          property={deletingProperty}
          onConfirm={handleDelete}
          onCancel={() => setDeletingProperty(null)}
        />
      )}
    </div>
  );
}