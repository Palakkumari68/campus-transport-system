import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDriverRequests, acceptRequest, declineRequest } from "../Services/api";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    getDriverRequests()
      .then((res) => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  const pending = requests.filter((r) => r.status === "PENDING");
  const today = requests.filter((r) => r.status === "COMPLETED");

  const handleAccept = async (id) => {
    await acceptRequest(id);
    fetchRequests();
    navigate("/driver/active");
  };

  const handleDecline = async (id) => {
    await declineRequest(id);
    fetchRequests();
  };

  return (
    <>
      <div className="grid-3">
        <div className="card"><div className="card-label">Pending Requests</div><div className="card-value amber">{pending.length}</div></div>
        <div className="card"><div className="card-label">Trips Today</div><div className="card-value blue">{today.length}</div></div>
        <div className="card"><div className="card-label">Total Trips</div><div className="card-value green">{requests.length}</div></div>
      </div>

      {pending.length > 0 && (
        <div className="alert alert-amber">
          You have {pending.length} pending request{pending.length > 1 ? "s" : ""}. Accept before they expire.
        </div>
      )}

      <div className="section-title">New Requests</div>
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : pending.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>No pending requests right now.</p>
      ) : (
        pending.map((r) => (
          <div key={r.id} className="req-card">
            <div className="req-card-header">
              <div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>REQ-{r.id}</div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{r.serviceType}</div>
              </div>
              <span className="badge badge-amber">Pending</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
              {r.pickupLocation} → {r.dropLocation || "—"} &nbsp;|&nbsp; {r.requesterName} &nbsp;|&nbsp;{" "}
              {new Date(r.createdAt).toLocaleTimeString()}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-success btn-sm" onClick={() => handleAccept(r.id)}>
                Accept
              </button>
              <button className="btn btn-sm" onClick={() => handleDecline(r.id)}>
                Decline
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}