import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEMO_USERS = [
  { id: "ADMIN", password: "admin123", label: "Admin", desc: "full access (all modules)" },
  { id: "CUS-001", password: "cust123", label: "CUS-001", desc: "Ravi Krishnan (Tenant)" },
  { id: "CUS-002", password: "cust123", label: "CUS-002", desc: "Priya Sundaram (Owner)" },
  { id: "CUS-003", password: "cust123", label: "CUS-003", desc: "Aarav Mehta (Tenant)" },
];

const VALID_USERS = {
  ADMIN: "admin123",
  "CUS-001": "cust123",
  "CUS-002": "cust123",
  "CUS-003": "cust123",
};

const styles = {
  page: {
    background: "rgb(232, 226, 213)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    overflowX: "hidden",
    padding: "24px 16px",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    borderRadius: "14px",
    overflow: "hidden",
  },

  /* HEADER */
  header: {
    background: "#0d1b2a",
    padding: "38px 40px 34px",
    textAlign: "center",
    position: "relative",
  },
  headerTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "29px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.01em",
    marginBottom: "8px",
  },
  headerSub: {
    fontSize: "10.5px",
    fontWeight: "600",
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: "#c9a961",
    fontStyle: "italic",
  },

  /* BODY */
  body: {
    background: "#ffffff",
    padding: "40px 45px 36px",
  },
  heading: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "22px",
    fontWeight: "600",
    color: "#0d1b2a",
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#9a9690",
    marginBottom: "28px",
  },

  /* FIELD */
  fieldWrap: { marginBottom: "20px" },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.13em",
    textTransform: "uppercase",
    color: "#1b263b",
    marginBottom: "7px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #e5dfd6",
    borderRadius: "8px",
    fontFamily: "inherit",
    fontSize: "14px",
    color: "#0d1b2a",
    background: "#fdfcfa",
    outline: "none",
  },
  inputFocus: {
    borderColor: "#b8a070",
    boxShadow: "0 0 0 3px rgba(184,160,112,0.16)",
    background: "#ffffff",
  },
  pwdWrap: { position: "relative" },
  pwdInput: {
    width: "100%",
    padding: "12px 46px 12px 14px",
    border: "1.5px solid #e5dfd6",
    borderRadius: "8px",
    fontFamily: "inherit",
    fontSize: "14px",
    color: "#0d1b2a",
    background: "#fdfcfa",
    outline: "none",
  },
  eyeBtn: {
    position: "absolute",
    right: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#bbb",
    display: "flex",
    alignItems: "center",
    padding: "4px",
  },

  /* ERROR */
  error: {
    background: "rgba(164,22,26,0.07)",
    border: "1px solid rgba(164,22,26,0.22)",
    borderRadius: "7px",
    padding: "10px 14px",
    color: "#a4161a",
    fontSize: "13px",
    marginBottom: "18px",
  },

  /* SIGN IN BTN */
  signinBtn: {
    width: "100%",
    padding: "14px",
    background: "#0d1b2a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "0.01em",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  signinBtnDisabled: {
    background: "#8a97a4",
    cursor: "not-allowed",
  },
  signinBtnSuccess: {
    background: "#2d6a4f",
    cursor: "default",
  },

  /* DEMO SECTION */
  demo: {
    background: "#f7f3ec",
    borderTop: "1px solid #ece7dd",
    padding: "22px 40px 20px",
  },
  demoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "10.5px",
    fontWeight: "700",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#c9a961",
    marginBottom: "14px",
  },
  demoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #ece7dd",
    gap: "12px",
  },
  demoRowLast: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    gap: "12px",
  },
  demoInfo: { display: "flex", alignItems: "baseline", gap: "5px", flexWrap: "wrap" },
  demoId: { fontSize: "13.5px", fontWeight: "700", color: "#0d1b2a" },
  demoDesc: { fontSize: "12.5px", color: "#8e8880" },
  useBtn: {
    padding: "5px 18px",
    background: "transparent",
    border: "1.5px solid #c9a961",
    borderRadius: "20px",
    color: "#9a7830",
    fontFamily: "inherit",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  useBtnHover: {
    background: "#c9a961",
    color: "#ffffff",
    border: "1.5px solid #c9a961",
  },

  /* FOOTER */
  footer: {
    background: "#f7f3ec",
    borderTop: "1px solid #ece7dd",
    padding: "14px 40px",
    textAlign: "center",
    fontSize: "11.5px",
    color: "#b0aba3",
  },
};

