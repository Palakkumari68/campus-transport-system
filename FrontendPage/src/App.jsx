import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import DriverLogin from "./Pages/DriverSide/DriverLogin";
import DriverDashboard from "./Pages/DriverSide/DriverDashboard";
import ViewRequests from "./Pages/DriverSide/ViewRequests";
import UpdateStatus from "./Pages/DriverSide/UpdateStatus";
import ActiveTrip from "./Pages/DriverSide/ActiveTrip";
import Profile from "./Pages/DriverSide/Profile";

import AdminLayout from "./Pages/AdminSide/AdminLayout";
import AdminDashboard from "./Pages/AdminSide/AdminDashboard";
import AdminRequests from "./Pages/AdminSide/AdminRequests";
import AdminVehicles from "./Pages/AdminSide/AdminVehicles";
import AdminDrivers from "./Pages/AdminSide/AdminDrivers";
import AdminAnalytics from "./Pages/AdminSide/AdminAnalytics";

import {PrivateRoute} from "./Components/PrivateRoute"; // ✅ FIX

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Driver Routes */}
        <Route path="/" element={<DriverLogin />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/requests" element={<ViewRequests />} />
        <Route path="/driver/update-status" element={<UpdateStatus />} />
        <Route path="/driver/active-trip" element={<ActiveTrip />} />
        <Route path="/driver/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
