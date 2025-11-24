"use client";

import { useMemo } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { ServiceArea } from "@/lib/data/service-areas";

interface ServiceAreaMapProps {
  areas: ServiceArea[];
  highlightedArea?: string | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "500px",
  borderRadius: "1rem",
};

const center = {
  lat: -27.28, // Approx center of North Brisbane/Moreton Bay
  lng: 153.02,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9c9c9" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
  ],
};

export default function ServiceAreaMap({ areas, highlightedArea }: ServiceAreaMapProps) {
  // Generate spider net connections
  const connections = useMemo(() => {
    const lines: { path: { lat: number; lng: number }[] }[] = [];
    const maxConnections = 3; // Connect to 3 nearest neighbors

    areas.forEach((area, i) => {
      // Find distances to all other points
      const distances = areas
        .map((other, j) => {
          if (i === j) return null;
          const d = Math.sqrt(
            Math.pow(area.lat - other.lat, 2) + Math.pow(area.lng - other.lng, 2)
          );
          return { index: j, distance: d };
        })
        .filter((item): item is { index: number; distance: number } => item !== null)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxConnections);

      distances.forEach((conn) => {
        const target = areas[conn.index];
        // Avoid duplicate lines (only draw if current index < target index)
        // Actually, for a "net", drawing both ways is fine, but redundant.
        // Let's just draw all to ensure connectivity visually.
        lines.push({
          path: [
            { lat: area.lat, lng: area.lng },
            { lat: target.lat, lng: target.lng },
          ],
        });
      });
    });

    return lines;
  }, [areas]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={11}
      center={center}
      options={options}
    >
      {/* Spider Net Lines */}
      {connections.map((line, idx) => (
        <Polyline
          key={idx}
          path={line.path}
          options={{
            strokeColor: "#e5e7eb", // Light gray
            strokeOpacity: 0.8,
            strokeWeight: 1,
          }}
        />
      ))}

      {/* Markers */}
      {areas.map((area) => (
        <Marker
          key={area.name}
          position={{ lat: area.lat, lng: area.lng }}
          title={area.name}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: highlightedArea === area.name ? 8 : 5,
            fillColor: highlightedArea === area.name ? "#2563eb" : "#6b7280", // Blue if highlighted, Gray otherwise
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }}
          animation={highlightedArea === area.name ? google.maps.Animation.BOUNCE : undefined}
        />
      ))}
    </GoogleMap>
  );
}
