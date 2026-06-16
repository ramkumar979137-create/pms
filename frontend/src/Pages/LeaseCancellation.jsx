// LeaseCancellationModule.jsx
// AUM Sol Corp PMS — Lease Cancellation Module
// Design: matches existing PMS style (cream bg, white card, navy table, gold accents)

import { useState, useEffect } from 'react'
import axios from 'axios'
import '../Css/LeaseCancellation.css'

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
   Seed Leases (mock active leases)
───────────────────────────────────── */
// Active leases will be fetched from the backend; keep the seed as fallback
let ACTIVE_LEASES = [
  { id: 'LSE-001', customer: 'Ravi Krishnan', property: '12 Anna Nagar, Chennai', leaseStart: '2024-01-01', leaseEnd: '2025-12-31', value: 480000 },
  { id: 'LSE-002', customer: 'Priya Sundaram', property: '45 T Nagar, Chennai', leaseStart: '2024-03-15', leaseEnd: '2025-03-14', value: 360000 },
  { id: 'LSE-003', customer: 'Aarav Mehta', property: '78 Velachery, Chennai', leaseStart: '2024-06-01', leaseEnd: '2026-05-31', value: 300000 },
]

/* ─────────────────────────────────────
   Helpers
───────────────────────────────────── */
function nextId(list) {
  const max = list.reduce((acc, r) => {
    const n = parseInt(r.id.replace('LCN-', ''), 10)
    return n > acc ? n : acc
  }, 0)
  return `LCN-${String(max + 1).padStart(3, '0')}`
}

function today() {
  return new Date().toISOString().split('T')[0]
}

function blankForm(id) {
  return {
    id,
    cancelDate: today(),
    leaseId: '',
    customer: '',
    leaseStart: '',
    leaseEnd: '',
    leaseValue: '',
    currency: 'INR',
    refundAmount: '0.00',
    refundPolicy: 'Full refund of deposit',
    reason: '',
    status: 'Cancelled',
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
  if (s === 'Cancelled')       return 'badgeCancelled'
  if (s === 'Pending Approval') return 'badgePending'
  if (s === 'Disputed')        return 'badgeDisputed'
  return ''
}

/* ─────────────────────────────────────
  Modal Form
───────────────────────────────────── */
function CancellationForm({ form, onChange, activeLeases }) {
  const set = (k, v) => onChange({ ...form, [k]: v })
  
  const handleLeaseSelect = leaseId => {
    const lease = (activeLeases || []).find(l => l.id === leaseId)
    if (lease) {
      onChange({
        ...form,
        leaseId: lease.id,
        customer: lease.customer,
        property: lease.property,
        leaseStart: lease.leaseStart,
        leaseEnd: lease.leaseEnd,
        leaseValue: lease.value,
      })
    } else {
      onChange({
        ...form,
        leaseId: '',
        customer: '',
        property: '',
        leaseStart: '',
        leaseEnd: '',
        leaseValue: '',
      })
    }
  }

  return (
    <div className="lcFormGrid">

      {/* Row 1: Record ID + Cancel Date */}
      <div className="lcField">
        <label className="lcLabel">Record ID</label>
        <input className="lcInput lcReadonly" value={form.id} readOnly />
      </div>

      <div className="lcField">
        <label className="lcLabel">Cancellation Date <span className="lcReq">*</span></label>
        <input
          type="date"
          className="lcInput"
          value={form.cancelDate}
          onChange={e => set('cancelDate', e.target.value)}
        />
      </div>

      {/* Row 2: Lease dropdown (full width) */}
      <div className="lcField lcFull">
        <label className="lcLabel">Lease <span className="lcReq">*</span></label>
        <select
          className="lcSelect"
          value={form.leaseId}
          onChange={e => handleLeaseSelect(e.target.value)}
        >
          <option value="">— Select active lease —</option>
          {activeLeases.map(l => (
            <option key={l.id} value={l.id}>
              {l.id} — {l.customer} · {l.property}
            </option>
          ))}
        </select>
      </div>

      {/* Row 3: Auto-filled lease details */}
      <div className="lcField">
        <label className="lcLabel">Customer</label>
        <input className="lcInput lcReadonly" value={form.customer} readOnly placeholder="" />
      </div>

      <div className="lcField">
        <label className="lcLabel">Property</label>
        <input className="lcInput lcReadonly" value={form.property} readOnly placeholder="" />
      </div>

      <div className="lcField">
        <label className="lcLabel">Lease Start</label>
        <input className="lcInput lcReadonly" value={form.leaseStart ? formatDate(form.leaseStart) : ''} readOnly placeholder="" />
      </div>

      <div className="lcField">
        <label className="lcLabel">Lease End</label>
        <input className="lcInput lcReadonly" value={form.leaseEnd ? formatDate(form.leaseEnd) : ''} readOnly placeholder="" />
      </div>

      <div className="lcField">
        <label className="lcLabel">Original Lease Value</label>
        <input
          className="lcInput lcReadonly"
          value={form.leaseValue ? formatCurrency(form.currency, form.leaseValue) : ''}
          readOnly
          placeholder=""
        />
      </div>

      {/* ── REFUND & REASON section ── */}
      <div className="lcSectionTitle">Refund &amp; Reason</div>

      {/* Refund Amount */}
      <div className="lcField">
        <label className="lcLabel">Refund Amount</label>
        <div className="lcAmountRow">
          <select
            className="lcSelect lcCurrencySelect"
            value={form.currency}
            onChange={e => set('currency', e.target.value)}
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
            ))}
          </select>
          <input
            type="number"
            className="lcInput"
            value={form.refundAmount}
            min="0"
            step="0.01"
            onChange={e => set('refundAmount', e.target.value)}
          />
        </div>
      </div>

      {/* Refund Policy */}
      <div className="lcField">
        <label className="lcLabel">Refund Policy</label>
        <select
          className="lcSelect"
          value={form.refundPolicy}
          onChange={e => set('refundPolicy', e.target.value)}
        >
          {REFUND_POLICIES.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Reason (full width) */}
      <div className="lcField lcFull">
        <label className="lcLabel">Reason for Cancellation</label>
        <textarea
          className="lcTextarea"
          placeholder="Why is this lease being cancelled?"
          value={form.reason}
          onChange={e => set('reason', e.target.value)}
        />
      </div>

      {/* Status */}
      <div className="lcField">
        <label className="lcLabel">Status</label>
        <select
          className="lcSelect"
          value={form.status}
          onChange={e => set('status', e.target.value)}
        >
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

    </div>
  )
}

