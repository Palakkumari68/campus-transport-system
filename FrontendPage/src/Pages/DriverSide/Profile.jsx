import React, { useState } from "react";
import {
  updateDriverProfile,
  updateDriverAvailability,
} from "../../Services/api";

export default function DriverProfile() {
  const [form, setForm] = useState({
    name: "Ravi Sharma",
    license: "DL-0420110012345",
    phone: "+91 98765 43210",
    availability: "ON_DUTY",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await updateDriverProfile(form);
      await updateDriverAvailability(form.availability);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#efefef] px-4 py-8">
      <div className="mx-auto w-full max-w-2xl rounded-[28px] bg-white p-8 shadow-lg md:p-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600 shadow-sm">
            RS
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">{form.name}</h2>
            <p className="text-sm text-gray-500">Driver</p>
          </div>
        </div>

        {saved && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            Profile updated successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
              placeholder="Enter full name"
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
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
              placeholder="Enter license number"
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
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
              placeholder="Enter phone number"
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

          <button
            type="submit"
            className="w-full rounded-full bg-red-600 py-3 text-white font-semibold shadow-md transition duration-200 hover:bg-red-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}