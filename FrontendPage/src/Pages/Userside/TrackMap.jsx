import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const pointIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const pickupLocation = [30.7685, 76.5758];
const dropLocation = [30.7708, 76.5782];

const routePoints = [
  [30.7640, 76.5700],
  [30.7652, 76.5717],
  [30.7664, 76.5730],
  [30.7673, 76.5742],
  [30.7685, 76.5758],
];

function TrackMap() {
  const [step, setStep] = useState(0);
  const [vehiclePosition, setVehiclePosition] = useState(routePoints[0]);

  useEffect(() => {
    if (step >= routePoints.length - 1) return;

    const timer = setTimeout(() => {
      const nextStep = step + 1;
      setStep(nextStep);
      setVehiclePosition(routePoints[nextStep]);
    }, 2000);

    return () => clearTimeout(timer);
  }, [step]);

  const remainingSteps = routePoints.length - 1 - step;
  const eta = remainingSteps * 2;

  return (
    <div style={{ marginTop: "20px" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #eaecf0",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "14px",
        }}
      >
        <h3 style={{ margin: "0 0 8px", color: "#101828" }}>Vehicle Tracking</h3>
        <p style={{ margin: "6px 0" }}><strong>Status:</strong> Driver is on the way</p>
        <p style={{ margin: "6px 0" }}><strong>ETA:</strong> {eta} min</p>
      </div>

      <MapContainer
        center={pickupLocation}
        zoom={16}
        style={{ height: "400px", width: "100%", borderRadius: "16px" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={pickupLocation} icon={pointIcon}>
          <Popup>Pickup Location</Popup>
        </Marker>

        <Marker position={dropLocation} icon={pointIcon}>
          <Popup>Drop Location</Popup>
        </Marker>

        <Marker position={vehiclePosition} icon={vehicleIcon}>
          <Popup>Vehicle Current Location</Popup>
        </Marker>

        <Polyline positions={[vehiclePosition, pickupLocation]} />
      </MapContainer>
    </div>
  );
}

export default TrackMap;