import { useState, useRef, useEffect } from "react";
import useGoogle from "../services/useAutocomplete.service";
import { LocationPayload } from "../typings/types";

export interface AutocompleteProps {
  onSelect: (place: LocationPayload) => void;
  value?: string;
  onChange?: (v: string) => void;
}


// TO DO: Replace key for google
export const Autocomplete: React.FC<AutocompleteProps> = ({
  onSelect,
  value,
  onChange,
}) => {
  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
    placesService,
  } = useGoogle({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    options: {
      componentRestrictions: { country: "md" },
    },
    debounce: 600,
  });

  const [inputValue, setInputValue] = useState(value ?? "");

  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);
  // close dropdown on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const openAndFetch = (v: string) => {
    setInputValue(v);
    setIsOpen(!!v);
    if (onChange) {
      onChange(v);
    }
    getPlacePredictions({ input: v });
    setHighlightIndex(0);
  };

  const select = (placeId: string, address: string) => {
    if (!placesService) return;
    placesService.getDetails(
      { placeId, fields: ["geometry"] },
      (res, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          res?.geometry
        ) {
          const loc = res.geometry.location;
          onSelect({ address, lat: loc.lat(), lng: loc.lng() });
          setInputValue(address);
          setIsOpen(false);
        }
      }
    );
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i < placePredictions.length - 1 ? i + 1 : i));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const sel = placePredictions[highlightIndex];
      if (sel) select(sel.place_id, sel.description);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full ">
      <input
        type="text"
        value={inputValue}
        placeholder="Address in Moldova…"
        onChange={(e) => openAndFetch(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => inputValue && setIsOpen(true)}
        style={{
          width: "100%",
          padding: "8px",
          boxSizing: "border-box",
        }}
      />

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: 200,
            overflowY: "auto",
            background: "white",
            border: "1px solid #ccc",
            zIndex: 10,
          }}
        >
          {isPlacePredictionsLoading ? (
            <div style={{ padding: 8 }}>Loading…</div>
          ) : placePredictions.length ? (
            placePredictions.map((p, i) => (
              <div
                key={p.place_id}
                onMouseDown={() => select(p.place_id, p.description)}
                onMouseEnter={() => setHighlightIndex(i)}
                style={{
                  padding: "8px",
                  background: i === highlightIndex ? "#eee" : "transparent",
                  cursor: "pointer",
                }}
              >
                {p.description}
              </div>
            ))
          ) : (
            <div style={{ padding: 8 }}>No results</div>
          )}
        </div>
      )}
    </div>
  );
};
