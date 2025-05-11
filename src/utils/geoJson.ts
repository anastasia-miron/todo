import { FeatureCollection, Polygon, MultiPolygon } from "geojson";

export const getRegionNameFromGeoJSON = (
  lat: number,
  lng: number,
  regions: FeatureCollection<Polygon | MultiPolygon, any>
): { iso: string; name: string } | null => {
  const isIntersect = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number
  ) => y1 > y !== y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;

  const isInsidePolygon = (vertices: number[][], x: number, y: number) => {
    let intersections = 0;
    const n = vertices.length;

    for (let i = 0; i < n; i++) {
      const x1 = vertices[i][0];
      const y1 = vertices[i][1];
      const x2 = vertices[(i + 1) % n][0];
      const y2 = vertices[(i + 1) % n][1];

      if (isIntersect(x1, y1, x2, y2, x, y)) {
        intersections++;
      }
    }

    return intersections % 2 === 1;
  };

  for (const feat of regions.features) {
    const geom = feat.geometry;
    // collect one or more arrays of linear-rings
    const polygons: number[][][] =
      geom.type === "Polygon"
        ? (geom.coordinates as number[][][])
        : geom.type === "MultiPolygon"
        ? // flatten all rings of all sub-polygons
          (geom.coordinates as number[][][][]).flat()
        : [];

    for (const ring of polygons) {
      // GeoJSON coords are [lng, lat], but our point-in-poly wants [lat, lng]
      const latLngRing = ring.map(([lng0, lat0]) => [lat0, lng0]);

      if (isInsidePolygon(latLngRing, lat, lng)) {
        // found it!
        return {
          iso: feat.properties?.["shapeISO"] ?? null,
          name: feat.properties?.["shapeName"] ?? null,
        };
      }
    }
  }

  return null;
};
