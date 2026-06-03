import { useState, useEffect } from "react";
import Modal from "../Components/Modal";
import "../Css/Global.css";
import "../Css/Vendors.css";

const API_URL = "http://localhost:5000/api/vendors";

const EMPTY_FORM = {
  vendorCode: "",
  name: "",
  service: "Plumbing",
  contact: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  idProofType: "",
  idProofNumber: "",
  accountDetails: "",
  rating: "",
  status: "Active",
  preferred: false,
  comments: "",
  fileNames: [],
  jobs: 0,
};

const services = ["Electrical", "Plumbing", "HVAC", "Painting", "Carpentry", "Civil", "Cleaning", "Gardening"];
const statusColor = { Active: "success", Inactive: "danger" };

function RatingStars({ r }) {
  const stars = Math.min(5, Math.max(0, Math.round(r)));
  return (
    <span className="vendor-rating">
      {"★".repeat(stars)}{"☆".repeat(5 - stars)} <span>{(r ?? 0).toFixed(1)}</span>
    </span>
  );
}

export default function Vendors() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [filterSvc, setFilterSvc] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const allServices = ["All", ...new Set(items.map((item) => item.service).filter(Boolean))];
  const filtered = items
    .filter((item) => filterSvc === "All" || item.service === filterSvc)
    .filter((item) =>
      String(item.name).toLowerCase().includes(search.toLowerCase()) ||
      String(item.city).toLowerCase().includes(search.toLowerCase()) ||
      String(item.service).toLowerCase().includes(search.toLowerCase()) ||
      String(item.vendorCode).toLowerCase().includes(search.toLowerCase())
    );

  const loadVendors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "200");
      if (search.trim()) params.append("search", search.trim());
      if (filterSvc !== "All") params.append("service", filterSvc);
      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load vendors");
      setItems(data.items || []);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Unable to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, [search, filterSvc]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const openNewForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        rating: Number(form.rating) || 0,
        jobs: Number(form.jobs) || 0,
      };
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save vendor");
      await loadVendors();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to save vendor.");
    }
  };

  const handleDelete = async (vendorId) => {
    if (!window.confirm("Delete this vendor?")) return;
    try {
      const response = await fetch(`${API_URL}/${vendorId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete vendor");
      await loadVendors();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Unable to delete vendor.");
    }
  };

  const handleEdit = (vendor) => {
    setEditingId(vendor.id);
    setForm({
      vendorCode: vendor.vendorCode || "",
      name: vendor.name || "",
      service: vendor.service || "Plumbing",
      contact: vendor.contact || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      city: vendor.city || "",
      address: vendor.address || "",
      idProofType: vendor.idProofType || "",
      idProofNumber: vendor.idProofNumber || "",
      accountDetails: vendor.accountDetails || "",
      rating: vendor.rating?.toString() || "",
      status: vendor.status || "Active",
      preferred: vendor.preferred || false,
      comments: vendor.comments || "",
      fileNames: vendor.fileNames || [],
      jobs: vendor.jobs || 0,
    });
    setShowForm(true);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setForm((prev) => ({ ...prev, fileNames: files.map((file) => file.name) }));
  };

  return (
    <div className="vendors-page">
      <div className="vendors-header">
        <div>
          <div className="vendors-module-label">MASTER / VENDOR MANAGEMENT MODULE</div>
          <h1>Vendors</h1>
        </div>
        <div className="vendors-header-meta">Service providers and contractors</div>
      </div>

      <div className="vendors-panel">
        {showForm && (
          <Modal
            isOpen={true}
            onClose={() => setShowForm(false)}
            title={editingId ? "Edit Vendor" : "New Vendor"}
            size="large"
            className="vendors-modal-box"
            footer={
              <div className="vendors-modal-actions">
                <button className="vendors-btn secondary" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button className="vendors-btn primary" type="submit" form="vendor-form">
                  {editingId ? "Update Vendor" : "Save Vendor"}
                </button>
              </div>
            }
          >
            <p className="vendors-modal-subtitle">Fill in vendor details for invoice and service tracking.</p>
            <form id="vendor-form" className="vendors-modal-form" onSubmit={handleSubmit}>
              <div className="vendors-modal-grid">
                <label className="vendors-full-width">
                  Vendor ID
                  <input disabled value={editingId ? form.vendorCode || "" : "Auto-generated"} />
                </label>
                <label>
                  Vendor Name <span>*</span>
                  <input required value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                </label>
                <label>
                  Service Type
                  <select value={form.service} onChange={(e) => setForm((prev) => ({ ...prev, service: e.target.value }))} className="vendors-form-select">
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Contact Person
                  <input placeholder="Contact person" value={form.contact} onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))} />
                </label>
                <label>
                  Phone
                  <input placeholder="Phone number" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
                </label>
                <label>
                  Email
                  <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
                </label>
                <label>
                  City
                  <input placeholder="City" value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} />
                </label>
                <label className="vendors-full-width">
                  Address
                  <textarea placeholder="Full vendor address" rows={3} value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
                </label>
                <label>
                  ID Proof Type
                  <select value={form.idProofType} onChange={(e) => setForm((prev) => ({ ...prev, idProofType: e.target.value }))} className="vendors-form-select">
                    <option value="">� Select �</option>
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="PAN">PAN</option>
                    <option value="Passport">Passport</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Driving Licence">Driving Licence</option>
                  </select>
                </label>
                <label>
                  ID Proof Number
                  <input placeholder="ID proof number" value={form.idProofNumber} onChange={(e) => setForm((prev) => ({ ...prev, idProofNumber: e.target.value }))} />
                </label>
                <label className="vendors-full-width">
                  Account Details
                  <textarea placeholder="Bank account or payment details" rows={3} value={form.accountDetails} onChange={(e) => setForm((prev) => ({ ...prev, accountDetails: e.target.value }))} />
                </label>
                <label>
                  Initial Rating
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))} />
                </label>
                <label>
                  Jobs
                  <input type="number" min="0" value={form.jobs} onChange={(e) => setForm((prev) => ({ ...prev, jobs: Number(e.target.value) }))} />
                </label>
                <label>
                  Status
                  <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="vendors-form-select">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
                <label className="vendors-full-width preferred-toggle-section">
                  Preferred Vendor
                  <div className="preferred-toggle">
                    <button type="button" className={form.preferred ? "active" : ""} onClick={() => setForm((prev) => ({ ...prev, preferred: true }))}>
                      Yes
                    </button>
                    <button type="button" className={!form.preferred ? "active" : ""} onClick={() => setForm((prev) => ({ ...prev, preferred: false }))}>
                      No
                    </button>
                  </div>
                </label>
                <label className="vendors-full-width">
                  Supporting Documents
                  <input type="file" multiple onChange={handleFileUpload} />
                  {form.fileNames.length > 0 && (
                    <ul className="vendors-file-list">
                      {form.fileNames.map((name, idx) => (
                        <li key={idx}>{name}</li>
                      ))}
                    </ul>
                  )}
                </label>
                <label className="vendors-full-width">
                  Internal Comments
                  <textarea value={form.comments} onChange={(e) => setForm((prev) => ({ ...prev, comments: e.target.value }))} rows={3} placeholder="Add any notes or vendor requirements." />
                </label>
              </div>
            </form>
          </Modal>
        )}

        <div className="vendors-table-card">
          <div className="vendors-panel-top">
            <div className="vendors-search">
              <input
                type="search"
                placeholder="Search vendor, city or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="vendors-filter-select" value={filterSvc} onChange={(e) => setFilterSvc(e.target.value)}>
              {allServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <div className="vendors-action-row">
              <span className="vendors-count">{loading ? "Loading..." : `${filtered.length} vendor(s)`}</span>
              <button className="vendors-add-button" type="button" onClick={openNewForm}>
                <i className="bi bi-plus-lg"></i> Add Vendor
              </button>
            </div>
          </div>

          <div className="table-wrap vendors-table-wrapper">
            <table className="vendors-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vendor Name</th>
                  <th>Service</th>
                  <th>Contact</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Rating</th>
                  <th>Jobs</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "2rem" }}>
                      Loading vendors...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>
                      No vendors found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((vendor) => (
                    <tr key={vendor.id}>
                      <td>{vendor.vendorCode}</td>
                      <td>{vendor.name}</td>
                      <td>
                        <span className="vendor-badge neutral">{vendor.service}</span>
                      </td>
                      <td>{vendor.contact}</td>
                      <td>{vendor.phone}</td>
                      <td>{vendor.city}</td>
                      <td>
                        <RatingStars r={vendor.rating || 0} />
                      </td>
                      <td>{vendor.jobs}</td>
                      <td>
                        <span className={`vendor-badge ${statusColor[vendor.status || "Active"]}`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="vendor-actions">
                        <button className="vendors-btn sm secondary" aria-label="Edit vendor" onClick={() => handleEdit(vendor)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="vendors-btn sm danger" aria-label="Delete vendor" onClick={() => handleDelete(vendor.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
