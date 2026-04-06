import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const dummyRequests = [
  {
    id: 101,
    requesterName: "Aman Verma",
    pickupLocation: "Hostel Block A",
    dropLocation: "Medical Room",
    status: "PENDING",
    updatedAt: new Date().toISOString(),
  },
  {
    id: 102,
    requesterName: "Dr. Mehta",
    pickupLocation: "Faculty Block",
    dropLocation: "Main Gate",
    status: "IN_PROGRESS",
    updatedAt: new Date().toISOString(),
  },
  {
    id: 103,
    requesterName: "Riya Sharma",
    pickupLocation: "Library",
    dropLocation: "Girls Hostel",
    status: "COMPLETED",
    updatedAt: new Date().toISOString(),
  },
  {
    id: 104,
    requesterName: "Sarthak",
    pickupLocation: "Block C",
    dropLocation: "Parking Area",
    status: "COMPLETED",
    updatedAt: new Date().toISOString(),
  },
];

export default function DriverDashboard() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Driver",
    role: "DRIVER",
  };

  const [availability, setAvailability] = useState("ON_DUTY");
  const [requests] = useState(dummyRequests);

  const pending = useMemo(
    () => requests.filter((r) => r.status === "PENDING"),
    [requests]
  );

  const activeTrip = useMemo(
    () => requests.find((r) => ["ACCEPTED", "IN_PROGRESS"].includes(r.status)),
    [requests]
  );

  const completedToday = useMemo(() => {
    return requests.filter((r) => {
      if (r.status !== "COMPLETED") return false;

      const d = new Date(r.updatedAt);
      const now = new Date();

      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
  }, [requests]);

  const totalCompleted = useMemo(
    () => requests.filter((r) => r.status === "COMPLETED").length,
    [requests]
  );

  const availabilityStyle = {
    ON_DUTY:
      "bg-green-50 text-green-700 border border-green-300",
    OFF_DUTY:
      "bg-red-50 text-red-700 border border-red-300",
    ON_BREAK:
      "bg-yellow-50 text-yellow-700 border border-yellow-300",
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Welcome, {storedUser?.name || "Driver"} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here&apos;s your shift overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold outline-none ${availabilityStyle[availability]}`}
          >
            <option value="ON_DUTY">On Duty</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="ON_BREAK">On Break</option>
          </select>
        </div>
      </div>

      {/* Alerts */}
      {activeTrip && (
        <div
          onClick={() => navigate("/driver/active-trip")}
          className="mb-4 cursor-pointer rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm transition hover:shadow-md"
        >
          <span className="font-semibold">
            Active trip in progress — REQ-{activeTrip.id}
          </span>
          <span className="ml-2 underline">View →</span>
        </div>
      )}

      {!activeTrip && pending.length > 0 && (
        <div
          onClick={() => navigate("/driver/requests")}
          className="mb-4 cursor-pointer rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-yellow-800 shadow-sm transition hover:shadow-md"
        >
          <span className="font-semibold">
            {pending.length} new request{pending.length > 1 ? "s" : ""} waiting
            for your response
          </span>
          <span className="ml-2 underline">View →</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500">Pending Requests</p>
          <h2 className="mt-3 text-4xl font-bold text-red-600">
            {pending.length}
          </h2>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500">Trips Today</p>
          <h2 className="mt-3 text-4xl font-bold text-black">
            {completedToday.length}
          </h2>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-gray-500">Total Trips</p>
          <h2 className="mt-3 text-4xl font-bold text-black">
            {totalCompleted}
          </h2>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="mb-4 text-2xl font-bold text-black">Quick Actions</h2>

      <div className="mb-8 grid gap-5 md:grid-cols-2">
        <div
          onClick={() => navigate("/driver/requests")}
          className="cursor-pointer rounded-3xl border border-gray-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
            📋
          </div>
          <h3 className="text-xl font-semibold text-black">
            Incoming Requests
          </h3>
          <p className="mt-2 text-gray-600">{pending.length} pending</p>
          <button className="mt-5 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">
            View Requests
          </button>
        </div>

        <div
          onClick={() => navigate("/driver/active-trip")}
          className="cursor-pointer rounded-3xl border border-gray-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
            🗺️
          </div>
          <h3 className="text-xl font-semibold text-black">Active Trip</h3>
          <p className="mt-2 text-gray-600">
            {activeTrip ? `REQ-${activeTrip.id} in progress` : "No active trip"}
          </p>
          <button className="mt-5 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">
            View Trip
          </button>
        </div>
      </div>

      {/* Recent trips */}
      <h2 className="mb-4 text-2xl font-bold text-black">Recent Trips</h2>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Passenger
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  From
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">To</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No trips yet
                  </td>
                </tr>
              ) : (
                requests.slice(0, 8).map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-black">
                      REQ-{r.id}
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
                    <td className="px-6 py-4 text-sm">
                      {r.status === "PENDING" && (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          Pending
                        </span>
                      )}
                      {r.status === "ACCEPTED" && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          Accepted
                        </span>
                      )}
                      {r.status === "IN_PROGRESS" && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Active
                        </span>
                      )}
                      {r.status === "COMPLETED" && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Completed
                        </span>
                      )}
                      {r.status === "CANCELLED" && (
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Dummy mode enabled — no backend connected
      </p>
    </div>
  );
}