/* ─────────────────────────────────────
   Modal — inline (no createPortal)
───────────────────────────────────── */
function CancellationModal({ form, onChange, onClose, onSave, activeLeases }) {
  const handleSave = () => {
    if (!form.leaseId || !form.cancelDate) {
      alert('Lease and Cancellation Date are required.')
      return
    }
    onSave(form)
  }

  const onBackdropClick = e => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="lcBackdrop" onClick={onBackdropClick}>
      <div className="lcModal" role="dialog" aria-modal="true">

        <div className="lcModalHeader">
          <span className="lcModalTitle">Cancel Lease Agreement</span>
          <button className="lcCloseBtn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="lcModalBody">
          <CancellationForm form={form} onChange={onChange} activeLeases={activeLeases} />
        </div>

        <div className="lcModalFooter">
          <button className="lcBtnOutline" onClick={onClose}>Cancel</button>
          <button className="lcBtnDanger" onClick={handleSave}>Confirm Cancellation</button>
        </div>

      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   Main Page
───────────────────────────────────── */
export default function LeaseCancellationModule() {
  const [records, setRecords] = useState([])
  const [modal, setModal]     = useState(null) // null | { form }
  const [activeLeases, setActiveLeases] = useState(ACTIVE_LEASES)

  const openNew    = ()   => setModal({ form: blankForm(nextId(records)) })
  const closeModal = ()   => setModal(null)
  const updateForm = form => setModal(prev => ({ ...prev, form }))

  const handleSave = form => {
    setRecords(prev => [...prev, form])
    closeModal()
  }

  useEffect(() => {
    const fetchActiveLeases = async () => {
      try {
        const apiBase = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

        const storedUser = localStorage.getItem('pms_user')
        const parsedUser = storedUser ? JSON.parse(storedUser) : {}
        const token = parsedUser?.token

        // Try the authenticated /mine endpoint first when token available
        if (token) {
          try {
            const res = await axios.get(`${apiBase}/api/lease-agreements/mine`, { headers: { Authorization: `Bearer ${token}` } })
            const items = Array.isArray(res.data.leases) ? res.data.leases : Array.isArray(res.data) ? res.data : []
            const mapped = items.map(l => ({
              id: l.id,
              customer: l.customer,
              property: l.property,
              leaseStart: l.leaseStart || '',
              leaseEnd: l.leaseEnd || '',
              value: l.value || 0,
            }))
            setActiveLeases(mapped)
            return
          } catch (err) {
            // If unauthorized or other error, fall through to public fetch fallback
            console.debug('/mine fetch failed, falling back to public fetch', err)
          }
        }

        // Fallback: fetch public list and filter client-side (used when no token)
        const res = await axios.get(`${apiBase}/api/lease-agreements?status=Active&limit=200`)
        const items = Array.isArray(res.data.leases) ? res.data.leases : Array.isArray(res.data) ? res.data : []

        // only show leases belonging to the currently logged-in user (based on parsedUser)
        const matchesUser = (lease) => {
          if (parsedUser?.role === 'admin') return true
          if (typeof lease.userId !== 'undefined' && parsedUser?.id && Number(lease.userId) === Number(parsedUser.id)) return true
          if (lease.userIdentifier && parsedUser?.userId && lease.userIdentifier === parsedUser.userId) return true
          return false
        }

        const filtered = items.filter(matchesUser)
        const mapped = filtered.map(l => ({
          id: l.leaseId || `LSE-${String(l.id).padStart(3, '0')}`,
          customer: l.customerName || l.tenant || '',
          property: l.propertyAddress || l.property || '',
          leaseStart: l.startDate || '',
          leaseEnd: l.endDate || '',
          value: l.leaseValueAmount || l.monthlyRent || 0,
        }))
        setActiveLeases(mapped)
      } catch (err) {
        // leave fallback ACTIVE_LEASES in place
        console.debug('Failed to load active leases for cancellations, using fallback', err)
      }
    }
    fetchActiveLeases()
  }, [])

  const handleDelete = id => {
    if (window.confirm(`Delete record ${id}?`))
      setRecords(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="lcPageWrapper">

      {/* Page Header */}
      <div className="lcBreadcrumb">Agreements / Lease Cancellation Module</div>
      <div className="lcTitleRow">
        <h1 className="lcPageTitle">Lease Cancellations</h1>
        <span className="lcPageSubtitle">Process lease terminations with refund tracking</span>
      </div>

      {/* Content Card */}
      <div className="lcContentCard">

        {/* Toolbar */}
        <div className="lcToolbar">
          <div className="lcSpacer" />
          <button className="lcNewBtn" onClick={openNew}>+ New Cancellation</button>
        </div>

        {/* Table */}
        <div className="table-wrap lcTableWrap">
          <table className="lcTable">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Lease ID</th>
                <th>Customer</th>
                <th>Property</th>
                <th>Cancel Date</th>
                <th>Refund</th>
                <th>Policy</th>
                <th>Status</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={10} className="lcEmptyState">
                    No cancellations recorded
                  </td>
                </tr>
              ) : (
                records.map(r => (
                  <tr key={r.id}>
                    <td><span className="lcRecordId">{r.id}</span></td>
                    <td>{r.leaseId || '—'}</td>
                    <td>{r.customer || '—'}</td>
                    <td className="lcPropertyCell">{r.property || '—'}</td>
                    <td>{formatDate(r.cancelDate)}</td>
                    <td>{r.refundAmount > 0 ? formatCurrency(r.currency, r.refundAmount) : '—'}</td>
                    <td className="lcPolicyCell">{r.refundPolicy}</td>
                    <td>
                      <span className={`lcBadge ${statusClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td style={{ width: 50 }}>
                      <button className="lcEditBtn" onClick={() => {}}>Edit</button>
                    </td>
                    <td style={{ width: 66 }}>
                      <button className="lcDeleteBtn" onClick={() => handleDelete(r.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lcMobileList">
          {records.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888', padding: '32px 0' }}>
              No cancellations recorded
            </p>
          )}
          {records.map(r => (
            <div className="lcMobileCard" key={r.id}>
              <div className="lcMcTop">
                <div>
                  <div className="lcMcId">{r.id}</div>
                  <div className="lcMcLease">Lease: {r.leaseId || '—'}</div>
                </div>
                <span className={`lcBadge ${statusClass(r.status)}`}>{r.status}</span>
              </div>
              <div className="lcMcRow">Customer: <span>{r.customer || '—'}</span></div>
              <div className="lcMcRow">Property: <span>{r.property || '—'}</span></div>
              <div className="lcMcRow">Cancel Date: <span>{formatDate(r.cancelDate)}</span></div>
              <div className="lcMcRow">Refund: <span>{r.refundAmount > 0 ? formatCurrency(r.currency, r.refundAmount) : '—'}</span></div>
              <div className="lcMcActions">
                <button className="lcDeleteBtn" onClick={() => handleDelete(r.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      {modal && (
        <CancellationModal
          form={modal.form}
          onChange={updateForm}
          onClose={closeModal}
          onSave={handleSave}
          activeLeases={activeLeases}
        />
      )}

    </div>
  )
}