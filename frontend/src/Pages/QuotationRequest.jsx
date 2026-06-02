import { useState } from "react";
import "../Css/QuotationRequests.css";

const INITIAL_DATA = [
  {
    id: "QTR-001",
    maintenance: "MNT-001",
    vendor: "BlueSky Plumbing Co.",
    service: "Plumbing",
    description: "Replace leaking sink P-trap and resealing",
    duration: "3 Days",
    quoteValue: 4500,
    status: "PENDING",
  },
  {
    id: "QTR-002",
    maintenance: "MNT-001",
    vendor: "BlueSky Plumbing Co.",
    service: "Plumbing",
    description: "Premium replacement with extended warranty",
    duration: "2 Days",
    quoteValue: 6200,
    status: "PENDING",
  },
  {
    id: "QTR-003",
    maintenance: "MNT-001",
    vendor: "BrightSpark Electricals",
    service: "Plumbing",
    description: "Full diagnostic + replacement",
    duration: "4 Days",
    quoteValue: 5300,
    status: "PENDING",
  },
];

const EMPTY_FORM = {
  maintenance: "",
  vendor: "",
  service: "",
  description: "",
  durationValue: "",
  durationUnit: "Days",
  quoteValue: "",
  status: "PENDING",
  notes: "",
};

const STATUS_COLORS = {
  PENDING: "badge-pending",
  APPROVED: "badge-approved",
  REJECTED: "badge-rejected",
};

function formatINR(val) {
  return "₹ " + Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function QuoteModal({ onClose, onSave, editData }) {
  const [form, setForm] = useState(
    editData
      ? {
          maintenance: editData.maintenance,
          vendor: editData.vendor,
          service: editData.service,
          description: editData.description,
          durationValue: editData.duration.split(" ")[0],
          durationUnit: editData.duration.split(" ")[1] || "Days",
          quoteValue: editData.quoteValue,
          status: editData.status,
          notes: "",
        }
      : EMPTY_FORM
  );

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = () => {
    if (!form.vendor || !form.service || !form.quoteValue) {
      alert("Please fill required fields: Vendor, Service, Quote Value.");
      return;
    }
    const record = {
      id: editData ? editData.id : `QTR-${String(Date.now()).slice(-3).padStart(3, "0")}`,
      maintenance: form.maintenance || "—",
      vendor: form.vendor,
      service: form.service,
      description: form.description,
      duration: `${form.durationValue || "—"} ${form.durationUnit}`,
      quoteValue: parseFloat(form.quoteValue) || 0,
      status: form.status,
    };
    onSave(record, !!editData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-top-bar" />
        <div className="modal-header">
          <h2 className="modal-title">{editData ? "Edit Quotation" : "Request Quote"}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          {/* QUOTATION DETAILS */}
          <div className="section-heading">Quotation Details</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Maintenance ID</label>
              <input
                className="form-input"
                placeholder="e.g. MNT-001"
                value={form.maintenance}
                onChange={(e) => set("maintenance", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Vendor <span className="req">*</span></label>
              <input
                className="form-input"
                placeholder="Vendor name"
                value={form.vendor}
                onChange={(e) => set("vendor", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Service <span className="req">*</span></label>
              <select
                className="form-select"
                value={form.service}
                onChange={(e) => set("service", e.target.value)}
              >
                <option value="">— Select —</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Carpentry</option>
                <option>Painting</option>
                <option>Civil Work</option>
                <option>HVAC</option>
                <option>Cleaning</option>
                <option>Pest Control</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="form-row single">
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Describe the work to be quoted..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </div>

          {/* COST & DURATION */}
          <div className="section-heading">Cost &amp; Duration</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quote Value (₹) <span className="req">*</span></label>
              <input
                className="form-input"
                type="number"
                placeholder="0.00"
                value={form.quoteValue}
                onChange={(e) => set("quoteValue", e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  className="form-input"
                  type="number"
                  placeholder="e.g. 3"
                  value={form.durationValue}
                  onChange={(e) => set("durationValue", e.target.value)}
                  min="1"
                  style={{ flex: 1 }}
                />
                <select
                  className="form-select"
                  value={form.durationUnit}
                  onChange={(e) => set("durationUnit", e.target.value)}
                  style={{ width: "100px" }}
                >
                  <option>Hours</option>
                  <option>Days</option>
                  <option>Weeks</option>
                </select>
              </div>
            </div>
          </div>

          {/* NOTES */}
          <div className="section-heading">Additional Notes</div>

          <div className="form-row single">
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Any additional notes or terms..."
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSubmit}>
            {editData ? "Update Quote" : "Save Quote"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuotationRequests() {
  const [records, setRecords] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.vendor.toLowerCase().includes(q) ||
      r.service.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.maintenance.toLowerCase().includes(q)
    );
  });

  const handleSave = (record, isEdit) => {
    if (isEdit) {
      setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)));
    } else {
      setRecords((prev) => [...prev, record]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this quotation request?")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const openEdit = (row) => {
    setEditData(row);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  return (
    <div className="page-wrapper">
      <div className="breadcrumb">Operations / Quotation Request Module</div>
      <div className="page-header">
        <h1 className="page-title">Quotation Requests</h1>
        <span className="page-subtitle">Vendor quotes for maintenance work</span>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search quotations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-add" onClick={openAdd}>
            + Request Quote
          </button>
        </div>

        <div className="record-count">{filtered.length} record(s)</div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>QTR ID</th>
                <th>Maintenance</th>
                <th>Vendor</th>
                <th>Service</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Quote Value</th>
                <th>Status</th>
                <th style={{ width: 90 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>
                    No quotation requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="id-cell">{r.id}</td>
                    <td>{r.maintenance}</td>
                    <td>{r.vendor}</td>
                    <td>{r.service}</td>
                    <td className="desc-cell">{r.description}</td>
                    <td>{r.duration}</td>
                    <td className="value-cell">{formatINR(r.quoteValue)}</td>
                    <td>
                      <span className={STATUS_COLORS[r.status] || "badge-pending"}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-edit" onClick={() => openEdit(r)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(r.id)} aria-label="Delete">✕</button>
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
        <QuoteModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editData={editData}
        />
      )}
    </div>
  );
}