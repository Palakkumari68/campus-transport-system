import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrackMap from "./TrackMap";
import { getMyRequests } from "../../services/api";

export default function RequestStatus() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "STUDENT" && user.role !== "USER") {
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "DRIVER") {
        navigate("/driver/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
      return;
    }

    setCurrentUser(user);
    fetchMyRequests();
  }, [navigate]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getMyRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load user requests:", err);
      setError(
        err.response?.data?.message || "Could not load your requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return { bg: "#fef3c7", color: "#b45309" };
      case "ACCEPTED":
        return { bg: "#dbeafe", color: "#1d4ed8" };
      case "IN_PROGRESS":
        return { bg: "#fee2e2", color: "#b91c1c" };
      case "COMPLETED":
        return { bg: "#dcfce7", color: "#15803d" };
      case "CANCELLED":
        return { bg: "#e5e7eb", color: "#374151" };
      default:
        return { bg: "#f3f4f6", color: "#374151" };
    }
  };

  const getServiceLabel = (serviceType) => {
    switch (serviceType) {
      case "AMBULANCE":
        return "🚑 Ambulance";
      case "ERICKSHAW":
        return "🛺 E-Rickshaw";
      case "INDENTA":
        return "🚌 Indenta";
      default:
        return serviceType || "Service";
    }
  };

  if (!currentUser) {
    return <div style={{ padding: "40px", fontSize: "18px" }}>Loading...</div>;
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

          <button style={styles.refreshBtn} onClick={fetchMyRequests}>
            Refresh
          </button>
        </div>

        <div style={styles.card}>
          <p style={styles.loggedText}>
            Logged in as:{" "}
            <strong>
              {currentUser.fullName || currentUser.name || currentUser.email}
            </strong>
          </p>

          {error && <div style={styles.errorBox}>{error}</div>}

          {loading ? (
            <p style={styles.emptyText}>Loading your requests...</p>
          ) : requests.length === 0 ? (
            <p style={styles.emptyText}>
              No service requests found. Try booking a service first.
            </p>
          ) : (
            <>
              <div style={styles.requestGrid}>
                {requests.map((request) => {
                  const statusStyle = getStatusColor(request.status);

                  return (
                    <div key={request.id} style={styles.requestCard}>
                      <p>
                        <strong>Request ID:</strong> REQ-{request.id}
                      </p>

                      <p>
                        <strong>Service:</strong>{" "}
                        {getServiceLabel(request.serviceType)}
                      </p>

                      <p>
                        <strong>Pickup:</strong>{" "}
                        {request.pickupLocation || "—"}
                      </p>

                      <p>
                        <strong>Drop:</strong>{" "}
                        {request.dropLocation || request.destination || "—"}
                      </p>

                      {request.description && (
                        <p>
                          <strong>Note:</strong> {request.description}
                        </p>
                      )}

                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          style={{
                            ...styles.statusBadge,
                            background: statusStyle.bg,
                            color: statusStyle.color,
                          }}
                        >
                          {request.status}
                        </span>
                      </p>

                      {request.driverName && (
                        <div style={styles.driverBox}>
                          <p>
                            <strong>Driver Name:</strong> {request.driverName}
                          </p>
                          <p>
                            <strong>Driver Phone:</strong>{" "}
                            {request.driverPhone || "Not available"}
                          </p>
                        </div>
                      )}

                      {request.createdAt && (
                        <p>
                          <strong>Created:</strong>{" "}
                          {new Date(request.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
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
  refreshBtn: {
    border: "1px solid #d0d5dd",
    background: "#fff",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
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
  errorBox: {
    color: "#d92d20",
    background: "#fef3f2",
    border: "1px solid #fecdca",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  emptyText: {
    color: "#667085",
    fontSize: "15px",
  },
  requestGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  requestCard: {
    background: "#f9fafb",
    border: "1px solid #eaecf0",
    borderRadius: "16px",
    padding: "18px",
    lineHeight: "1.8",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px",
  },
  driverBox: {
    marginTop: "10px",
    padding: "10px 12px",
    borderRadius: "12px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
  },
};