// MoldovaMap.tsx
import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  Marker,
} from "react-leaflet";
import type { Feature, Polygon, MultiPolygon } from "geojson";
import moldovaGeoJson from "../data/moldova.geo.json";
import regionsGeoJson from "../data/moldova.region.geo.json";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { RegionsModel } from "../typings/models";

// ——— helper to lock pan/zoom to Moldova’s bbox ———
function BoundsSetter() {
  const map = useMap();
  React.useEffect(() => {
    map.setMaxBounds([
      [45.45, 26.62], // SW corner
      [48.5, 30.15], // NE corner
    ]);
    map.setMinZoom(7);
    map.setMaxZoom(14);
    map.setView([47.2, 28.6], 7);
  }, [map]);
  return null;
}

export interface MoldovaOnlyMapProps {
  markerPos?: { lat: number; lng: number };
  mode: "selection" | "show" | "setMarker";
  onRegionSelect?: (regionCode: RegionsModel, lat: number, lng: number) => void;
  selectedRegions?: RegionsModel[];
  availableRegions?: RegionsModel[];
}

export const MoldovaOnlyMap: React.FC<MoldovaOnlyMapProps> = ({
  markerPos,
  mode,
  onRegionSelect,
  selectedRegions,
  availableRegions,
}) => {
  // ——— 1. Grab the raw coords out of your GeoJSON feature ———
  const feat = moldovaGeoJson.features[0];
  const rawCoords = feat.geometry.coordinates;

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

  // ——— 2. Pull out all the *outer* rings as [lng,lat][][] ———
  //    (for Polygon it’s directly coordinates: [ [lng,lat], [lng,lat], … ]
  //     for MultiPolygon you get [ [ [lng,lat], … ], … ] )
  let rings: [number, number][][] = [];
  if (feat.geometry.type === "Polygon") {
    rings = rawCoords as [number, number][][];
  } else {
    // MultiPolygon: pick each polygon’s first ring
    rings = (rawCoords as [number, number][][][]).map((poly) => poly[0]);
  }

  // ——— 3. Define a world-spanning exterior ring (closed!) ———
  const worldRing: [number, number][] = [
    [-180, -90],
    [180, -90],
    [180, 90],
    [-180, 90],
    [-180, -90], // repeat first to close
  ];

  // ——— 4. Build one GeoJSON Feature whose geometry has two+ rings: ———
  //        first the world, then *every* Moldova outer ring as a hole
  const maskFeature: Feature<Polygon> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [worldRing, ...rings],
    },
  };

  const FlyToMarker: React.FC<{ pos: { lat: number; lng: number } }> = ({
    pos,
  }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo([pos.lat, pos.lng], 15);
    }, [pos, map]);
    return null;
  };

  const styleFn = (feature: Feature) => {
    const isoCode = feature?.properties?.shapeISO;

    if (selectedRegions) {
      return selectedRegions.some(
        (selectedRegion) => selectedRegion.iso == isoCode
      )
        ? selectedStyle
        : defaultStyle;
    }

    console.log("test if here executed");
    return defaultStyle;
  };

  const geoJsonRef = useRef<any>(null);

  // Whenever selectedRegions changes, update each polygon’s data-selected & style
  useEffect(() => {
    const layerGroup = geoJsonRef.current;
    console.log("test", layerGroup, selectedRegions, availableRegions);

    if (!layerGroup) return;
    if (!selectedRegions) return;
    if (!availableRegions) return;

    layerGroup.eachLayer((layer: any) => {
      const isoCode = layer.feature.properties.shapeISO;
      const region = availableRegions.find((r) => r.iso === isoCode);
      if (!region) return;

      console.log("test");

      const isSel = selectedRegions.some((sel) => sel.id === region.id);
      const el = layer.getElement();

      // toggle the attribute
      el.setAttribute("data-selected", isSel ? "true" : "false");

      // update style too
      layer.setStyle(isSel ? selectedStyle : defaultStyle);
    });
  }, [selectedRegions]);

  const onEachFeature = (feature: Feature, layer: any) => {
    const isoCode = feature.properties.shapeISO;

    if (selectedRegions && availableRegions) {
      const region = availableRegions.find((r) => r.iso === isoCode);
      console.log(region, selectedRegions)
      if (region) {
        const isSel = selectedRegions.some((sel) => sel.id === region.id);

        layer.once("add", () => {
          const el: SVGElement | undefined = layer.getElement();
          if (el) {
            el.setAttribute("data-selected", isSel ? "true" : "false");
          }
        });
        
      }
    }

    if (mode === "selection" || mode === "show") {
      layer.on({
        click:
          mode === "selection"
            ? (e: any) => {
                if (availableRegions && onRegionSelect) {
                  const region = availableRegions.find(
                    (r) => r.iso === isoCode
                  );
                  if (!region) return;
                  onRegionSelect(region, e.latlng.lat, e.latlng.lng);

                  const poly = e.target as L.Path;
                  poly.setStyle(selectedStyle);
                  const el = layer.getElement();
                  const isSel = el.getAttribute("data-selected") === "true";
                  el.setAttribute("data-selected", isSel ? "false" : "true");
                }
              }
            : null,

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
    }
  };

  return (
    <MapContainer style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <BoundsSetter />

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* outline Moldova in blue */}
      <GeoJSON
        data={feat as Feature<Polygon | MultiPolygon>}
        style={{ color: "#0172ad", weight: 2, fillOpacity: 0 }}
      />

      {/* mask everything *outside* Moldova in green */}
      <GeoJSON
        data={maskFeature}
        style={{
          fillColor: "#015DEB",
          fillOpacity: 0.3,
          stroke: false,
          fillRule: "evenodd", // ← critical so the second+ rings become *holes*
        }}
      />

      {(mode === "selection" || mode === "show") && (
        <GeoJSON
          ref={geoJsonRef}
          data={regionsGeoJson}
          style={styleFn}
          onEachFeature={onEachFeature}
        />
      )}

      {markerPos && (
        <>
          <FlyToMarker pos={markerPos} />
          <Marker
            keyboard={false}
            position={[markerPos.lat, markerPos.lng] as LatLngExpression}
            // icon={svgFileIcon}
          />
        </>
      )}
    </MapContainer>
  );
};
