import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.role) {
      setMessage("Please fill all fields (Email, Password, and Role)");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = existingUsers.find(
      (user) =>
        user.email.trim().toLowerCase() === formData.email.trim().toLowerCase() &&
        user.password === formData.password &&
        user.role === formData.role
    );

    if (!matchedUser) {
      setMessage("Invalid credentials. Email, password, or role does not match. Please sign up if you don't have an account.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    setMessage(`Login successful as ${matchedUser.role}`);

    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1>Campus Transport System</h1>
        <p className="subtitle">Login to continue</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <label>Login As</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Login</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="bottom-text">
          Don&apos;t have an account?{" "}
          <span className="link-text" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;