import { useState } from "react";
import "../Css/Invoice.css";

// ── PaymentInvoicing Component ──────────────────────────────────────────────
export default function PaymentInvoicing() {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="pi-page">
      {/* Header */}
      <div className="pi-header">
        <div>
          <h1 className="pi-title">Payment &amp; Invoicing</h1>
          <p className="pi-subtitle">
            Track vendor invoices, partial payments, and outstanding balances.
            Generate invoice PDFs.
          </p>
        </div>
        <button className="pi-btn-new" onClick={() => setShowForm(true)}>
          + New Invoice
        </button>
      </div>

      {/* Invoices Card */}
      <div className="pi-card">
        <div className="pi-card-header">
          <span className="pi-card-bar" />
          <span className="pi-card-title">Invoices</span>
        </div>
        <div className="pi-card-divider" />

        {invoices.length === 0 ? (
          <div className="pi-empty">
            No invoices yet. Click &quot;+ New Invoice&quot; to create one.
          </div>
        ) : (
          <table className="pi-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNo}</td>
                  <td>{inv.vendor}</td>
                  <td>₹ {inv.amount}</td>
                  <td>₹ {inv.paid}</td>
                  <td>₹ {inv.amount - inv.paid}</td>
                  <td>
                    <span className={`pi-badge pi-badge--${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <button className="pi-btn-pdf">PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}