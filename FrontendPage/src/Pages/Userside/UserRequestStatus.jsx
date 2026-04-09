import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrackMap from "./TrackMap";

export default function RequestStatus() {
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

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logoBox}>
          <div style={styles.logoIcon}>CM</div>
          <div>
            <div style={styles.logoText}>CampusMove</div>
            <div style={styles.logoSub}>Smart Transport System</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <button style={styles.navItem} onClick={() => navigate("/dashboard")}>
            <span>🏠</span>
            <span>Dashboard</span>
          </button>

          <button
            style={styles.navItem}
            onClick={() => navigate("/book-service")}
          >
            <span>📋</span>
            <span>Book Service</span>
          </button>

          <button style={{ ...styles.navItem, ...styles.navActive }}>
            <span>📍</span>
            <span>My Requests</span>
          </button>

          <button
            style={styles.navItem}
            onClick={() => navigate("/register")}
          >
            <span>📝</span>
            <span>Register</span>
          </button>

          <button style={styles.navItem} onClick={handleLogout}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>My Request Status</h1>
            <p style={styles.pageSubtitle}>
              Track all your submitted service requests
            </p>
          </div>
        </div>

        <div style={styles.card}>
          {currentUser && (
            <p style={styles.loggedText}>
              Logged in as: <strong>{currentUser.fullName || currentUser.email}</strong>
            </p>
          )}

          {requests.length === 0 ? (
  <p style={styles.emptyText}>No service requests found. Try booking a service first.</p>
) : (
  <>
    <div style={styles.requestGrid}>
      {requests.map((request) => (
        <div key={request.reqId} style={styles.requestCard}>
          <p><strong>Request ID:</strong> {request.reqId}</p>
          <p><strong>Service:</strong> {request.service}</p>
          <p><strong>Pickup:</strong> {request.pickup}</p>
          <p><strong>Drop:</strong> {request.drop}</p>
          <p><strong>Urgency:</strong> {request.urgency}</p>
          <p><strong>Status:</strong> {request.status}</p>
        </div>
      ))}
    </div>

    <TrackMap />
  </>
)}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: "#f8fafc",
  },
  sidebar: {
    width: "250px",
    background: "linear-gradient(180deg, #7f1d1d 0%, #991b1b 100%)",
    color: "#fff",
    padding: "24px 0",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 20px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  },
  logoIcon: {
    width: "46px",
    height: "46px",
    background: "#fff",
    color: "#991b1b",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "800",
  },
  logoSub: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.8)",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "20px 12px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.84)",
    cursor: "pointer",
    fontWeight: "600",
    textAlign: "left",
  },
  navActive: {
    background: "#fff",
    color: "#991b1b",
  },
  main: {
    flex: 1,
    padding: "28px",
  },
  topBar: {
    marginBottom: "24px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "800",
    color: "#101828",
  },
  pageSubtitle: {
    color: "#667085",
    marginTop: "8px",
    fontSize: "15px",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
    border: "1px solid #f2f4f7",
  },
  loggedText: {
    marginBottom: "20px",
    color: "#344054",
  },
  emptyText: {
    color: "#667085",
    fontSize: "15px",
  },
  requestGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  requestCard: {
    background: "#f9fafb",
    border: "1px solid #eaecf0",
    borderRadius: "16px",
    padding: "18px",
    lineHeight: "1.8",
  },
};