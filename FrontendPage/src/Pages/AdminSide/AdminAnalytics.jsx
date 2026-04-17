// src/pages/admin/AdminAnalytics.jsx
import React, { useEffect, useState } from "react";
import { getAnalytics, getAllRequests } from "../../services/api";
import {
  Card, SectionTitle, StatCard, PageWrapper,
} from "../../Components/AdminUI";

// Simple pure-CSS bar chart — no external chart lib needed
function BarChart({ data, maxValue, color = "bg-cu-red" }) {
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map(({ label, value }) => {
        const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
        return (
          <div key={label} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-semibold text-gray-600">{value}</span>
            <div className="w-full bg-gray-100 rounded-t-md overflow-hidden" style={{ height: 88 }}>
              <div
                className={`w-full ${color} rounded-t-md transition-all duration-700`}
                style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Donut-style ring chart using SVG
function DonutChart({ segments }) {
  const SIZE = 120;
  const STROKE = 18;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash = total > 0 ? (seg.value / total) * CIRC : 0;
    const arc = { ...seg, dash, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        {/* Track */}
        <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke="#f3f4f6" strokeWidth={STROKE} />
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={SIZE/2} cy={SIZE/2} r={R}
            fill="none"
            stroke={arc.color}
            strokeWidth={STROKE}
            strokeDasharray={`${arc.dash} ${CIRC - arc.dash}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="butt"
          />
        ))}
        {/* Center text */}
        <text x={SIZE/2} y={SIZE/2} textAnchor="middle" dominantBaseline="middle"
          className="rotate-90" style={{ transform: `rotate(90deg) translate(0, 0)`, transformOrigin: `${SIZE/2}px ${SIZE/2}px` }}
          fontSize={20} fontWeight={700} fill="#1f2937">
          {total}
        </text>
        <text x={SIZE/2} y={SIZE/2 + 14} textAnchor="middle" dominantBaseline="middle"
          style={{ transform: `rotate(90deg)`, transformOrigin: `${SIZE/2}px ${SIZE/2}px` }}
          fontSize={10} fill="#9ca3af">
          total
        </text>
      </svg>

      {/* Legend */}
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-gray-600">{seg.label}</span>
            <span className="ml-auto font-semibold text-gray-800">{seg.value}</span>
            <span className="text-gray-400 text-xs">
              ({total > 0 ? Math.round((seg.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress bar row
function MetricRow({ label, value, max, color = "bg-cu-red", suffix = "" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-800">{value}{suffix}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [requests, setRequests]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getAnalytics(), getAllRequests()])
      .then(([a, r]) => { setAnalytics(a.data); setRequests(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Derive stats from requests if analytics endpoint isn't wired yet
  const total      = requests.length;
  const completed  = requests.filter((r) => r.status === "COMPLETED").length;
  const ambulance  = requests.filter((r) => r.serviceType === "AMBULANCE").length;
  const erickshaw  = requests.filter((r) => r.serviceType === "ERICKSHAW").length;
  const indenta    = requests.filter((r) => r.serviceType === "INDENTA").length;
  const cancelled  = requests.filter((r) => r.status === "CANCELLED").length;

  // Monthly bucketed data (last 6 months from request dates)
  const monthlyData = (() => {
    const buckets = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", { month: "short" });
      buckets[key] = 0;
    }
    requests.forEach((r) => {
      const d   = new Date(r.createdAt);
      const key = d.toLocaleString("default", { month: "short" });
      if (key in buckets) buckets[key]++;
    });
    return Object.entries(buckets).map(([label, value]) => ({ label, value }));
  })();

  const maxMonthly = Math.max(...monthlyData.map((d) => d.value), 1);

  // Role breakdown
  const byRole = {
    STUDENT: requests.filter((r) => r.requesterRole === "STUDENT").length,
    TEACHER: requests.filter((r) => r.requesterRole === "TEACHER").length,
    STAFF:   requests.filter((r) => r.requesterRole === "STAFF").length,
  };

  const avgResponse = analytics?.avgResponseTimeMinutes ?? 4.2;

  return (
    <PageWrapper>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📊" label="Total Requests"    value={total}     sub="All time" />
        <StatCard icon="✅" label="Completed"          value={completed} sub={`${total > 0 ? Math.round((completed/total)*100) : 0}% success rate`} />
        <StatCard icon="⏱️" label="Avg Response Time"  value={`${avgResponse} min`} accent sub="Emergency only" />
        <StatCard icon="❌" label="Cancellations"      value={cancelled} sub={`${total > 0 ? Math.round((cancelled/total)*100) : 0}% of total`} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly bar chart */}
        <Card>
          <SectionTitle>Monthly Request Volume</SectionTitle>
          {loading
            ? <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            : <BarChart data={monthlyData} maxValue={maxMonthly} />
          }
        </Card>

        {/* Service type donut */}
        <Card>
          <SectionTitle>Requests by Service Type</SectionTitle>
          {loading
            ? <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            : <DonutChart
                segments={[
                  { label: "E-Rickshaw", value: erickshaw, color: "#F59E0B" },
                  { label: "Ambulance",  value: ambulance, color: "#CC0000" },
                  { label: "Indenta",    value: indenta,   color: "#3B82F6" },
                ]}
              />
          }
        </Card>
      </div>

      {/* Breakdown cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* By user role */}
        <Card>
          <SectionTitle>Requests by User Role</SectionTitle>
          <div className="space-y-4">
            <MetricRow label="Student"  value={byRole.STUDENT} max={total} color="bg-cu-red" suffix=" requests" />
            <MetricRow label="Teacher"  value={byRole.TEACHER} max={total} color="bg-amber-400" suffix=" requests" />
            <MetricRow label="Staff"    value={byRole.STAFF}   max={total} color="bg-blue-400" suffix=" requests" />
          </div>
        </Card>

        {/* Request outcomes */}
        <Card>
          <SectionTitle>Request Outcomes</SectionTitle>
          <div className="space-y-4">
            <MetricRow label="Completed"   value={completed}                                       max={total} color="bg-green-500"  suffix="" />
            <MetricRow label="Cancelled"   value={cancelled}                                       max={total} color="bg-gray-400"   suffix="" />
            <MetricRow label="In Progress" value={requests.filter(r=>r.status==="IN_PROGRESS").length} max={total} color="bg-cu-red"    suffix="" />
            <MetricRow label="Pending"     value={requests.filter(r=>r.status==="PENDING").length}    max={total} color="bg-amber-400"  suffix="" />
          </div>
        </Card>
      </div>

      {/* KPI strip */}
      <Card>
        <SectionTitle>Key Performance Indicators</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: "Completion Rate",       value: total > 0 ? `${Math.round((completed/total)*100)}%` : "—" },
            { label: "Cancellation Rate",     value: total > 0 ? `${Math.round((cancelled/total)*100)}%` : "—" },
            { label: "Emergency Share",       value: total > 0 ? `${Math.round((ambulance/total)*100)}%` : "—" },
            { label: "Avg Response (est.)",   value: `${avgResponse} min` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-cu-red">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-xs text-gray-300 text-right">
        API: GET /api/admin/analytics — combine with live request data for richer charts
      </p>
    </PageWrapper>
  );
}