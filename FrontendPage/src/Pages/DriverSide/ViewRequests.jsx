// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getDriverRequests,
//   acceptRequest,
//   declineRequest,
// } from "../../Services/api";

// // How many seconds a pending request stays valid
// const EXPIRY_SECONDS = 60;

// function CountdownTimer({ createdAt, onExpire }) {
//   const getSecondsLeft = () => {
//     const elapsed = Math.floor(
//       (Date.now() - new Date(createdAt).getTime()) / 1000
//     );
//     return Math.max(0, EXPIRY_SECONDS - elapsed);
//   };

//   const [seconds, setSeconds] = useState(getSecondsLeft);

//   useEffect(() => {
//     if (seconds <= 0) {
//       onExpire();
//       return;
//     }
//     const t = setTimeout(() => setSeconds(getSecondsLeft()), 1000);
//     return () => clearTimeout(t);
//   });

//   const pct = Math.round((seconds / EXPIRY_SECONDS) * 100);
//   const color =
//     seconds > 30
//       ? "var(--success)"
//       : seconds > 10
//       ? "var(--warning)"
//       : "var(--danger)";

//   return (
//     <div style={{ minWidth: 80 }}>
//       <div style={{ fontSize: 12, fontWeight: 500, color, marginBottom: 3 }}>
//         {seconds}s left
//       </div>
//       <div className="progress-bar">
//         <div
//           className="progress-fill"
//           style={{ width: `${pct}%`, background: color }}
//         />
//       </div>
//     </div>
//   );
// }

// const SERVICE_ICON = {
//   AMBULANCE: "🚑",
//   ERICKSHAW: "🛺",
//   INDENTA:   "🚌",
// };

// export default function ViewRequests() {
//   const navigate = useNavigate();
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [filter, setFilter]     = useState("PENDING");
//   const [actionId, setActionId] = useState(null); // id being accepted/declined

//   const fetchRequests = () => {
//     setLoading(true);
//     getDriverRequests()
//       .then((res) => setRequests(res.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchRequests();
//     // Poll every 20 seconds for new requests
//     const interval = setInterval(fetchRequests, 20000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleAccept = async (id) => {
//     setActionId(id);
//     try {
//       await acceptRequest(id);
//       navigate("/driver/active");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setActionId(null);
//     }
//   };

//   const handleDecline = async (id) => {
//     setActionId(id);
//     try {
//       await declineRequest(id);
//       fetchRequests();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setActionId(null);
//     }
//   };

//   const filtered =
//     filter === "ALL"
//       ? requests
//       : requests.filter((r) => r.status === filter);

//   const pendingCount = requests.filter((r) => r.status === "PENDING").length;

//   return (
//     <>
//       {/* ── Header row ──────────────────────────────────────── */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 14,
//           flexWrap: "wrap",
//           gap: 8,
//         }}
//       >
//         <div>
//           {pendingCount > 0 ? (
//             <div className="alert alert-amber" style={{ margin: 0 }}>
//               ⚡ {pendingCount} request{pendingCount > 1 ? "s" : ""} waiting —
//               accept before timer expires
//             </div>
//           ) : (
//             <div className="alert alert-blue" style={{ margin: 0 }}>
//               No pending requests right now. Auto-refreshes every 20s.
//             </div>
//           )}
//         </div>
//         <button className="btn btn-sm" onClick={fetchRequests}>
//           ↻ Refresh
//         </button>
//       </div>

//       {/* ── Filter tabs ─────────────────────────────────────── */}
//       <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
//         {[
//           { label: "Pending",     value: "PENDING" },
//           { label: "Active",      value: "IN_PROGRESS" },
//           { label: "Completed",   value: "COMPLETED" },
//           { label: "All",         value: "ALL" },
//         ].map((f) => (
//           <button
//             key={f.value}
//             className={"btn btn-sm" + (filter === f.value ? " btn-primary" : "")}
//             onClick={() => setFilter(f.value)}
//           >
//             {f.label}
//             {f.value === "PENDING" && pendingCount > 0 && (
//               <span
//                 style={{
//                   marginLeft: 5,
//                   background: "var(--danger)",
//                   color: "#fff",
//                   borderRadius: 20,
//                   padding: "1px 6px",
//                   fontSize: 10,
//                 }}
//               >
//                 {pendingCount}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ── Pending requests — card view ─────────────────────── */}
//       {filter === "PENDING" && !loading && (
//         <>
//           {filtered.length === 0 ? (
//             <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
//               No pending requests.
//             </p>
//           ) : (
//             filtered.map((r) => (
//               <div key={r.id} className="req-card">
//                 <div className="req-card-header">
//                   <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                     <span style={{ fontSize: 20 }}>
//                       {SERVICE_ICON[r.serviceType] || "🚗"}
//                     </span>
//                     <div>
//                       <div
//                         style={{ fontSize: 11, color: "var(--text-faint)" }}
//                       >
//                         REQ-{r.id}
//                       </div>
//                       <div style={{ fontWeight: 500, fontSize: 14 }}>
//                         {r.serviceType}
//                       </div>
//                     </div>
//                   </div>
//                   <CountdownTimer
//                     createdAt={r.createdAt}
//                     onExpire={fetchRequests}
//                   />
//                 </div>

