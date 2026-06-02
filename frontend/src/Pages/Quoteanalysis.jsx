import { useState, useMemo } from "react";
import "../Css/QuotationAnalysis.css";

function ConfirmModal({ quote, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="confirm-modal" role="dialog" aria-modal="true">
        <div className="modal-top-bar" />
        <div className="confirm-header">
          <div className="confirm-icon">✓</div>
          <h2 className="confirm-title">Confirm Approval</h2>
          <p className="confirm-subtitle">Are you sure you want to proceed with this vendor?</p>
        </div>
        <div className="confirm-body">
          <div className="confirm-row">
            <span className="confirm-key">Vendor</span>
            <span className="confirm-val">{quote.vendorName}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-key">Vendor ID</span>
            <span className="confirm-val">{quote.vendorId}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-key">Service</span>
            <span className="confirm-val">{quote.service}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-key">Description</span>
            <span className="confirm-val">{quote.description}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-key">Duration</span>
            <span className="confirm-val">{quote.duration}</span>
          </div>
          <div className="confirm-row confirm-row-highlight">
            <span className="confirm-key">Quote Value</span>
            <span className="confirm-val confirm-amount">{formatINR(quote.quoteValue)}</span>
          </div>
        </div>
        <div className="confirm-footer">
          <button className="btn-cancel-confirm" onClick={onCancel}>Cancel</button>
          <button className="btn-approve" onClick={onConfirm}>Approve &amp; Proceed</button>
        </div>
      </div>
    </div>
  );
}

const MAINTENANCE_REQUESTS = [
  {
    id: "MNT-001",
    service: "Plumbing",
    priority: "High",
    status: "Open",
    description: "Kitchen sink leakage causing water damage to cabin",
  },
  {
    id: "MNT-002",
    service: "Electrical",
    priority: "Medium",
    status: "Open",
    description: "Faulty wiring in Block B common area",
  },
  {
    id: "MNT-003",
    service: "Carpentry",
    priority: "Low",
    status: "Open",
    description: "Broken door frame in unit 304",
  },
];

const ALL_QUOTES = [
  {
    qtrId: "QTR-001",
    mntId: "MNT-001",
    vendorName: "BlueSky Plumbing Co.",
    vendorId: "VND-001",
    service: "Plumbing",
    description: "Replace leaking sink P-trap and resealing",
    duration: "3 Days",
    durationDays: 3,
    quoteValue: 4500,
    status: "PENDING",
  },
  {
    qtrId: "QTR-002",
    mntId: "MNT-001",
    vendorName: "BrightSpark Electricals",
    vendorId: "VND-002",
    service: "Plumbing",
    description: "Full diagnostic + replacement",
    duration: "4 Days",
    durationDays: 4,
    quoteValue: 5300,
    status: "PENDING",
  },
  {
    qtrId: "QTR-003",
    mntId: "MNT-001",
    vendorName: "BlueSky Plumbing Co.",
    vendorId: "VND-001",
    service: "Plumbing",
    description: "Premium replacement with extended warranty",
    duration: "2 Days",
    durationDays: 2,
    quoteValue: 6200,
    status: "PENDING",
  },
  {
    qtrId: "QTR-004",
    mntId: "MNT-002",
    vendorName: "BrightSpark Electricals",
    vendorId: "VND-002",
    service: "Electrical",
    description: "Full wiring inspection and repair",
    duration: "2 Days",
    durationDays: 2,
    quoteValue: 8500,
    status: "PENDING",
  },
  {
    qtrId: "QTR-005",
    mntId: "MNT-002",
    vendorName: "PowerTech Solutions",
    vendorId: "VND-003",
    service: "Electrical",
    description: "Partial rewiring and safety audit",
    duration: "3 Days",
    durationDays: 3,
    quoteValue: 7200,
    status: "PENDING",
  },
  {
    qtrId: "QTR-006",
    mntId: "MNT-003",
    vendorName: "WoodCraft Works",
    vendorId: "VND-004",
    service: "Carpentry",
    description: "Door frame replacement with hardware",
    duration: "1 Day",
    durationDays: 1,
    quoteValue: 2800,
    status: "PENDING",
  },
];

