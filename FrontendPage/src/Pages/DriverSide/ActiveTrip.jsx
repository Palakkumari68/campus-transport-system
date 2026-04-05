import React, { useEffect, useState } from "react";
import { getDriverRequests, updateRequestStatus } from "../../Services/api";

export default function ActiveTrip() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchActive = () => {
    getDriverRequests()
      .then((res) => {
        const active = res.data.find((r) =>
          ["ACCEPTED", "IN_PROGRESS"].includes(r.status)
        );
        setTrip(active || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchActive(); }, []);

  const updateStatus = async (status) => {
    if (!trip) return;
    setUpdating(true);
    try {
      await updateRequestStatus(trip.id, status);
      fetchActive();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Loading...</p>;

  if (!trip)
    return (
      <div className="alert alert-blue">
        No active trip right now. Accept a request from Incoming Requests.
      </div>
    );

  return (
    <>
      <div className="alert alert-green">
        Active trip — REQ-{trip.id}
      </div>
      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-label">Passenger</div>
          <div style={{ fontWeight: 500 }}>{trip.requesterName}</div>
          <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{trip.requesterRoll}</div>
        </div>
        <div className="card">
          <div className="card-label">Pickup</div>
          <div style={{ fontWeight: 500 }}>{trip.pickupLocation}</div>
        </div>
        <div className="card">
          <div className="card-label">Drop</div>
          <div style={{ fontWeight: 500 }}>{trip.dropLocation || "—"}</div>
        </div>
      </div>

      <div className="section-title">Update Status</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {trip.status === "ACCEPTED" && (
          <button
            className="btn btn-primary"
            disabled={updating}
            onClick={() => updateStatus("IN_PROGRESS")}
          >
            Passenger Picked Up
          </button>
        )}
        {trip.status === "IN_PROGRESS" && (
          <button
            className="btn btn-success"
            disabled={updating}
            onClick={() => updateStatus("COMPLETED")}
          >
            Mark Completed
          </button>
        )}
        <button
          className="btn btn-danger"
          disabled={updating}
          onClick={() => updateStatus("CANCELLED")}
        >
          Cancel Trip
        </button>
      </div>
      <p style={{ marginTop: 12, fontSize: 11, color: "var(--text-faint)" }}>
        API: PUT /api/request/{"{id}"}/status
      </p>
    </>
  );
}