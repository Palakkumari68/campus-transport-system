import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDriverRequests, updateRequestStatus } from "../../services/api";

const PIPELINE = [
  {
    status: "ACCEPTED",
    label: "Request Accepted",
    desc: "You accepted the request. Head to the pickup location.",
    icon: "✓",
    next: "IN_PROGRESS",
    nextLabel: "Passenger Picked Up",
  },
  {
    status: "IN_PROGRESS",
    label: "Ride in Progress",
    desc: "Passenger is on board. Drive safely to the destination.",
    icon: "🗺️",
    next: "COMPLETED",
    nextLabel: "Mark as Completed",
  },
  {
    status: "COMPLETED",
    label: "Trip Completed",
    desc: "Trip finished successfully. Well done!",
    icon: "✅",
    next: null,
    nextLabel: null,
  },
];

const STATUS_ORDER = {
  ACCEPTED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
};

export default function UpdateStatus() {
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [error, setError] = useState("");

  const fetchActive = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getDriverRequests();
      const requests = res.data || [];

      const active = requests.find((r) =>
        ["ACCEPTED", "IN_PROGRESS"].includes(r.status)
      );

      setTrip(active || null);
    } catch (err) {
      console.error("Failed to load active trip:", err);
      setError(
        err.response?.data?.message || "Could not load active trip."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActive();
  }, []);

  const advance = async () => {
    if (!trip) return;

    const step = PIPELINE[STATUS_ORDER[trip.status]];
    if (!step?.next) return;

    try {
      setUpdating(true);
      setError("");

      await updateRequestStatus(trip.id, step.next);

      if (step.next === "COMPLETED") {
        setTrip((prev) => (prev ? { ...prev, status: "COMPLETED" } : prev));
      } else {
        await fetchActive();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setError(
        err.response?.data?.message || "Could not update trip status."
      );
    } finally {
      setUpdating(false);
    }
  };

  const cancel = async () => {
    if (!trip) return;

    try {
      setUpdating(true);
      setError("");

      await updateRequestStatus(trip.id, "CANCELLED");
      setCancelled(true);
      setTrip(null);
    } catch (err) {
      console.error("Failed to cancel trip:", err);
      setError(err.response?.data?.message || "Could not cancel trip.");
    } finally {
      setUpdating(false);
      setConfirmCancel(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
          <p className="text-sm text-gray-600">Loading active trip...</p>
        </div>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
          Trip cancelled.{" "}
          <span
            className="cursor-pointer underline"
            onClick={() => navigate("/driver/requests")}
          >
            Back to requests →
          </span>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-6">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-700 shadow-sm">
          No active trip right now.{" "}
          <span
            className="cursor-pointer underline"
            onClick={() => navigate("/driver/requests")}
          >
            View incoming requests →
          </span>
        </div>
      </div>
    );
  }

  const currentStep = PIPELINE[STATUS_ORDER[trip.status]];

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Update Trip Status</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track and update your current trip progress
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500">Request ID</p>
          <h2 className="mt-3 text-xl font-bold text-black">REQ-{trip.id}</h2>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500">Service Type</p>
          <h2 className="mt-3 text-xl font-bold text-black">
            {{
              AMBULANCE: "🚑 Ambulance",
              ERICKSHAW: "🛺 E-Rickshaw",
              INDENTA: "🚌 Indenta",
            }[trip.serviceType] || trip.serviceType || "—"}
          </h2>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500">Current Status</p>
          <h2 className="mt-3 text-xl font-bold text-red-600">{trip.status}</h2>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Passenger</p>
            <h3 className="mt-2 text-lg font-semibold text-black">
              {trip.requesterName || trip.requester?.name || trip.patientName || "—"}
            </h3>
            {(trip.requesterPhone || trip.contactNumber) && (
              <a
                href={`tel:${trip.requesterPhone || trip.contactNumber}`}
                className="mt-1 block text-sm text-red-600 hover:underline"
              >
                {trip.requesterPhone || trip.contactNumber}
              </a>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Pickup Location</p>
            <h3 className="mt-2 text-lg font-semibold text-black">
              {trip.pickupLocation || "—"}
            </h3>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Drop Location</p>
            <h3 className="mt-2 text-lg font-semibold text-black">
              {trip.dropLocation || trip.destination || "—"}
            </h3>
          </div>
        </div>

        {trip.description && (
          <div className="mt-5 border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-500">Notes</p>
            <p className="mt-2 text-sm text-gray-700">{trip.description}</p>
          </div>
        )}
      </div>

      <h2 className="mb-4 text-2xl font-bold text-black">Trip Progress</h2>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {PIPELINE.map((step, i) => {
          const done = STATUS_ORDER[trip.status] > i;
          const active = STATUS_ORDER[trip.status] === i;

          return (
            <React.Fragment key={step.status}>
              <div className="flex min-w-[90px] flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition
                    ${
                      done
                        ? "border-green-600 bg-green-100 text-green-700"
                        : active
                        ? "border-red-600 bg-red-100 text-red-700"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                >
                  {done ? "✓" : step.icon}
                </div>
                <p
                  className={`mt-2 max-w-[90px] text-center text-xs ${
                    done
                      ? "text-green-700"
                      : active
                      ? "font-semibold text-red-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {i < PIPELINE.length - 1 && (
                <div
                  className={`h-[2px] min-w-[30px] flex-1 ${
                    done ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-700 shadow-sm">
        <strong>
          {currentStep.icon} {currentStep.label}:
        </strong>{" "}
        {currentStep.desc}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {currentStep.next && (
          <button
            className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${
              currentStep.next === "IN_PROGRESS"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={updating}
            onClick={advance}
          >
            {updating ? "Updating..." : currentStep.nextLabel}
          </button>
        )}

        {trip.status === "COMPLETED" && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700 shadow-sm">
            ✅ Trip completed! You can now accept new requests.
          </div>
        )}

        {trip.status !== "COMPLETED" && !confirmCancel && (
          <button
            className="rounded-full border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            onClick={() => setConfirmCancel(true)}
          >
            Cancel Trip
          </button>
        )}

        {confirmCancel && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>Are you sure you want to cancel this trip?</span>
            <button
              className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-70"
              disabled={updating}
              onClick={cancel}
            >
              Yes, Cancel
            </button>
            <button
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              onClick={() => setConfirmCancel(false)}
            >
              No
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        API: PUT /api/request/{"{id}"}/status
      </p>
    </div>
  );
}
































// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getDriverRequests, updateRequestStatus } from "../../Services/api";

// // The ordered status pipeline for a trip
// const PIPELINE = [
//   {
//     status: "ACCEPTED",
//     label: "Request Accepted",
//     desc: "You accepted the request. Head to the pickup location.",
//     icon: "✓",
//     next: "IN_PROGRESS",
//     nextLabel: "Passenger Picked Up",
//     btnClass: "btn-primary",
//   },
//   {
//     status: "IN_PROGRESS",
//     label: "Ride in Progress",
//     desc: "Passenger is on board. Drive safely to the destination.",
//     icon: "🗺️",
//     next: "COMPLETED",
//     nextLabel: "Mark as Completed",
//     btnClass: "btn-success",
//   },
//   {
//     status: "COMPLETED",
//     label: "Trip Completed",
//     desc: "Trip finished successfully. Well done!",
//     icon: "✅",
//     next: null,
//     nextLabel: null,
//     btnClass: "",
//   },
// ];

// const STATUS_ORDER = { ACCEPTED: 0, IN_PROGRESS: 1, COMPLETED: 2 };

// export default function UpdateStatus() {
//   const navigate = useNavigate();
//   const [trip, setTrip]         = useState(null);
//   const [loading, setLoading]   = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [cancelled, setCancelled] = useState(false);
//   const [confirmCancel, setConfirmCancel] = useState(false);

//   const fetchActive = () => {
//     setLoading(true);
//     getDriverRequests()
//       .then((res) => {
//         const active = res.data.find((r) =>
//           ["ACCEPTED", "IN_PROGRESS"].includes(r.status)
//         );
//         setTrip(active || null);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => { fetchActive(); }, []);

//   const advance = async () => {
//     if (!trip) return;
//     const step = PIPELINE[STATUS_ORDER[trip.status]];
//     if (!step?.next) return;
//     setUpdating(true);
//     try {
//       await updateRequestStatus(trip.id, step.next);
//       fetchActive();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const cancel = async () => {
//     if (!trip) return;
//     setUpdating(true);
//     try {
//       await updateRequestStatus(trip.id, "CANCELLED");
//       setCancelled(true);
//       setTrip(null);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setUpdating(false);
//       setConfirmCancel(false);
//     }
//   };

//   // ── Loading ──────────────────────────────────────────────
//   if (loading)
//     return <p style={{ color: "var(--text-muted)" }}>Loading active trip...</p>;

//   // ── Cancelled ────────────────────────────────────────────
//   if (cancelled)
//     return (
//       <div className="alert alert-red">
//         Trip cancelled.{" "}
//         <span
//           style={{ textDecoration: "underline", cursor: "pointer" }}
//           onClick={() => navigate("/driver/requests")}
//         >
//           Back to requests →
//         </span>
//       </div>
//     );

//   // ── No active trip ───────────────────────────────────────
//   if (!trip)
//     return (
//       <div className="alert alert-blue">
//         No active trip right now.{" "}
//         <span
//           style={{ textDecoration: "underline", cursor: "pointer" }}
//           onClick={() => navigate("/driver/requests")}
//         >
//           View incoming requests →
//         </span>
//       </div>
//     );

//   const currentStep = PIPELINE[STATUS_ORDER[trip.status]];

//   return (
//     <>
//       {/* ── Trip info cards ──────────────────────────────────── */}
//       <div className="grid-3" style={{ marginBottom: 16 }}>
//         <div className="card">
//           <div className="card-label">Request ID</div>
//           <div style={{ fontWeight: 500 }}>REQ-{trip.id}</div>
//         </div>
//         <div className="card">
//           <div className="card-label">Service Type</div>
//           <div style={{ fontWeight: 500 }}>
//             {{
//               AMBULANCE: "🚑 Ambulance",
//               ERICKSHAW: "🛺 E-Rickshaw",
//               INDENTA:   "🚌 Indenta",
//             }[trip.serviceType] || trip.serviceType}
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-label">Current Status</div>
//           <div style={{ fontWeight: 500, color: "var(--primary)" }}>
//             {trip.status}
//           </div>
//         </div>
//       </div>

//       {/* ── Passenger details ────────────────────────────────── */}
//       <div className="card" style={{ marginBottom: 16 }}>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//             gap: "10px 20px",
//           }}
//         >
//           <div>
//             <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 2 }}>
//               Passenger
//             </div>
//             <div style={{ fontWeight: 500 }}>{trip.requesterName}</div>
//             {trip.requesterPhone && (
//               <a
//                 href={`tel:${trip.requesterPhone}`}
//                 style={{ fontSize: 12, color: "var(--primary)" }}
//               >
//                 {trip.requesterPhone}
//               </a>
//             )}
//           </div>
//           <div>
//             <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 2 }}>
//               Pickup Location
//             </div>
//             <div style={{ fontWeight: 500 }}>{trip.pickupLocation}</div>
//           </div>
//           <div>
//             <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 2 }}>
//               Drop Location
//             </div>
//             <div style={{ fontWeight: 500 }}>{trip.dropLocation || "—"}</div>
//           </div>
//           {trip.description && (
//             <div style={{ gridColumn: "1 / -1" }}>
//               <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 2 }}>
//                 Notes
//               </div>
//               <div style={{ fontSize: 13 }}>{trip.description}</div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Visual pipeline ──────────────────────────────────── */}
//       <div className="section-title">Trip Progress</div>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 0,
//           marginBottom: 24,
//           flexWrap: "wrap",
//         }}
//       >
//         {PIPELINE.map((step, i) => {
//           const done = STATUS_ORDER[trip.status] > i;
//           const active = STATUS_ORDER[trip.status] === i;
//           return (
//             <React.Fragment key={step.status}>
//               {/* Step circle */}
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
//                 <div
//                   style={{
//                     width: 40,
//                     height: 40,
//                     borderRadius: "50%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: done ? 16 : 14,
//                     fontWeight: 500,
//                     border: `2px solid ${
//                       done
//                         ? "var(--success)"
//                         : active
//                         ? "var(--primary)"
//                         : "var(--border-strong)"
//                     }`,
//                     background: done
//                       ? "var(--success-light)"
//                       : active
//                       ? "var(--primary-light)"
//                       : "var(--bg)",
//                     color: done
//                       ? "var(--success)"
//                       : active
//                       ? "var(--primary)"
//                       : "var(--text-faint)",
//                     transition: "all .3s",
//                   }}
//                 >
//                   {done ? "✓" : step.icon}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 11,
//                     marginTop: 5,
//                     textAlign: "center",
//                     color: done
//                       ? "var(--success)"
//                       : active
//                       ? "var(--primary)"
//                       : "var(--text-faint)",
//                     fontWeight: active ? 500 : 400,
//                     maxWidth: 80,
//                   }}
//                 >
//                   {step.label}
//                 </div>
//               </div>

//               {/* Connector line */}
//               {i < PIPELINE.length - 1 && (
//                 <div
//                   style={{
//                     flex: 1,
//                     height: 2,
//                     minWidth: 20,
//                     background: done ? "var(--success)" : "var(--border-strong)",
//                     marginBottom: 20,
//                     transition: "background .3s",
//                   }}
//                 />
//               )}
//             </React.Fragment>
//           );
//         })}
//       </div>

//       {/* ── Current step description ─────────────────────────── */}
//       <div
//         className="alert alert-blue"
//         style={{ marginBottom: 16 }}
//       >
//         <strong>{currentStep.icon} {currentStep.label}:</strong>{" "}
//         {currentStep.desc}
//       </div>

//       {/* ── Action buttons ───────────────────────────────────── */}
//       <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
//         {currentStep.next && (
//           <button
//             className={`btn ${currentStep.btnClass}`}
//             disabled={updating}
//             onClick={advance}
//             style={{ minWidth: 180 }}
//           >
//             {updating ? "Updating..." : currentStep.nextLabel}
//           </button>
//         )}

//         {trip.status === "COMPLETED" && (
//           <div className="alert alert-green" style={{ margin: 0 }}>
//             ✅ Trip completed! You can now accept new requests.
//           </div>
//         )}

//         {trip.status !== "COMPLETED" && !confirmCancel && (
//           <button
//             className="btn btn-sm"
//             style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
//             onClick={() => setConfirmCancel(true)}
//           >
//             Cancel Trip
//           </button>
//         )}

//         {confirmCancel && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               background: "var(--danger-light)",
//               border: "0.5px solid var(--danger)",
//               borderRadius: "var(--radius)",
//               padding: "6px 12px",
//               fontSize: 13,
//             }}
//           >
//             <span style={{ color: "var(--danger)" }}>
//               Are you sure you want to cancel this trip?
//             </span>
//             <button
//               className="btn btn-danger btn-sm"
//               disabled={updating}
//               onClick={cancel}
//             >
//               Yes, Cancel
//             </button>
//             <button
//               className="btn btn-sm"
//               onClick={() => setConfirmCancel(false)}
//             >
//               No
//             </button>
//           </div>
//         )}
//       </div>

//       <p style={{ marginTop: 14, fontSize: 11, color: "var(--text-faint)" }}>
//         API: PUT /api/request/{"{id}"}/status — body: {"{ status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }"}
//       </p>
//     </>
//   );
// }
