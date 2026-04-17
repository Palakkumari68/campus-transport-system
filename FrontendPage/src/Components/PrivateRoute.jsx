// import React from "react";
// import { Navigate } from "react-router-dom";

// export function PrivateRoute({ children, roles }) {
//   const user = JSON.parse(localStorage.getItem("user"));

//   // ❌ Not logged in
//   if (!user) {
//     return <Navigate to="/" replace />;
//   }

//   // ❌ Role not allowed
//   if (roles && !roles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   // ✅ Allowed
//   return children;
// }

import React from "react";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children, allowedRoles = [] }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // not logged in
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // no role restriction
  if (!allowedRoles.length) {
    return children;
  }

  // role not allowed
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "DRIVER") {
      return <Navigate to="/driver/dashboard" replace />;
    }

    if (user.role === "USER" || user.role === "STUDENT") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}