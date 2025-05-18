import React, { useEffect, useMemo, useState } from "react";
import { Navigation, X } from "lucide-react";
import { RequestUrgencyEnum } from "../typings/models";
import { LocationPayload, RequestPayload } from "../typings/types";
import { useFormik } from "formik";
import { requestSchema } from "../schemas";
import "./RequestFormModal.css";
import { Autocomplete } from "./PlaceAutoComplete";
import { MoldovaOnlyMap } from "./MoldovaMap";
import { Badge } from "./Badge";
import { getRegionNameFromGeoJSON } from "../utils/geoJson";
import regionsGeoJson from "../data/moldova.region.geo.json";
import type { FeatureCollection, MultiPolygon } from "geojson";
import { Polygon } from "leaflet";
import apiService from "../services/api.service";

interface Props {
  request?: RequestPayload;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RequestPayload) => void;
}

const DEFAULT_VALUE: RequestPayload = {
  location: { address: "", lat: 0, lng: 0 },
  description: "",
  title: "",
  urgency: RequestUrgencyEnum.MEDIUM,
};

const RequestFormModal: React.FC<Props> = (props) => {
  const { request, onClose, onSubmit, open } = props;
  const [volutersByRegion, setVolunteersByRegion] = useState<{
    counter: number;
    region: string;
  }>();
  const [markerPos, setMarkerPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
    dirty,
    isValid,
    isSubmitting,
    errors,
  } = useFormik({
    initialValues: DEFAULT_VALUE,
    validationSchema: requestSchema,
    onSubmit,
  });

  useEffect(() => {
    if (request) {
      setValues(request);
      if (request.location.lat) {
        setMarkerPos({ lat: request.location.lat, lng: request.location.lng });
      }
    }
  }, [request]);

  useEffect(() => {
    if (markerPos) {
      const matchedRegion = getRegionNameFromGeoJSON(
        markerPos.lat,
        markerPos.lng,
        regionsGeoJson as FeatureCollection<Polygon | MultiPolygon, any>
      );

      if (!matchedRegion) {
        setVolunteersByRegion({ counter: 0, region: "Unknown" });
        return;
      }

      // 2) call your new endpoint
      apiService
        .get<{ iso: string; name: string; volunteer_count: number }>(
          `/regions/${matchedRegion.iso}/volunteer`
        )
        .then((res) => {
          if (!res.success) {
            setVolunteersByRegion({ counter: 0, region: matchedRegion.name });
          } else {
            setVolunteersByRegion({
              counter: res.data.volunteer_count,
              region: res.data.name,
            });
          }
        })
        .catch(() => {
          setVolunteersByRegion({ counter: 0, region: matchedRegion.name });
        });
    }
  }, [markerPos]);

  const MemoizedMap = useMemo(
    () => <MoldovaOnlyMap mode="setMarker" markerPos={markerPos} />,
    [markerPos]
  );

  const handlePlaceSelect = (place: LocationPayload) => {
    console.log("test",place);
    setFieldValue("location", place);
    console.log('values', values)

    setMarkerPos({ lat: place.lat, lng: place.lng });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        console.log(lat, lng);

        // reverse‐geocode via Google Maps Geocoder
        if (window.google?.maps?.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
              // feed both address coords into your existing flow
              handlePlaceSelect({
                address: results[0].formatted_address,
                lat,
                lng,
              });
            } else {
              // fallback: just set marker
              setMarkerPos({ lat, lng });
            }
          });
        } else {
          setMarkerPos({ lat, lng });
        }
      },
      (err) => {
        console.error(err);
        alert("Eroare la obținerea locației.");
      }
    );
  };

  if (!open) return null;

  return (
    <dialog open={open}>
      <div className="relative bg-white dark:bg-gray-900 max-md:w-full! max-md:h-full flex flex-col">
        <div className="cursor-pointer" onClick={onClose}>
          <Badge
            className="absolute w-10 h-10 z-999 top-2 shadow-xl right-2"
            variant="default"
          >
            <X />
          </Badge>
        </div>

        <div className="flex-1 mb-4 relative">
          {MemoizedMap}
          <div className="cursor-pointer" onClick={handleUseCurrentLocation}>
            <Badge
              className="absolute w-10 h-10 z-999 bottom-5 shadow-xl right-2"
              variant="default"
            >
              <Navigation />
            </Badge>
          </div>
          {volutersByRegion && (
            <div className="absolute bottom-5 h-10 p-2 left-7 rounded-full text-white z-999 bg-[#4485e6] opacity-90">
              Aveți {volutersByRegion.counter} voluntar
              {volutersByRegion.counter !== 1 ? "s" : ""} disponibil în regiunea{" "}
              {volutersByRegion.region}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between m-3">
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              type="text"
              placeholder="Titlu"
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby="error-title"
              value={values.title}
              onChange={handleChange}
              required
            />
            {errors.title && <small id="error-title">{errors.title}</small>}
            <textarea
              name="description"
              placeholder="Descriere"
              aria-invalid={errors.description ? "true" : "false"}
              aria-describedby="error-description"
              value={values.description}
              onChange={handleChange}
              required
            />
            {errors.description && (
              <small id="error-description">{errors.description}</small>
            )}
            <Autocomplete
              value={values.location.address}
              onChange={(value) => setFieldValue("location.address", value)}
              onSelect={handlePlaceSelect}
            />
            <select
              name="urgency"
              value={values.urgency}
              onChange={handleChange}
            >
              <option value={RequestUrgencyEnum.LOW}>Urgență scăzută</option>
              <option value={RequestUrgencyEnum.MEDIUM}>Urgență medie</option>
              <option value={RequestUrgencyEnum.HIGH}>Urgență ridicată</option>
            </select>
            <footer>
              <button
                type="submit"
                disabled={!dirty || !isValid}
                aria-busy={isSubmitting}
              >
                Salvează
              </button>
            </footer>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default RequestFormModal;
