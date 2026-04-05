import React, { useEffect, useState } from "react";
import {
  getDriverRequests,
  acceptRequest,
  declineRequest,
} from "../../Services/api";
import { useNavigate } from "react-router-dom";

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

export default function DriverRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    setLoading(true);

    getDriverRequests()
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);
      fetchRequests();
      navigate("/driver/active");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await declineRequest(id);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#efefef] px-4 py-8">
      <div className="mx-auto w-full max-w-7xl rounded-[28px] bg-white p-6 shadow-lg md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Driver Requests</h2>
          <p className="mt-1 text-sm text-gray-600">
            View and manage passenger transport requests.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="min-w-full border-collapse">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  ID
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  Passenger
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  From
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  To
                </th>
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
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No requests
                  </td>
                </tr>
              ) : (
                requests.map((r, index) => (
                  <tr
                    key={r.id}
                    className={`border-t border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-800">
                      REQ-{r.id}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-700">
                      {r.requesterName}
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
    </div>
  );
}