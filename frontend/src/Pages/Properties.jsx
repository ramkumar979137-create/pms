import { useState, useEffect } from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Modal from "../Components/Modal";
import "../Css/Properties.css";

const PAGE_SIZE = 10;
const API_URL = "http://localhost:5000/api/properties";
const CUSTOMER_API_URL = "http://localhost:5000/api/customers";

const PROPERTY_TYPES = ["APARTMENT", "VILLA", "HOUSE", "COMMERCIAL", "PLOT"];
const OCCUPANCY_TYPES = ["Owned", "Leased", "Rented"];
const STATUSES = ["OCCUPIED", "VACANT"];

const EMPTY_FORM = {
  name: "",
  type: "APARTMENT",
  address: "",
  occupancy: "Owned",
  owner: "",
  status: "OCCUPIED",
  purchasedOn: "",
  purchaseValue: "",
  currency: "INR",
  maintenancePhone: "",
  maintenanceEmail: "",
  notes: "",
};

function PropertyTableSkeleton({ rows = 5 }) {
  return (
    <div className="skeleton-wrapper">
      {[...Array(rows)].map((_, index) => (
        <div className="skeleton-row" key={index}>
          <div className="skeleton-cell short" />
          <div className="skeleton-cell long" />
          <div className="skeleton-cell medium" />
          <div className="skeleton-cell long" />
          <div className="skeleton-cell medium" />
          <div className="skeleton-cell medium" />
          <div className="skeleton-cell short" />
        </div>
      ))}
    </div>
  );
}

