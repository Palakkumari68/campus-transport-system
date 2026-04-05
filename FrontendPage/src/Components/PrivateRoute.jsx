import React from "react";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role not allowed
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}