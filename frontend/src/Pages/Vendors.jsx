// Pages/Vendors.jsx
import { useState } from "react";
import Modal from "../Components/Modal";
import "../Css/Global.css";
import "../Css/Vendors.css";

const mockData = [
  { id: "V001", name: "BlueSky Plumbing Co.", service: "Plumbing", contact: "M. Saravanan", phone: "+91 99400 11111", city: "Chennai", rating: 4.8, jobs: 24, status: "Active" },
  { id: "V002", name: "BrightSpark Electricals", service: "Electrical", contact: "R. Kumar", phone: "+91 99400 22222", city: "Chennai", rating: 4.6, jobs: 18, status: "Active" },
  { id: "V003", name: "CleanLine Janitorial", service: "Cleaning", contact: "S. Latha", phone: "+91 99400 33333", city: "Coimbatore", rating: 4.4, jobs: 12, status: "Active" },
  { id: "V004", name: "GreenTouch Gardeners", service: "Gardening", contact: "P. Murugan", phone: "+91 99400 44444", city: "Chennai", rating: 4.2, jobs: 9, status: "Active" },
];

const empty = { name: "", service: "Plumbing", contact: "", phone: "", city: "", rating: "", status: "Active", preferred: false, comments: "" };
const services = ["Electrical", "Plumbing", "HVAC", "Painting", "Carpentry", "Civil", "Cleaning", "Gardening"];
const statusColor = { Active: "success", Inactive: "danger" };

function RatingStars({ r }) {
  const stars = Math.round(r);
  return (
    <span className="vendor-rating">
      {"★".repeat(stars)}{"☆".repeat(5 - stars)} <span>{r.toFixed(1)}</span>
    </span>
  );
}

export default function Vendors() {
  const [items, setItems] = useState(mockData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");
  const [filterSvc, setFilterSvc] = useState("All");

  const allServices = ["All", ...new Set(items.map((item) => item.service))];
  const filtered = items
    .filter((item) => filterSvc === "All" || item.service === filterSvc)
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.city.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (event) => {
    event.preventDefault();
    setItems((prev) => [
      ...prev,
      {
        ...form,
        id: `V-${String(prev.length + 1).padStart(3, "0")}`,
        rating: Number(form.rating) || 0,
        jobs: 0,
      },
    ]);
    setForm(empty);
    setShowForm(false);
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
            title="New Vendor"
            size="large"
            className="vendors-modal-box"
            footer={
              <div className="vendors-modal-actions">
                <button className="vendors-btn secondary" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button className="vendors-btn primary" type="submit" form="vendor-form">
                  <i className="bi bi-check-lg"></i> Save Vendor
                </button>
              </div>
            }
          >
            <p className="vendors-modal-subtitle">Fill in vendor details for invoice and service tracking.</p>
            <form id="vendor-form" className="vendors-modal-form" onSubmit={handleAdd}>
              <div className="vendors-modal-grid">
                  <label>
                    Vendor Name <span>*</span>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </label>
                  <label>
                    Service Type
                    <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Contact Person
                    <input placeholder="Contact person" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                  </label>
                  <label>
                    Phone
                    <input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </label>
                  <label>
                    City
                    <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </label>
                  <label>
                    Initial Rating
                    <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                  </label>
                  <label>
                    Status
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </label>
                  <label className="vendors-full-width">
                    Internal Comments
                    <textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} rows={3} placeholder="Add any notes or vendor requirements." />
                  </label>
                </div>
                <div className="vendors-modal-actions">
                  <button className="vendors-btn secondary" type="button" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button className="vendors-btn primary" type="submit">
                    <i className="bi bi-check-lg"></i> Save Vendor
                  </button>
                </div>
              </form>
                </Modal>
        )}

        <div className="vendors-table-card">
          {/* Toolbar */}
          <div className="vendors-panel-top">
            <div className="vendors-search">
              <input
                type="search"
                placeholder="Search vendor, city or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select value={filterSvc} onChange={(e) => setFilterSvc(e.target.value)} className="vendors-filter-select">
              {allServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <div className="vendors-action-row">
              <span className="vendors-count">{filtered.length} vendor(s)</span>
              <button className="vendors-add-button" onClick={() => setShowForm((value) => !value)}>
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
                {filtered.map((vendor) => (
                  <tr key={vendor.id}>
                    <td>{vendor.id}</td>
                    <td>{vendor.name}</td>
                    <td>
                      <span className="vendor-badge neutral">{vendor.service}</span>
                    </td>
                    <td>{vendor.contact}</td>
                    <td>{vendor.phone}</td>
                    <td>{vendor.city}</td>
                    <td>
                      <RatingStars r={vendor.rating} />
                    </td>
                    <td>{vendor.jobs}</td>
                    <td>
                      <span className={`vendor-badge ${statusColor[vendor.status]}`}>{vendor.status}</span>
                    </td>
                    <td className="vendor-actions">
                      <button className="vendors-btn sm secondary" aria-label="Edit vendor">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="vendors-btn sm danger" aria-label="Delete vendor">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}