//                 {/* Request meta */}
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: "4px 16px",
//                     fontSize: 12,
//                     color: "var(--text-muted)",
//                     marginBottom: 12,
//                   }}
//                 >
//                   <div>
//                     <span style={{ color: "var(--text-faint)" }}>From: </span>
//                     {r.pickupLocation}
//                   </div>
//                   <div>
//                     <span style={{ color: "var(--text-faint)" }}>To: </span>
//                     {r.dropLocation || "—"}
//                   </div>
//                   <div>
//                     <span style={{ color: "var(--text-faint)" }}>
//                       Passenger:{" "}
//                     </span>
//                     {r.requesterName}
//                   </div>
//                   <div>
//                     <span style={{ color: "var(--text-faint)" }}>Time: </span>
//                     {new Date(r.createdAt).toLocaleTimeString()}
//                   </div>
//                 </div>

//                 {r.description && (
//                   <div
//                     style={{
//                       fontSize: 12,
//                       background: "var(--bg)",
//                       border: "0.5px solid var(--border)",
//                       borderRadius: "var(--radius)",
//                       padding: "6px 10px",
//                       marginBottom: 12,
//                       color: "var(--text-muted)",
//                     }}
//                   >
//                     📝 {r.description}
//                   </div>
//                 )}

//                 <div style={{ display: "flex", gap: 8 }}>
//                   <button
//                     className="btn btn-success"
//                     disabled={actionId === r.id}
//                     onClick={() => handleAccept(r.id)}
//                   >
//                     {actionId === r.id ? "Accepting..." : "✓ Accept"}
//                   </button>
//                   <button
//                     className="btn btn-sm"
//                     style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
//                     disabled={actionId === r.id}
//                     onClick={() => handleDecline(r.id)}
//                   >
//                     ✕ Decline
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </>
//       )}

//       {/* ── All other filters — table view ───────────────────── */}
//       {filter !== "PENDING" && (
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Type</th>
//                 <th>Passenger</th>
//                 <th>From</th>
//                 <th>To</th>
//                 <th>Time</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     style={{ textAlign: "center", color: "var(--text-muted)" }}
//                   >
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     style={{ textAlign: "center", color: "var(--text-muted)" }}
//                   >
//                     No requests
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((r) => (
//                   <tr key={r.id}>
//                     <td>REQ-{r.id}</td>
//                     <td>
//                       {SERVICE_ICON[r.serviceType]} {r.serviceType}
//                     </td>
//                     <td>{r.requesterName}</td>
//                     <td>{r.pickupLocation}</td>
//                     <td>{r.dropLocation || "—"}</td>
//                     <td>{new Date(r.createdAt).toLocaleTimeString()}</td>
//                     <td>
//                       {{
//                         PENDING:     <span className="badge badge-amber">Pending</span>,
//                         ACCEPTED:    <span className="badge badge-blue">Accepted</span>,
//                         IN_PROGRESS: <span className="badge badge-red">Active</span>,
//                         COMPLETED:   <span className="badge badge-green">Completed</span>,
//                         CANCELLED:   <span className="badge badge-gray">Cancelled</span>,
//                       }[r.status]}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <p style={{ fontSize: 11, color: "var(--text-faint)" }}>
//         API: GET /api/driver/requests &nbsp;|&nbsp; PUT
//         /api/driver/request/{"{id}"}/accept &nbsp;|&nbsp; PUT
//         /api/driver/request/{"{id}"}/decline
//       </p>
//     </>
//   );
// }












import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EXPIRY_SECONDS = 60;

const dummyRequests = [
  {
    id: 101,
    serviceType: "AMBULANCE",
    status: "PENDING",
    pickupLocation: "Hostel Block A",
    dropLocation: "Medical Room",
    requesterName: "Aman Verma",
    createdAt: new Date(Date.now() - 15000).toISOString(),
    description: "Student feeling dizzy",
  },
  {
    id: 102,
    serviceType: "ERICKSHAW",
    status: "IN_PROGRESS",
    pickupLocation: "Faculty Block",
    dropLocation: "Main Gate",
    requesterName: "Dr. Mehta",
    createdAt: new Date(Date.now() - 300000).toISOString(),
    description: "",
  },
  {
    id: 103,
    serviceType: "INDENTA",
    status: "COMPLETED",
    pickupLocation: "Library",
    dropLocation: "Boys Hostel",
    requesterName: "Riya Sharma",
    createdAt: new Date(Date.now() - 600000).toISOString(),
    description: "Regular campus drop",
  },
];

function CountdownTimer({ createdAt, onExpire }) {
  const getSecondsLeft = () => {
    const elapsed = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / 1000
    );
    return Math.max(0, EXPIRY_SECONDS - elapsed);
  };

  const [seconds, setSeconds] = useState(getSecondsLeft);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire();
      return;
    }
    const t = setTimeout(() => setSeconds(getSecondsLeft()), 1000);
    return () => clearTimeout(t);
  }, [seconds, createdAt, onExpire]);

  const pct = Math.round((seconds / EXPIRY_SECONDS) * 100);

  const barColor =
    seconds > 30
      ? "bg-green-500"
      : seconds > 10
      ? "bg-yellow-500"
      : "bg-red-500";

  const textColor =
    seconds > 30
      ? "text-green-600"
      : seconds > 10
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="min-w-[92px]">
      <div className={`mb-1 text-xs font-semibold ${textColor}`}>
        {seconds}s left
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const SERVICE_ICON = {
  AMBULANCE: "🚑",
  ERICKSHAW: "🛺",
  INDENTA: "🚌",
};

