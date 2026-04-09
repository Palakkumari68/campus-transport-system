import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const demoUsers = [
  {
    fullName: "Admin User",
    email: "admin@campus.com",
    password: "admin123",
    role: "ADMIN",
  },
  {
    fullName: "Driver User",
    email: "driver@campus.com",
    password: "driver123",
    role: "DRIVER",
  },
  {
    fullName: "Nishtha Sen",
    email: "student@campus.com",
    password: "user123",
    role: "USER",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const matchedUser = demoUsers.find(
      (user) =>
        user.email === form.email.trim() &&
        user.password === form.password.trim()
    );

    if (!matchedUser) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    if (matchedUser.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (matchedUser.role === "DRIVER") {
      navigate("/driver/dashboard");
    } else if (matchedUser.role === "USER") {
      navigate("/dashboard");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.brandBox}>
          <div style={styles.logo}>CM</div>
          <div>
            <h1 style={styles.brandTitle}>CampusMove</h1>
            <p style={styles.brandSub}>Smart Transport System</p>
          </div>
        </div>

        <div style={styles.leftContent}>
          <h2 style={styles.heading}>One Login for All Roles</h2>
          <p style={styles.description}>
            Login as Admin, Driver, or Student/User and get redirected to your
            own dashboard.
          </p>

          <div style={styles.demoBox}>
            <h3 style={styles.demoTitle}>Demo Credentials</h3>

            <div style={styles.demoItem}>
              <strong>Admin</strong>
              <p style={styles.demoText}>Email: admin@campus.com</p>
              <p style={styles.demoText}>Password: admin123</p>
            </div>

            <div style={styles.demoItem}>
              <strong>Driver</strong>
              <p style={styles.demoText}>Email: driver@campus.com</p>
              <p style={styles.demoText}>Password: driver123</p>
            </div>

            <div style={styles.demoItem}>
              <strong>User</strong>
              <p style={styles.demoText}>Email: student@campus.com</p>
              <p style={styles.demoText}>Password: user123</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <form style={styles.formCard} onSubmit={handleLogin}>
          <h2 style={styles.formTitle}>Login</h2>
          <p style={styles.formSub}>Enter your credentials to continue</p>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.loginBtn}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: "#f8fafc",
  },
  leftPanel: {
    background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #dc2626 100%)",
    color: "#fff",
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  brandBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logo: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#fff",
    color: "#991b1b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "20px",
  },
  brandTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
  },
  brandSub: {
    margin: "4px 0 0",
    color: "rgba(255,255,255,0.85)",
  },
  leftContent: {
    maxWidth: "520px",
  },
  heading: {
    fontSize: "42px",
    lineHeight: "1.2",
    marginBottom: "16px",
    fontWeight: "800",
  },
  description: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "rgba(255,255,255,0.9)",
    marginBottom: "28px",
  },
  demoBox: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "20px",
    padding: "24px",
  },
  demoTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "20px",
  },
  demoItem: {
    marginBottom: "14px",
  },
  demoText: {
    margin: "4px 0",
    color: "rgba(255,255,255,0.88)",
  },
  rightPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
  },
  formCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 18px 40px rgba(16,24,40,0.08)",
    border: "1px solid #f2f4f7",
  },
  formTitle: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "800",
    color: "#101828",
  },
  formSub: {
    marginTop: "8px",
    color: "#667085",
    marginBottom: "24px",
  },
  formGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "700",
    fontSize: "14px",
    color: "#344054",
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "14px",
    border: "1px solid #d0d5dd",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  error: {
    color: "#d92d20",
    background: "#fef3f2",
    border: "1px solid #fecdca",
    padding: "10px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "14px",
  },
  loginBtn: {
    width: "100%",
    border: "none",
    background: "#991b1b",
    color: "#fff",
    padding: "14px",
    borderRadius: "14px",
    fontWeight: "800",
    fontSize: "15px",
    cursor: "pointer",
  },
};