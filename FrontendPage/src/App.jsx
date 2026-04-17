// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./index.css";

// import Dashboard from "./Pages/UserSide/Dashboard";
// import BookService from "./Pages/UserSide/BookService";
// import RequestStatus from "./Pages/UserSide/RequestStatus";
// import Register from "./Pages/UserSide/Register";

// import DriverLogin from "./Pages/DriverSide/DriverLogin";
// import DriverDashboard from "./Pages/DriverSide/DriverDashboard";
// import ViewRequests from "./Pages/DriverSide/ViewRequests";
// import UpdateStatus from "./Pages/DriverSide/UpdateStatus";
// import ActiveTrip from "./Pages/DriverSide/ActiveTrip";
// import Profile from "./Pages/DriverSide/Profile";

// import AdminLayout from "./Pages/AdminSide/AdminLayout";
// import AdminDashboard from "./Pages/AdminSide/AdminDashboard";
// import AdminRequests from "./Pages/AdminSide/AdminRequests";
// import AdminVehicles from "./Pages/AdminSide/AdminVehicles";
// import AdminDrivers from "./Pages/AdminSide/AdminDrivers";
// import AdminAnalytics from "./Pages/AdminSide/AdminAnalytics";

// import {PrivateRoute} from "./Components/PrivateRoute"; // ✅ FIX

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Driver Routes */}
//         <Route path="/" element={<DriverLogin />} />
//         <Route path="/driver/dashboard" element={<DriverDashboard />} />
//         <Route path="/driver/requests" element={<ViewRequests />} />
//         <Route path="/driver/update-status" element={<UpdateStatus />} />
//         <Route path="/driver/active-trip" element={<ActiveTrip />} />
//         <Route path="/driver/profile" element={<Profile />} />

//         {/* Admin Routes */}
//         <Route
//           path="/admin"
//           element={
//             <PrivateRoute roles={["ADMIN"]}>
//               <AdminLayout />
//             </PrivateRoute>
//           }
//         >
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="requests" element={<AdminRequests />} />
//           <Route path="vehicles" element={<AdminVehicles />} />
//           <Route path="drivers" element={<AdminDrivers />} />
//           <Route path="analytics" element={<AdminAnalytics />} />
//         </Route>
//          {/* User Routes */}
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/book-service" element={<BookService />} />
//         <Route path="/request-status" element={<RequestStatus />} />
//         <Route path="/register" element={<Register />} />



//       </Routes>
//     </BrowserRouter>
//   );
// }


import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Common
import LoginPage from "./Pages/LoginPage";
import { PrivateRoute } from "./Components/PrivateRoute";

// Driver
import DriverDashboard from "./Pages/DriverSide/DriverDashboard";
import ViewRequests from "./Pages/DriverSide/DriverViewRequests";
import UpdateStatus from "./Pages/DriverSide/DriverUpdateStatus";
import ActiveTrip from "./Pages/DriverSide/ActiveTrip";
import Profile from "./Pages/DriverSide/DriverProfile";

// Admin
import AdminLayout from "./Pages/AdminSide/AdminLayout";
import AdminDashboard from "./Pages/AdminSide/AdminDashboard";
import AdminRequests from "./Pages/AdminSide/AdminRequests";
import AdminVehicles from "./Pages/AdminSide/AdminVehicles";
import AdminDrivers from "./Pages/AdminSide/AdminDrivers";
import AdminAnalytics from "./Pages/AdminSide/AdminAnalytics";

// User
import Dashboard from "./Pages/Userside/UserDashboard";
import BookService from "./Pages/Userside/UserBookservice";
import RequestStatus from "./Pages/Userside/UserRequestStatus";
import Register from "./Pages/Userside/UserRegister";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Common Login */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={["USER"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/book-service"
          element={
            <PrivateRoute roles={["USER"]}>
              <BookService />
            </PrivateRoute>
          }
        />
        <Route
          path="/request-status"
          element={
            <PrivateRoute roles={["USER"]}>
              <RequestStatus />
            </PrivateRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PrivateRoute roles={["USER"]}>
              <Register />
            </PrivateRoute>
          }
        />

        {/* Driver Routes */}
        <Route
          path="/driver/dashboard"
          element={
            <PrivateRoute roles={["DRIVER"]}>
              <DriverDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/driver/requests"
          element={
            <PrivateRoute roles={["DRIVER"]}>
              <ViewRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/driver/update-status"
          element={
            <PrivateRoute roles={["DRIVER"]}>
              <UpdateStatus />
            </PrivateRoute>
          }
        />
        <Route
          path="/driver/active-trip"
          element={
            <PrivateRoute roles={["DRIVER"]}>
              <ActiveTrip />
            </PrivateRoute>
          }
        />
        <Route
          path="/driver/profile"
          element={
            <PrivateRoute roles={["DRIVER"]}>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
