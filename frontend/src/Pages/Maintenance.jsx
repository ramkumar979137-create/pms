// MaintenanceRequestModule.jsx
// AUM Sol Corp PMS — Maintenance Request Module

import { useState } from 'react'
import '../Css/Maintenance.css'

/* ─────────────────────────────────────
   Constants
───────────────────────────────────── */
const SERVICE_TYPES = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting',
  'AC / HVAC', 'Cleaning', 'Security', 'Other',
]

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const STATUSES = ['Open', 'In Progress', 'Completed', 'Cancelled']

const GST_RATES = ['0%', '5%', '12%', '18%', '28%']

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Card']

const PAYMENT_STATUSES = ['Pending', 'Paid', 'Partial']

const CURRENCIES = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
]

/* ─────────────────────────────────────
   Seed Data
───────────────────────────────────── */
const PROPERTIES = [
  { id: 'PROP-001', name: 'Lotus Residency 3B', address: '3B Lotus Residency, Anna Nagar, Chennai - 600040', customer: 'Ravi Krishnan', phone: '+91 9840011111' },
  { id: 'PROP-002', name: 'Green Villa',         address: '12 Green Villa, Velachery, Chennai - 600042',      customer: 'Aarav Mehta',    phone: '+91 9840033333' },
  { id: 'PROP-003', name: 'Sunrise Apartments',  address: '45 Sunrise Apts, T Nagar, Chennai - 600017',      customer: 'Priya Sundaram', phone: '+91 9840022222' },
]

const VENDORS = [
  { id: 'VND-001', name: 'BrightSpark Electricals' },
  { id: 'VND-002', name: 'AquaFix Plumbing Co.' },
  { id: 'VND-003', name: 'WoodCraft Carpenters' },
  { id: 'VND-004', name: 'CoolAir HVAC Services' },
]

const SEED = [
  {
    id: 'MNT-001',
    requestDate: '2026-05-20',
    propertyId: 'PROP-001',
    propertyName: 'Lotus Residency 3B',
    propertyAddress: '3B Lotus Residency, Anna Nagar, Chennai - 600040',
    customer: 'Ravi Krishnan',
    customerPhone: '+91 9840011111',
    serviceType: 'Plumbing',
    priority: 'High',
    description: 'Pipe leakage in bathroom',
    vendorId: '',
    vendorName: '',
    status: 'Open',
    assignedDate: '',
    completionDate: '',
    currency: 'INR',
    serviceAmount: '0',
    gstRate: '18%',
    gstAmount: '',
    total: '',
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    remarks: '',
  },
  {
    id: 'MNT-002',
    requestDate: '2026-05-22',
    propertyId: 'PROP-002',
    propertyName: 'Green Villa',
    propertyAddress: '12 Green Villa, Velachery, Chennai - 600042',
    customer: 'Aarav Mehta',
    customerPhone: '+91 9840033333',
    serviceType: 'Electrical',
    priority: 'Medium',
    description: 'Electrical short circuit in living room',
    vendorId: 'VND-001',
    vendorName: 'BrightSpark Electricals',
    status: 'In Progress',
    assignedDate: '2026-05-23',
    completionDate: '',
    currency: 'INR',
    serviceAmount: '2500',
    gstRate: '18%',
    gstAmount: '450',
    total: '2950',
    paymentMethod: 'UPI',
    paymentStatus: 'Pending',
    remarks: '',
  },
]

/* ─────────────────────────────────────
   Helpers
───────────────────────────────────── */
function nextId(list) {
  const max = list.reduce((acc, r) => {
    const n = parseInt(r.id.replace('MNT-', ''), 10)
    return n > acc ? n : acc
  }, 0)
  return `MNT-${String(max + 1).padStart(3, '0')}`
}

function today() {
  return new Date().toISOString().split('T')[0]
}

function blankForm(id) {
  return {
    id,
    requestDate: today(),
    propertyId: '',
    propertyName: '',
    propertyAddress: '',
    customer: '',
    customerPhone: '',
    serviceType: 'Plumbing',
    priority: 'Medium',
    description: '',
    vendorId: '',
    vendorName: '',
    status: 'Open',
    assignedDate: '',
    completionDate: '',
    currency: 'INR',
    serviceAmount: '0.00',
    gstRate: '18%',
    gstAmount: '',
    total: '',
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    remarks: '',
  }
}

function calcGst(amount, rate) {
  const a = parseFloat(amount) || 0
  const r = parseFloat(rate) / 100
  return (a * r).toFixed(2)
}

function calcTotal(amount, gst) {
  return ((parseFloat(amount) || 0) + (parseFloat(gst) || 0)).toFixed(2)
}

