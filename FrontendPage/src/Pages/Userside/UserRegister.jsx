import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");

    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    setCurrentUser(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

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

          <button style={styles.navItem} onClick={() => navigate("/book-service")}>
            <span>📋</span>
            <span>Book Service</span>
          </button>

          <button style={styles.navItem} onClick={() => navigate("/request-status")}>
            <span>📍</span>
            <span>My Requests</span>
          </button>

          <button style={{ ...styles.navItem, ...styles.navActive }}>
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
            <h1 style={styles.pageTitle}>Register for Transport Updates</h1>
            <p style={styles.pageSubtitle}>
              Fill your details for quicker in-campus service access
            </p>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>User Registration Details</h2>

          <div style={styles.infoBox}>
            <p><strong>Name:</strong> {currentUser.fullName || "N/A"}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Role:</strong> {currentUser.role}</p>
          </div>

          <p style={styles.cardText}>
            This page can be used later to add extra student details like hostel,
            department, phone number, emergency contact, and preferred transport type.
          </p>

          <div style={styles.actionRow}>
            <button style={styles.filledBtn} onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;

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
    maxWidth: "800px",
  },
  cardTitle: {
    margin: "0 0 16px",
    fontSize: "22px",
    fontWeight: "800",
    color: "#101828",
  },
  infoBox: {
    background: "#f9fafb",
    border: "1px solid #eaecf0",
    borderRadius: "16px",
    padding: "16px",
    lineHeight: "1.9",
    marginBottom: "18px",
    color: "#344054",
  },
  cardText: {
    color: "#667085",
    fontSize: "15px",
    lineHeight: "1.6",
  },
  actionRow: {
    marginTop: "20px",
  },
  filledBtn: {
    border: "none",
    background: "#991b1b",
    color: "#fff",
    padding: "11px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "800",
  },
};