function formatINR(val) {
  return "₹ " + Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

export default function QuotationAnalysis() {
  const [selectedMnt, setSelectedMnt] = useState("MNT-001");
  const [selectedQtr, setSelectedQtr] = useState(null);
  const [confirmQuote, setConfirmQuote] = useState(null);
  const [approvedQtr, setApprovedQtr] = useState(null);

  const mntInfo = MAINTENANCE_REQUESTS.find((m) => m.id === selectedMnt);

  const quotes = useMemo(() => {
    const filtered = ALL_QUOTES.filter((q) => q.mntId === selectedMnt);
    return [...filtered].sort((a, b) => a.quoteValue - b.quoteValue);
  }, [selectedMnt]);

  const lowestId = quotes.length > 0 ? quotes[0].qtrId : null;

  const handleMntChange = (e) => {
    setSelectedMnt(e.target.value);
    setSelectedQtr(null);
    setApprovedQtr(null);
  };

  const handleProceed = () => {
    if (!selectedQtr) return;
    const chosen = quotes.find((q) => q.qtrId === selectedQtr);
    setConfirmQuote(chosen);
  };

  const handleConfirmApprove = () => {
    setApprovedQtr(confirmQuote.qtrId);
    setConfirmQuote(null);
  };

  return (
    <div className="page-wrapper">
      <div className="breadcrumb">Operations / Quote Analysis Module</div>
      <div className="page-header">
        <h1 className="page-title">Quotation Analysis</h1>
        <span className="page-subtitle">Compare quotes and select the best vendor</span>
      </div>

      <div className="card">
        <div className="mnt-label">Maintenance Request</div>
        <div className="selector-row">
          <select className="mnt-select" value={selectedMnt} onChange={handleMntChange}>
            {MAINTENANCE_REQUESTS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} — {m.service} — {m.description}
              </option>
            ))}
          </select>
          <span className="sort-hint">
            Sorted lowest → highest. Lowest is highlighted <span className="star">★</span>
          </span>
        </div>

        {mntInfo && (
          <div className="meta-row">
            <strong>{mntInfo.id}</strong>
            <span> · {mntInfo.service} · Priority: {mntInfo.priority} · Status: {mntInfo.status}</span>
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Vendor</th>
                <th>Service</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Quote Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>
                    No quotes found for this maintenance request.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => {
                  const isLowest = q.qtrId === lowestId;
                  const isSelected = selectedQtr === q.qtrId;
                  const isApproved = approvedQtr === q.qtrId;
                  return (
                    <tr
                      key={q.qtrId}
                      className={isLowest ? "row-lowest" : ""}
                      onClick={() => !approvedQtr && setSelectedQtr(q.qtrId)}
                    >
                      <td>
                        <div className="select-cell">
                          <input
                            type="radio"
                            name="quote-select"
                            checked={isSelected}
                            onChange={() => !approvedQtr && setSelectedQtr(q.qtrId)}
                            onClick={(e) => e.stopPropagation()}
                            disabled={!!approvedQtr}
                          />
                          {isLowest && (
                            <span className="lowest-badge">
                              <span className="star">★</span> LOWEST
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="vendor-name">{q.vendorName}</span>
                        <span className="vendor-id">{q.vendorId}</span>
                      </td>
                      <td>{q.service}</td>
                      <td style={{ color: "#555", maxWidth: 220 }}>{q.description}</td>
                      <td>{q.duration}</td>
                      <td>
                        <span className={isLowest ? "value-lowest" : "value-normal"}>
                          {formatINR(q.quoteValue)}
                        </span>
                      </td>
                      <td>
                        <span className={isApproved ? "badge-approved" : "badge-pending"}>
                          {isApproved ? "APPROVED" : q.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="proceed-row">
          {approvedQtr ? (
            <div className="approved-notice">
              <span className="approved-check">✓</span>
              Quote approved and sent for contract processing.
            </div>
          ) : (
            <button
              className="btn-proceed"
              onClick={handleProceed}
              disabled={!selectedQtr}
            >
              → Proceed to Contract Approval
            </button>
          )}
        </div>
      </div>

      {confirmQuote && (
        <ConfirmModal
          quote={confirmQuote}
          onConfirm={handleConfirmApprove}
          onCancel={() => setConfirmQuote(null)}
        />
      )}
    </div>
  );
}