import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    type: "E-Rickshaw",
    icon: "🛺",
    color: "#175cd3",
    bg: "#eff8ff",
    border: "#b2ddff",
    desc: "For easy in-campus transport",
    eta: "~5 min",
  },
  {
    type: "Tempo",
    icon: "🚛",
    color: "#7a5af8",
    bg: "#f4f3ff",
    border: "#d9d6fe",
    desc: "For shifting luggage and goods",
    eta: "~15 min",
  },
  {
    type: "Ambulance",
    icon: "🚑",
    color: "#d92d20",
    bg: "#fef3f2",
    border: "#fecdca",
    desc: "Emergency medical service",
    eta: "~3 min",
    emergency: true,
  },
];

const pickupLocations = [
  "Sukhna Hostel",
  "Tagore Hostel",
  "fountain Area",
  "B1 Block",
  "A1 Block",
  "Library B1",
  "C3 Block",
  "Food Republic",
  "A3 Block",
  "D1 Block",
  "D3 Block",
  "creative Food",
];

const dropLocations = [
  "Medical Centre",
  "Main Gate",
  "Admin Block",
  "Hostel Block A",
  "Hostel Block B",
  "Hostel Block C",
  "Sports Ground",
  "Canteen",
  "Library",
  "Railway Station",
  "Bus Stand",
  "City Hospital",
];

