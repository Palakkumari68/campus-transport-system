import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ─────────────────────────────────────────────
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

// ─── Requests ─────────────────────────────────────────
export const createRequest = (data) => API.post("/request/create", data);
export const getMyRequests = () => API.get("/request/my");
export const getRequestById = (id) => API.get(`/request/${id}`);
export const getAllRequests = (params) => API.get("/request/all", { params });
export const updateRequestStatus = (id, status) =>
  API.put(`/request/${id}/status`, { status });

// ─── Driver ───────────────────────────────────────────
export const getDriverRequests = () => API.get("/driver/requests");
export const acceptRequest = (id) =>
  API.put(`/driver/request/${id}/accept`);
export const declineRequest = (id) =>
  API.put(`/driver/request/${id}/decline`);
export const updateDriverProfile = (data) => API.put("/driver/profile", data);
export const updateDriverAvailability = (status) =>
  API.put("/driver/availability", { status });

// ─── Admin ────────────────────────────────────────────
export const getAllVehicles = () => API.get("/admin/vehicles");
export const addVehicle = (data) => API.post("/admin/vehicle/add", data);
export const updateVehicle = (id, data) =>
  API.put(`/admin/vehicle/${id}`, data);
export const getAllDrivers = () => API.get("/admin/drivers");
export const addDriver = (data) => API.post("/admin/driver/add", data);
export const getAnalytics = () => API.get("/admin/analytics");

export default API;