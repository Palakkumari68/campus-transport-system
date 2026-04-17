import React, { useEffect, useState } from "react";
import { getAllDrivers, addDriver, updateDriverAPI } from "../../services/api";
import {
  Card,
  StatCard,
  Badge,
  Table,
  TR,
  TD,
  RedButton,
  OutlineButton,
  GhostButton,
  Input,
  Select,
  Alert,
  PageWrapper,
} from "../../Components/AdminUI";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  vehicleAssigned: "",
  availability: "OFF_DUTY",
};

const AVAIL_DOT = {
  ON_DUTY: "bg-green-500",
  OFF_DUTY: "bg-gray-300",
  ON_BREAK: "bg-amber-400",
};

function DriverModal({ driver, onClose, onSaved }) {
  const isEdit = !!driver?.id;
  const [form, setForm] = useState(driver || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(driver || EMPTY_FORM);
  }, [driver]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEdit) {
        const payload = {
          name: form.name,
          phone: form.phone,
          vehicleAssigned: form.vehicleAssigned,
          availability: form.availability,
        };

        await updateDriverAPI(driver.id, payload);
      } else {
        await addDriver(form);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Save driver failed:", err);
      setError(err.response?.data?.message || "Failed to save driver.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-base font-bold text-gray-800">
            {isEdit ? "Edit Driver" : "Add New Driver"}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-500 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {error && <Alert type="danger">{error}</Alert>}

          <Input
            label="Full Name"
            name="name"
            placeholder="Ravi Sharma"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            placeholder="driver@campus.edu"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isEdit}
          />

          <Input
            label="Phone"
            name="phone"
            placeholder="+91 XXXXX XXXXX"
            value={form.phone}
            onChange={handleChange}
          />

          <Input
            label="Vehicle Assigned"
            name="vehicleAssigned"
            placeholder="E-Rickshaw #04"
            value={form.vehicleAssigned}
            onChange={handleChange}
          />

          <Select
            label="Availability"
            name="availability"
            value={form.availability}
            onChange={handleChange}
          >
            <option value="ON_DUTY">On Duty</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="ON_BREAK">On Break</option>
          </Select>

          <div className="flex gap-3 pt-2">
            <RedButton type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Driver"}
            </RedButton>
            <OutlineButton type="button" onClick={onClose} className="flex-1">
              Cancel
            </OutlineButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function DriverCard({ driver, onEdit }) {
  const initials = (driver.name || "DR")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-cu-red text-sm font-bold text-white">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-800">
            {driver.name}
          </p>
          <p className="truncate text-xs text-gray-400">{driver.email}</p>
        </div>

        <div className="ml-auto flex flex-shrink-0 items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              AVAIL_DOT[driver.availability] || "bg-gray-300"
            }`}
          />
          <span className="text-xs text-gray-500">
            {driver.availability?.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="mb-4 space-y-1.5 text-xs text-gray-500">
        <div className="flex gap-2">
          <span className="w-16 text-gray-300">Vehicle</span>
          <span className="text-gray-700">
            {driver.vehicleAssigned || driver.vehicle_assigned || "Unassigned"}
          </span>
        </div>

        <div className="flex gap-2">
          <span className="w-16 text-gray-300">Phone</span>
          <span className="text-gray-700">{driver.phone || "—"}</span>
        </div>

        <div className="flex gap-2">
          <span className="w-16 text-gray-300">Trips</span>
          <span className="font-semibold text-gray-700">
            {driver.totalTrips ?? driver.total_trips ?? "—"}
          </span>
        </div>
      </div>

      <GhostButton
        onClick={() => onEdit(driver)}
        className="w-full justify-center"
      >
        Edit Profile
      </GhostButton>
    </div>
  );
}

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [view, setView] = useState("cards");
  const [filterAvail, setFilterAvail] = useState("ALL");
  const [error, setError] = useState("");

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllDrivers();
      setDrivers(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filtered =
    filterAvail === "ALL"
      ? drivers
      : drivers.filter((d) => d.availability === filterAvail);

  const onDuty = drivers.filter((d) => d.availability === "ON_DUTY").length;
  const offDuty = drivers.filter((d) => d.availability === "OFF_DUTY").length;
  const onBreak = drivers.filter((d) => d.availability === "ON_BREAK").length;

  return (
    <PageWrapper>
      <div className="space-y-6">
        {error && <Alert type="danger">{error}</Alert>}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon="👥" label="Total Drivers" value={drivers.length} />
          <StatCard icon="🟢" label="On Duty" value={onDuty} accent />
          <StatCard icon="🔴" label="Off Duty" value={offDuty} />
          <StatCard icon="🟡" label="On Break" value={onBreak} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {["ALL", "ON_DUTY", "OFF_DUTY", "ON_BREAK"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterAvail(f)}
              className={`rounded-pill px-4 py-1.5 text-xs font-semibold transition-all ${
                filterAvail === f
                  ? "bg-cu-red text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-500 hover:border-cu-red hover:text-cu-red"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-pill bg-gray-100 p-0.5">
              {["cards", "table"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`capitalize rounded-pill px-3 py-1 text-xs font-medium transition-all ${
                    view === v ? "bg-white text-cu-red shadow-sm" : "text-gray-500"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <RedButton size="sm" onClick={() => setModal("add")}>
              + Add Driver
            </RedButton>
          </div>
        </div>

        {view === "cards" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-44 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-card"
                  />
                ))
              : filtered.map((d) => (
                  <DriverCard key={d.id} driver={d} onEdit={(drv) => setModal(drv)} />
                ))}

            {!loading && filtered.length === 0 && (
              <p className="col-span-3 py-10 text-center text-gray-400">
                No drivers found.
              </p>
            )}
          </div>
        )}

        {view === "table" && (
          <Card padding={false}>
            <Table
              heads={[
                "Name",
                "Vehicle",
                "Phone",
                "Trips",
                "Availability",
                "Action",
              ]}
              loading={loading}
              empty="No drivers found"
            >
              {filtered.map((d) => (
                <TR key={d.id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-cu-red text-xs font-bold text-white">
                        {(d.name || "DR")
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{d.name}</p>
                        <p className="text-xs text-gray-400">{d.email}</p>
                      </div>
                    </div>
                  </TD>

                  <TD>
                    {d.vehicleAssigned || d.vehicle_assigned || (
                      <span className="text-xs italic text-gray-300">
                        Unassigned
                      </span>
                    )}
                  </TD>

                  <TD className="text-xs text-gray-500">{d.phone || "—"}</TD>

                  <TD className="font-semibold">
                    {d.totalTrips ?? d.total_trips ?? "—"}
                  </TD>

                  <TD>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          AVAIL_DOT[d.availability] || "bg-gray-300"
                        }`}
                      />
                      <Badge status={d.availability} />
                    </div>
                  </TD>

                  <TD>
                    <GhostButton onClick={() => setModal(d)}>Edit</GhostButton>
                  </TD>
                </TR>
              ))}
            </Table>
          </Card>
        )}

        {modal && (
          <DriverModal
            driver={modal === "add" ? null : modal}
            onClose={() => setModal(null)}
            onSaved={fetchDrivers}
          />
        )}
      </div>
    </PageWrapper>
  );
}













