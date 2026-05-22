// SignupPage.jsx
import { useState } from "react";
import "../Css/auth.css";
import "../Css/Signup.css";

/* ── Password Strength Helpers ── */
function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#c0392b", "#c9973a", "#7a6020", "#4a7c2f"];

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
  }
}

export default function SignupPage({ onSwitch }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    company:   "",
    password:  "",
    confirm:   "",
    role:      "",
  });
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const strength = getStrength(form.password);



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.firstName || !form.lastName || !form.email || !form.password || !form.role) {
    setError("Please fill in all required fields.");
    return;
  }
  if (form.password !== form.confirm) {
    setError("Passwords do not match.");
    return;
  }
  if (strength < 2) {
    setError("Please choose a stronger password.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        company: form.company,
        role: form.role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Signup failed");
      return;
    }

    // Success screen
    setSubmitted(true);

  } catch (err) {
    setError("Server error — try again later.");
  }
};

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div className="auth-card text-center">
        <div className="signup-success-icon">
          <i className="bi bi-check-circle-fill"></i>
        </div>
        <h3>Account Created!</h3>
        <p className="sub">
          Welcome, {form.firstName}! Check your email to verify your account.
        </p>
        <button className="btn-gold mt-2" onClick={onSwitch}>
          <i className="bi bi-box-arrow-in-right me-2"></i>
          Go to Login
        </button>
      </div>
    );
  }

  /* ── Signup Form ── */
  return (
    <div className="auth-card">
        {/* <div style={styles.header}>
            <div style={styles.headerTitle}>AUM Sol Corp</div>
            <div style={styles.headerSub}>Property Management System</div>
          </div> */}
      <div className="auth-tab-bar">
        <button type="button" className="auth-tab-button" onClick={onSwitch}>
          Login
        </button>
        <button type="button" className="auth-tab-button active">
          Sign Up
        </button>
      </div>
      <h3>Create your account</h3>
      <p className="sub">Start your 14-day free trial — no credit card required.</p>

      {error && (
        <div className="alert-custom">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Name Row */}
        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="form-label">
              First Name <span className="required-star">*</span>
            </label>
            <input
              name="firstName"
              className="form-control"
              placeholder="John"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="col-6">
            <label className="form-label">
              Last Name <span className="required-star">*</span>
            </label>
            <input
              name="lastName"
              className="form-control"
              placeholder="Smith"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">
            Work Email <span className="required-star">*</span>
          </label>
          <div className="input-group input-icon">
            <span className="input-group-text">
              <i className="bi bi-envelope"></i>
            </span>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="john@company.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Company */}
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <div className="input-group input-icon">
            <span className="input-group-text">
              <i className="bi bi-building"></i>
            </span>
            <input
              name="company"
              className="form-control"
              placeholder="Smith Properties LLC"
              value={form.company}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Role */}
        <div className="mb-3">
          <label className="form-label">
            Your Role <span className="required-star">*</span>
          </label>
          <select
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
          >
            <option value="">Select your role</option>
            <option>Property Manager</option>
            <option>Property Owner</option>
            <option>Real Estate Investor</option>
            <option>HOA Manager</option>
            <option>Other</option>
          </select>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="form-label">
            Password <span className="required-star">*</span>
          </label>
          <div className="input-group input-icon">
            <span className="input-group-text">
              <i className="bi bi-lock"></i>
            </span>
            <input
              name="password"
              type={showPw ? "text" : "password"}
              className="form-control"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPw(!showPw)}
            >
              <i className={`bi ${showPw ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>

          {/* Strength indicator */}
          {form.password && (
            <>
              <div className="strength-bar mt-1">
                <div
                  className="strength-fill"
                  style={{
                    width:      `${(strength / 4) * 100}%`,
                    background: strengthColor[strength],
                  }}
                ></div>
              </div>
              <span
                className="strength-label"
                style={{ color: strengthColor[strength] }}
              >
                {strengthLabel[strength]} password
              </span>
            </>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="form-label">
            Confirm Password <span className="required-star">*</span>
          </label>
          <div className="input-group input-icon">
            <span className="input-group-text">
              <i className="bi bi-lock-fill"></i>
            </span>
            <input
              name="confirm"
              type={showCf ? "text" : "password"}
              className="form-control"
              placeholder="Re-enter password"
              value={form.confirm}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowCf(!showCf)}
            >
              <i className={`bi ${showCf ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary-main mb-3">
          <i className="bi bi-rocket-takeoff me-2"></i>
          Start Free Trial
        </button>

        <p className="terms-text">
          By signing up, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>

      </form>

      <div className="switch-text">
        Already have an account?{" "}
        <button onClick={onSwitch}>Sign In</button>
      </div>
    </div>
  );
}
