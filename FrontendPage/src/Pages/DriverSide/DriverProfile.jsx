import React, { useMemo, useState } from "react";

export default function DriverProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Ravi Sharma",
    email: "driver@cuchd.in",
    role: "DRIVER",
  };

  const [form, setForm] = useState({
    name: storedUser.name || "Ravi Sharma",
    email: storedUser.email || "driver@cuchd.in",
    license: "DL-0420110012345",
    phone: "+91 98765 43210",
    availability: "ON_DUTY",
  });

  const [saved, setSaved] = useState(false);

  const initials = useMemo(() => {
    const parts = form.name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [form.name]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: form.name,
        email: form.email,
        role: "DRIVER",
      })
    );

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const availabilityBadge = {
    ON_DUTY: "bg-green-50 text-green-700 border border-green-200",
    OFF_DUTY: "bg-red-50 text-red-700 border border-red-200",
    ON_BREAK: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Driver Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your personal details and availability status
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
          {/* Top Banner */}
          <div className="bg-red-600 px-8 py-8 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white text-2xl font-bold text-red-600 shadow-md">
                {initials}
              </div>

              <div>
                <h2 className="text-2xl font-bold">{form.name}</h2>
                <p className="mt-1 text-sm text-red-100">Campus Driver</p>
                <div
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${availabilityBadge[form.availability]}`}
                >
                  {form.availability === "ON_DUTY" && "On Duty"}
                  {form.availability === "OFF_DUTY" && "Off Duty"}
                  {form.availability === "ON_BREAK" && "On Break"}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {saved && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                Profile updated successfully.
              </div>
            )}

            <form onSubmit={handleSave} className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  License Number
                </label>
                <input
                  type="text"
                  name="license"
                  value={form.license}
                  onChange={handleChange}
                  placeholder="Enter license number"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Availability Status
                </label>
                <select
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                >
                  <option value="ON_DUTY">On Duty</option>
                  <option value="OFF_DUTY">Off Duty</option>
                  <option value="ON_BREAK">On Break</option>
                </select>
              </div>

              {/* Info cards */}
              <div className="md:col-span-2 mt-2 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Driver ID
                  </p>
                  <p className="mt-2 text-sm font-semibold text-black">
                    DRV-1001
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Vehicle Assigned
                  </p>
                  <p className="mt-2 text-sm font-semibold text-black">
                    E-Rickshaw 07
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Shift Timing
                  </p>
                  <p className="mt-2 text-sm font-semibold text-black">
                    8:00 AM - 4:00 PM
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full rounded-full bg-red-600 py-3 text-white font-semibold shadow-md transition duration-200 hover:bg-red-700"
                >
                  Save Changes
                </button>
              </div>
            </form>

            <p className="mt-4 text-center text-xs text-gray-500">
              Dummy mode enabled — no backend connected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}