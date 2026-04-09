import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");

    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    setCurrentUser(user);

    const allRequests = JSON.parse(localStorage.getItem("requests") || "[]");
    const userRequests = allRequests.filter((r) => r.userEmail === user.email);
    setRequests(userRequests);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === "Pending").length;
    const completed = requests.filter((r) => r.status === "Completed").length;
    return {
      total: requests.length,
      pending,
      completed,
    };
  }, [requests]);

  if (!currentUser) {
    return <div style={{ padding: "40px", fontSize: "18px" }}>Loading...</div>;
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .dashboard-page {
          display: flex;
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background:
            radial-gradient(circle at top right, rgba(239, 68, 68, 0.08), transparent 28%),
            linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .dashboard-sidebar {
          width: 270px;
          background: linear-gradient(180deg, #7f1d1d 0%, #b91c1c 55%, #ef4444 100%);
          color: white;
          padding: 24px 16px;
          position: sticky;
          top: 0;
          height: 100vh;
          box-shadow: 8px 0 30px rgba(127, 29, 29, 0.18);
        }

        .logo-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.14);
          margin-bottom: 18px;
        }

        .logo-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(255,255,255,0.95);
          color: #b91c1c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        .logo-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.78);
          margin-top: 2px;
        }

        .nav-wrap {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 14px;
        }

        .nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          border: none;
          border-radius: 16px;
          padding: 14px 16px;
          background: transparent;
          color: rgba(255,255,255,0.86);
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          text-align: left;
          transition: all 0.28s ease;
        }

        .nav-btn:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
          transform: translateX(6px);
        }

        .nav-btn.active {
          background: rgba(255,255,255,0.96);
          color: #b91c1c;
          box-shadow: 0 14px 28px rgba(0,0,0,0.12);
        }

        .sidebar-footer {
          margin-top: 24px;
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(4px);
        }

        .sidebar-footer-title {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .sidebar-footer-text {
          font-size: 12px;
          color: rgba(255,255,255,0.78);
          line-height: 1.5;
        }

        .dashboard-main {
          flex: 1;
          padding: 30px;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .page-title {
          margin: 0;
          font-size: 34px;
          font-weight: 800;
          color: #101828;
        }

        .page-subtitle {
          margin-top: 8px;
          color: #667085;
          font-size: 15px;
        }

        .top-pill {
          padding: 12px 16px;
          border-radius: 16px;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(226,232,240,0.9);
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
          font-size: 14px;
          color: #344054;
        }

        .hero-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #991b1b 0%, #dc2626 65%, #f87171 100%);
          color: white;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 22px 45px rgba(153, 27, 27, 0.22);
          margin-bottom: 24px;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          right: -60px;
          top: -60px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.09);
        }

        .hero-card::after {
          content: "";
          position: absolute;
          left: -40px;
          bottom: -50px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 760px;
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.2);
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: 0.3px;
        }

        .hero-title {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
          line-height: 1.25;
        }

        .hero-text {
          margin-top: 12px;
          color: rgba(255,255,255,0.88);
          font-size: 15px;
          line-height: 1.7;
          max-width: 650px;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .primary-btn,
        .secondary-btn {
          border-radius: 14px;
          padding: 13px 20px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.28s ease;
        }

        .primary-btn {
          border: none;
          background: #fff;
          color: #b91c1c;
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }

        .primary-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 18px 28px rgba(0,0,0,0.18);
        }

        .secondary-btn {
          border: 1px solid rgba(255,255,255,0.34);
          background: rgba(255,255,255,0.08);
          color: #fff;
          backdrop-filter: blur(6px);
        }

        .secondary-btn:hover {
          background: rgba(255,255,255,0.14);
          transform: translateY(-3px);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 20px;
        }

        .stat-card,
        .info-card,
        .wide-card {
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(226,232,240,0.95);
          border-radius: 24px;
          box-shadow: 0 16px 35px rgba(15, 23, 42, 0.06);
          transition: all 0.3s ease;
        }

        .stat-card:hover,
        .info-card:hover,
        .wide-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 42px rgba(15, 23, 42, 0.1);
        }

        .stat-card {
          grid-column: span 4;
          padding: 22px;
          position: relative;
          overflow: hidden;
        }

        .stat-card::after {
          content: "";
          position: absolute;
          right: -20px;
          bottom: -28px;
          width: 95px;
          height: 95px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.08);
        }

        .stat-label {
          color: #667085;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 34px;
          font-weight: 800;
          color: #101828;
          margin-bottom: 8px;
        }

        .stat-note {
          color: #475467;
          font-size: 13px;
        }

        .info-card {
          grid-column: span 4;
          padding: 22px;
        }

        .wide-card {
          grid-column: span 8;
          padding: 24px;
        }

        .card-heading {
          margin: 0 0 18px;
          font-size: 20px;
          font-weight: 800;
          color: #101828;
        }

        .profile-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .profile-item {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #eef2f6;
          font-size: 14px;
        }

        .profile-label {
          color: #667085;
          font-weight: 600;
        }

        .profile-value {
          color: #101828;
          font-weight: 700;
          text-align: right;
        }

        .service-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .service-box {
          border-radius: 18px;
          padding: 18px;
          background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
          border: 1px solid #edf2f7;
          transition: all 0.28s ease;
        }

        .service-box:hover {
          transform: translateY(-5px);
          border-color: #fecaca;
          box-shadow: 0 18px 30px rgba(239, 68, 68, 0.08);
        }

        .service-icon {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .service-title {
          font-size: 16px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 6px;
        }

        .service-desc {
          color: #667085;
          font-size: 13px;
          line-height: 1.55;
        }

        .quick-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .soft-btn {
          border: 1px solid #fecaca;
          background: #fff5f5;
          color: #b91c1c;
          padding: 11px 16px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.28s ease;
        }

        .soft-btn:hover {
          background: #fee2e2;
          transform: translateY(-2px);
        }

        @media (max-width: 1100px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .stat-card,
          .info-card,
          .wide-card {
            grid-column: span 12;
          }

          .service-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 860px) {
          .dashboard-page {
            flex-direction: column;
          }

          .dashboard-sidebar {
            width: 100%;
            height: auto;
            position: relative;
          }

          .dashboard-main {
            padding: 20px;
          }

          .hero-title {
            font-size: 24px;
          }

          .page-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="logo-box">
            <div className="logo-icon">CM</div>
            <div>
              <div className="logo-text">CampusMove</div>
              <div className="logo-sub">Smart Transport System</div>
            </div>
          </div>

          <nav className="nav-wrap">
            <button className="nav-btn active">
              <span>🏠</span>
              <span>Dashboard</span>
            </button>

            <button className="nav-btn" onClick={() => navigate("/book-service")}>
              <span>📋</span>
              <span>Book Service</span>
            </button>

            <button className="nav-btn" onClick={() => navigate("/request-status")}>
              <span>📍</span>
              <span>My Requests</span>
            </button>

            <button className="nav-btn" onClick={() => navigate("/register")}>
              <span>📝</span>
              <span>Register</span>
            </button>

            <button className="nav-btn" onClick={handleLogout}>
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-footer-title">Campus Support</div>
            <div className="sidebar-footer-text">
              Book transport, check request progress, and manage service access from one place.
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="topbar">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">
                Welcome back, {currentUser.fullName || currentUser.email} ({currentUser.role})
              </p>
            </div>

            <div className="top-pill">
              Logged in as <strong>{currentUser.email}</strong>
            </div>
          </div>

          <section className="hero-card">
            <div className="hero-content">
              <div className="hero-badge">SMART CAMPUS MOBILITY</div>
              <h2 className="hero-title">
                Manage bookings, track vehicles, and access transport services with ease
              </h2>
              <p className="hero-text">
                our dashboard gives quick access to e-rickshaw booking, emergency ambulance
                support, request tracking, and service registration in one clean interface.
              </p>

              <div className="hero-actions">
                <button className="primary-btn" onClick={() => navigate("/book-service")}>
                  Book a Service
                </button>
                <button className="secondary-btn" onClick={() => navigate("/request-status")}>
                  Track My Requests
                </button>
              </div>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-label">Total Requests</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-note">All transport requests created by you</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Pending Requests</div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-note">Currently waiting for assignment or action</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Completed Requests</div>
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-note">Successfully completed campus transport tasks</div>
            </div>

            <div className="wide-card">
              <h3 className="card-heading">Available Services</h3>

              <div className="service-grid">
                <div className="service-box">
                  <div className="service-icon">🛺</div>
                  <div className="service-title">E-Rickshaw</div>
                  <div className="service-desc">
                    Fast and convenient in-campus transport for students and staff.
                  </div>
                </div>

                <div className="service-box">
                  <div className="service-icon">🚛</div>
                  <div className="service-title">Tempo Service</div>
                  <div className="service-desc">
                    Useful for shifting luggage, equipment, and other goods within campus.
                  </div>
                </div>

                <div className="service-box">
                  <div className="service-icon">🚑</div>
                  <div className="service-title">Ambulance</div>
                  <div className="service-desc">
                    Emergency medical transport with priority support and faster response.
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <button className="soft-btn" onClick={() => navigate("/book-service")}>
                  New Booking
                </button>
                <button className="soft-btn" onClick={() => navigate("/request-status")}>
                  View Status
                </button>
                <button className="soft-btn" onClick={() => navigate("/register")}>
                  Update Registration
                </button>
              </div>
            </div>

            <div className="info-card">
              <h3 className="card-heading">Profile Info</h3>
              <div className="profile-list">
                <div className="profile-item">
                  <span className="profile-label">Full Name</span>
                  <span className="profile-value">{currentUser.fullName || "N/A"}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Email</span>
                  <span className="profile-value">{currentUser.email}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Role</span>
                  <span className="profile-value">{currentUser.role}</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}