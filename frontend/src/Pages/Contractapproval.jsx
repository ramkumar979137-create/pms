// ContractApprovalModule.jsx
// AUM Sol Corp PMS — Contract Approval Module

import { useState } from 'react'
import '../Css/ContractApproval.css'

/* ─────────────────────────────────────
   Constants
───────────────────────────────────── */
const CONTRACT_TYPES = ['Service Contract', 'Vendor Contract', 'Maintenance Contract', 'Supply Contract', 'Other']
const STATUSES       = ['Approved', 'Pending', 'Rejected', 'Under Review']
const CURRENCIES     = [{ code: 'INR', symbol: '₹' }, { code: 'USD', symbol: '$' }, { code: 'EUR', symbol: '€' }]
const GST_RATES      = ['0%', '5%', '12%', '18%', '28%']
const PAYMENT_TERMS  = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Immediate', 'Milestone-based']

/* ─────────────────────────────────────
   Seed Data
───────────────────────────────────── */
const VENDORS = [
  { id: 'VND-001', name: 'BrightSpark Electricals', contact: '+91 9900011111' },
  { id: 'VND-002', name: 'AquaFix Plumbing Co.',    contact: '+91 9900022222' },
  { id: 'VND-003', name: 'WoodCraft Carpenters',     contact: '+91 9900033333' },
  { id: 'VND-004', name: 'CoolAir HVAC Services',    contact: '+91 9900044444' },
]

const QUOTATIONS = [
  { id: 'QUO-001', vendor: 'BrightSpark Electricals', scope: 'Electrical wiring overhaul – Green Villa',   amount: '45000' },
  { id: 'QUO-002', vendor: 'AquaFix Plumbing Co.',    scope: 'Plumbing renovation – Lotus Residency 3B',  amount: '28000' },
  { id: 'QUO-003', vendor: 'CoolAir HVAC Services',   scope: 'AC installation – Sunrise Apartments',       amount: '62000' },
]

/* ─────────────────────────────────────
   Helpers
───────────────────────────────────── */
function nextId(list) {
  const max = list.reduce((acc, r) => {
    const n = parseInt(r.id.replace('CAP-', ''), 10)
    return n > acc ? n : acc
  }, 0)
  return `CAP-${String(max + 1).padStart(3, '0')}`
}

function today() { return new Date().toISOString().split('T')[0] }