function formatAmount(cur, val) {
  if (!val || val === '0' || val === '0.00') return '—'
  const sym = CURRENCIES.find(c => c.code === cur)?.symbol || '₹'
  return `${sym} ${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

function formatDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}-${m}-${y}`
}

const priorityClass = p => {
  if (p === 'High')     return 'mntBadgeHigh'
  if (p === 'Critical') return 'mntBadgeCritical'
  if (p === 'Medium')   return 'mntBadgeMedium'
  return 'mntBadgeLow'
}

/* ─────────────────────────────────────
   Summary Cards
───────────────────────────────────── */
function SummaryCards({ records }) {
  const total      = records.length
  const open       = records.filter(r => r.status === 'Open').length
  const inProgress = records.filter(r => r.status === 'In Progress').length
  const completed  = records.filter(r => r.status === 'Completed').length

  return (
    <div className="mntCards">
      <div className="mntCard">
        <div className="mntCardLabel">Total Requests</div>
        <div className="mntCardValue">{total}</div>
      </div>
      <div className="mntCard">
        <div className="mntCardLabel">Open</div>
        <div className="mntCardValue mntCardOpen">{open}</div>
      </div>
      <div className="mntCard">
        <div className="mntCardLabel">In Progress</div>
        <div className="mntCardValue mntCardProgress">{inProgress}</div>
      </div>
      <div className="mntCard">
        <div className="mntCardLabel">Completed</div>
        <div className="mntCardValue mntCardDone">{completed}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   Form
───────────────────────────────────── */
function MaintenanceForm({ form, onChange }) {
  const set = (k, v) => onChange({ ...form, [k]: v })

  const handlePropertySelect = propId => {
    const prop = PROPERTIES.find(p => p.id === propId)
    if (prop) {
      onChange({ ...form, propertyId: prop.id, propertyName: prop.name, propertyAddress: prop.address, customer: prop.customer, customerPhone: prop.phone })
    } else {
      onChange({ ...form, propertyId: '', propertyName: '', propertyAddress: '', customer: '', customerPhone: '' })
    }
  }

  const handleVendorSelect = vendorId => {
    const v = VENDORS.find(v => v.id === vendorId)
    onChange({ ...form, vendorId: vendorId, vendorName: v ? v.name : '' })
  }

  const handleAmountChange = (k, v) => {
    const updated = { ...form, [k]: v }
    const gst = calcGst(
      k === 'serviceAmount' ? v : form.serviceAmount,
      k === 'gstRate' ? v : form.gstRate
    )
    updated.gstAmount = gst
    updated.total = calcTotal(k === 'serviceAmount' ? v : form.serviceAmount, gst)
    onChange(updated)
  }

  return (
    <div className="mntFormGrid">

      {/* ── REQUEST DETAILS ── */}
      <div className="mntSectionTitle">Request Details</div>

      <div className="mntField">
        <label className="mntLabel">Request ID</label>
        <input className="mntInput mntReadonly" value={form.id} readOnly />
      </div>

      <div className="mntField">
        <label className="mntLabel">Request Date <span className="mntReq">*</span></label>
        <input type="date" className="mntInput" value={form.requestDate} onChange={e => set('requestDate', e.target.value)} />
      </div>

      <div className="mntField">
        <label className="mntLabel">Property <span className="mntReq">*</span></label>
        <select className="mntSelect" value={form.propertyId} onChange={e => handlePropertySelect(e.target.value)}>
          <option value="">— Select Property —</option>
          {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="mntField">
        <label className="mntLabel">Customer (auto-fill from property)</label>
        <select className="mntSelect mntReadonly" value={form.customer} readOnly>
          <option>{form.customer || '— Select / auto —'}</option>
        </select>
      </div>

      <div className="mntField mntFull">
        <label className="mntLabel">Property Address <span className="mntSubLabel">(auto from Property)</span></label>
        <input className="mntInput mntReadonly" value={form.propertyAddress} readOnly placeholder="Select a property to auto-fill" />
      </div>

      <div className="mntField mntFull">
        <label className="mntLabel">Customer Mobile Number <span className="mntSubLabel">(auto from Customer)</span></label>
        <input className="mntInput mntReadonly" value={form.customerPhone} readOnly placeholder="Select a customer to auto-fill" />
      </div>

      <div className="mntField">
        <label className="mntLabel">Service Type <span className="mntReq">*</span></label>
        <select className="mntSelect" value={form.serviceType} onChange={e => set('serviceType', e.target.value)}>
          {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="mntField">
        <label className="mntLabel">Priority</label>
        <select className="mntSelect" value={form.priority} onChange={e => set('priority', e.target.value)}>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="mntField mntFull">
        <label className="mntLabel">Issue Description <span className="mntReq">*</span></label>
        <textarea className="mntTextarea" placeholder="Describe the issue in detail" value={form.description} onChange={e => set('description', e.target.value)} />
      </div>

      {/* ── VENDOR & SCHEDULE ── */}
      <div className="mntSectionTitle">Vendor &amp; Schedule</div>

      <div className="mntField">
        <label className="mntLabel">Assigned Vendor</label>
        <select className="mntSelect" value={form.vendorId} onChange={e => handleVendorSelect(e.target.value)}>
          <option value="">— Select Vendor —</option>
          {VENDORS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      <div className="mntField">
        <label className="mntLabel">Status</label>
        <select className="mntSelect" value={form.status} onChange={e => set('status', e.target.value)}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="mntField">
        <label className="mntLabel">Assigned Date</label>
        <input type="date" className="mntInput" value={form.assignedDate} onChange={e => set('assignedDate', e.target.value)} />
      </div>

      <div className="mntField">
        <label className="mntLabel">Completion Date</label>
        <input type="date" className="mntInput" value={form.completionDate} onChange={e => set('completionDate', e.target.value)} />
      </div>

      {/* ── COST & GST ── */}
      <div className="mntSectionTitle">Cost &amp; GST</div>

      <div className="mntField">
        <label className="mntLabel">Service Amount</label>
        <div className="mntAmountRow">
          <select className="mntSelect mntCurrencySelect" value={form.currency} onChange={e => set('currency', e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
          </select>
          <input type="number" className="mntInput" value={form.serviceAmount} min="0" step="0.01"
            onChange={e => handleAmountChange('serviceAmount', e.target.value)} />
        </div>
      </div>

      <div className="mntField">
        <label className="mntLabel">GST %</label>
        <select className="mntSelect" value={form.gstRate} onChange={e => handleAmountChange('gstRate', e.target.value)}>
          {GST_RATES.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="mntField">
        <label className="mntLabel">GST Amount (auto)</label>
        <input className="mntInput mntReadonly" value={form.gstAmount ? `${CURRENCIES.find(c=>c.code===form.currency)?.symbol} ${form.gstAmount}` : ''} readOnly placeholder="" />
      </div>

      <div className="mntField mntFull">
        <label className="mntLabel">Total (auto)</label>
        <input className="mntInput mntReadonly mntTotalInput" value={form.total ? `${CURRENCIES.find(c=>c.code===form.currency)?.symbol} ${form.total}` : ''} readOnly placeholder="" />
      </div>

      {/* ── PAYMENT ── */}
      <div className="mntSectionTitle">Payment</div>

      <div className="mntField">
        <label className="mntLabel">Payment Method</label>
        <select className="mntSelect" value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}>
          {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      <div className="mntField">
        <label className="mntLabel">Payment Status</label>
        <select className="mntSelect" value={form.paymentStatus} onChange={e => set('paymentStatus', e.target.value)}>
          {PAYMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="mntField mntFull">
        <label className="mntLabel">Remarks</label>
        <textarea className="mntTextarea" placeholder="" value={form.remarks} onChange={e => set('remarks', e.target.value)} />
      </div>

    </div>
  )
}

/* ─────────────────────────────────────
   Modal
───────────────────────────────────── */
function MaintenanceModal({ mode, form, onChange, onClose, onSave }) {
  const handleSave = () => {
    if (!form.propertyId || !form.description.trim()) {
      alert('Property and Issue Description are required.')
      return
    }
    onSave(form)
  }

  const onBackdropClick = e => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="mntBackdrop" onClick={onBackdropClick}>
      <div className="mntModal" role="dialog" aria-modal="true">

        <div className="mntModalHeader">
          <span className="mntModalTitle">
            {mode === 'add' ? 'New Maintenance Request' : 'Edit Maintenance Request'}
          </span>
          <button className="mntCloseBtn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="mntModalBody">
          <MaintenanceForm form={form} onChange={onChange} />
        </div>

        <div className="mntModalFooter">
          <button className="mntBtnOutline" onClick={onClose}>Cancel</button>
          <button className="mntBtnPrimary" onClick={handleSave}>Save Request</button>
        </div>

      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   Main Page
───────────────────────────────────── */
export default function Maintenance() {
  const [records, setRecords]   = useState(SEED)
  const [search, setSearch]     = useState('')
  const [filterStatus, setFilterStatus]     = useState('All Status')
  const [filterPriority, setFilterPriority] = useState('All Priority')
  const [modal, setModal]       = useState(null)

  /* ── Filter ── */
  const visible = records.filter(r => {
    const q = search.toLowerCase()
    const matchQ = !q || r.id.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q) ||
      r.propertyName.toLowerCase().includes(q) || r.serviceType.toLowerCase().includes(q)
    const matchS = filterStatus === 'All Status' || r.status === filterStatus
    const matchP = filterPriority === 'All Priority' || r.priority === filterPriority
    return matchQ && matchS && matchP
  })

  /* ── Handlers ── */
  const openAdd  = ()  => setModal({ mode: 'add',  form: blankForm(nextId(records)) })
  const openEdit = r   => setModal({ mode: 'edit', form: { ...r } })
  const closeModal     = ()   => setModal(null)
  const updateForm     = form => setModal(prev => ({ ...prev, form }))

  const handleSave = form => {
    setRecords(prev => {
      const idx = prev.findIndex(r => r.id === form.id)
      if (idx >= 0) { const u = [...prev]; u[idx] = form; return u }
      return [...prev, form]
    })
    closeModal()
  }

  const handleStatusChange = (id, newStatus) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }

  const handleDelete = id => {
    if (window.confirm(`Delete request ${id}?`))
      setRecords(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="mntPageWrapper">

      {/* Header */}
      <div className="mntBreadcrumb">Operations / Maintenance Request Module</div>
      <div className="mntTitleRow">
        <h1 className="mntPageTitle">Maintenance Management</h1>
        <span className="mntPageSubtitle">Service tickets and request lifecycle</span>
      </div>

      {/* Summary Cards */}
      <SummaryCards records={records} />

      {/* Content Card */}
      <div className="mntContentCard">

        {/* Toolbar */}
        <div className="mntToolbar">
          <div className="mntSearchBox">
            <svg className="mntSearchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input placeholder="Search request..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <select className="mntFilterSelect" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option>All Status</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>

          <select className="mntFilterSelect" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option>All Priority</option>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>

          <div className="mntSpacer" />

          <button className="mntAddBtn" onClick={openAdd}>+ New Request</button>
        </div>

        <p className="mntRecordCount">{visible.length} request(s)</p>

        {/* Desktop Table */}
        <div className="table-wrap mntTableWrap">
          <table className="mntTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Property</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Priority</th>
                <th>Vendor</th>
                <th>Total</th>
                <th>Status</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={10} className="mntEmptyState">No maintenance requests found.</td></tr>
              ) : (
                visible.map(r => (
                  <tr key={r.id}>
                    <td><span className="mntRecordId">{r.id}</span></td>
                    <td>{r.propertyName || '—'}</td>
                    <td>{r.customer || '—'}</td>
                    <td>{r.serviceType}</td>
                    <td>
                      <span className={`mntPriorityBadge ${priorityClass(r.priority)}`}>{r.priority.toUpperCase()}</span>
                    </td>
                    <td>{r.vendorName || '—'}</td>
                    <td>{r.total ? formatAmount(r.currency, r.total) : '—'}</td>
                    <td>
                      <select
                        className="mntStatusSelect"
                        value={r.status}
                        onChange={e => handleStatusChange(r.id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ width: 50 }}>
                      <button className="mntEditBtn" onClick={() => openEdit(r)}>Edit</button>
                    </td>
                    <td style={{ width: 40 }}>
                      <button className="mntDeleteX" onClick={() => handleDelete(r.id)}>×</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mntMobileList">
          {visible.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888', padding: '32px 0' }}>No requests found.</p>
          )}
          {visible.map(r => (
            <div className="mntMobileCard" key={r.id}>
              <div className="mntMcTop">
                <div>
                  <div className="mntMcId">{r.id}</div>
                  <div className="mntMcProp">{r.propertyName}</div>
                </div>
                <span className={`mntPriorityBadge ${priorityClass(r.priority)}`}>{r.priority.toUpperCase()}</span>
              </div>
              <div className="mntMcRow">Customer: <span>{r.customer || '—'}</span></div>
              <div className="mntMcRow">Service: <span>{r.serviceType}</span></div>
              <div className="mntMcRow">Vendor: <span>{r.vendorName || '—'}</span></div>
              <div className="mntMcRow">Total: <span>{r.total ? formatAmount(r.currency, r.total) : '—'}</span></div>
              <div className="mntMcRow">Status: <span>{r.status}</span></div>
              <div className="mntMcActions">
                <button className="mntEditBtn" onClick={() => openEdit(r)}>Edit</button>
                <button className="mntDeleteBtn" onClick={() => handleDelete(r.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      {modal && (
        <MaintenanceModal
          mode={modal.mode}
          form={modal.form}
          onChange={updateForm}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

    </div>
  )
}