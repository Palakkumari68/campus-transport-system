import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDriverRequests, updateRequestStatus } from "../../Services/api";

// The ordered status pipeline for a trip
const PIPELINE = [
  {
    status: "ACCEPTED",
    label: "Request Accepted",
    desc: "You accepted the request. Head to the pickup location.",
    icon: "✓",
    next: "IN_PROGRESS",
    nextLabel: "Passenger Picked Up",
    btnClass: "btn-primary",
  },
  {
    status: "IN_PROGRESS",
    label: "Ride in Progress",
    desc: "Passenger is on board. Drive safely to the destination.",
    icon: "🗺️",
    next: "COMPLETED",
    nextLabel: "Mark as Completed",
    btnClass: "btn-success",
  },
  {
    status: "COMPLETED",
    label: "Trip Completed",
    desc: "Trip finished successfully. Well done!",
    icon: "✅",
    next: null,
    nextLabel: null,
    btnClass: "",
  },
];

const STATUS_ORDER = { ACCEPTED: 0, IN_PROGRESS: 1, COMPLETED: 2 };

export default function UpdateStatus() {
  const navigate = useNavigate();
  const [trip, setTrip]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const fetchActive = () => {
    setLoading(true);
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

  const advance = async () => {
    if (!trip) return;
    const step = PIPELINE[STATUS_ORDER[trip.status]];
    if (!step?.next) return;
    setUpdating(true);
    try {
      await updateRequestStatus(trip.id, step.next);
      fetchActive();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const cancel = async () => {
    if (!trip) return;
    setUpdating(true);
    try {
      await updateRequestStatus(trip.id, "CANCELLED");
      setCancelled(true);
      setTrip(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
      setConfirmCancel(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────
  if (loading)
    return <p style={{ color: "var(--text-muted)" }}>Loading active trip...</p>;

  // ── Cancelled ────────────────────────────────────────────
  if (cancelled)
    return (
      <div className="alert alert-red">
        Trip cancelled.{" "}
        <span
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => navigate("/driver/requests")}
        >
          Back to requests →
        </span>
      </div>
    );

  // ── No active trip ───────────────────────────────────────
  if (!trip)
    return (
      <div className="alert alert-blue">
        No active trip right now.{" "}
        <span
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => navigate("/driver/requests")}
        >
          View incoming requests →
        </span>
      </div>
    );

  const currentStep = PIPELINE[STATUS_ORDER[trip.status]];

  return (
    <>
      {/* ── Trip info cards ──────────────────────────────────── */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-label">Request ID</div>
          <div style={{ fontWeight: 500 }}>REQ-{trip.id}</div>
        </div>
        <div className="card">
          <div className="card-label">Service Type</div>
          <div style={{ fontWeight: 500 }}>
            {{
              AMBULANCE: "🚑 Ambulance",
              ERICKSHAW: "🛺 E-Rickshaw",
              INDENTA:   "🚌 Indenta",
            }[trip.serviceType] || trip.serviceType}
          </div>
        </div>
        <div className="card">
          <div className="card-label">Current Status</div>
          <div style={{ fontWeight: 500, color: "var(--primary)" }}>
            {trip.status}
          </div>
        </div>
      </div>

      {/* ── Passenger details ────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px 20px",
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 2 }}>
              Passenger
            </div>
            <div style={{ fontWeight: 500 }}>{trip.requesterName}</div>
            {trip.requesterPhone && (
              <a
                href={`tel:${trip.requesterPhone}`}
                style={{ fontSize: 12, color: "var(--primary)" }}
              >
                {trip.requesterPhone}
              </a>
            )}
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 2 }}>
              Pickup Location
            </div>
            <div style={{ fontWeight: 500 }}>{trip.pickupLocation}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 2 }}>
              Drop Location
            </div>
            <div style={{ fontWeight: 500 }}>{trip.dropLocation || "—"}</div>
          </div>
          {trip.description && (
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 2 }}>
                Notes
              </div>
              <div style={{ fontSize: 13 }}>{trip.description}</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Visual pipeline ──────────────────────────────────── */}
      <div className="section-title">Trip Progress</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {PIPELINE.map((step, i) => {
          const done = STATUS_ORDER[trip.status] > i;
          const active = STATUS_ORDER[trip.status] === i;
          return (
            <React.Fragment key={step.status}>
              {/* Step circle */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: done ? 16 : 14,
                    fontWeight: 500,
                    border: `2px solid ${
                      done
                        ? "var(--success)"
                        : active
                        ? "var(--primary)"
                        : "var(--border-strong)"
                    }`,
                    background: done
                      ? "var(--success-light)"
                      : active
                      ? "var(--primary-light)"
                      : "var(--bg)",
                    color: done
                      ? "var(--success)"
                      : active
                      ? "var(--primary)"
                      : "var(--text-faint)",
                    transition: "all .3s",
                  }}
                >
                  {done ? "✓" : step.icon}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    marginTop: 5,
                    textAlign: "center",
                    color: done
                      ? "var(--success)"
                      : active
                      ? "var(--primary)"
                      : "var(--text-faint)",
                    fontWeight: active ? 500 : 400,
                    maxWidth: 80,
                  }}
                >
                  {step.label}
                </div>
              </div>

              {/* Connector line */}
              {i < PIPELINE.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    minWidth: 20,
                    background: done ? "var(--success)" : "var(--border-strong)",
                    marginBottom: 20,
                    transition: "background .3s",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Current step description ─────────────────────────── */}
      <div
        className="alert alert-blue"
        style={{ marginBottom: 16 }}
      >
        <strong>{currentStep.icon} {currentStep.label}:</strong>{" "}
        {currentStep.desc}
      </div>

      {/* ── Action buttons ───────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {currentStep.next && (
          <button
            className={`btn ${currentStep.btnClass}`}
            disabled={updating}
            onClick={advance}
            style={{ minWidth: 180 }}
          >
            {updating ? "Updating..." : currentStep.nextLabel}
          </button>
        )}

        {trip.status === "COMPLETED" && (
          <div className="alert alert-green" style={{ margin: 0 }}>
            ✅ Trip completed! You can now accept new requests.
          </div>
        )}

        {trip.status !== "COMPLETED" && !confirmCancel && (
          <button
            className="btn btn-sm"
            style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
            onClick={() => setConfirmCancel(true)}
          >
            Cancel Trip
          </button>
        )}

        {confirmCancel && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--danger-light)",
              border: "0.5px solid var(--danger)",
              borderRadius: "var(--radius)",
              padding: "6px 12px",
              fontSize: 13,
            }}
          >
            <span style={{ color: "var(--danger)" }}>
              Are you sure you want to cancel this trip?
            </span>
            <button
              className="btn btn-danger btn-sm"
              disabled={updating}
              onClick={cancel}
            >
              Yes, Cancel
            </button>
            <button
              className="btn btn-sm"
              onClick={() => setConfirmCancel(false)}
            >
              No
            </button>
          </div>
        )}
      </div>

      <p style={{ marginTop: 14, fontSize: 11, color: "var(--text-faint)" }}>
        API: PUT /api/request/{"{id}"}/status — body: {"{ status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }"}
      </p>
    </>
  );
}
