// Pages/LeaseAgreement.jsx
import { useState, useEffect, useRef } from "react";
import Modal from "../Components/Modal";
import axios from "axios";
import "../Css/Global.css";
import "../Css/LeaseAgreement.css";

const API = "http://localhost:5000/api/lease-agreements";
const leaseTermOptions = ["6", "12", "24", "36"];
const paymentOptions = ["Bank Transfer", "UPI", "Cash", "Cheque"];
const allCustomers = [
  { id: "cust-1", name: "Priya Sharma", userId: 1 },
  { id: "cust-2", name: "Arjun Menon", userId: 1 },
  { id: "cust-3", name: "Sneha Patel", userId: 2 },
  { id: "cust-4", name: "Mohammed Hassan", userId: 2 },
];
const allProperties = [
  { id: "prop-1", name: "Lotus Residency", address: "12 KK Nagar, Madurai", userId: 1 },
  { id: "prop-2", name: "Skyline Towers", address: "88 OMR, Chennai", userId: 1 },
  { id: "prop-3", name: "Green Villa", address: "4 Whitefield, Bengaluru", userId: 2 },
  { id: "prop-4", name: "Downtown Plaza", address: "50 MG Road, Bengaluru", userId: 2 },
];
const currencyOptions = ["₹ INR", "$ USD", "€ EUR"];
const statusColor = { Active: "success", Expired: "danger", Terminated: "danger", "Renewal Pending": "warning" };
const emptyForm = {
  leaseId: "",
  customer: "",
  customerName: "",
  tenant: "",
  landlord: "",
  property: "",
  propertyUnit: "",
  propertyType: "Residential",
  propertyAddress: "",
  startDate: "",
  endDate: "",
  leaseTerm: "12",
  monthlyRent: "",
  securityDeposit: "",
  maintenanceCharge: "",
  utilityCharge: "",
  rentDueDay: "1",
  paymentMode: "Bank Transfer",
  leaseValueCurrency: "₹ INR",
  leaseValueAmount: "",
  advanceCurrency: "₹ INR",
  advanceAmount: "",
  paymentDate: "",
  exceptionDate: "",
  delayPenaltyCurrency: "₹ INR",
  delayPenaltyAmount: "",
  increasePercentage: "",
  terms: "",
  notes: "",
  autoRenewal: false,
  status: "Active",
  userId: 1,
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
const SAMPLE_LEASES = [
  {
    id: 1,
    leaseId: "LA-2024-001",
    tenant: "Priya Sharma",
    landlord: "Rajesh Kumar",
    property: "Lotus Residency",
    propertyUnit: "3B",
    propertyType: "Residential",
    propertyAddress: "12 KK Nagar, Madurai",
    startDate: "2024-01-15",
    endDate: "2025-01-14",
    leaseTerm: "12",
    monthlyRent: 18000,
    securityDeposit: 36000,
    maintenanceCharge: 500,
    utilityCharge: 200,
    rentDueDay: "5",
    paymentMode: "Bank Transfer",
    increasePercentage: "5",
    terms: "Monthly rent payable by the 5th of each month. Late payment fee: 5% per month.",
    notes: "Tenant well-behaved, paid on time.",
    autoRenewal: true,
    status: "Active",
    docs: [
      { name: "lease_deed_001.pdf" },
      { name: "tenant_id_proof.jpg" },
      { name: "property_noc.pdf" }
    ]
  },
  {
    id: 2,
    leaseId: "LA-2024-002",
    tenant: "Arjun Menon",
    landlord: "Priya Sundaram",
    property: "Skyline Towers",
    propertyUnit: "7A",
    propertyType: "Residential",
    propertyAddress: "88 OMR, Chennai",
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    leaseTerm: "12",
    monthlyRent: 25000,
    securityDeposit: 50000,
    maintenanceCharge: 1000,
    utilityCharge: 500,
    rentDueDay: "1",
    paymentMode: "UPI",
    increasePercentage: "7",
    terms: "Premium apartment. Annual increment 7%. Pet policy: No pets allowed.",
    notes: "Corporate lease, defaulted in last 3 months.",
    autoRenewal: false,
    status: "Expired",
    docs: [
      { name: "lease_deed_002.pdf" },
      { name: "tenant_passport.pdf" }
    ]
  },
  {
    id: 3,
    leaseId: "LA-2024-003",
    tenant: "Sneha Patel",
    landlord: "Vikram Singh",
    property: "Green Villa",
    propertyUnit: "Ground",
    propertyType: "Villa",
    propertyAddress: "4 Whitefield, Bengaluru",
    startDate: "2024-03-20",
    endDate: "2026-03-19",
    leaseTerm: "24",
    monthlyRent: 35000,
    securityDeposit: 105000,
    maintenanceCharge: 1500,
    utilityCharge: 800,
    rentDueDay: "20",
    paymentMode: "Cheque",
    increasePercentage: "4",
    terms: "2-year lease. 3-month notice required for termination. Renewal negotiable.",
    notes: "Family of 4, regular maintenance done.",
    autoRenewal: true,
    status: "Active",
    docs: [
      { name: "lease_agreement_villa.pdf" },
      { name: "property_photos.zip" },
      { name: "govt_id_scan.pdf" }
    ]
  },
  {
    id: 4,
    leaseId: "LA-2023-045",
    tenant: "Mohammed Hassan",
    landlord: "Ravi Shankar",
    property: "Downtown Plaza",
    propertyUnit: "Suite 501",
    propertyType: "Commercial",
    propertyAddress: "50 MG Road, Bengaluru",
    startDate: "2022-01-01",
    endDate: "2023-12-31",
    leaseTerm: "36",
    monthlyRent: 55000,
    securityDeposit: 165000,
    maintenanceCharge: 3000,
    utilityCharge: 1200,
    rentDueDay: "1",
    paymentMode: "Bank Transfer",
    increasePercentage: "6",
    terms: "Commercial lease. Business registered office. Renewal clause included.",
    notes: "Professional tenant, terminated early.",
    autoRenewal: false,
    status: "Terminated",
    docs: [
      { name: "commercial_lease.pdf" },
      { name: "business_registration.pdf" }
    ]
  }
];

export default function LeaseAgreement() {
  const [leases, setLeases] = useState(SAMPLE_LEASES);
  const [showForm, setShow] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileRef = useRef();
  const currentUserId = Number(JSON.parse(localStorage.getItem("pms_user") || "{}")?.id || 1);
  const currentCustomers = allCustomers.filter(c => c.userId === currentUserId);
  const currentProperties = allProperties.filter(p => p.userId === currentUserId);
  const handleCustomerSelect = (customerName) => {
    const customer = allCustomers.find(c => c.name === customerName);
    setForm(prev => ({
      ...prev,
      customer: customer?.name || "",
      customerName: customer?.name || (customerName === "" ? "" : prev.customerName),
    }));
  };
  const handlePropertySelect = (propertyId) => {
    const property = allProperties.find(p => p.name === propertyId);
    setForm(prev => ({
      ...prev,
      property: property?.name || "",
      propertyUnit: property?.name || prev.propertyUnit,
      propertyAddress: property?.address || prev.propertyAddress,
    }));
  };
  const tenure = calculateTenure(form.startDate, form.endDate);

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "All") params.status = filter;
      if (search) params.tenant = search;
      const res = await axios.get(API, { params });
      setLeases(res.data.leases || SAMPLE_LEASES);
    } catch {
      setError("Failed to load leases.");
      setLeases(SAMPLE_LEASES);
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
      const user = JSON.parse(localStorage.getItem("pms_user") || "{}");

      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append("userId", String(user.id || 1));
      files.forEach(f => fd.append("docs", f));

      if (editingId) {
        await axios.put(`${API}/${editingId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await axios.post(API, fd, { headers: { "Content-Type": "multipart/form-data" } });
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
    setForm({
      leaseId: lease.leaseId || "",
      customer: lease.customer || "",
      customerName: lease.customerName || "",
      tenant: lease.tenant || "",
      landlord: lease.landlord || "",
      property: lease.property || "",
      propertyUnit: lease.propertyUnit || "",
      propertyType: lease.propertyType || "Residential",
      propertyAddress: lease.propertyAddress || "",
      startDate: lease.startDate || "",
      endDate: lease.endDate || "",
      leaseTerm: lease.leaseTerm || "12",
      monthlyRent: lease.monthlyRent || "",
      securityDeposit: lease.securityDeposit || "",
      maintenanceCharge: lease.maintenanceCharge || "",
      utilityCharge: lease.utilityCharge || "",
      rentDueDay: lease.rentDueDay || "1",
      paymentMode: lease.paymentMode || "Bank Transfer",
      leaseValueCurrency: lease.leaseValueCurrency || "₹ INR",
      leaseValueAmount: lease.leaseValueAmount || "",
      advanceCurrency: lease.advanceCurrency || "₹ INR",
      advanceAmount: lease.advanceAmount || "",
      paymentDate: lease.paymentDate || "",
      exceptionDate: lease.exceptionDate || "",
      delayPenaltyCurrency: lease.delayPenaltyCurrency || "₹ INR",
      delayPenaltyAmount: lease.delayPenaltyAmount || "",
      increasePercentage: lease.increasePercentage || "",
      terms: lease.terms || "",
      notes: lease.notes || "",
      autoRenewal: lease.autoRenewal || false,
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
                  <label>Lease ID</label>
                  <input value={form.leaseId} onChange={e => setForm({ ...form, leaseId: e.target.value })} placeholder="LSE-007" />
                </div>
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
                  <select value={form.customer} onChange={e => handleCustomerSelect(e.target.value)}>
                    <option value="">— Select Customer —</option>
                    {currentCustomers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>Customer Name</label>
                  <input value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Customer name" />
                </div>
              </div>
              <div className="lease-grid-4">
                <div className="field-group">
                  <label>Property *</label>
                  <select value={form.property} onChange={e => handlePropertySelect(e.target.value)}>
                    <option value="">— Select Property —</option>
                    {currentProperties.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>Property Name</label>
                  <input value={form.propertyUnit} onChange={e => setForm({ ...form, propertyUnit: e.target.value })} placeholder="Property name" />
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
                  <input readOnly value={tenure} placeholder="Auto-calculated from dates" />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Financial Details</div>
              <div className="lease-grid-4">
                <div className="field-group">
                  <label>Lease Value *</label>
                  <div className="split-input">
                    <select value={form.leaseValueCurrency} onChange={e => setForm({ ...form, leaseValueCurrency: e.target.value })}>
                      {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" value={form.leaseValueAmount} onChange={e => setForm({ ...form, leaseValueAmount: e.target.value })} placeholder="0.00" />
                  </div>
                </div>
                <div className="field-group">
                  <label>Advance Amount</label>
                  <div className="split-input">
                    <select value={form.advanceCurrency} onChange={e => setForm({ ...form, advanceCurrency: e.target.value })}>
                      {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" value={form.advanceAmount} onChange={e => setForm({ ...form, advanceAmount: e.target.value })} placeholder="0.00" />
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
                    <select value={form.delayPenaltyCurrency} onChange={e => setForm({ ...form, delayPenaltyCurrency: e.target.value })}>
                      {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" value={form.delayPenaltyAmount} onChange={e => setForm({ ...form, delayPenaltyAmount: e.target.value })} placeholder="0.00" />
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

            <div className="form-section">
              <div className="form-section-title">Agreement Details</div>
              <div className="form-grid" style={{ marginBottom: "1rem" }}>
                <div className="field-group">
                  <label>Tenant Name *</label>
                  <input required value={form.tenant} onChange={e => setForm({ ...form, tenant: e.target.value })} placeholder="Priya Sharma" />
                </div>
                <div className="field-group">
                  <label>Landlord Name *</label>
                  <input required value={form.landlord} onChange={e => setForm({ ...form, landlord: e.target.value })} placeholder="John Doe" />
                </div>
                <div className="field-group">
                  <label>Property Type</label>
                  <select value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })}>
                    {["Residential", "Commercial", "Villa", "Hotel", "Hostel"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>Lease Term (months)</label>
                  <select value={form.leaseTerm} onChange={e => setForm({ ...form, leaseTerm: e.target.value })}>
                    {leaseTermOptions.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>Monthly Rent (₹) *</label>
                  <input required type="number" value={form.monthlyRent} onChange={e => setForm({ ...form, monthlyRent: e.target.value })} placeholder="18000" />
                </div>
                <div className="field-group">
                  <label>Security Deposit (₹)</label>
                  <input type="number" value={form.securityDeposit} onChange={e => setForm({ ...form, securityDeposit: e.target.value })} placeholder="36000" />
                </div>
                <div className="field-group">
                  <label>Maintenance Charge (₹)</label>
                  <input type="number" value={form.maintenanceCharge} onChange={e => setForm({ ...form, maintenanceCharge: e.target.value })} placeholder="500" />
                </div>
                <div className="field-group">
                  <label>Utility Charge (₹)</label>
                  <input type="number" value={form.utilityCharge} onChange={e => setForm({ ...form, utilityCharge: e.target.value })} placeholder="200" />
                </div>
                <div className="field-group">
                  <label>Rent Due Day (1–28)</label>
                  <input type="number" min="1" max="28" value={form.rentDueDay} onChange={e => setForm({ ...form, rentDueDay: e.target.value })} />
                </div>
                <div className="field-group">
                  <label>Payment Mode</label>
                  <select value={form.paymentMode} onChange={e => setForm({ ...form, paymentMode: e.target.value })}>
                    {paymentOptions.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>Annual Rent Increase (%)</label>
                  <input type="number" value={form.increasePercentage} onChange={e => setForm({ ...form, increasePercentage: e.target.value })} placeholder="5" />
                </div>
                <div className="field-group" style={{ justifyContent: "flex-end" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginTop: "1.5rem" }}>
                    <input type="checkbox" checked={form.autoRenewal} onChange={e => setForm({ ...form, autoRenewal: e.target.checked })} />
                    Auto Renewal
                  </label>
                </div>
                <div className="field-group form-full">
                  <label>Terms & Conditions</label>
                  <textarea value={form.terms} onChange={e => setForm({ ...form, terms: e.target.value })} placeholder="Lease terms..." />
                </div>
                <div className="field-group form-full">
                  <label>Notes / Remarks</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Internal remarks..." />
                </div>
              </div>
            </div>

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
                  <th>Lease ID</th>
                  <th>Customer</th>
                  <th>Property</th>
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
                {filtered.map(l => (
                  <tr key={l.id}>
                    <td className="lease-cell-id">{l.leaseId}</td>
                    <td>{l.tenant}</td>
                    <td>{l.property} {l.propertyUnit}</td>
                    <td>{l.startDate}</td>
                    <td>{l.endDate}</td>
                    <td>{l.leaseTerm} months</td>
                    <td className="lease-cell-amount">₹{Number(l.monthlyRent).toLocaleString('en-IN')}.00</td>
                    <td className="lease-cell-amount">₹{Number(l.securityDeposit).toLocaleString('en-IN')}.00</td>
                    <td><span className={`badge-lease ${statusColor[l.status]}`}>{l.status.toUpperCase()}</span></td>
                    <td>
                      <button className="lease-pdf-btn" type="button">
                        <i className="bi bi-file-earmark-text"></i> PDF
                      </button>
                    </td>
                    <td className="lease-action-cell">
                      <button className="lease-link-btn" onClick={() => handleEdit(l)}>Edit</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={10} className="lease-empty-state">No lease agreements found.</td>
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