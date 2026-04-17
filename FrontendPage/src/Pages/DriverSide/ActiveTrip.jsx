import React, { useEffect, useState } from "react";
import { getDriverRequests, updateRequestStatus } from "../../services/api";

export default function ActiveTrip() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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
      console.error("Failed to fetch active trip:", err);
      setError(
        err.response?.data?.message || "Could not load active trip details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActive();
  }, []);

  const handleUpdateStatus = async (status) => {
    if (!trip) return;

    try {
      setUpdating(true);
      setError("");

      await updateRequestStatus(trip.id, status);
      await fetchActive();
    } catch (err) {
      console.error("Failed to update trip status:", err);
      setError(
        err.response?.data?.message || "Could not update trip status."
      );
    } finally {
      setUpdating(false);
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

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Active Trip</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage your current assigned trip
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {!trip ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-700 shadow-sm">
          No active trip right now. Accept a request from Incoming Requests.
        </div>
      ) : (
        <>
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700 shadow-sm">
            <span className="font-semibold">Active trip — REQ-{trip.id}</span>
          </div>

          <div className="mb-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
              <p className="text-sm font-medium text-gray-500">Passenger</p>
              <h2 className="mt-3 text-xl font-bold text-black">
                {trip.requesterName || trip.requester?.name || trip.patientName || "—"}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {trip.requesterRoll ||
                  trip.rollNumber ||
                  trip.requester?.rollNumber ||
                  "No roll number"}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
              <p className="text-sm font-medium text-gray-500">Pickup</p>
              <h2 className="mt-3 text-xl font-bold text-black">
                {trip.pickupLocation || "—"}
              </h2>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
              <p className="text-sm font-medium text-gray-500">Drop</p>
              <h2 className="mt-3 text-xl font-bold text-black">
                {trip.dropLocation || trip.destination || "—"}
              </h2>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-black">Update Status</h2>

            <div className="flex flex-wrap gap-3">
              {trip.status === "ACCEPTED" && (
                <button
                  className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={updating}
                  onClick={() => handleUpdateStatus("IN_PROGRESS")}
                >
                  {updating ? "Updating..." : "Passenger Picked Up"}
                </button>
              )}

              {trip.status === "IN_PROGRESS" && (
                <button
                  className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={updating}
                  onClick={() => handleUpdateStatus("COMPLETED")}
                >
                  {updating ? "Updating..." : "Mark Completed"}
                </button>
              )}

              <button
                className="rounded-full bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                disabled={updating}
                onClick={() => handleUpdateStatus("CANCELLED")}
              >
                {updating ? "Updating..." : "Cancel Trip"}
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              API: PUT /api/request/{"{id}"}/status
            </p>
          </div>
        </>
      )}
    </div>
  );
}


























// import React, { useEffect, useState } from "react";
// import { getDriverRequests, updateRequestStatus } from "../../Services/api";

// export default function ActiveTrip() {
//   const [trip, setTrip] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   const fetchActive = () => {
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

//   const updateStatus = async (status) => {
//     if (!trip) return;
//     setUpdating(true);
//     try {
//       await updateRequestStatus(trip.id, status);
//       fetchActive();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) return <p style={{ color: "var(--text-muted)" }}>Loading...</p>;

//   if (!trip)
//     return (
//       <div className="alert alert-blue">
//         No active trip right now. Accept a request from Incoming Requests.
//       </div>
//     );

//   return (
//     <>
//       <div className="alert alert-green">
//         Active trip — REQ-{trip.id}
//       </div>
//       <div className="grid-3" style={{ marginBottom: 16 }}>
//         <div className="card">
//           <div className="card-label">Passenger</div>
//           <div style={{ fontWeight: 500 }}>{trip.requesterName}</div>
//           <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{trip.requesterRoll}</div>
//         </div>
//         <div className="card">
//           <div className="card-label">Pickup</div>
//           <div style={{ fontWeight: 500 }}>{trip.pickupLocation}</div>
//         </div>
//         <div className="card">
//           <div className="card-label">Drop</div>
//           <div style={{ fontWeight: 500 }}>{trip.dropLocation || "—"}</div>
//         </div>
//       </div>

//       <div className="section-title">Update Status</div>
//       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//         {trip.status === "ACCEPTED" && (
//           <button
//             className="btn btn-primary"
//             disabled={updating}
//             onClick={() => updateStatus("IN_PROGRESS")}
//           >
//             Passenger Picked Up
//           </button>
//         )}
//         {trip.status === "IN_PROGRESS" && (
//           <button
//             className="btn btn-success"
//             disabled={updating}
//             onClick={() => updateStatus("COMPLETED")}
//           >
//             Mark Completed
//           </button>
//         )}
//         <button
//           className="btn btn-danger"
//           disabled={updating}
//           onClick={() => updateStatus("CANCELLED")}
//         >
//           Cancel Trip
//         </button>
//       </div>
//       <p style={{ marginTop: 12, fontSize: 11, color: "var(--text-faint)" }}>
//         API: PUT /api/request/{"{id}"}/status
//       </p>
//     </>
//   );
// }