export default function BookService() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      navigate('/', { replace: true });
      return;
    }
    setCurrentUser(user);
  }, [navigate]);
  const [form, setForm] = useState({
    pickup: "",
    drop: "",
    note: "",
    urgency: "normal",
  });
  const [loading, setLoading] = useState(false);
  const [reqId] = useState("REQ" + Math.floor(1000 + Math.random() * 9000));

  const handleSelect = (service) => {
    setSelected(service);
    setStep(2);
  };

  const handleSubmit = () => {
    if (!form.pickup || !form.drop) return;
    setLoading(true);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const request = {
      reqId,
      userEmail: currentUser?.email || 'guest',
      service: selected?.type || 'N/A',
      pickup: form.pickup,
      drop: form.drop,
      urgency: form.urgency,
      note: form.note,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    existingRequests.push(request);
    localStorage.setItem('requests', JSON.stringify(existingRequests));

    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
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
          {[
            { icon: "🏠", label: "Dashboard" },
            { icon: "📋", label: "Book Service", active: true },
            { icon: "📍", label: "My Requests" },
            { icon: "👤", label: "Profile" },
          ].map((item) => (
            <button
              key={item.label}
              style={{
                ...styles.navItem,
                ...(item.active ? styles.navActive : {}),
              }}
              onClick={() => !item.active && navigate('/dashboard')}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Book a Service</h1>
            <p style={styles.pageSubtitle}>
              Choose service, enter details, and confirm your request
            </p>
          </div>
          <button
            style={styles.backBtn}
            onClick={() => (step > 1 ? setStep(step - 1) : navigate('/dashboard'))}
          >
            ← Back
          </button>
        </div>

        <div style={styles.progressWrap}>
          {["Choose Service", "Fill Details", "Confirmed"].map((label, i) => (
            <div key={label} style={styles.progressStep}>
              <div
                style={{
                  ...styles.progressCircle,
                  background: step >= i + 1 ? "#991b1b" : "#eaecf0",
                  color: step >= i + 1 ? "#fff" : "#667085",
                }}
              >
                {i + 1}
              </div>
              <span style={styles.progressLabel}>{label}</span>
              {i < 2 && <div style={styles.progressLine}></div>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Select your service</h2>
            <div style={styles.serviceGrid}>
              {services.map((s) => (
                <button
                  key={s.type}
                  style={{
                    ...styles.serviceCard,
                    background: s.bg,
                    border: `1.5px solid ${s.border}`,
                  }}
                  onClick={() => handleSelect(s)}
                >
                  {s.emergency && <div style={styles.emergencyTag}>Emergency</div>}
                  <div style={styles.serviceIcon}>{s.icon}</div>
                  <div style={{ ...styles.serviceName, color: s.color }}>{s.type}</div>
                  <div style={styles.serviceDesc}>{s.desc}</div>
                  <div style={{ ...styles.eta, color: s.color }}>ETA {s.eta}</div>
                  <div style={{ ...styles.selectBtn, background: s.color }}>Select</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selected && (
          <div style={styles.formCard}>
            <div style={styles.selectedHeader}>
              <div style={styles.selectedLeft}>
                <div style={styles.selectedIcon}>{selected.icon}</div>
                <div>
                  <div style={{ ...styles.selectedType, color: selected.color }}>
                    {selected.type}
                  </div>
                  <div style={styles.selectedDesc}>{selected.desc}</div>
                </div>
              </div>
              <button style={styles.changeBtn} onClick={() => setStep(1)}>
                Change
              </button>
            </div>

            {selected.type === "Ambulance" && (
              <div style={styles.alertBox}>
                🚨 Emergency booking will notify the campus medical response team.
              </div>
            )}

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Pickup Location *</label>
                <select
                  style={styles.input}
                  value={form.pickup}
                  onChange={(e) => setForm({ ...form, pickup: e.target.value })}
                >
                  <option value="">Select pickup location</option>
                  {pickupLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Drop Location *</label>
                <select
                  style={styles.input}
                  value={form.drop}
                  onChange={(e) => setForm({ ...form, drop: e.target.value })}
                >
                  <option value="">Select drop location</option>
                  {dropLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selected.type !== "Ambulance" && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Urgency</label>
                <div style={styles.urgencyRow}>
                  {["normal", "urgent"].map((u) => (
                    <button
                      key={u}
                      style={{
                        ...styles.urgencyBtn,
                        background: form.urgency === u ? "#991b1b" : "#fff",
                        color: form.urgency === u ? "#fff" : "#344054",
                        border: form.urgency === u
                          ? "1px solid #991b1b"
                          : "1px solid #d0d5dd",
                      }}
                      onClick={() => setForm({ ...form, urgency: u })}
                    >
                      {u === "normal" ? "Normal" : "Urgent"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Additional Note</label>
              <textarea
                rows={4}
                style={styles.textarea}
                placeholder="Enter any extra details here..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            <button
              style={{
                ...styles.submitBtn,
                opacity: !form.pickup || !form.drop ? 0.6 : 1,
              }}
              disabled={!form.pickup || !form.drop || loading}
              onClick={handleSubmit}
            >
              {loading ? "Submitting..." : `Confirm ${selected.type}`}
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successTitle}>Request Submitted Successfully</h2>
            <p style={styles.successText}>
              Your request has been placed and is now waiting for driver assignment.
            </p>

            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}>
                <span>Request ID</span>
                <strong>{reqId}</strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Service</span>
                <strong>
                  {selected?.icon} {selected?.type}
                </strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Pickup</span>
                <strong>{form.pickup}</strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Drop</span>
                <strong>{form.drop}</strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Status</span>
                <strong style={{ color: "#b54708" }}>Pending</strong>
              </div>
            </div>

            <div style={styles.successActions}>
              <button
                style={styles.outlineBtn}
                onClick={() => {
                  setStep(1);
                  setSelected(null);
                  setForm({ pickup: "", drop: "", note: "", urgency: "normal" });
                }}
              >
                New Request
              </button>
              <button style={styles.filledBtn} onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#101828",
  },
  pageSubtitle: {
    color: "#667085",
    marginTop: "6px",
  },
  backBtn: {
    border: "1px solid #d0d5dd",
    background: "#fff",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  progressStep: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  progressCircle: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },
  progressLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#475467",
  },
  progressLine: {
    width: "42px",
    height: "2px",
    background: "#d0d5dd",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
    border: "1px solid #f2f4f7",
  },
  cardTitle: {
    margin: "0 0 18px",
    fontSize: "20px",
    fontWeight: "800",
  },
  serviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },
  serviceCard: {
    position: "relative",
    borderRadius: "18px",
    padding: "20px",
    textAlign: "left",
    cursor: "pointer",
  },
  emergencyTag: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#fff",
    color: "#d92d20",
    borderRadius: "999px",
    padding: "5px 10px",
    fontSize: "11px",
    fontWeight: "800",
  },
  serviceIcon: {
    fontSize: "34px",
    marginBottom: "12px",
  },
  serviceName: {
    fontSize: "18px",
    fontWeight: "800",
  },
  serviceDesc: {
    fontSize: "13px",
    color: "#667085",
    marginTop: "6px",
  },
  eta: {
    marginTop: "10px",
    fontWeight: "700",
    fontSize: "13px",
  },
  selectBtn: {
    marginTop: "16px",
    color: "#fff",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: "800",
    textAlign: "center",
  },
  formCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
    border: "1px solid #f2f4f7",
    maxWidth: "900px",
  },
  selectedHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f2f4f7",
  },
  selectedLeft: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },
  selectedIcon: {
    fontSize: "34px",
  },
  selectedType: {
    fontWeight: "800",
    fontSize: "18px",
  },
  selectedDesc: {
    color: "#667085",
    fontSize: "13px",
  },
  changeBtn: {
    border: "1px solid #d0d5dd",
    background: "#fff",
    borderRadius: "10px",
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: "700",
  },
  alertBox: {
    background: "#fef3f2",
    border: "1px solid #fecdca",
    color: "#b42318",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "18px",
    fontWeight: "600",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  formGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#344054",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d0d5dd",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
  urgencyRow: {
    display: "flex",
    gap: "10px",
  },
  urgencyBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    background: "#fff",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d0d5dd",
    fontSize: "14px",
    boxSizing: "border-box",
    resize: "vertical",
    outline: "none",
  },
  submitBtn: {
    width: "100%",
    border: "none",
    background: "#991b1b",
    color: "#fff",
    padding: "14px",
    borderRadius: "14px",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "15px",
  },
  successCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
    border: "1px solid #f2f4f7",
    maxWidth: "700px",
    textAlign: "center",
  },
  successIcon: {
    fontSize: "54px",
    marginBottom: "10px",
  },
  successTitle: {
    margin: "0 0 8px",
    fontSize: "24px",
    fontWeight: "800",
  },
  successText: {
    color: "#667085",
    marginBottom: "22px",
  },
  summaryBox: {
    background: "#f9fafb",
    borderRadius: "16px",
    padding: "18px",
    textAlign: "left",
    marginBottom: "20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eaecf0",
    fontSize: "14px",
  },
  successActions: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },
  outlineBtn: {
    border: "1px solid #991b1b",
    background: "#fff",
    color: "#991b1b",
    padding: "11px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "800",
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
