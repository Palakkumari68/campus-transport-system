import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { to: "/admin/dashboard", icon: "▣", label: "Dashboard" },
  { section: "Management" },
  { to: "/admin/requests", icon: "📋", label: "All Requests" },
  { to: "/admin/vehicles", icon: "🚗", label: "Vehicles" },
  { to: "/admin/drivers", icon: "👥", label: "Drivers" },
  { section: "Reports" },
  { to: "/admin/analytics", icon: "📊", label: "Analytics" },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getPageTitle(pathname) {
  if (pathname.includes("/admin/requests")) return "Requests";
  if (pathname.includes("/admin/vehicles")) return "Vehicles";
  if (pathname.includes("/admin/drivers")) return "Drivers";
  if (pathname.includes("/admin/analytics")) return "Analytics";
  return "Admin Dashboard";
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "ADMIN") {
      if (user.role === "DRIVER") {
        navigate("/driver/dashboard", { replace: true });
      } else if (user.role === "USER") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
      return;
    }

    setCurrentUser(user);
  }, [navigate]);

  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!currentUser) {
    return <div className="p-10 text-lg">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#efefef] text-black-900">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } font-sans flex min-h-screen flex-col bg-red-500 transition-all duration-300`}
      >
        <div className="flex items-center gap-3 border-b border-white/15 px-4 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-red-600 shadow-sm">
            CU
          </div>

          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-black text-lg font-bold leading-tight tracking-wide">
                Campus Admin
              </p>
              <p className="text-black-700 text-sm font-medium">
                Transport Management
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((item, index) => {
            if (item.section) {
              return sidebarOpen ? (
                <p
                  key={index}
                  className="px-3 pb-2 pt-5 text-xs font-bold uppercase tracking-[0.18em] text-red-200"
                >
                  {item.section}
                </p>
              ) : (
                <div key={index} className="my-4 border-t border-white/15" />
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `mb-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-red-600 shadow-md"
                      : "text-red-50 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="flex h-6 w-6 items-center justify-center text-base">
                  {item.icon}
                </span>
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/15 p-3">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-red-100 transition hover:bg-white/10 hover:text-white"
          >
            <span>{sidebarOpen ? "◀" : "▶"}</span>
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Smart Campus Emergency &amp; Transport System
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>

              <div className="flex items-center gap-3 rounded-full bg-gray-100 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                  {getInitials(currentUser?.fullName || "Admin User")}
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {currentUser?.fullName || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-600 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}




























// import React, { useState } from "react";
// import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../Context/AuthContext";

// const NAV = [
//   { to: "/admin/dashboard", icon: "▣", label: "Dashboard" },
//   { section: "Management" },
//   { to: "/admin/requests", icon: "📋", label: "All Requests" },
//   { to: "/admin/vehicles", icon: "🚗", label: "Vehicles" },
//   { to: "/admin/drivers", icon: "👥", label: "Drivers" },
//   { section: "Reports" },
//   { to: "/admin/analytics", icon: "📊", label: "Analytics" },
// ];

// function getInitials(name = "") {
//   return name
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// }

// function getPageTitle(pathname) {
//   if (pathname.includes("/admin/requests")) return "Requests";
//   if (pathname.includes("/admin/vehicles")) return "Vehicles";
//   if (pathname.includes("/admin/drivers")) return "Drivers";
//   if (pathname.includes("/admin/analytics")) return "Analytics";
//   return "Admin Dashboard";
// }

// export default function AdminLayout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const pageTitle = getPageTitle(location.pathname);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="flex min-h-screen bg-[#efefef] text-black-900">
//       <aside
//         className={`${
//           sidebarOpen ? "w-64" : "w-20"
//         } font-sans  flex min-h-screen flex-col bg-red-500  transition-all duration-300`}
//       >
//         <div className="flex items-center gap-3 border-b border-white/15 px-4 py-5">
//           <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-red-600 shadow-sm">
//             CU
//           </div>

//           {sidebarOpen && (
//             <div className="overflow-hidden">
//               <p className="text-black text-lg font-bold leading-tight tracking-wide">Campus Admin</p>
//               <p className="text-black-700 text-sm font-medium">
//                 Transport Management
//               </p>
//             </div>
//           )}
//         </div>

//         <nav className="flex-1 overflow-y-auto px-3 py-4">
//           {NAV.map((item, index) => {
//             if (item.section) {
//               return sidebarOpen ? (
//                 <p
//                   key={index}
//                   className="px-3 pb-2 pt-5 text-xs font-bold uppercase tracking-[0.18em] text-red-200"
//                 >
//                   {item.section}
//                 </p>
//               ) : (
//                 <div
//                   key={index}
//                   className="my-4 border-t border-white/15"
//                 />
//               );
//             }

//             return (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 className={({ isActive }) =>
//                   `mb-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
//                     isActive
//                       ? "bg-white text-red-600 shadow-md"
//                       : "text-red-50 hover:bg-white/10 hover:text-white"
//                   }`
//                 }
//               >
//                 <span className="flex h-6 w-6 items-center justify-center text-base">
//                   {item.icon}
//                 </span>
//                 {sidebarOpen && <span className="truncate">{item.label}</span>}
//               </NavLink>
//             );
//           })}
//         </nav>

//         <div className="border-t border-white/15 p-3">
//           <button
//             onClick={() => setSidebarOpen((prev) => !prev)}
//             className="flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-red-100 transition hover:bg-white/10 hover:text-white"
//           >
//             <span>{sidebarOpen ? "◀" : "▶"}</span>
//             {sidebarOpen && <span>Collapse</span>}
//           </button>
//         </div>
//       </aside>

//       <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
//         <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
//               <p className="mt-1 text-sm text-gray-500">
//                 Smart Campus Emergency &amp; Transport System
//               </p>
//             </div>

//             <div className="flex items-center gap-3">
//               <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
//                 <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
//                 Live
//               </span>

//               <div className="flex items-center gap-3 rounded-full bg-gray-100 px-3 py-2">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
//                   {getInitials(user?.name || "Admin User")}
//                 </div>

//                 <div className="hidden sm:block">
//                   <p className="text-sm font-semibold text-gray-800">
//                     {user?.name || "Admin User"}
//                   </p>
//                   <p className="text-xs text-gray-500">Administrator</p>
//                 </div>
//               </div>

//               <button
//                 onClick={handleLogout}
//                 className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-600 hover:text-red-600"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