function blankForm(id) {
  return {
    id,
    contractDate: today(),
    contractType: 'Service Contract',
    vendorId: '',
    vendorName: '',
    vendorContact: '',
    quotationId: '',
    scope: '',
    startDate: '',
    endDate: '',
    currency: 'INR',
    contractValue: '0.00',
    gstRate: '18%',
    gstAmount: '',
    totalValue: '',
    paymentTerms: 'Net 30',
    status: 'Approved',
    approvedBy: '',
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

function fmt(cur, val) {
  if (!val || val === '0' || val === '0.00') return '—'
  const sym = CURRENCIES.find(c => c.code === cur)?.symbol || '₹'
  return `${sym} ${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

function fmtDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}-${m}-${y}`
}

const statusClass = s => {
  if (s === 'Approved')     return 'capBadgeApproved'
  if (s === 'Pending')      return 'capBadgePending'
  if (s === 'Rejected')     return 'capBadgeRejected'
  if (s === 'Under Review') return 'capBadgeReview'
  return ''
}

/* ─────────────────────────────────────
   Form
───────────────────────────────────── */
function ContractForm({ form, onChange }) {
  const set = (k, v) => onChange({ ...form, [k]: v })

  const handleVendor = vendorId => {
    const v = VENDORS.find(v => v.id === vendorId)
    onChange({ ...form, vendorId, vendorName: v?.name || '', vendorContact: v?.contact || '' })
  }

  const handleQuotation = qId => {
    const q = QUOTATIONS.find(q => q.id === qId)
    if (q) {
      const gst   = calcGst(q.amount, form.gstRate)
      const total = calcTotal(q.amount, gst)
      onChange({ ...form, quotationId: qId, scope: q.scope, contractValue: q.amount, gstAmount: gst, totalValue: total })
    } else {
      onChange({ ...form, quotationId: '', scope: '' })
    }
  }

  const handleAmount = (k, v) => {
    const updated = { ...form, [k]: v }
    const gst   = calcGst(k === 'contractValue' ? v : form.contractValue, k === 'gstRate' ? v : form.gstRate)
    updated.gstAmount  = gst
    updated.totalValue = calcTotal(k === 'contractValue' ? v : form.contractValue, gst)
    onChange(updated)
  }

  return (
    <div className="capFormGrid">

      {/* ── CONTRACT DETAILS ── */}
      <div className="capSectionTitle">Contract Details</div>

      <div className="capField">
        <label className="capLabel">Contract ID</label>
        <input className="capInput capReadonly" value={form.id} readOnly />
      </div>

      <div className="capField">
        <label className="capLabel">Contract Date <span className="capReq">*</span></label>
        <input type="date" className="capInput" value={form.contractDate} onChange={e => set('contractDate', e.target.value)} />
      </div>

      <div className="capField">
        <label className="capLabel">Contract Type <span className="capReq">*</span></label>
        <select className="capSelect" value={form.contractType} onChange={e => set('contractType', e.target.value)}>
          {CONTRACT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="capField">
        <label className="capLabel">Status</label>
        <select className="capSelect" value={form.status} onChange={e => set('status', e.target.value)}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* ── VENDOR ── */}
      <div className="capSectionTitle">Vendor</div>

      <div className="capField">
        <label className="capLabel">Vendor <span className="capReq">*</span></label>
        <select className="capSelect" value={form.vendorId} onChange={e => handleVendor(e.target.value)}>
          <option value="">— Select Vendor —</option>
          {VENDORS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      <div className="capField">
        <label className="capLabel">Vendor Contact (auto)</label>
        <input className="capInput capReadonly" value={form.vendorContact} readOnly placeholder="Auto from vendor" />
      </div>

      <div className="capField">
        <label className="capLabel">Linked Quotation</label>
        <select className="capSelect" value={form.quotationId} onChange={e => handleQuotation(e.target.value)}>
          <option value="">— Select Quotation (optional) —</option>
          {QUOTATIONS.map(q => <option key={q.id} value={q.id}>{q.id} – {q.vendor}</option>)}
        </select>
      </div>

      <div className="capField">
        <label className="capLabel">Approved By <span className="capReq">*</span></label>
        <input className="capInput" placeholder="Approver name" value={form.approvedBy} onChange={e => set('approvedBy', e.target.value)} />
      </div>

      <div className="capField capFull">
        <label className="capLabel">Scope of Work <span className="capReq">*</span></label>
        <textarea className="capTextarea" placeholder="Describe the contract scope" value={form.scope} onChange={e => set('scope', e.target.value)} />
      </div>

      {/* ── DURATION ── */}
      <div className="capSectionTitle">Duration</div>

      <div className="capField">
        <label className="capLabel">Start Date <span className="capReq">*</span></label>
        <input type="date" className="capInput" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
      </div>

      <div className="capField">
        <label className="capLabel">End Date</label>
        <input type="date" className="capInput" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
      </div>

      {/* ── FINANCIALS ── */}
      <div className="capSectionTitle">Financials</div>

      <div className="capField">
        <label className="capLabel">Contract Value</label>
        <div className="capAmountRow">
          <select className="capSelect capCurrencySelect" value={form.currency} onChange={e => set('currency', e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
          </select>
          <input type="number" className="capInput" value={form.contractValue} min="0" step="0.01"
            onChange={e => handleAmount('contractValue', e.target.value)} />
        </div>
      </div>

      <div className="capField">
        <label className="capLabel">GST %</label>
        <select className="capSelect" value={form.gstRate} onChange={e => handleAmount('gstRate', e.target.value)}>
          {GST_RATES.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="capField">
        <label className="capLabel">GST Amount (auto)</label>
        <input className="capInput capReadonly" readOnly
          value={form.gstAmount ? `${CURRENCIES.find(c => c.code === form.currency)?.symbol} ${form.gstAmount}` : ''} />
      </div>

      <div className="capField">
        <label className="capLabel">Total Value (auto)</label>
        <input className="capInput capReadonly capTotalInput" readOnly
          value={form.totalValue ? `${CURRENCIES.find(c => c.code === form.currency)?.symbol} ${form.totalValue}` : ''} />
      </div>

      <div className="capField">
        <label className="capLabel">Payment Terms</label>
        <select className="capSelect" value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)}>
          {PAYMENT_TERMS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* ── REMARKS ── */}
      <div className="capSectionTitle">Remarks</div>

      <div className="capField capFull">
        <label className="capLabel">Internal Remarks</label>
        <textarea className="capTextarea" placeholder="Any internal notes..." value={form.remarks} onChange={e => set('remarks', e.target.value)} />
      </div>

    </div>
  )
}

/* ─────────────────────────────────────
   Modal
───────────────────────────────────── */
function ContractModal({ mode, form, onChange, onClose, onSave }) {
  const handleSave = () => {
    if (!form.vendorId || !form.approvedBy.trim() || !form.scope.trim() || !form.startDate) {
      alert('Vendor, Approved By, Scope, and Start Date are required.')
      return
    }
    onSave(form)
  }

  const onBackdropClick = e => { if (e.target === e.currentTarget) onClose() }

  return (
    <div className="capBackdrop" onClick={onBackdropClick}>
      <div className="capModal" role="dialog" aria-modal="true">

        <div className="capModalHeader">
          <span className="capModalTitle">{mode === 'add' ? 'New Contract' : 'Edit Contract'}</span>
          <button className="capCloseBtn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="capModalBody">
          <ContractForm form={form} onChange={onChange} />
        </div>

        <div className="capModalFooter">
          <button className="capBtnOutline" onClick={onClose}>Cancel</button>
          <button className="capBtnPrimary" onClick={handleSave}>
            {mode === 'add' ? 'Approve Contract' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   Main Page
───────────────────────────────────── */
export default function ContractApproval() {
  const [contracts, setContracts] = useState([])
  const [modal, setModal]         = useState(null)

  const openAdd    = ()   => setModal({ mode: 'add',  form: blankForm(nextId(contracts)) })
  const openEdit   = c    => setModal({ mode: 'edit', form: { ...c } })
  const closeModal = ()   => setModal(null)
  const updateForm = form => setModal(prev => ({ ...prev, form }))

  const handleSave = form => {
    setContracts(prev => {
      const idx = prev.findIndex(c => c.id === form.id)
      if (idx >= 0) { const u = [...prev]; u[idx] = form; return u }
      return [...prev, form]
    })
    closeModal()
  }

  const handleDelete = id => {
    if (window.confirm(`Delete contract ${id}?`))
      setContracts(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="capPageWrapper">

      {/* Header */}
      <div className="capTitleRow">
        <div>
          <h1 className="capPageTitle">Contract Approval</h1>
          <p className="capPageSubtitle">Approve vendor contracts after quotation analysis. Generates formal approval letter PDF.</p>
        </div>
        <button className="capAddBtn" onClick={openAdd}>+ New Contract</button>
      </div>

      {/* Content Card */}
      <div className="capContentCard">

        <div className="capCardHeader">
          <span className="capCardTitle">Approved Contracts</span>
        </div>

        {/* Desktop Table */}
        {contracts.length === 0 ? (
          <p className="capEmptyState">
            No contracts yet. Approve one from Quotation Analysis or click "+ New Contract".
          </p>
        ) : (
          <>
            <div className="capTableWrap">
              <table className="capTable">
                <thead>
                  <tr>
                    <th>Contract ID</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Vendor</th>
                    <th>Scope</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Total Value</th>
                    <th>Status</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map(c => (
                    <tr key={c.id}>
                      <td><span className="capRecordId">{c.id}</span></td>
                      <td>{fmtDate(c.contractDate)}</td>
                      <td>{c.contractType}</td>
                      <td>{c.vendorName || '—'}</td>
                      <td className="capScopeCell">{c.scope || '—'}</td>
                      <td>{fmtDate(c.startDate)}</td>
                      <td>{fmtDate(c.endDate)}</td>
                      <td>{fmt(c.currency, c.totalValue)}</td>
                      <td><span className={`capBadge ${statusClass(c.status)}`}>{c.status}</span></td>
                      <td style={{ width: 50 }}>
                        <button className="capEditBtn" onClick={() => openEdit(c)}>Edit</button>
                      </td>
                      <td style={{ width: 66 }}>
                        <button className="capDeleteBtn" onClick={() => handleDelete(c.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="capMobileList">
              {contracts.map(c => (
                <div className="capMobileCard" key={c.id}>
                  <div className="capMcTop">
                    <div>
                      <div className="capMcId">{c.id}</div>
                      <div className="capMcVendor">{c.vendorName}</div>
                    </div>
                    <span className={`capBadge ${statusClass(c.status)}`}>{c.status}</span>
                  </div>
                  <div className="capMcRow">Type: <span>{c.contractType}</span></div>
                  <div className="capMcRow">Scope: <span>{c.scope || '—'}</span></div>
                  <div className="capMcRow">Duration: <span>{fmtDate(c.startDate)} → {fmtDate(c.endDate)}</span></div>
                  <div className="capMcRow">Total: <span>{fmt(c.currency, c.totalValue)}</span></div>
                  <div className="capMcActions">
                    <button className="capEditBtn" onClick={() => openEdit(c)}>Edit</button>
                    <button className="capDeleteBtn" onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ContractModal
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