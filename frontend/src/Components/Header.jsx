// Components/Header.jsx
import { useState } from "react";
import "../Css/Header.css";
import Logo from "../Assets/AUM_Sol_Corp_symbol_with_bg.png";    

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const SignOutIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function Header({ onMenuClick, user = {} }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = () => {
    setShowConfirm(true);
  };

  const confirmSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem("pms_user");
    localStorage.removeItem("pms_token");
    // Redirect to login page
    window.location.href = "/login";
  };

  const cancelSignOut = () => {
    setShowConfirm(false);
  };

  return (
    <header className="pms-header">
      {/* Brand / Logo — same width as sidebar */}
      <div className="header-brand">
        <div className="header-brand-logo">
          <img src={Logo} alt="AUM Sol Corp Logo" />
        </div>  
        <div className="header-brand-text">
          <h1 className="header-brand-name">AUM Sol Corp</h1>
          <small className="header-brand-tag">A Unite for Multiple Solutions</small>
        </div>
      </div>

      {/* Search */}
      <div className="header-search">
        <SearchIcon />
        <input type="text" placeholder="Search customers, properties, vendors, invoices..." />
      </div>

      <div className="header-spacer" />

      {/* Right: user info + sign out */}
      <div className="header-right">
        <div className="header-user-info">
          <div className="header-user-name">{user.name || "Administrator"}</div>
          <div className="header-user-role">{user.role || "Admin"}</div>
        </div>
        <div className="header-badge">{(user.role || "ADMIN").toUpperCase()}</div>
        <div className="header-avatar">
          {(user.name?.[0] || "A").toUpperCase()}
        </div>
        <button className="header-signout" onClick={handleSignOut}>
          <SignOutIcon /> Sign Out
        </button>
      </div>

      {/* Mobile hamburger — appears last */}
      <button className="header-hamburger" onClick={onMenuClick} aria-label="Open menu">
        ☰
      </button>

      {/* Sign Out Confirmation Dialog */}
      {showConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h2>Confirm Sign Out</h2>
            <p>Are you sure you want to sign out?</p>
            <div className="confirmation-buttons">
              <button className="btn-cancel" onClick={cancelSignOut}>Cancel</button>
              <button className="btn-confirm" onClick={confirmSignOut}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}