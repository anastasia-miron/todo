// components/VolunteerRegionsMap.tsx
import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature } from "geojson";
import regionsGeoJson from "../data/moldova.region.geo.json";
import "leaflet/dist/leaflet.css";

interface Props {
  onRegionSelect: (regionCode: string, lat: number, lng: number) => void;
  selectedRegions: string[];
}

export const VolunteerRegionsMap: React.FC<Props> = ({
  onRegionSelect,
  selectedRegions,
}) => {
  const defaultStyle = {
    color: "#444",
    weight: 1,
    fillOpacity: 0.2,
  };
  const highlightStyle = {
    color: "#333",
    weight: 2,
    fillOpacity: 0.4,
  };
  const highlightSelectedStyle = {
    color: "#003b00",
    weight: 2,
    fillOpacity: 0.6,
  };
  const selectedStyle = {
    color: "#006400", // dark green
    weight: 2,
    fillOpacity: 0.6,
  };


  const styleFn = (feature: Feature) => {
    const code = feature.properties.shapeName;
    return selectedRegions.includes(code) ? selectedStyle : defaultStyle;
  };

  const onEachFeature = (feature: Feature, layer: any) => {
    const code = feature.properties.shapeName;

    layer.on({
      click: (e: any) => {
        onRegionSelect(code, e.latlng.lat, e.latlng.lng);

  
        const poly = e.target as L.Path;
        poly.setStyle(selectedStyle);
        const el = layer.getElement();
        const isSel = el.getAttribute("data-selected") === "true";
        el.setAttribute("data-selected", isSel ? "false" : "true");
      },

      mouseover: (e: any) => {
        const poly = e.target as L.Path;
        const el = layer.getElement();
        const isSel = el.getAttribute("data-selected") === "true";
        poly.setStyle(isSel ? highlightSelectedStyle : highlightStyle);
      },

      mouseout: (e: any) => {
        const el = layer.getElement();
        const isSel = el.getAttribute("data-selected") === "true";
        layer.setStyle(isSel ? selectedStyle : defaultStyle);
      },
    });

    layer.bindTooltip(feature.properties.shapeName, { sticky: true });
  };

  return (
    <MapContainer
      center={[47.2, 28.6]}
      zoom={7}
      style={{ height: 400, width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON
        ref={geoJsonRef}
        data={regionsGeoJson}
        style={styleFn}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};