const getStatusBadge = (status) => {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  switch (status) {
    case "PENDING":
      return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
    case "ACCEPTED":
      return <span className={`${base} bg-blue-100 text-blue-700`}>Accepted</span>;
    case "IN_PROGRESS":
      return <span className={`${base} bg-red-100 text-red-700`}>Active</span>;
    case "COMPLETED":
      return <span className={`${base} bg-green-100 text-green-700`}>Completed</span>;
    case "CANCELLED":
      return <span className={`${base} bg-gray-200 text-gray-700`}>Cancelled</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-700`}>Unknown</span>;
  }
};

export default function ViewRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(dummyRequests);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("PENDING");
  const [actionId, setActionId] = useState(null);

  const fetchRequests = () => {
    setLoading(true);

    setTimeout(() => {
      setRequests((prev) =>
        prev.filter((r) => {
          if (r.status !== "PENDING") return true;

          const elapsed = Math.floor(
            (Date.now() - new Date(r.createdAt).getTime()) / 1000
          );
          return elapsed < EXPIRY_SECONDS;
        })
      );
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = (id) => {
    setActionId(id);

    setTimeout(() => {
      const acceptedReq = requests.find((r) => r.id === id);

      if (acceptedReq) {
        localStorage.setItem(
          "activeTrip",
          JSON.stringify({ ...acceptedReq, status: "IN_PROGRESS" })
        );
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "IN_PROGRESS" } : r
        )
      );

      setActionId(null);
      navigate("/driver/active-trip");
    }, 500);
  };

  const handleDecline = (id) => {
    setActionId(id);

    setTimeout(() => {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setActionId(null);
    }, 500);
  };

  const filtered =
    filter === "ALL"
      ? requests
      : requests.filter((r) => r.status === filter);

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">View Requests</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and respond to incoming transport requests
          </p>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[250px]">
            {pendingCount > 0 ? (
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-800">
                ⚡ {pendingCount} request{pendingCount > 1 ? "s" : ""} waiting —
                accept before timer expires
              </div>
            ) : (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                No pending requests right now. Auto-refreshes every 20s.
              </div>
            )}
          </div>

          <button
            onClick={fetchRequests}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {[
            { label: "Pending", value: "PENDING" },
            { label: "Active", value: "IN_PROGRESS" },
            { label: "Completed", value: "COMPLETED" },
            { label: "All", value: "ALL" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f.value
                  ? "bg-red-600 text-white shadow-md"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {f.label}
              {f.value === "PENDING" && pendingCount > 0 && (
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {filter === "PENDING" && !loading && (
          <>
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-md">
                No pending requests.
              </div>
            ) : (
              <div className="space-y-5">
                {filtered.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-3xl border border-gray-200 bg-white p-5 shadow-md"
                  >
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
                          {SERVICE_ICON[r.serviceType] || "🚗"}
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-gray-500">
                            REQ-{r.id}
                          </div>
                          <div className="text-base font-bold text-black">
                            {r.serviceType}
                          </div>
                        </div>
                      </div>

                      <CountdownTimer
                        createdAt={r.createdAt}
                        onExpire={fetchRequests}
                      />
                    </div>

                    <div className="mb-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                      <div>
                        <span className="font-semibold text-gray-500">From: </span>
                        {r.pickupLocation}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500">To: </span>
                        {r.dropLocation || "—"}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500">
                          Passenger:{" "}
                        </span>
                        {r.requesterName}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500">Time: </span>
                        {new Date(r.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                    {r.description && (
                      <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        📝 {r.description}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={actionId === r.id}
                        onClick={() => handleAccept(r.id)}
                        className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionId === r.id ? "Accepting..." : "✓ Accept"}
                      </button>

                      <button
                        disabled={actionId === r.id}
                        onClick={() => handleDecline(r.id)}
                        className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        ✕ Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {filter !== "PENDING" && (
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Passenger
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">From</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">To</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No requests
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r, index) => (
                      <tr
                        key={r.id}
                        className={`border-t border-gray-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-red-50/30`}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-black">
                          REQ-{r.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {SERVICE_ICON[r.serviceType]} {r.serviceType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {r.requesterName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {r.pickupLocation}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {r.dropLocation || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(r.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {getStatusBadge(r.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-gray-500">
          Dummy mode enabled — no backend/API connected
        </p>
      </div>
    </div>
  );
}
