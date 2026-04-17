import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const NAV_CONFIG = {
  user: [
    { to: "/user/dashboard", label: "Dashboard", icon: "⊞" },
    { section: "Book Services" },
    { to: "/user/book/ambulance", label: "Book Ambulance", icon: "🚑" },
    { to: "/user/book/erickshaw", label: "Book E-Rickshaw", icon: "🛺" },
    { to: "/user/book/indenta", label: "Book Indenta", icon: "🚌" },
    { section: "My Requests" },
    { to: "/user/track", label: "Track Request", icon: "📍" },
    { to: "/user/history", label: "History", icon: "🕐" },
  ],
  driver: [
    { to: "/driver/dashboard", label: "Dashboard", icon: "⊞" },
    { section: "Requests" },
    { to: "/driver/requests", label: "Incoming Requests", icon: "📋" },
    { to: "/driver/active", label: "Active Trip", icon: "🗺️" },
    { section: "Profile" },
    { to: "/driver/profile", label: "My Profile", icon: "👤" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
    { section: "Management" },
    { to: "/admin/requests", label: "All Requests", icon: "📋" },
    { to: "/admin/vehicles", label: "Vehicles", icon: "🚗" },
    { to: "/admin/drivers", label: "Drivers", icon: "👥" },
    { section: "Reports" },
    { to: "/admin/analytics", label: "Analytics", icon: "📊" },
  ],
};

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Layout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Smart Campus</h2>
          <span>Emergency &amp; Transport</span>
        </div>
        <nav className="sidebar-nav">
          {NAV_CONFIG[role].map((item, i) => {
            if (item.section) {
              return (
                <div key={i} className="nav-section">
                  {item.section}
                </div>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  "nav-item" + (isActive ? " active" : "")
                }
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main area */}
      <div className="main-area">
        <header className="topbar">
          <span className="topbar-title">Smart Campus Transport</span>
          <div className="user-chip">
            <div className="avatar">{getInitials(user?.name)}</div>
            <span>{user?.name}</span>
            <span
              style={{
                fontSize: 11,
                background: "#e6f1fb",
                color: "#185fa5",
                padding: "2px 7px",
                borderRadius: 20,
              }}
            >
              {user?.role}
            </span>
            <button className="btn btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}