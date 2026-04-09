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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children, roles }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  // ❌ Not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Wrong role → redirect to their own dashboard
  if (roles && !roles.includes(currentUser.role)) {
    if (currentUser.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (currentUser.role === "DRIVER") {
      return <Navigate to="/driver/dashboard" replace />;
    }
    if (currentUser.role === "USER") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // ✅ Allowed
  return children;
}