import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllRequests,
  getAllVehicles,
  getAllDrivers,
} from "../../services/api";
import {
  StatCard,
  Card,
  SectionTitle,
  Badge,
  Table,
  TR,
  TD,
  Alert,
  PageWrapper,
} from "../../Components/AdminUI";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllRequests(), getAllVehicles(), getAllDrivers()])
      .then(([r, v, d]) => {
        setRequests(r.data || []);
        setVehicles(v.data || []);
        setDrivers(d.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();

  const todayReqs = requests.filter(
    (r) => new Date(r.createdAt).toDateString() === today
  );

  const active = requests.filter((r) =>
    ["ACCEPTED", "IN_PROGRESS"].includes(r.status)
  );

  const emergency = active.filter((r) => r.serviceType === "AMBULANCE");

  const onlineDrivers = drivers.filter((d) => d.availability === "ON_DUTY");

  const serviceTypes = [
    {
      type: "AMBULANCE",
      label: "Ambulance",
      icon: "🚑",
      barClass: "bg-red-600",
    },
    {
      type: "ERICKSHAW",
      label: "E-Rickshaw",
      icon: "🛺",
      barClass: "bg-amber-500",
    },
    {
      type: "INDENTA",
      label: "Indenta Bus",
      icon: "🚌",
      barClass: "bg-blue-500",
    },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            Monitor campus transport, emergency requests, vehicles, and drivers
            in one place.
          </p>
        </div>

        {emergency.length > 0 && (
          <Alert type="danger">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                🚨 <strong>{emergency.length} active ambulance</strong>{" "}
                request{emergency.length > 1 ? "s" : ""} on campus right now.
              </div>
              <button
                onClick={() => navigate("/admin/requests")}
                className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                View Requests
              </button>
            </div>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon="📋"
            label="Requests Today"
            value={loading ? "—" : todayReqs.length}
            sub="All service types"
          />

          <StatCard
            icon="⚡"
            label="Active Now"
            value={loading ? "—" : active.length}
            accent
            sub="Needs monitoring"
          />

          <StatCard
            icon="🚗"
            label="Vehicles"
            value={loading ? "—" : vehicles.length}
            sub="In fleet"
          />

          <StatCard
            icon="👥"
            label="Drivers On Duty"
            value={loading ? "—" : onlineDrivers.length}
            sub={loading ? "Loading..." : `of ${drivers.length} total`}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card padding={false} className="overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-5">
              <SectionTitle
                action={
                  <button
                    onClick={() => navigate("/admin/requests")}
                    className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                  >
                    View all →
                  </button>
                }
              >
                Active Requests
              </SectionTitle>
            </div>

            <Table
              heads={["ID", "Type", "Requester", "Status"]}
              loading={loading}
              empty="No active requests"
            >
              {active.slice(0, 6).map((r) => (
                <TR key={r.id} onClick={() => navigate("/admin/requests")}>
                  <TD className="font-mono text-xs text-gray-500">
                    REQ-{r.id}
                  </TD>

                  <TD>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {{
                          AMBULANCE: "🚑",
                          ERICKSHAW: "🛺",
                          INDENTA: "🚌",
                        }[r.serviceType] || "🚗"}
                      </span>
                      <span className="font-medium text-gray-800">
                        {r.serviceType}
                      </span>
                    </div>
                  </TD>

                  <TD>{r.requesterName}</TD>

                  <TD>
                    <Badge status={r.status} />
                  </TD>
                </TR>
              ))}
            </Table>
          </Card>

          <Card padding={false} className="overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-5">
              <SectionTitle
                action={
                  <button
                    onClick={() => navigate("/admin/vehicles")}
                    className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                  >
                    Manage →
                  </button>
                }
              >
                Vehicle Status
              </SectionTitle>
            </div>

            <Table
              heads={["Vehicle", "Driver", "Status"]}
              loading={loading}
              empty="No vehicles"
            >
              {vehicles.slice(0, 6).map((v) => (
                <TR key={v.id}>
                  <TD>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">
                        {v.registrationNo}
                      </p>
                      <p className="text-xs text-gray-500">{v.vehicleType}</p>
                    </div>
                  </TD>

                  <TD>
                    {v.driverName ? (
                      <span className="text-gray-700">{v.driverName}</span>
                    ) : (
                      <span className="italic text-gray-400">Unassigned</span>
                    )}
                  </TD>

                  <TD>
                    <Badge status={v.status} />
                  </TD>
                </TR>
              ))}
            </Table>
          </Card>
        </div>

        <Card>
          <SectionTitle>Today&apos;s Requests by Service Type</SectionTitle>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceTypes.map(({ type, label, icon, barClass }) => {
              const count = todayReqs.filter((r) => r.serviceType === type).length;
              const pct =
                todayReqs.length > 0
                  ? Math.round((count / todayReqs.length) * 100)
                  : 0;

              return (
                <div
                  key={type}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                      {icon}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{label}</p>
                      <p className="text-sm text-gray-500">{count} requests</p>
                    </div>

                    <div className="ml-auto text-right">
                      <p className="text-2xl font-bold text-gray-900">{pct}%</p>
                    </div>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}