// // src/pages/admin/AdminDrivers.jsx
// import React, { useEffect, useState } from "react";
// import { getAllDrivers, addDriver } from "../../services/api";
// import {
//   Card, SectionTitle, StatCard, Badge, Table, TR, TD,
//   RedButton, OutlineButton, GhostButton, Input, Select, Alert, PageWrapper,
// } from "../../Components/AdminUI";

// const EMPTY_FORM = {
//   name: "",
//   email: "",
//   phone: "",
//   licenseNumber: "",
//   vehicleAssigned: "",
//   availability: "OFF_DUTY",
// };

// const AVAIL_DOT = {
//   ON_DUTY:  "bg-green-500",
//   OFF_DUTY: "bg-gray-300",
//   ON_BREAK: "bg-amber-400",
// };

// function DriverModal({ driver, onClose, onSaved }) {
//   const isEdit = !!driver?.id;
//   const [form, setForm] = useState(driver || EMPTY_FORM);
//   const [loading, setLoading] = useState(false);
//   const [error, setError]   = useState("");

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       // addDriver covers both create (no id) and edit (id present)
//       await addDriver(form);
//       onSaved();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save driver.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <h3 className="text-base font-bold text-gray-800">
//             {isEdit ? "Edit Driver" : "Add New Driver"}
//           </h3>
//           <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm">✕</button>
//         </div>