/* ── Spinner ─────────────────────────────────────────────── */
const spinnerKeyframes = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
  @keyframes _spin { to { transform: rotate(360deg); } }
  @keyframes _fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  ._login-card { animation: _fadeUp 0.42s cubic-bezier(0.22,1,0.36,1) both; }
  ._spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: _spin 0.65s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }
  input::placeholder { color: #bbb8b2; }
`;

/* ── Icons ───────────────────────────────────────────────── */
const EyeOpen = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const KeyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="#c9a961" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="M21 2l-9.6 9.6M15.5 7.5L19 4m0 0l2 2-3 3-2-2" />
  </svg>
);

/* ── Main Component ──────────────────────────────────────── */
export default function Login({ onLogin, onSwitch }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hoveredUse, setHoveredUse] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleUseDemo = (id, pwd) => {
    setUserId(id);
    setPassword(pwd);
    setError("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!userId.trim() || !password) {
      setError("Please enter your User ID and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: userId.trim().toUpperCase(), password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      const user = data.user || {};
      const storedUser = {
        id: user.id ?? user.userId ?? userId.trim().toUpperCase(),
        userId: user.userId || userId.trim().toUpperCase(),
        name: user.name || "",
        email: user.email || "",
        role: user.role || (userId.trim().toUpperCase() === "ADMIN" ? "ADMIN" : "CUSTOMER"),
        token: user.token || "",
      };
      localStorage.setItem("pms_user", JSON.stringify(storedUser));
      setSuccess(true);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const signinBtnStyle = {
    ...styles.signinBtn,
    ...(loading || success ? styles.signinBtnDisabled : {}),
    ...(success ? styles.signinBtnSuccess : {}),
  };

  return (
    <>
      <style>{spinnerKeyframes}</style>

      <div style={styles.page}>
        <div style={styles.card} className="_login-card">



          {/* ── HEADER ── */}
          <div style={styles.header}>
            <div style={styles.headerTitle}>AUM Sol Corp</div>
            <div style={styles.headerSub}>Property Management System</div>
          </div>
          <div className="auth-tab-bar">
            <button type="button" className="auth-tab-button active">
              Login
            </button>
            <button type="button" className="auth-tab-button" onClick={onSwitch}>
              Sign Up
            </button>
          </div>

          {/* ── BODY ── */}
          <div style={styles.body}>
            <div style={styles.heading}>Sign in to your account</div>
            <div style={styles.subtitle}>
              Role-based access · Admin and Customer portals
            </div>



            {error && <div style={styles.error}>{error}</div>}

            {/* USER ID */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>User ID</label>
              <input
                style={{
                  ...styles.input,
                  ...(focusedField === "uid" ? styles.inputFocus : {}),
                }}
                type="text"
                placeholder="e.g. ADMIN or CUS-001"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setError(""); }}
                onFocus={() => setFocusedField("uid")}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete="username"
                spellCheck={false}
              />
            </div>

            {/* PASSWORD */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Password</label>
              <div style={styles.pwdWrap}>
                <input
                  style={{
                    ...styles.pwdInput,
                    ...(focusedField === "pwd" ? styles.inputFocus : {}),
                  }}
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onFocus={() => setFocusedField("pwd")}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            {/* SIGN IN */}
            <button
              style={signinBtnStyle}
              onClick={handleSubmit}
              disabled={loading || success}
            >
              {loading && <span className="_spinner" />}
              {success
                ? "✓ Signed in — redirecting…"
                : loading
                  ? "Signing in…"
                  : "Sign In"}
            </button>
          </div>

          {/* ── DEMO CREDENTIALS ── */}
          {/* <div style={styles.demo}>
            <div style={styles.demoHeader}>
              <KeyIcon />
              Demo Credentials
            </div>

            {DEMO_USERS.map((user, idx) => (
              <div
                key={user.id}
                style={idx === DEMO_USERS.length - 1 ? styles.demoRowLast : styles.demoRow}
              >
                <div style={styles.demoInfo}>
                  <span style={styles.demoId}>{user.label}</span>
                  <span style={styles.demoDesc}>· {user.desc}</span>
                </div>
                <button
                  style={{
                    ...styles.useBtn,
                    ...(hoveredUse === user.id ? styles.useBtnHover : {}),
                  }}
                  onMouseEnter={() => setHoveredUse(user.id)}
                  onMouseLeave={() => setHoveredUse(null)}
                  onClick={() => handleUseDemo(user.id, user.password)}
                >
                  Use
                </button>
              </div>
            ))}
          </div> */}

          {/* ── FOOTER ── */}
          <div style={styles.footer}>
            Secure access · Backend-validated permissions enforced
          </div>

        </div>
      </div>
    </>
  );
}