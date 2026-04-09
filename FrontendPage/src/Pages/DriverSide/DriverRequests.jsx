import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const dummyRequests = [
  {
    id: 201,
    requesterName: "Aman Verma",
    pickupLocation: "Hostel Block A",
    dropLocation: "Medical Room",
    createdAt: new Date().toISOString(),
    status: "PENDING",
    serviceType: "AMBULANCE",
  },
  {
    id: 202,
    requesterName: "Dr. Mehta",
    pickupLocation: "Faculty Block",
    dropLocation: "Main Gate",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: "PENDING",
    serviceType: "ERICKSHAW",
  },
  {
    id: 203,
    requesterName: "Riya Sharma",
    pickupLocation: "Library",
    dropLocation: "Girls Hostel",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: "IN_PROGRESS",
    serviceType: "INDENTA",
  },
  {
    id: 204,
    requesterName: "Sarthak",
    pickupLocation: "Block C",
    dropLocation: "Parking Area",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    status: "COMPLETED",
    serviceType: "ERICKSHAW",
  },
];

const getStatusBadge = (status) => {
  const baseClass =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  switch (status) {
    case "PENDING":
      return (
        <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>
          Pending
        </span>
      );
    case "ACCEPTED":
      return (
        <span className={`${baseClass} bg-blue-100 text-blue-700`}>
          Accepted
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className={`${baseClass} bg-red-100 text-red-700`}>
          Active
        </span>
      );
    case "COMPLETED":
      return (
        <span className={`${baseClass} bg-green-100 text-green-700`}>
          Completed
        </span>
      );
    case "CANCELLED":
      return (
        <span className={`${baseClass} bg-gray-100 text-gray-700`}>
          Cancelled
        </span>
      );
    default:
      return (
        <span className={`${baseClass} bg-gray-100 text-gray-700`}>
          Unknown
        </span>
      );
  }
};

const getServiceBadge = (type) => {
  const baseClass =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  switch (type) {
    case "AMBULANCE":
      return (
        <span className={`${baseClass} bg-red-100 text-red-700`}>
          🚑 Ambulance
        </span>
      );
    case "ERICKSHAW":
      return (
        <span className={`${baseClass} bg-blue-100 text-blue-700`}>
          🛺 E-Rickshaw
        </span>
      );
    case "INDENTA":
      return (
        <span className={`${baseClass} bg-purple-100 text-purple-700`}>
          🚌 Indenta
        </span>
      );
    default:
      return (
        <span className={`${baseClass} bg-gray-100 text-gray-700`}>
          Service
        </span>
      );
  }
};

export default function DriverRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(dummyRequests);
  const [filter, setFilter] = useState("ALL");

  const handleAccept = (id) => {
    const acceptedRequest = requests.find((r) => r.id === id);

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "IN_PROGRESS" } : r
      )
    );

    if (acceptedRequest) {
      localStorage.setItem(
        "activeTrip",
        JSON.stringify({
          ...acceptedRequest,
          status: "IN_PROGRESS",
        })
      );
    }

    navigate("/driver/active-trip");
  };

  const handleDecline = (id) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "CANCELLED" } : r
      )
    );
  };

  const filteredRequests = useMemo(() => {
    if (filter === "ALL") return requests;
    return requests.filter((r) => r.status === filter);
  }, [filter, requests]);

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const activeCount = requests.filter((r) => r.status === "IN_PROGRESS").length;
  const completedCount = requests.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Driver Requests</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage passenger transport requests
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-md">
            <p className="text-sm font-medium text-gray-500">Pending Requests</p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {pendingCount}
            </h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-md">
            <p className="text-sm font-medium text-gray-500">Active Trips</p>
            <h2 className="mt-2 text-3xl font-bold text-black">{activeCount}</h2>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-md">
            <p className="text-sm font-medium text-gray-500">Completed Trips</p>
            <h2 className="mt-2 text-3xl font-bold text-black">
              {completedCount}
            </h2>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-3">
          {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === status
                    ? "bg-red-600 text-white shadow-md"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {status === "ALL" ? "All" : status.replace("_", " ")}
              </button>
            )
          )}
        </div>

        {/* Requests Table */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Passenger
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Service
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    From
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">To</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Time
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((r, index) => (
                    <tr
                      key={r.id}
                      className={`border-t border-gray-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-red-50/30`}
                    >
                      <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                        REQ-{r.id}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {r.requesterName}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {getServiceBadge(r.serviceType)}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {r.pickupLocation}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {r.dropLocation || "—"}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700">
                        {new Date(r.createdAt).toLocaleTimeString()}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {getStatusBadge(r.status)}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {r.status === "PENDING" ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleAccept(r.id)}
                              className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
                            >
                              Accept
                            </button>

                            <button
                              onClick={() => handleDecline(r.id)}
                              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          Dummy mode enabled — no backend connected
        </p>
      </div>
    </div>
  );
}