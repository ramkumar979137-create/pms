import React, { useState, useMemo } from 'react';
import Modal from '../Components/Modal';
import '../Css/RentalAgreemnt.css';

// ─── Initial Data ────────────────────────────────────────────────────────────
const INITIAL_DATA = [
  {
    id: 'RNT-001',
    customer: 'Aarav Mehta',
    property: 'Skyline Towers 7A',
    start: '2026-01-01',
    tenure: 12,
    end: '2026-12-31',
    monthly: 22000,
    advance: 44000,
    status: 'ACTIVE',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  '₹ ' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d} ${months[+m - 1]} ${y}`;
};

const addMonths = (iso, monthsToAdd) => {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setMonth(date.getMonth() + Number(monthsToAdd));
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const nextId = (data) => {
  const nums = data.map((r) => parseInt(r.id.replace('RNT-', ''), 10));
  return 'RNT-' + String(Math.max(0, ...nums) + 1).padStart(3, '0');
};

const EMPTY_FORM = {
  customer: '', property: '', start: '', tenure: 12,
  monthly: '', advance: '', status: 'ACTIVE',
};

// ─── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cls = {
    ACTIVE: 'ra-badge ra-badge--active',
    EXPIRED: 'ra-badge ra-badge--expired',
    PENDING: 'ra-badge ra-badge--pending',
  }[status] || 'ra-badge';
  return <span className={cls}>{status}</span>;
}

// ─── AgreementModal ───────────────────────────────────────────────────────────
function AgreementModal({ initial, onSave, onClose, title }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.customer || !form.property || !form.start) return;
    const end = addMonths(form.start, form.tenure);
    onSave({ ...form, end });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={title}
      size="large"
      className="ra-modal"
      footer={
        <div className="ra-form-actions">
          <button className="ra-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="ra-btn-save" onClick={handleSave}>Save Agreement</button>
        </div>
      }
    >
      <div className="ra-modal-body">
        <div className="ra-form-grid">
          <div className="ra-form-group">
            <label className="ra-form-label">Customer Name</label>
            <input className="ra-form-input" value={form.customer}
              onChange={(e) => set('customer', e.target.value)}
              placeholder="e.g. Aarav Mehta" />
          </div>

          <div className="ra-form-group">
            <label className="ra-form-label">Property</label>
            <input className="ra-form-input" value={form.property}
              onChange={(e) => set('property', e.target.value)}
              placeholder="e.g. Skyline Towers 7A" />
          </div>

          <div className="ra-form-group">
            <label className="ra-form-label">Start Date</label>
            <input type="date" className="ra-form-input" value={form.start}
              onChange={(e) => set('start', e.target.value)} />
          </div>

          <div className="ra-form-group">
            <label className="ra-form-label">Tenure (months)</label>
            <input type="number" className="ra-form-input" value={form.tenure} min={1}
              onChange={(e) => set('tenure', e.target.value)} />
          </div>

          <div className="ra-form-group">
            <label className="ra-form-label">Monthly Rent (₹)</label>
            <input type="number" className="ra-form-input" value={form.monthly}
              onChange={(e) => set('monthly', e.target.value)}
              placeholder="22000" />
          </div>

          <div className="ra-form-group">
            <label className="ra-form-label">Advance (₹)</label>
            <input type="number" className="ra-form-input" value={form.advance}
              onChange={(e) => set('advance', e.target.value)}
              placeholder="44000" />
          </div>

          <div className="ra-form-group">
            <label className="ra-form-label">Status</label>
            <select className="ra-form-select" value={form.status}
              onChange={(e) => set('status', e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

      </div>
    </Modal>
  );
}

// ─── AgreementRow ─────────────────────────────────────────────────────────────
// ─── AgreementRow ─────────────────────────────────────────────────────────────
function AgreementRow({ record, onEdit, onDelete }) {
  return (
    <tr>
      <td><span className="ra-rent-id">{record.id}</span></td>
      <td>{record.customer}</td>
      <td>{record.property}</td>
      <td>{fmtDate(record.start)}</td>
      <td>{record.tenure} mo</td>
      <td>{fmtDate(record.end)}</td>
      <td className="ra-amount">{fmt(record.monthly)}</td>
      <td className="ra-amount">{fmt(record.advance)}</td>
      <td><StatusBadge status={record.status} /></td>
      <td>
        <div className="ra-actions-cell">
          <button className="ra-btn-edit" onClick={() => onEdit(record)}>Edit</button>
          <button className="ra-btn-delete" onClick={() => onDelete(record.id)}>Delete</button>
        </div>
      </td>
    </tr>
  );
}

// ─── RentAgreements (Main Component) ─────────────────────────────────────────
export default function RentalAgreement() {
  const [records, setRecords]   = useState(INITIAL_DATA);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatus] = useState('ALL');
  const [modal, setModal]       = useState(null); // null | 'new' | record

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.customer.toLowerCase().includes(search.toLowerCase()) ||
        r.property.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [records, search, statusFilter]);

  const handleSave = (formData) => {
    if (modal === 'new') {
      const newRecord = { ...formData, id: nextId(records) };
      setRecords((p) => [...p, newRecord]);
    } else {
      setRecords((p) => p.map((r) => (r.id === modal.id ? { ...modal, ...formData } : r)));
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete ${id}?`)) {
      setRecords((p) => p.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="ra-page">
      {/* Breadcrumb */}
      <div className="ra-breadcrumb">
        Agreements / <span>Rental Agreement Module</span>
      </div>

      {/* Header */}
      <div className="ra-header">
        <div className="ra-header-left">
          <h1>Rent Agreements</h1>
        </div>
        <div className="ra-header-right">Short-term rentals with due tracking</div>
      </div>

      {/* Card */}
      <div className="ra-card">
        {/* Toolbar */}
        <div className="ra-toolbar">
          <div className="ra-search-wrapper">
            <span className="ra-search-icon">🔍</span>
            <input
              className="ra-search-input"
              placeholder="Search rentals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="ra-select-wrapper">
            <select
              className="ra-status-select"
              value={statusFilter}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="EXPIRED">Expired</option>
            </select>
            <span className="ra-select-arrow">▾</span>
          </div>

          <button className="ra-btn-new" onClick={() => setModal('new')}>
            + New Rent Agreement
          </button>
        </div>

        {/* Record Count */}
        <div className="ra-record-count">{filtered.length} record(s)</div>

        {/* Table */}
        <div className="ra-table-wrapper">
          {filtered.length === 0 ? (
            <div className="ra-empty">
              <div className="ra-empty-icon">📋</div>
              <p>No agreements found.</p>
            </div>
          ) : (
            <table className="ra-table">
              <thead>
                <tr>
                  {['Rent ID','Customer','Property','Start','Tenure','End','Monthly','Advance','Status','Actions']
                    .map((h) => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <AgreementRow
                    key={r.id}
                    record={r}
                    onEdit={(rec) => setModal(rec)}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <AgreementModal
          title={modal === 'new' ? 'New Rent Agreement' : 'Edit Agreement'}
          initial={modal === 'new' ? EMPTY_FORM : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}