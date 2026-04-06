// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../Context/AuthContext";

// export default function DriverLogin() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       // Pass role hint so backend can validate it's a driver account
//       const user = await login({ ...form, expectedRole: "DRIVER" });

//       if (user.role !== "DRIVER") {
//         setError("This login is only for drivers. Use the main login page.");
//         return;
//       }
//       navigate("/driver/dashboard");
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Login failed. Check your credentials."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         {/* Icon */}
//         <div
//           style={{
//             width: 48,
//             height: 48,
//             borderRadius: "50%",
//             background: "var(--primary-light)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: 22,
//             marginBottom: 14,
//           }}
//         >
//           🚗
//         </div>

//         <h1>Driver Portal</h1>
//         <p>Smart Campus Emergency &amp; Transport System</p>

//         {error && <div className="alert alert-red">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Driver Email / ID</label>
//             <input
//               type="text"
//               name="email"
//               placeholder="driver@campus.edu"
//               value={form.email}
//               onChange={handleChange}
//               autoComplete="username"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="••••••••"
//               value={form.password}
//               onChange={handleChange}
//               autoComplete="current-password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary"
//             style={{ width: "100%", marginBottom: 10 }}
//             disabled={loading}
//           >
//             {loading ? "Signing in..." : "Sign in as Driver"}
//           </button>
//         </form>

//         <p
//           style={{
//             textAlign: "center",
//             fontSize: 12,
//             color: "var(--text-muted)",
//             marginTop: 8,
//           }}
//         >
//           Not a driver?{" "}
//           <Link to="/login" style={{ color: "var(--primary)" }}>
//             Go to main login
//           </Link>
//         </p>

//         {/* API note */}
//         <p
//           style={{
//             marginTop: 16,
//             fontSize: 11,
//             color: "var(--text-faint)",
//             borderTop: "0.5px solid var(--border)",
//             paddingTop: 10,
//           }}
//         >
//           API: POST /api/auth/login — expects {"{ email, password }"}
//         </p>
//       </div>
//     </div>
//   );
// }



import { useNavigate } from "react-router-dom";
import { useState } from "react";

function DriverLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy login
    if (email && password) {
      localStorage.setItem(
        "user",
        JSON.stringify({ role: "DRIVER", name: "Driver", email })
      );
      navigate("/driver/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-10">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            🚗
          </div>

          <h2 className="mt-4 text-3xl font-bold text-black">
            Driver Portal
          </h2>

          <p className="mt-2 text-sm text-gray-600 text-center leading-6">
            Smart Campus Transport System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Driver Email
            </label>

            <input
              type="text"
              placeholder="Enter your driver email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-full bg-red-600 py-3 text-white font-semibold shadow-md transition duration-200 hover:bg-red-700"
          >
            Sign in as Driver
          </button>
        </form>

        {/* Bottom Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Not a driver?{" "}
          <span className="text-red-600 font-medium cursor-pointer hover:underline">
            Go to main login
          </span>
        </p>
      </div>

      {/* Bottom Red Strip (CUIMS style touch) */}
      <div className="hidden md:block absolute bottom-0 left-0 w-full h-24 bg-red-600"></div>

    </div>
  );
}

export default DriverLogin;