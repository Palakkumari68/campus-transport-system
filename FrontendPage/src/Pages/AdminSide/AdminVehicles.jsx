// src/pages/admin/AdminVehicles.jsx
import React, { useEffect, useState } from "react";
import { getAllVehicles, addVehicle, updateVehicle } from "../../Services/api";
import {
  Card, SectionTitle, StatCard, Badge, Table, TR, TD,
  RedButton, OutlineButton, GhostButton, Input, Select, Alert, PageWrapper,
} from "../../Components/AdminUI";

const VEHICLE_TYPES = ["AMBULANCE", "ERICKSHAW", "INDENTA", "OTHER"];
const VEHICLE_STATUS = ["AVAILABLE", "IN_TRIP", "ON_CALL", "PARKED", "MAINTENANCE"];

const TYPE_ICON = { AMBULANCE: "🚑", ERICKSHAW: "🛺", INDENTA: "🚌", OTHER: "🚗" };

const EMPTY_FORM = {
  vehicleType: "ERICKSHAW",
  registrationNo: "",
  capacity: "",
  driverName: "",
  status: "AVAILABLE",
};

function VehicleModal({ vehicle, onClose, onSaved }) {
  const isEdit = !!vehicle?.id;
  const [form, setForm] = useState(vehicle || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) await updateVehicle(vehicle.id, form);
      else        await addVehicle(form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save vehicle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">
            {isEdit ? "Edit Vehicle" : "Add New Vehicle"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && <Alert type="danger">{error}</Alert>}

          <Select label="Vehicle Type" name="vehicleType" value={form.vehicleType} onChange={handleChange}>
            {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>

          <Input label="Registration Number" name="registrationNo" placeholder="UP32 AB 1234" value={form.registrationNo} onChange={handleChange} required />

          <Input label="Capacity" name="capacity" placeholder="e.g. 4 persons / 50 seats" value={form.capacity} onChange={handleChange} />

          <Input label="Assigned Driver (optional)" name="driverName" placeholder="Driver name" value={form.driverName} onChange={handleChange} />

          <Select label="Current Status" name="status" value={form.status} onChange={handleChange}>
            {VEHICLE_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>

          <div className="flex gap-3 pt-2">
            <RedButton type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Vehicle"}
            </RedButton>
            <OutlineButton onClick={onClose} className="flex-1">Cancel</OutlineButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null); // null | "add" | vehicle object

  const fetchVehicles = () => {
    setLoading(true);
    getAllVehicles()
      .then((res) => setVehicles(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVehicles(); }, []);

  const countByStatus = (s) => vehicles.filter((v) => v.status === s).length;

  return (
    <PageWrapper>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🚗" label="Total Fleet"  value={vehicles.length} />
        <StatCard icon="✅" label="Available"    value={countByStatus("AVAILABLE")} />
        <StatCard icon="🔴" label="In Use"        value={countByStatus("IN_TRIP") + countByStatus("ON_CALL")} accent />
        <StatCard icon="🅿️" label="Parked"        value={countByStatus("PARKED")} />
      </div>

      {/* Vehicle cards grid */}
      <div>
        <SectionTitle action={
          <RedButton size="sm" onClick={() => setModal("add")}>+ Add Vehicle</RedButton>
        }>
          All Vehicles
        </SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-card h-36 animate-pulse" />
              ))
            : vehicles.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow p-5"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-cu-red-light rounded-xl flex items-center justify-center text-2xl">
                        {TYPE_ICON[v.vehicleType] || "🚗"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{v.registrationNo}</p>
                        <p className="text-xs text-gray-400">{v.vehicleType}</p>
                      </div>
                    </div>
                    <Badge status={v.status} />
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                    <div className="flex gap-2">
                      <span className="text-gray-300 w-16">Driver</span>
                      <span className="text-gray-700 font-medium">{v.driverName || "Unassigned"}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-300 w-16">Capacity</span>
                      <span className="text-gray-700">{v.capacity || "—"}</span>
                    </div>
                  </div>

                  <GhostButton onClick={() => setModal(v)} className="w-full justify-center">
                    Edit Details
                  </GhostButton>
                </div>
              ))}
        </div>
      </div>

      {/* Tabular view */}
      <Card padding={false}>
        <div className="px-6 pt-5 pb-0">
          <SectionTitle>Vehicle Table View</SectionTitle>
        </div>
        <Table
          heads={["Type", "Reg. No.", "Driver", "Capacity", "Status", "Action"]}
          loading={loading}
          empty="No vehicles in fleet"
        >
          {vehicles.map((v) => (
            <TR key={v.id}>
              <TD>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  {TYPE_ICON[v.vehicleType]} {v.vehicleType}
                </span>
              </TD>
              <TD className="font-mono text-sm">{v.registrationNo}</TD>
              <TD>{v.driverName || <span className="text-gray-300 italic text-xs">Unassigned</span>}</TD>
              <TD className="text-gray-500">{v.capacity || "—"}</TD>
              <TD><Badge status={v.status} /></TD>
              <TD>
                <GhostButton onClick={() => setModal(v)}>Edit</GhostButton>
              </TD>
            </TR>
          ))}
        </Table>
      </Card>

      {/* Modal */}
      {modal && (
        <VehicleModal
          vehicle={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={fetchVehicles}
        />
      )}
    </PageWrapper>
  );
}