//         <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
//           {error && <Alert type="danger">{error}</Alert>}

//           <Input label="Full Name"       name="name"            placeholder="Ravi Sharma"           value={form.name}            onChange={handleChange} required />
//           <Input label="Email"           name="email"           placeholder="driver@campus.edu"      value={form.email}           onChange={handleChange} required />
//           <Input label="Phone"           name="phone"           placeholder="+91 XXXXX XXXXX"        value={form.phone}           onChange={handleChange} />
//           <Input label="License Number"  name="licenseNumber"   placeholder="DL-0420110012345"       value={form.licenseNumber}   onChange={handleChange} required />
//           <Input label="Vehicle Assigned" name="vehicleAssigned" placeholder="E-Rickshaw #04"        value={form.vehicleAssigned} onChange={handleChange} />

//           <Select label="Availability" name="availability" value={form.availability} onChange={handleChange}>
//             <option value="ON_DUTY">On Duty</option>
//             <option value="OFF_DUTY">Off Duty</option>
//             <option value="ON_BREAK">On Break</option>
//           </Select>

//           <div className="flex gap-3 pt-2">
//             <RedButton type="submit" disabled={loading} className="flex-1">
//               {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Driver"}
//             </RedButton>
//             <OutlineButton onClick={onClose} className="flex-1">Cancel</OutlineButton>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// function DriverCard({ driver, onEdit }) {
//   const initials = driver.name
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow p-5">
//       {/* Avatar + name */}
//       <div className="flex items-center gap-3 mb-4">
//         <div className="w-11 h-11 rounded-full bg-cu-red text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
//           {initials}
//         </div>
//         <div className="min-w-0">
//           <p className="font-bold text-gray-800 text-sm truncate">{driver.name}</p>
//           <p className="text-xs text-gray-400 truncate">{driver.email}</p>
//         </div>
//         {/* Availability dot */}
//         <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
//           <span className={`w-2 h-2 rounded-full ${AVAIL_DOT[driver.availability] || "bg-gray-300"}`} />
//           <span className="text-xs text-gray-500">{driver.availability?.replace("_", " ")}</span>
//         </div>
//       </div>

//       {/* Details */}
//       <div className="space-y-1.5 text-xs text-gray-500 mb-4">
//         <div className="flex gap-2">
//           <span className="text-gray-300 w-16">License</span>
//           <span className="font-mono text-gray-600">{driver.licenseNumber || "—"}</span>
//         </div>
//         <div className="flex gap-2">
//           <span className="text-gray-300 w-16">Vehicle</span>
//           <span className="text-gray-700">{driver.vehicleAssigned || "Unassigned"}</span>
//         </div>
//         <div className="flex gap-2">
//           <span className="text-gray-300 w-16">Phone</span>
//           <span className="text-gray-700">{driver.phone || "—"}</span>
//         </div>
//         <div className="flex gap-2">
//           <span className="text-gray-300 w-16">Trips</span>
//           <span className="font-semibold text-gray-700">{driver.totalTrips ?? "—"}</span>
//         </div>
//       </div>

//       <GhostButton onClick={() => onEdit(driver)} className="w-full justify-center">
//         Edit Profile
//       </GhostButton>
//     </div>
//   );
// }

// export default function AdminDrivers() {
//   const [drivers, setDrivers]   = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [modal, setModal]       = useState(null);
//   const [view, setView]         = useState("cards"); // "cards" | "table"
//   const [filterAvail, setFilterAvail] = useState("ALL");

//   const fetchDrivers = () => {
//     setLoading(true);
//     getAllDrivers()
//       .then((res) => setDrivers(res.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => { fetchDrivers(); }, []);

//   const filtered = filterAvail === "ALL"
//     ? drivers
//     : drivers.filter((d) => d.availability === filterAvail);

