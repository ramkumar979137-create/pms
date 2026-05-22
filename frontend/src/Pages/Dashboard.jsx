// Pages/Dashboard.jsx
import "../Css/Global.css";

import { useState, useEffect } from "react";
import axios from "axios";

const statusColor = {
  Open: "warning", Paid: "success", Active: "success",
  Pending: "warning", Approved: "info",
};

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard");
      setStats(res.data.stats || []);
      setRecentActivity(res.data.recentActivity || []);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Welcome back 👋</h2>
        <p>Here's what's happening in your properties today.</p>
        {error && <div style={{ color: "var(--danger)", marginBottom: 10 }}>{error}</div>}
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {loading ? (
          <div>Loading...</div>
        ) : stats.length > 0 ? (
          stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className={`stat-icon ${s.type}`}>
                <i className={`bi ${s.icon}`}></i>
              </div>
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
            </div>
          ))
        ) : (
            <div style={{ padding: 20, color: "var(--text-muted)" }}>No dashboard stats available yet.</div>
          )}
      </div>

      {/* Recent activity */}
      <div className="pms-card">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
          <h3 style={{ fontSize:"1.1rem" }}>Recent Activity</h3>
          <span style={{ fontSize:"0.8rem", color:"var(--text-muted)" }}>Last 7 days</span>
        </div>
        <div className="pms-table-wrap">
          <table className="pms-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4}>Loading...</td></tr>
              ) : recentActivity.map((a, i) => (
                <tr key={i}>
                  <td><span className="badge-pms neutral">{a.type}</span></td>
                  <td>{a.desc}</td>
                  <td><span className={`badge-pms ${statusColor[a.status]}`}>{a.status}</span></td>
                  <td style={{ color:"var(--text-muted)", fontSize:"0.82rem" }}>{a.date}</td>
                </tr>
              ))}
              {!loading && recentActivity.length === 0 && (
                 <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>No recent activity available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}