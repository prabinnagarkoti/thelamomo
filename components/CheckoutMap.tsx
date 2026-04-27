"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default Leaflet icons in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Center updater component to smoothly move map 
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface MapProps {
  location: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function CheckoutMap({ location, onLocationSelect }: MapProps) {
  const center: [number, number] = location ? [location.lat, location.lng] : [-33.8688, 151.2093];

  return (
    <div className="h-56 rounded-xl overflow-hidden border border-white/10 mt-3 shadow-2xl relative z-10 block w-full">
      <MapContainer
        center={center}
        zoom={location ? 16 : 10}
        style={{ height: "100%", width: "100%", backgroundColor: "#020617" }}
        zoomControl={false}
      >
        {/* CartoDB Dark Matter Base Map for Uber-like aesthetic */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        {location && <Marker position={center} icon={customIcon} />}
        {location && <MapUpdater center={center} />}
        <MapEvents onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
