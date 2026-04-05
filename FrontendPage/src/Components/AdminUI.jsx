import React from "react";

// ── Buttons ────────────────────────────────────────────────────────────────
export function RedButton({
  children,
  onClick,
  disabled,
  className = "",
  type = "button",
  size = "md",
}) {
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full bg-red-600 text-white font-semibold
        shadow-sm transition duration-200
        hover:bg-red-700 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  onClick,
  disabled,
  className = "",
  type = "button",
  size = "md",
}) {
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full border border-red-600 bg-white text-red-600 font-semibold
        transition duration-200 hover:bg-red-50 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = "",
  size = "sm",
  type = "button",
}) {
  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full bg-gray-100 text-gray-600 font-medium
        transition duration-200 hover:bg-red-50 hover:text-red-600
        ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, accent = false, sub }) {
  return (
    <div
      className={`
        rounded-3xl border bg-white p-6 shadow-sm
        transition duration-200 hover:shadow-md
        ${accent ? "border-red-200 ring-1 ring-red-200" : "border-gray-200"}
      `}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div
            className={`
              flex h-14 w-14 items-center justify-center rounded-2xl text-2xl
              ${accent ? "bg-red-600 text-white" : "bg-red-50 text-red-600"}
            `}
          >
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
            {label}
          </p>
          <p className={`text-3xl font-bold ${accent ? "text-red-600" : "text-gray-900"}`}>
            {value}
          </p>
          {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = "", padding = true }) {
  return (
    <div
      className={`
        overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm
        ${padding ? "p-6" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ── Section Title ───────────────────────────────────────────────────────────
export function SectionTitle({ children, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-xl font-bold text-gray-900">{children}</h2>
      {action}
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  AVAILABLE: "bg-green-100 text-green-700",
  ON_CALL: "bg-red-100 text-red-700",
  IN_TRIP: "bg-yellow-100 text-yellow-700",
  PARKED: "bg-gray-100 text-gray-600",
  ON_DUTY: "bg-green-100 text-green-700",
  OFF_DUTY: "bg-gray-100 text-gray-600",
  ON_BREAK: "bg-yellow-100 text-yellow-700",
  STUDENT: "bg-blue-100 text-blue-700",
  TEACHER: "bg-purple-100 text-purple-700",
  STAFF: "bg-indigo-100 text-indigo-700",
};

export function Badge({ status, label }) {
  const cls = BADGE_STYLES[status] || "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {label || status}
    </span>
  );
}

// ── Table ───────────────────────────────────────────────────────────────────
export function Table({ heads, children, loading, empty = "No records found" }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            {heads.map((h) => (
              <th
                key={h}
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={heads.length} className="px-6 py-10 text-center text-sm text-gray-500">
                Loading...
              </td>
            </tr>
          ) : React.Children.count(children) === 0 ? (
            <tr>
              <td colSpan={heads.length} className="px-6 py-10 text-center text-sm text-gray-500">
                {empty}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export function TR({ children, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`
        border-b border-gray-100 transition
        ${onClick ? "cursor-pointer hover:bg-red-50/60" : "hover:bg-gray-50/60"}
      `}
    >
      {children}
    </tr>
  );
}

export function TD({ children, className = "" }) {
  return <td className={`px-6 py-4 text-sm text-gray-700 align-middle ${className}`}>{children}</td>;
}

// ── Alert ───────────────────────────────────────────────────────────────────
export function Alert({ type = "info", children }) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    success: "border-green-200 bg-green-50 text-green-800",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    danger: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${styles[type]}`}>
      {children}
    </div>
  );
}

// ── Form Controls ───────────────────────────────────────────────────────────
export function Input({ label, className = "", ...props }) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full rounded-2xl border border-gray-300 bg-white px-4 py-3
          text-sm text-gray-800 outline-none transition
          placeholder:text-gray-400
          focus:border-red-500 focus:ring-2 focus:ring-red-200
          ${className}
        `}
      />
    </div>
  );
}

export function Select({ label, children, className = "", ...props }) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full rounded-2xl border border-gray-300 bg-white px-4 py-3
          text-sm text-gray-800 outline-none transition
          focus:border-red-500 focus:ring-2 focus:ring-red-200
          ${className}
        `}
      >
        {children}
      </select>
    </div>
  );
}

// ── Page Wrapper ────────────────────────────────────────────────────────────
export function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-[#efefef]">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}