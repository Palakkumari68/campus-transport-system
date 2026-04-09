import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    const missingFields = [];
    if (!formData.fullName) missingFields.push("Full Name");
    if (!formData.email) missingFields.push("Email");
    if (!formData.phone) missingFields.push("Phone");
    if (!formData.password) missingFields.push("Password");
    if (!formData.confirmPassword) missingFields.push("Confirm Password");
    if (!formData.role) missingFields.push("Role");

    if (missingFields.length > 0) {
      setMessage(`Please fill the following fields: ${missingFields.join(", ")}`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    const userAlreadyExists = existingUsers.find(
      (user) => user.email === formData.email
    );

    if (userAlreadyExists) {
      setMessage("User already exists. Please login.");
      return;
    }

    const newUser = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    };

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    setMessage("Signup successful");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1>Campus Transport System</h1>
        <p className="subtitle">Create a new account</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <label>Role</label>
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

          <button type="submit">Sign Up</button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="bottom-text">
          Already have an account?{" "}
          <span className="link-text" onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;