//   const onDuty   = drivers.filter((d) => d.availability === "ON_DUTY").length;
//   const offDuty  = drivers.filter((d) => d.availability === "OFF_DUTY").length;
//   const onBreak  = drivers.filter((d) => d.availability === "ON_BREAK").length;

//   return (
//     <PageWrapper>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard icon="👥" label="Total Drivers" value={drivers.length} />
//         <StatCard icon="🟢" label="On Duty"        value={onDuty}  accent />
//         <StatCard icon="🔴" label="Off Duty"        value={offDuty} />
//         <StatCard icon="🟡" label="On Break"        value={onBreak} />
//       </div>

//       {/* Toolbar */}
//       <div className="flex flex-wrap items-center gap-3">
//         {/* Availability filter */}
//         {["ALL", "ON_DUTY", "OFF_DUTY", "ON_BREAK"].map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilterAvail(f)}
//             className={`
//               px-4 py-1.5 rounded-pill text-xs font-semibold transition-all
//               ${filterAvail === f
//                 ? "bg-cu-red text-white shadow-sm"
//                 : "bg-white text-gray-500 border border-gray-200 hover:border-cu-red hover:text-cu-red"
//               }
//             `}
//           >
//             {f.replace("_", " ")}
//           </button>
//         ))}

//         <div className="ml-auto flex items-center gap-2">
//           {/* View toggle */}
//           <div className="flex bg-gray-100 rounded-pill p-0.5">
//             {["cards", "table"].map((v) => (
//               <button
//                 key={v}
//                 onClick={() => setView(v)}
//                 className={`px-3 py-1 rounded-pill text-xs font-medium transition-all capitalize
//                   ${view === v ? "bg-white text-cu-red shadow-sm" : "text-gray-500"}`}
//               >
//                 {v}
//               </button>
//             ))}
//           </div>
//           <RedButton size="sm" onClick={() => setModal("add")}>+ Add Driver</RedButton>
//         </div>
//       </div>

//       {/* Card view */}
//       {view === "cards" && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {loading
//             ? Array.from({ length: 3 }).map((_, i) => (
//                 <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-card h-44 animate-pulse" />
//               ))
//             : filtered.map((d) => (
//                 <DriverCard key={d.id} driver={d} onEdit={(drv) => setModal(drv)} />
//               ))}
//           {!loading && filtered.length === 0 && (
//             <p className="col-span-3 text-center text-gray-400 py-10">No drivers found.</p>
//           )}
//         </div>
//       )}

//       {/* Table view */}
//       {view === "table" && (
//         <Card padding={false}>
//           <Table
//             heads={["Name", "License", "Vehicle", "Phone", "Trips", "Availability", "Action"]}
//             loading={loading}
//             empty="No drivers found"
//           >
//             {filtered.map((d) => (
//               <TR key={d.id}>
//                 <TD>
//                   <div className="flex items-center gap-2">
//                     <div className="w-7 h-7 rounded-full bg-cu-red text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
//                       {d.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-800 text-sm">{d.name}</p>
//                       <p className="text-xs text-gray-400">{d.email}</p>
//                     </div>
//                   </div>
//                 </TD>
//                 <TD className="font-mono text-xs">{d.licenseNumber || "—"}</TD>
//                 <TD>{d.vehicleAssigned || <span className="text-gray-300 italic text-xs">Unassigned</span>}</TD>
//                 <TD className="text-gray-500 text-xs">{d.phone || "—"}</TD>
//                 <TD className="font-semibold">{d.totalTrips ?? "—"}</TD>
//                 <TD>
//                   <div className="flex items-center gap-1.5">
//                     <span className={`w-2 h-2 rounded-full ${AVAIL_DOT[d.availability] || "bg-gray-300"}`} />
//                     <Badge status={d.availability} />
//                   </div>
//                 </TD>
//                 <TD>
//                   <GhostButton onClick={() => setModal(d)}>Edit</GhostButton>
//                 </TD>
//               </TR>
//             ))}
//           </Table>
//         </Card>
//       )}

//       {/* Modal */}
//       {modal && (
//         <DriverModal
//           driver={modal === "add" ? null : modal}
//           onClose={() => setModal(null)}
//           onSaved={fetchDrivers}
//         />
//       )}
//     </PageWrapper>
//   );
// }