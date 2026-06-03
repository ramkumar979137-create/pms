import { useState, useEffect } from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Modal from "../Components/Modal";
import "../Css/Customers.css";

const PAGE_SIZE = 10;
const API_URL = "http://localhost:5000/api/customers";
const CUSTOMER_TYPES = ["TENANT", "OWNER"];
const CUSTOMER_STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

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
  status: "ACTIVE",
  notes: "",
};

function maskId(num) {
  if (!num) return "";
  const visible = num.slice(-4);
  return "•".repeat(Math.max(0, num.length - 4)) + visible;
}

function CustomerTableSkeleton({ rows = 5 }) {
  return (
    <div className="skeleton-wrapper">
      {[...Array(rows)].map((_, index) => (
        <div className="skeleton-row" key={index}>
          <div className="skeleton-cell short" />
          <div className="skeleton-cell long" />
          <div className="skeleton-cell medium" />
          <div className="skeleton-cell medium" />
          <div className="skeleton-cell long" />
          <div className="skeleton-cell medium" />
          <div className="skeleton-cell short" />
        </div>
      ))}
    </div>
  );
}

function NewCustomerModal({ initial = null, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [fileNames, setFileNames] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      const [countryCode, ...phoneParts] = (initial.phone || "+91 ").split(" ");
      setForm({
        ...EMPTY_FORM,
        firstName: initial.firstName || "",
        lastName: initial.lastName || "",
        type: initial.type || "",
        occupation: initial.occupation || "",
        gender: initial.gender || "",
        dob: initial.dob || "",
        address: initial.address || "",
        countryCode: countryCode || "+91",
        phone: phoneParts.join(" ") || "",
        email: initial.email || "",
        idProofType: initial.idProofType || "",
        idProofNumber: initial.idProofNumber || "",
        status: initial.status || "ACTIVE",
        notes: initial.notes || "",
      });
    } else {
      setForm(EMPTY_FORM);
      setFileNames([]);
    }
  }, [initial]);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleFile = (e) => {
    const files = Array.from(e.target.files || []);
    setFileNames(files.map((f) => f.name));
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.type || !form.phone || !form.idProofType || !form.idProofNumber) {
      setValidationError("Please fill in required fields: First Name, Type, Phone, and ID proof.");
      return;
    }
    setValidationError("");
    setSaving(true);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      type: form.type,
      occupation: form.occupation,
      gender: form.gender,
      dob: form.dob,
      address: form.address,
      countryCode: form.countryCode,
      phone: `${form.countryCode} ${form.phone}`.trim(),
      email: form.email,
      idProofType: form.idProofType,
      idProofNumber: form.idProofNumber,
      status: form.status || "ACTIVE",
      notes: form.notes,
    };

    try {
      await onSave(payload, initial?.id);
      onClose();
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : "Unable to save customer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={initial ? "Edit Customer" : "New Customer"}
      size="large"
      footer={
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit} type="button" disabled={saving}>
            {saving ? (initial ? "Updating..." : "Saving...") : (initial ? "Update" : "Save") + " Customer"}
          </button>
        </div>
      }
    >
      {validationError && <p className="form-error">{validationError}</p>}
      <div className="section-heading">
        <span>Basic Information</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            First Name <span className="req">*</span>
          </label>
          <input
            className="form-input"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input
            className="form-input"
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Type <span className="req">*</span>
          </label>
          <select
            className="form-select"
            value={form.type}
            onChange={(e) => setField("type", e.target.value)}
          >
            <option value="">— Select —</option>
            {CUSTOMER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Occupation</label>
          <select
            className="form-select"
            value={form.occupation}
            onChange={(e) => setField("occupation", e.target.value)}
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
            onChange={(e) => setField("gender", e.target.value)}
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
            onChange={(e) => setField("dob", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row single">
        <div className="form-group">
          <label className="form-label">
            Address <span className="req">*</span>
          </label>
          <textarea
            className="form-textarea"
            placeholder="Full address"
            value={form.address}
            onChange={(e) => setField("address", e.target.value)}
          />
        </div>
      </div>

      <div className="section-heading">
        <span>Contact &amp; Identity</span>
      </div>

      <div className="form-row single">
        <div className="form-group">
          <label className="form-label">
            Mobile Number <span className="req">*</span>
          </label>
          <div className="phone-row">
            <select
              className="country-code-select"
              value={form.countryCode}
              onChange={(e) => setField("countryCode", e.target.value)}
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
              onChange={(e) => setField("phone", e.target.value)}
              maxLength={15}
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
            onChange={(e) => setField("email", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            ID Proof Type <span className="req">*</span>
          </label>
          <select
            className="form-select"
            value={form.idProofType}
            onChange={(e) => setField("idProofType", e.target.value)}
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
            <label className="form-label">
              ID Proof Number <span className="req">*</span>
            </label>
          <input
            className="form-input"
            placeholder="ID number (will be masked in lists)"
            value={form.idProofNumber}
            onChange={(e) => setField("idProofNumber", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      <div className="form-row single">
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            placeholder="Add any notes or remarks..."
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </div>
      </div>

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
          {fileNames.map((name, index) => (
            <li key={index} style={{ fontSize: "13px", color: "#4a4843", marginBottom: "4px" }}>
              {name}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [toastVisible, setToastVisible] = useState(false);

  const loadCustomers = async (page = 1) => {
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
      if (!response.ok) throw new Error(data.message || "Unable to load customers");

      setCustomers(data.items || []);
      setTotalRecords(data.total || 0);
      setCurrentPage(data.page || page);
      setTotalPages(Math.max(1, Math.ceil((data.total || 0) / (data.limit || PAGE_SIZE))));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load customers";
      setError(message);
      setToast({ message, type: "error" });
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3600);
  };

  useEffect(() => {
    loadCustomers(1);
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    loadCustomers(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      loadCustomers(currentPage);
      showToast("Customer deleted successfully.", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete customer.";
      setError(message);
      showToast(message, "error");
    }
  };

  const handleDeleteRequest = (customer) => {
    setDeleteTarget(customer);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      handleDelete(deleteTarget.id);
      setDeleteTarget(null);
      setConfirmOpen(false);
    }
  };

  const handleSave = async (payload, customerId) => {
    try {
      const response = await fetch(customerId ? `${API_URL}/${customerId}` : API_URL, {
        method: customerId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save customer");
      setShowModal(false);
      setEditingCustomer(null);
      loadCustomers(currentPage);
      showToast(customerId ? "Customer updated successfully." : "Customer added successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save customer";
      setError(message);
      throw new Error(message);
    }
  };

  const handleOpenNew = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const displayedCustomers = customers.map((customer) => ({
    ...customer,
    name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
  }));

  return (
    <div className="page-wrapper">
      {toastVisible && (
        <div className={`toast-top-right ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          {toast.message}
        </div>
      )}
      <div className="breadcrumb">Master / Customer Module</div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
        </div>
        <span className="page-subtitle">Tenants and property owners</span>
      </div>

      <div className="card">
        {/* {toastVisible && (
          <div className={`toast-message ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
            {toast.message}
          </div>
        )} */}
        <div className="toolbar">
          <button type="button" className="btn-add" onClick={handleOpenNew}>
            + Add Customer
          </button>
          <div className="search-wrap">
            <SearchRoundedIcon className="search-icon" fontSize="small" />
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
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
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
                <th>Phone</th>
                <th>Email</th>
                <th>Occupation</th>
                  <th>ID Proof</th>
                <th style={{ width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {loading && displayedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <CustomerTableSkeleton />
                  </td>
                </tr>
              ) : displayedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>
                    No customers found.
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="id-cell">{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>
                      <span className={`badge ${customer.type === "TENANT" ? "badge-tenant" : "badge-owner"}`}>
                        {customer.type}
                      </span>
                    </td>
                    <td>{customer.phone}</td>
                    <td style={{ color: "#555" }}>{customer.email}</td>
                    <td>{customer.occupation}</td>
                    <td>{customer.idProofType ? `${customer.idProofType} • ${maskId(customer.idProofNumber)}` : "N/A"}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-edit" onClick={() => handleOpenEdit(customer)}>
                                        <EditOutlinedIcon fontSize="small" />
                        </button>
                        <button className="action-delete" onClick={() => handleDeleteRequest(customer)}>
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
        <NewCustomerModal
          initial={editingCustomer}
          onClose={() => {
            setShowModal(false);
            setEditingCustomer(null);
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
            Are you sure you want to delete this customer? This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
}
