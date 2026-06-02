// RentalCancellationModule.jsx
// AUM Sol Corp PMS — Rental Agreement Cancellation Module

import { useState } from 'react'
import '../Css/RenatalCancellation.css'

/* ─────────────────────────────────────
   Constants
───────────────────────────────────── */
const REFUND_POLICIES = [
  'Full refund of deposit',
  'Partial refund (50%)',
  'No refund',
  'Prorated refund',
  'Custom amount',
]

const CURRENCIES = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
]

const STATUSES = ['Cancelled', 'Pending Approval', 'Disputed']

/* ─────────────────────────────────────
   Seed — Active Rent Agreements
───────────────────────────────────── */
const ACTIVE_RENTS = [
  {
    id: 'RNT-001',
    customer: 'Ravi Krishnan',
    property: '12 Anna Nagar, Chennai',
    rentStart: '2024-01-01',
    rentEnd: '2025-12-31',
    monthlyRent: 18000,
  },
  {
    id: 'RNT-002',
    customer: 'Priya Sundaram',
    property: '45 T Nagar, Chennai',
    rentStart: '2024-03-15',
    rentEnd: '2025-03-14',
    monthlyRent: 22000,
  },
  {
    id: 'RNT-003',
    customer: 'Aarav Mehta',
    property: '78 Velachery, Chennai',
    rentStart: '2024-06-01',
    rentEnd: '2026-05-31',
    monthlyRent: 15000,
  },
]

/* ─────────────────────────────────────
   Helpers
───────────────────────────────────── */
function nextId(list) {
  const max = list.reduce((acc, r) => {
    const n = parseInt(r.id.replace('RCN-', ''), 10)
    return n > acc ? n : acc
  }, 0)
  return `RCN-${String(max + 1).padStart(3, '0')}`
}

function today() {
  return new Date().toISOString().split('T')[0]
}

function blankForm(id) {
  return {
    id,
    cancelDate: today(),
    rentId: '',
    customer: '',
    property: '',
    rentStart: '',
    rentEnd: '',
    monthlyRent: '',
    lastPaymentDate: '',
    currency: 'INR',
    pendingDues: '0.00',
    refundAmount: '0.00',
    refundPolicy: 'Full refund of deposit',
    status: 'Cancelled',
    reason: '',
    remarks: '',
  }
}

function formatCurrency(cur, amount) {
  const sym = CURRENCIES.find(c => c.code === cur)?.symbol || '₹'
  return `${sym} ${Number(amount).toLocaleString('en-IN')}`
}

function formatDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}-${m}-${y}`
}

const statusClass = s => {
  if (s === 'Cancelled')        return 'rcBadgeCancelled'
  if (s === 'Pending Approval') return 'rcBadgePending'
  if (s === 'Disputed')         return 'rcBadgeDisputed'
  return ''
}

/* ─────────────────────────────────────
   Form
───────────────────────────────────── */
function RentalCancellationForm({ form, onChange }) {
  const set = (k, v) => onChange({ ...form, [k]: v })

  const handleRentSelect = rentId => {
    const rent = ACTIVE_RENTS.find(r => r.id === rentId)
    if (rent) {
      onChange({
        ...form,
        rentId: rent.id,
        customer: rent.customer,
        property: rent.property,
        rentStart: rent.rentStart,
        rentEnd: rent.rentEnd,
        monthlyRent: rent.monthlyRent,
      })
    } else {
      onChange({
        ...form,
        rentId: '',
        customer: '',
        property: '',
        rentStart: '',
        rentEnd: '',
        monthlyRent: '',
      })
    }
  }

  return (
    <div className="rcFormGrid">

      {/* Row 1: Record ID + Cancel Date */}
      <div className="rcField">
        <label className="rcLabel">Record ID</label>
        <input className="rcInput rcReadonly" value={form.id} readOnly />
      </div>

      <div className="rcField">
        <label className="rcLabel">Cancellation Date <span className="rcReq">*</span></label>
        <input
          type="date"
          className="rcInput"
          value={form.cancelDate}
          onChange={e => set('cancelDate', e.target.value)}
        />
      </div>

      {/* Rent Agreement dropdown — full width */}
      <div className="rcField rcFull">
        <label className="rcLabel">Rent Agreement <span className="rcReq">*</span></label>
        <select
          className="rcSelect"
          value={form.rentId}
          onChange={e => handleRentSelect(e.target.value)}
        >
          <option value="">— Select active rent agreement —</option>
          {ACTIVE_RENTS.map(r => (
            <option key={r.id} value={r.id}>
              {r.id} — {r.customer} · {r.property}
            </option>
          ))}
        </select>
      </div>

      {/* Auto-filled: Customer, Property, Rent Start, Rent End */}
      <div className="rcField">
        <label className="rcLabel">Customer</label>
        <input className="rcInput rcReadonly" value={form.customer} readOnly />
      </div>

      <div className="rcField">
        <label className="rcLabel">Property</label>
        <input className="rcInput rcReadonly" value={form.property} readOnly />
      </div>

      <div className="rcField">
        <label className="rcLabel">Rent Start</label>
        <input
          className="rcInput rcReadonly"
          value={form.rentStart ? formatDate(form.rentStart) : ''}
          readOnly
        />
      </div>

      <div className="rcField">
        <label className="rcLabel">Rent End</label>
        <input
          className="rcInput rcReadonly"
          value={form.rentEnd ? formatDate(form.rentEnd) : ''}
          readOnly
        />
      </div>

      {/* Last Payment Date + Monthly Rent */}
      <div className="rcField">
        <label className="rcLabel">Last Payment Date</label>
        <input
          type="date"
          className="rcInput"
          value={form.lastPaymentDate}
          onChange={e => set('lastPaymentDate', e.target.value)}
        />
      </div>

      <div className="rcField">
        <label className="rcLabel">Monthly Rent</label>
        <input
          className="rcInput rcReadonly"
          value={form.monthlyRent ? formatCurrency(form.currency, form.monthlyRent) : ''}
          readOnly
        />
      </div>

      {/* ── SETTLEMENT section ── */}
      <div className="rcSectionTitle">Settlement</div>

      {/* Pending Dues */}
      <div className="rcField">
        <label className="rcLabel">Pending Dues</label>
        <div className="rcAmountRow">
          <select
            className="rcSelect rcCurrencySelect"
            value={form.currency}
            onChange={e => set('currency', e.target.value)}
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
            ))}
          </select>
          <input
            type="number"
            className="rcInput"
            value={form.pendingDues}
            min="0"
            step="0.01"
            onChange={e => set('pendingDues', e.target.value)}
          />
        </div>
      </div>

      {/* Refund Amount */}
      <div className="rcField">
        <label className="rcLabel">Refund Amount</label>
        <div className="rcAmountRow">
          <select
            className="rcSelect rcCurrencySelect"
            value={form.currency}
            onChange={e => set('currency', e.target.value)}
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
            ))}
          </select>
          <input
            type="number"
            className="rcInput"
            value={form.refundAmount}
            min="0"
            step="0.01"
            onChange={e => set('refundAmount', e.target.value)}
          />
        </div>
      </div>

      {/* Refund Policy */}
      <div className="rcField">
        <label className="rcLabel">Refund Policy</label>
        <select
          className="rcSelect"
          value={form.refundPolicy}
          onChange={e => set('refundPolicy', e.target.value)}
        >
          {REFUND_POLICIES.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Status */}
      <div className="rcField">
        <label className="rcLabel">Status</label>
        <select
          className="rcSelect"
          value={form.status}
          onChange={e => set('status', e.target.value)}
        >
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Reason */}
      <div className="rcField rcFull">
        <label className="rcLabel">Reason</label>
        <textarea
          className="rcTextarea"
          placeholder="Why is this rent agreement being cancelled?"
          value={form.reason}
          onChange={e => set('reason', e.target.value)}
        />
      </div>

      {/* Internal Remarks */}
      <div className="rcField rcFull">
        <label className="rcLabel">Internal Remarks</label>
        <textarea
          className="rcTextarea"
          placeholder="Internal notes (not visible to tenant)"
          value={form.remarks}
          onChange={e => set('remarks', e.target.value)}
        />
      </div>

    </div>
  )
}

/* ─────────────────────────────────────
   Modal — inline (no createPortal)
───────────────────────────────────── */
function RentalCancellationModal({ form, onChange, onClose, onSave }) {
  const handleSave = () => {
    if (!form.rentId || !form.cancelDate) {
      alert('Rent Agreement and Cancellation Date are required.')
      return
    }
    onSave(form)
  }

  const onBackdropClick = e => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="rcBackdrop" onClick={onBackdropClick}>
      <div className="rcModal" role="dialog" aria-modal="true">

        <div className="rcModalHeader">
          <span className="rcModalTitle">Cancel Rent Agreement</span>
          <button className="rcCloseBtn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="rcModalBody">
          <RentalCancellationForm form={form} onChange={onChange} />
        </div>

        <div className="rcModalFooter">
          <button className="rcBtnOutline" onClick={onClose}>Cancel</button>
          <button className="rcBtnDanger" onClick={handleSave}>Confirm Cancellation</button>
        </div>

      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   Main Page
───────────────────────────────────── */
export default function RentalCancellationModule() {
  const [records, setRecords] = useState([])
  const [modal, setModal]     = useState(null)

  const openNew    = ()   => setModal({ form: blankForm(nextId(records)) })
  const closeModal = ()   => setModal(null)
  const updateForm = form => setModal(prev => ({ ...prev, form }))

  const handleSave = form => {
    setRecords(prev => [...prev, form])
    closeModal()
  }

  const handleDelete = id => {
    if (window.confirm(`Delete record ${id}?`))
      setRecords(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="rcPageWrapper">

      {/* Page Header */}
      <div className="rcBreadcrumb">Agreements / Rental Agreement Cancellation Module</div>
      <div className="rcTitleRow">
        <h1 className="rcPageTitle">Rent Cancellations</h1>
        <span className="rcPageSubtitle">Process rent agreement terminations</span>
      </div>

      {/* Content Card */}
      <div className="rcContentCard">

        {/* Toolbar */}
        <div className="rcToolbar">
          <div className="rcSpacer" />
          <button className="rcNewBtn" onClick={openNew}>+ New Cancellation</button>
        </div>

        {/* Desktop Table */}
        <div className="table-wrap rcTableWrap">
          <table className="rcTable">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Rent ID</th>
                <th>Customer</th>
                <th>Property</th>
                <th>Cancel Date</th>
                <th>Pending Dues</th>
                <th>Refund</th>
                <th>Status</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={10} className="rcEmptyState">
                    No cancellations recorded
                  </td>
                </tr>
              ) : (
                records.map(r => (
                  <tr key={r.id}>
                    <td><span className="rcRecordId">{r.id}</span></td>
                    <td>{r.rentId || '—'}</td>
                    <td>{r.customer || '—'}</td>
                    <td className="rcPropertyCell">{r.property || '—'}</td>
                    <td>{formatDate(r.cancelDate)}</td>
                    <td>{parseFloat(r.pendingDues) > 0 ? formatCurrency(r.currency, r.pendingDues) : '—'}</td>
                    <td>{parseFloat(r.refundAmount) > 0 ? formatCurrency(r.currency, r.refundAmount) : '—'}</td>
                    <td>
                      <span className={`rcBadge ${statusClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td style={{ width: 50 }}>
                      <button className="rcEditBtn">Edit</button>
                    </td>
                    <td style={{ width: 66 }}>
                      <button className="rcDeleteBtn" onClick={() => handleDelete(r.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="rcMobileList">
          {records.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888', padding: '32px 0' }}>
              No cancellations recorded
            </p>
          )}
          {records.map(r => (
            <div className="rcMobileCard" key={r.id}>
              <div className="rcMcTop">
                <div>
                  <div className="rcMcId">{r.id}</div>
                  <div className="rcMcRent">Rent: {r.rentId || '—'}</div>
                </div>
                <span className={`rcBadge ${statusClass(r.status)}`}>{r.status}</span>
              </div>
              <div className="rcMcRow">Customer: <span>{r.customer || '—'}</span></div>
              <div className="rcMcRow">Property: <span>{r.property || '—'}</span></div>
              <div className="rcMcRow">Cancel Date: <span>{formatDate(r.cancelDate)}</span></div>
              <div className="rcMcRow">Pending Dues: <span>{parseFloat(r.pendingDues) > 0 ? formatCurrency(r.currency, r.pendingDues) : '—'}</span></div>
              <div className="rcMcRow">Refund: <span>{parseFloat(r.refundAmount) > 0 ? formatCurrency(r.currency, r.refundAmount) : '—'}</span></div>
              <div className="rcMcActions">
                <button className="rcDeleteBtn" onClick={() => handleDelete(r.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      {modal && (
        <RentalCancellationModal
          form={modal.form}
          onChange={updateForm}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

    </div>
  )
}