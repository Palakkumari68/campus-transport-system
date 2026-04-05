import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDriverRequests, updateDriverAvailability } from "../../Services/api";
import { useAuth } from "../../Context/AuthContext";

export default function DriverDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [availability, setAvailability] = useState("ON_DUTY");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDriverRequests()
      .then((res) => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAvailability = async (val) => {
    setAvailability(val);
    try {
      await updateDriverAvailability(val);
    } catch (err) {
      console.error(err);
    }
  };

  // Derived counts
  const pending = requests.filter((r) => r.status === "PENDING");
  const activeTrip = requests.find((r) =>
    ["ACCEPTED", "IN_PROGRESS"].includes(r.status)
  );
  const completedToday = requests.filter((r) => {
    if (r.status !== "COMPLETED") return false;
    const d = new Date(r.updatedAt);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const availabilityColors = {
    ON_DUTY:  { bg: "var(--success-light)",  color: "var(--success)" },
    OFF_DUTY: { bg: "var(--danger-light)",   color: "var(--danger)" },
    ON_BREAK: { bg: "var(--warning-light)",  color: "var(--warning)" },
  };
  const avStyle = availabilityColors[availability];

  return (
    <div className="page-container">
      {/* ── Greeting + availability toggle ─────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 17, fontWeight: 500 }}>
            Welcome, {user?.name || "Driver"} 👋
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Here's your shift overview
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Status:
          </span>
          <select
            value={availability}
            onChange={(e) => handleAvailability(e.target.value)}
            style={{
              width: "auto",
              padding: "5px 10px",
              background: avStyle.bg,
              color: avStyle.color,
              border: `0.5px solid ${avStyle.color}`,
              fontWeight: 500,
              fontSize: 12,
            }}
          >
            <option value="ON_DUTY">On Duty</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="ON_BREAK">On Break</option>
          </select>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="grid-3">
        <div className="card">
          <div className="card-label">Pending Requests</div>
          <div className="card-value amber">{loading ? "—" : pending.length}</div>
        </div>
        <div className="card">
          <div className="card-label">Trips Today</div>
          <div className="card-value blue">
            {loading ? "—" : completedToday.length}
          </div>
        </div>
        <div className="card">
          <div className="card-label">Total Trips</div>
          <div className="card-value green">
            {loading ? "—" : requests.filter((r) => r.status === "COMPLETED").length}
          </div>
        </div>
      </div>

      {/* ── Active trip alert ──────────────────────────────── */}
      {activeTrip && (
        <div
          className="alert alert-green"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/driver/active")}
        >
          🟢 Active trip in progress — REQ-{activeTrip.id} &nbsp;
          <strong style={{ textDecoration: "underline" }}>View →</strong>
        </div>
      )}

      {/* ── Pending requests alert ─────────────────────────── */}
      {!activeTrip && pending.length > 0 && (
        <div
          className="alert alert-amber"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/driver/requests")}
        >
          ⚡ {pending.length} new request{pending.length > 1 ? "s" : ""} waiting
          for your response. &nbsp;
          <strong style={{ textDecoration: "underline" }}>View →</strong>
        </div>
      )}

      {/* ── Quick actions ──────────────────────────────────── */}
      <div className="section-title" style={{ marginTop: 4 }}>
        Quick Actions
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div
          className="card"
          style={{ cursor: "pointer", transition: "opacity .15s" }}
          onClick={() => navigate("/driver/requests")}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.75)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
        >
          <div style={{ fontSize: 24, marginBottom: 6 }}>📋</div>
          <div style={{ fontWeight: 500 }}>Incoming Requests</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {pending.length} pending
          </div>
        </div>

        <div
          className="card"
          style={{ cursor: "pointer", transition: "opacity .15s" }}
          onClick={() => navigate("/driver/active")}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.75)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
        >
          <div style={{ fontSize: 24, marginBottom: 6 }}>🗺️</div>
          <div style={{ fontWeight: 500 }}>Active Trip</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {activeTrip ? `REQ-${activeTrip.id} in progress` : "No active trip"}
          </div>
        </div>
      </div>

      {/* ── Recent completed trips ─────────────────────────── */}
      <div className="section-title">Recent Trips</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Passenger</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                  Loading...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                  No trips yet
                </td>
              </tr>
            ) : (
              requests.slice(0, 8).map((r) => (
                <tr key={r.id}>
                  <td>REQ-{r.id}</td>
                  <td>{r.requesterName}</td>
                  <td>{r.pickupLocation}</td>
                  <td>{r.dropLocation || "—"}</td>
                  <td>
                    {{
                      PENDING:     <span className="badge badge-amber">Pending</span>,
                      ACCEPTED:    <span className="badge badge-blue">Accepted</span>,
                      IN_PROGRESS: <span className="badge badge-red">Active</span>,
                      COMPLETED:   <span className="badge badge-green">Completed</span>,
                      CANCELLED:   <span className="badge badge-gray">Cancelled</span>,
                    }[r.status]}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}