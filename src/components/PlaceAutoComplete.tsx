import { useState, useRef, useEffect } from "react";
import useGoogle from "../services/useAutocomplete.service";
import { LocationPayload } from "../typings/types";

export interface AutocompleteProps {
  onSelect: (place: LocationPayload) => void;
  value?: string;
  onChange?: (v: string) => void;
}

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
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    options: { componentRestrictions: { country: "md" },   },
    debounce: 600,
  });

  const [inputValue, setInputValue] = useState(value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  // **NEW**: track drop direction
  const [dropDirection, setDropDirection] = useState<"down" | "up">("down");
  const containerRef = useRef<HTMLDivElement>(null);

  // Mirror external value
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // **NEW**: recalc dropDirection when menu opens, on scroll/resize
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const checkPosition = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // ~200px max height of dropdown
      if (spaceBelow < 150 && spaceAbove > spaceBelow) {
        setDropDirection("up");
      } else {
        setDropDirection("down");
      }
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);
    window.addEventListener("scroll", checkPosition, true);
    return () => {
      window.removeEventListener("resize", checkPosition);
      window.removeEventListener("scroll", checkPosition, true);
    };
  }, [isOpen]);

  const openAndFetch = (v: string) => {
    setInputValue(v);
    setIsOpen(!!v);
    onChange?.(v);
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
      setHighlightIndex((i) =>
        i < placePredictions.length - 1 ? i + 1 : i
      );
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
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={inputValue}
        placeholder="Address in Moldova…"
        onChange={(e) => openAndFetch(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => inputValue && setIsOpen(true)}
        className="w-full p-2 border rounded"
      />

      {isOpen && (
        <div
          className={`absolute z-10 w-full bg-white dark:bg-gray-800  border rounded shadow max-h-[150px] overflow-y-auto
            ${dropDirection === "down" ? "top-full mt-1" : "bottom-full mb-1"}`}
        >
          {isPlacePredictionsLoading ? (
            <div className="p-2">Loading…</div>
          ) : placePredictions.length ? (
            placePredictions.map((p, i) => (
              <div
                key={p.place_id}
                onMouseDown={() => select(p.place_id, p.description)}
                onMouseEnter={() => setHighlightIndex(i)}
                className={`px-2 py-2 cursor-pointer dark:hover:bg-gray-700 ${
                  i === highlightIndex ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
              >
                {p.description}
              </div>
            ))
          ) : (
            <div className="p-2">No results</div>
          )}
        </div>
      )}
    </div>
  );
};
