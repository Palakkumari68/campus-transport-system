

import React, { useEffect, useState } from "react";
import { getAllRequests, updateRequestStatus } from "../../services/api";
import {
  Card,
  Badge,
  Table,
  TR,
  TD,
  RedButton,
  OutlineButton,
  GhostButton,
  Select,
  Alert,
  PageWrapper,
} from "../../Components/AdminUI";

const SERVICE_ICON = { AMBULANCE: "🚑", ERICKSHAW: "🛺", INDENTA: "🚌" };
const ALL_STATUSES = ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

function RequestDetailModal({ request, onClose, onStatusUpdate }) {
  const [newStatus, setNewStatus] = useState(request.status);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (newStatus === request.status) {
      onClose();
      return;
    }

    setUpdating(true);
    setError("");

    try {
      await updateRequestStatus(request.id, newStatus);
      onStatusUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update request status.");
    } finally {
      setUpdating(false);
    }
  };

  const createdAt = request.createdAt || request.created_at;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <p className="font-mono text-xs text-gray-400">REQ-{request.id}</p>
            <h3 className="text-base font-bold text-gray-800">
              {SERVICE_ICON[request.serviceType]} {request.serviceType} Request
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-500 transition-colors hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 px-6 py-4">
          {error && <Alert type="danger">{error}</Alert>}

          {[
            ["Requester", request.requesterName || request.requester?.name || "—"],
            ["Role", request.requesterRole || request.requester?.role || "—"],
            ["Pickup", request.pickupLocation || "—"],
            ["Drop", request.dropLocation || request.destination || "—"],
            ["Driver", request.driverName || request.driver?.name || "Not assigned"],
            ["Submitted", createdAt ? new Date(createdAt).toLocaleString() : "—"],
          ].map(([label, val]) => (
            <div key={label} className="flex items-start gap-3">
              <span className="w-24 flex-shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
              </span>
              <span className="text-sm text-gray-700">{val}</span>
            </div>
          ))}

          {request.description && (
            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
              📝 {request.description}
            </div>
          )}

          <div className="pt-2">
            <Select
              label="Update Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <RedButton onClick={handleUpdate} disabled={updating} className="flex-1">
            {updating ? "Saving..." : "Save Changes"}
          </RedButton>
          <OutlineButton onClick={onClose} className="flex-1">
            Cancel
          </OutlineButton>
        </div>
      </div>
    </div>
  );
}

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = requests.filter((r) => {
    const requesterName = r.requesterName || r.requester?.name || "";
    const matchType = filterType === "ALL" || r.serviceType === filterType;
    const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
    const matchSearch =
      !search ||
      requesterName.toLowerCase().includes(search.toLowerCase()) ||
      String(r.id).includes(search);

    return matchType && matchStatus && matchSearch;
  });

  const counts = {
    emergency: requests.filter(
      (r) => r.serviceType === "AMBULANCE" && r.status === "IN_PROGRESS"
    ).length,
    pending: requests.filter((r) => r.status === "PENDING").length,
  };

  return (
    <PageWrapper>
      <div className="space-y-4">
        {error && <Alert type="danger">{error}</Alert>}

        {counts.emergency > 0 && (
          <Alert type="danger">
            🚨 <strong>{counts.emergency} ambulance</strong> request
            {counts.emergency > 1 ? "s" : ""} active right now.
          </Alert>
        )}

        <div className="mb-2 flex flex-wrap gap-2">
          {[
            { label: "All", value: "ALL", count: requests.length },
            {
              label: "Pending",
              value: "PENDING",
              count: requests.filter((r) => r.status === "PENDING").length,
            },
            {
              label: "Active",
              value: "IN_PROGRESS",
              count: requests.filter((r) => r.status === "IN_PROGRESS").length,
            },
            {
              label: "Completed",
              value: "COMPLETED",
              count: requests.filter((r) => r.status === "COMPLETED").length,
            },
            {
              label: "Cancelled",
              value: "CANCELLED",
              count: requests.filter((r) => r.status === "CANCELLED").length,
            },
          ].map(({ label, value, count }) => (
            <button
              key={value}
              onClick={() => setFilterStatus(value)}
              className={`rounded-pill px-4 py-1.5 text-xs font-semibold transition-all ${
                filterStatus === value
                  ? "bg-cu-red text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-500 hover:border-cu-red hover:text-cu-red"
              }`}
            >
              {label}
              <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          ))}
        </div>

        <Card padding={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-6 py-4">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-48 flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-cu-red focus:outline-none focus:ring-2 focus:ring-cu-red/30"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cu-red/30"
            >
              <option value="ALL">All Types</option>
              <option value="AMBULANCE">Ambulance</option>
              <option value="ERICKSHAW">E-Rickshaw</option>
              <option value="INDENTA">Indenta</option>
            </select>
            <GhostButton onClick={fetchRequests}>↻ Refresh</GhostButton>
          </div>

          <Table
            heads={["ID", "Type", "Requester", "Role", "Pickup", "Date", "Status", "Action"]}
            loading={loading}
            empty="No requests match the current filters"
          >
            {filtered.map((r) => {
              const requesterName = r.requesterName || r.requester?.name || "—";
              const requesterRole = r.requesterRole || r.requester?.role || "—";
              const createdAt = r.createdAt || r.created_at;

              return (
                <TR key={r.id}>
                  <TD className="font-mono text-xs text-gray-400">REQ-{r.id}</TD>
                  <TD>
                    <span className="inline-flex items-center gap-1.5">
                      {SERVICE_ICON[r.serviceType]}
                      <span className="font-medium">{r.serviceType}</span>
                    </span>
                  </TD>
                  <TD className="font-medium text-gray-800">{requesterName}</TD>
                  <TD><Badge status={requesterRole} /></TD>
                  <TD className="max-w-32 truncate text-xs text-gray-500">
                    {r.pickupLocation || "—"}
                  </TD>
                  <TD className="whitespace-nowrap text-xs text-gray-400">
                    {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}{" "}
                    <span className="text-gray-300">
                      {createdAt
                        ? new Date(createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </TD>
                  <TD><Badge status={r.status} /></TD>
                  <TD>
                    <GhostButton onClick={() => setSelected(r)}>View</GhostButton>
                  </TD>
                </TR>
              );
            })}
          </Table>

          <div className="border-t border-gray-100 px-6 py-3 text-xs text-gray-400">
            Showing {filtered.length} of {requests.length} requests
          </div>
        </Card>

        {selected && (
          <RequestDetailModal
            request={selected}
            onClose={() => setSelected(null)}
            onStatusUpdate={fetchRequests}
          />
        )}
      </div>
    </PageWrapper>
  );
}




























// import React, { useEffect, useState } from "react";
// import { getAllRequests, updateRequestStatus } from "../../services/api";
// import {
//   Card, SectionTitle, Badge, Table, TR, TD,
//   RedButton, OutlineButton, GhostButton, Select, Alert, PageWrapper,
// } from "../../Components/AdminUI";

// const SERVICE_ICON = { AMBULANCE: "🚑", ERICKSHAW: "🛺", INDENTA: "🚌" };
// const ALL_STATUSES = ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

// function RequestDetailModal({ request, onClose, onStatusUpdate }) {
//   const [newStatus, setNewStatus] = useState(request.status);
//   const [updating, setUpdating] = useState(false);

//   const handleUpdate = async () => {
//     if (newStatus === request.status) return onClose();
//     setUpdating(true);
//     try {
//       await updateRequestStatus(request.id, newStatus);
//       onStatusUpdate();
//       onClose();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div>
//             <p className="text-xs text-gray-400 font-mono">REQ-{request.id}</p>
//             <h3 className="text-base font-bold text-gray-800">
//               {SERVICE_ICON[request.serviceType]} {request.serviceType} Request
//             </h3>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-4 space-y-3">
//           {[
//             ["Requester",     request.requesterName],
//             ["Role",          request.requesterRole],
//             ["Pickup",        request.pickupLocation],
//             ["Drop",          request.dropLocation || "—"],
//             ["Driver",        request.driverName || "Not assigned"],
//             ["Submitted",     new Date(request.createdAt).toLocaleString()],
//           ].map(([label, val]) => (
//             <div key={label} className="flex items-start gap-3">
//               <span className="text-xs font-semibold text-gray-400 w-24 flex-shrink-0 pt-0.5 uppercase tracking-wide">
//                 {label}
//               </span>
//               <span className="text-sm text-gray-700">{val}</span>
//             </div>
//           ))}

//           {request.description && (
//             <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
//               📝 {request.description}
//             </div>
//           )}

//           {/* Status update */}
//           <div className="pt-2">
//             <Select
//               label="Update Status"
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//             >
//               {ALL_STATUSES.map((s) => (
//                 <option key={s} value={s}>{s}</option>
//               ))}
//             </Select>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
//           <RedButton onClick={handleUpdate} disabled={updating} className="flex-1">
//             {updating ? "Saving..." : "Save Changes"}
//           </RedButton>
//           <OutlineButton onClick={onClose} className="flex-1">Cancel</OutlineButton>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function AdminRequests() {
//   const [requests, setRequests]     = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [filterType, setFilterType] = useState("ALL");
//   const [filterStatus, setFilterStatus] = useState("ALL");
//   const [search, setSearch]         = useState("");
//   const [selected, setSelected]     = useState(null);

//   const fetchRequests = () => {
//     setLoading(true);
//     getAllRequests()
//       .then((res) => setRequests(res.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => { fetchRequests(); }, []);

//   const filtered = requests.filter((r) => {
//     const matchType   = filterType === "ALL"   || r.serviceType === filterType;
//     const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
//     const matchSearch = !search || r.requesterName?.toLowerCase().includes(search.toLowerCase())
//       || String(r.id).includes(search);
//     return matchType && matchStatus && matchSearch;
//   });

//   const counts = {
//     emergency: requests.filter((r) => r.serviceType === "AMBULANCE" && r.status === "IN_PROGRESS").length,
//     pending:   requests.filter((r) => r.status === "PENDING").length,
//   };

//   return (
//     <PageWrapper>
//       {counts.emergency > 0 && (
//         <Alert type="danger">
//           🚨 <strong>{counts.emergency} ambulance</strong> request{counts.emergency > 1 ? "s" : ""} active right now.
//         </Alert>
//       )}

//       {/* Quick count chips */}
//       <div className="flex flex-wrap gap-2 mb-2">
//         {[
//           { label: "All",        value: "ALL",        count: requests.length },
//           { label: "Pending",    value: "PENDING",    count: requests.filter(r=>r.status==="PENDING").length },
//           { label: "Active",     value: "IN_PROGRESS",count: requests.filter(r=>r.status==="IN_PROGRESS").length },
//           { label: "Completed",  value: "COMPLETED",  count: requests.filter(r=>r.status==="COMPLETED").length },
//           { label: "Cancelled",  value: "CANCELLED",  count: requests.filter(r=>r.status==="CANCELLED").length },
//         ].map(({ label, value, count }) => (
//           <button
//             key={value}
//             onClick={() => setFilterStatus(value)}
//             className={`
//               px-4 py-1.5 rounded-pill text-xs font-semibold transition-all
//               ${filterStatus === value
//                 ? "bg-cu-red text-white shadow-sm"
//                 : "bg-white text-gray-500 border border-gray-200 hover:border-cu-red hover:text-cu-red"
//               }
//             `}
//           >
//             {label}
//             <span className="ml-1.5 opacity-70">({count})</span>
//           </button>
//         ))}
//       </div>

//       <Card padding={false}>
//         {/* Filters row */}
//         <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-gray-100">
//           <input
//             type="text"
//             placeholder="Search by name or ID..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="flex-1 min-w-48 px-4 py-2 border border-gray-200 rounded-xl text-sm
//               focus:outline-none focus:ring-2 focus:ring-cu-red/30 focus:border-cu-red"
//           />
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700
//               focus:outline-none focus:ring-2 focus:ring-cu-red/30"
//           >
//             <option value="ALL">All Types</option>
//             <option value="AMBULANCE">Ambulance</option>
//             <option value="ERICKSHAW">E-Rickshaw</option>
//             <option value="INDENTA">Indenta</option>
//           </select>
//           <GhostButton onClick={fetchRequests}>↻ Refresh</GhostButton>
//         </div>

//         {/* Table */}
//         <Table
//           heads={["ID", "Type", "Requester", "Role", "Pickup", "Date", "Status", "Action"]}
//           loading={loading}
//           empty="No requests match the current filters"
//         >
//           {filtered.map((r) => (
//             <TR key={r.id}>
//               <TD className="font-mono text-xs text-gray-400">REQ-{r.id}</TD>
//               <TD>
//                 <span className="inline-flex items-center gap-1.5">
//                   {SERVICE_ICON[r.serviceType]}
//                   <span className="font-medium">{r.serviceType}</span>
//                 </span>
//               </TD>
//               <TD className="font-medium text-gray-800">{r.requesterName}</TD>
//               <TD><Badge status={r.requesterRole} /></TD>
//               <TD className="text-gray-500 text-xs max-w-32 truncate">{r.pickupLocation}</TD>
//               <TD className="text-gray-400 text-xs whitespace-nowrap">
//                 {new Date(r.createdAt).toLocaleDateString()}{" "}
//                 <span className="text-gray-300">{new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
//               </TD>
//               <TD><Badge status={r.status} /></TD>
//               <TD>
//                 <GhostButton onClick={() => setSelected(r)}>View</GhostButton>
//               </TD>
//             </TR>
//           ))}
//         </Table>

//         {/* Footer count */}
//         <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
//           Showing {filtered.length} of {requests.length} requests
//         </div>
//       </Card>

//       {/* Detail modal */}
//       {selected && (
//         <RequestDetailModal
//           request={selected}
//           onClose={() => setSelected(null)}
//           onStatusUpdate={fetchRequests}
//         />
//       )}
//     </PageWrapper>
//   );
// }