function PropertyModal({ initial = null, onClose, onSave, customers = [] }) {
  const [form, setForm] = useState(initial ? { ...initial } : EMPTY_FORM);
  const [validationError, setValidationError] = useState("");
  const [saving, setSaving] = useState(false);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.type || !form.address) {
      setValidationError("Please fill in required fields: Name, Type, and Address.");
      return;
    }
    setValidationError("");
    setSaving(true);

    const payload = {
      name: form.name,
      type: form.type,
      address: form.address,
      occupancy: form.occupancy,
      owner: form.owner || null,
      status: form.status,
      purchasedOn: form.purchasedOn || null,
      purchaseValue: form.purchaseValue || null,
      currency: form.currency,
      maintenancePhone: form.maintenancePhone || null,
      maintenanceEmail: form.maintenanceEmail || null,
      notes: form.notes || null,
    };

    try {
      await onSave(payload, initial?.id);
      onClose();
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : "Unable to save property.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={initial ? "Edit Property" : "New Property"}
      size="large"
      footer={
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit} type="button" disabled={saving}>
            {saving ? (initial ? "Updating..." : "Saving...") : (initial ? "Update" : "Save") + " Property"}
          </button>
        </div>
      }
    >
      {validationError && <p className="form-error">{validationError}</p>}

      <div className="section-heading">
        <span>Property Details</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Property Name <span className="req">*</span>
          </label>
          <input
            className="form-input"
            placeholder="e.g. Sunrise Apartments"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Property Type <span className="req">*</span>
          </label>
          <select
            className="form-select"
            value={form.type}
            onChange={(e) => setField("type", e.target.value)}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row single">
        <div className="form-group">
          <label className="form-label">
            Address <span className="req">*</span>
          </label>
          <textarea
            className="form-textarea"
            placeholder="Full address with city, state, PIN"
            value={form.address}
            onChange={(e) => setField("address", e.target.value)}
            rows="3"
          />
        </div>
      </div>

      <div className="section-heading">
        <span>Occupancy &amp; Financial</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Occupancy Type</label>
          <select
            className="form-select"
            value={form.occupancy}
            onChange={(e) => setField("occupancy", e.target.value)}
          >
            {OCCUPANCY_TYPES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Purchased On</label>
          <input
            className="form-input"
            type="date"
            value={form.purchasedOn}
            onChange={(e) => setField("purchasedOn", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Owner / Customer Name</label>
          <select
            className="form-select"
            value={form.owner}
            onChange={(e) => setField("owner", e.target.value)}
          >
            <option value="">None</option>
            {customers.map((customer) => {
              const label = `CUS-${String(customer.id).padStart(3, "0")} — ${customer.firstName || ""} ${customer.lastName || ""}`.trim();
              return (
                <option key={customer.id} value={label}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Purchase Value</label>
          <input
            className="form-input"
            type="number"
            placeholder="0.00"
            value={form.purchaseValue}
            onChange={(e) => setField("purchaseValue", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Currency</label>
          <select
            className="form-select"
            value={form.currency}
            onChange={(e) => setField("currency", e.target.value)}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>

      <div className="section-heading">
        <span>Maintenance Contact</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Maintenance Phone</label>
          <input
            className="form-input"
            placeholder="+91 XXXXXXXXXX"
            value={form.maintenancePhone}
            onChange={(e) => setField("maintenancePhone", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Maintenance Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="maintenance@example.com"
            value={form.maintenanceEmail}
            onChange={(e) => setField("maintenanceEmail", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row single">
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            placeholder="Additional notes..."
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [toastVisible, setToastVisible] = useState(false);

  const loadProperties = async (page = 1) => {
    setLoading(true);
    setError("");
    setToastVisible(false);

    const type = typeFilter === "All Types" ? "ALL" : typeFilter.toUpperCase();
    const status = statusFilter === "All Status" ? "ALL" : statusFilter.toUpperCase();
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    if (search.trim()) params.set("search", search.trim());
    if (type !== "ALL") params.set("type", type);
    if (status !== "ALL") params.set("status", status);

    try {
      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load properties");

      setProperties(data.items || []);
      setTotalRecords(data.total || 0);
      setCurrentPage(data.page || page);
      setTotalPages(Math.max(1, Math.ceil((data.total || 0) / (data.limit || PAGE_SIZE))));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load properties";
      setError(message);
      setToast({ message, type: "error" });
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerOptions = async () => {
    try {
      const response = await fetch(`${CUSTOMER_API_URL}?page=1&limit=200`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load customers");
      setCustomers(data.items || []);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3600);
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadProperties(1);
    }
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    loadCustomerOptions();
  }, []);

  useEffect(() => {
    loadProperties(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      loadProperties(currentPage);
      showToast("Property deleted successfully.", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete property.";
      setError(message);
      showToast(message, "error");
    }
  };

  const handleDeleteRequest = (property) => {
    setDeleteTarget(property);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      handleDelete(deleteTarget.id);
      setDeleteTarget(null);
      setConfirmOpen(false);
    }
  };

  const handleSave = async (payload, propertyId) => {
    try {
      const response = await fetch(propertyId ? `${API_URL}/${propertyId}` : API_URL, {
        method: propertyId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save property");
      setShowModal(false);
      setEditingProperty(null);
      loadProperties(currentPage);
      showToast(propertyId ? "Property updated successfully." : "Property added successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save property";
      setError(message);
      throw new Error(message);
    }
  };

  const handleOpenNew = () => {
    setEditingProperty(null);
    setShowModal(true);
  };

  const handleOpenEdit = (property) => {
    setEditingProperty(property);
    setShowModal(true);
  };

  const allTypes = ["All Types", ...Array.from(new Set(properties.map((p) => p.type)))];

  return (
    <div className="page-wrapper">
      {toastVisible && (
        <div className={`toast-top-right ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          {toast.message}
        </div>
      )}
      <div className="breadcrumb">Master / Property Module</div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Properties</h1>
        </div>
        <span className="page-subtitle">Property inventory and occupancy</span>
      </div>

      <div className="card">
        <div className="toolbar">
          <button type="button" className="btn-add" onClick={handleOpenNew}>
            + Add Property
          </button>
          <div className="search-wrap">
            <SearchRoundedIcon className="search-icon" fontSize="small" />
            <input
              className="search-input"
              placeholder="Search by name, address, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {allTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Occupied</option>
            <option>Vacant</option>
          </select>
        </div>

        <div className="record-count">
          {loading ? "Loading..." : `${totalRecords} record(s)`}
          {error && <span className="error-text" style={{ color: "#d32f2f", marginLeft: "1rem" }}>{error}</span>}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Address</th>
                <th>Occupancy</th>
                <th>Owner</th>
                <th>Status</th>
                <th style={{ width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {loading && properties.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <PropertyTableSkeleton />
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>
                    No properties found.
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id}>
                    <td className="id-cell">{property.id}</td>
                    <td>{property.name}</td>
                    <td>
                      <span className={`badge badge-${property.type.toLowerCase()}`}>
                        {property.type}
                      </span>
                    </td>
                    <td>{property.address}</td>
                    <td>{property.occupancy}</td>
                    <td>{property.owner}</td>
                    <td>
                      <span className={`badge ${property.status === "OCCUPIED" ? "badge-occupied" : "badge-vacant"}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-edit" onClick={() => handleOpenEdit(property)}>
                          <EditOutlinedIcon fontSize="small" />
                        </button>
                        <button className="action-delete" onClick={() => handleDeleteRequest(property)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          className="pagination-row"
          style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}
        >
          <button
            className="btn-pagination"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: "6px", cursor: currentPage <= 1 ? "not-allowed" : "pointer", opacity: currentPage <= 1 ? 0.5 : 1 }}
          >
            Previous
          </button>
          <span className="pagination-info" style={{ padding: "8px 16px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn-pagination"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: "6px", cursor: currentPage >= totalPages ? "not-allowed" : "pointer", opacity: currentPage >= totalPages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <PropertyModal
          initial={editingProperty}
          customers={customers}
          onClose={() => {
            setShowModal(false);
            setEditingProperty(null);
          }}
          onSave={handleSave}
        />
      )}

      {confirmOpen && (
        <Modal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Confirm Delete"
          size="small"
          footer={
            <>
              <button className="btn-cancel" onClick={() => setConfirmOpen(false)} type="button">
                Cancel
              </button>
              <button className="btn-delete-confirm" onClick={handleConfirmDelete} type="button">
                Delete
              </button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, color: "#333" }}>
            Are you sure you want to delete this property? This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
}
