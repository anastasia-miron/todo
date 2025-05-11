import { useEffect, useCallback, useRef, useState } from "react";
import debounceFn from "lodash.debounce";

import { isBrowser, loadGoogleMapScript } from "../utils/google";

const GOOGLE_MAP_SCRIPT_BASE_URL = "https://maps.googleapis.com/maps/api/js";

interface usePlacesAutocompleteServiceConfig {
  apiKey?: string;
  libraries?: string[];
  googleMapsScriptBaseUrl?: string;
  debounce?: number;
  options?: google.maps.places.AutocompletionRequest;
  sessionToken?: boolean;
  language?: string;
}

interface usePlacesAutocompleteServiceResponse {
  placesService: google.maps.places.PlacesService | null;
  autocompleteSessionToken:
    | google.maps.places.AutocompleteSessionToken
    | undefined;
  placesAutocompleteService: google.maps.places.AutocompleteService | null;
  placePredictions: google.maps.places.AutocompletePrediction[];
  isPlacePredictionsLoading: boolean;
  getPlacePredictions: (opt: google.maps.places.AutocompletionRequest) => void;
  queryPredictions: google.maps.places.QueryAutocompletePrediction[];
  isQueryPredictionsLoading: boolean;
  getQueryPredictions: (
    opt: google.maps.places.QueryAutocompletionRequest
  ) => void;
  refreshSessionToken: () => void;
}

export default function usePlacesAutocompleteService({
  apiKey,
  libraries = "places",
  googleMapsScriptBaseUrl = GOOGLE_MAP_SCRIPT_BASE_URL,
  debounce = 300,
  options = {},
  sessionToken,
  language,
}: usePlacesAutocompleteServiceConfig): usePlacesAutocompleteServiceResponse {
  const languageQueryParam = language ? `&language=${language}` : "";
  const googleMapsScriptUrl = `${googleMapsScriptBaseUrl}?key=${apiKey}&libraries=${libraries}${languageQueryParam}`;
  const [placePredictions, setPlacePredictions] = useState([]);
  const [isPlacePredsLoading, setIsPlacePredsLoading] = useState(false);
  const [placeInputValue, setPlaceInputValue] = useState(null);
  const [isQueryPredsLoading, setIsQueryPredsLoading] = useState(false);
  const [queryInputValue, setQueryInputValue] = useState(false);
  const [queryPredictions, setQueryPredictions] = useState([]);
  const placesAutocompleteService = useRef(null);
  const placesService = useRef(null);
  const autocompleteSession = useRef(null);
  const handleLoadScript = useCallback(
    () => loadGoogleMapScript(googleMapsScriptBaseUrl, googleMapsScriptUrl),
    [googleMapsScriptBaseUrl, googleMapsScriptUrl]
  );

  const debouncedPlacePredictions = useCallback(
    debounceFn((optionsArg) => {
      if (placesAutocompleteService.current && optionsArg.input)
        placesAutocompleteService.current.getPlacePredictions(
          {
            ...(sessionToken && autocompleteSession.current
              ? { sessionToken: autocompleteSession.current }
              : {}),
            ...options,
            ...optionsArg,
          },
          (r) => {
            setIsPlacePredsLoading(false);
            setPlacePredictions(r || []);
          }
        );
    }, debounce),
    [debounce]
  );

  const debouncedQueryPredictions = useCallback(
    debounceFn((optionsArg) => {
      if (placesAutocompleteService.current && optionsArg.input)
        placesAutocompleteService.current.getQueryPredictions(
          {
            ...(sessionToken && autocompleteSession.current
              ? { sessionToken: autocompleteSession.current }
              : {}),
            ...options,
            ...optionsArg,
          },
          (r) => {
            setIsQueryPredsLoading(false);
            setQueryPredictions(r || []);
          }
        );
    }, debounce),
    [debounce]
  );

  useEffect(() => {
    if (!isBrowser) return;

    const buildService = () => {
      // eslint-disable-next-line no-undef
      if (!google)
        return console.error(
          "Google has not been found. Make sure your provide apiKey prop."
        );

      // eslint-disable-next-line no-undef
      placesAutocompleteService.current =
        new google.maps.places.AutocompleteService();

      // eslint-disable-next-line no-undef
      placesService.current = new google.maps.places.PlacesService(
        document.createElement("div")
      );

      if (sessionToken)
        autocompleteSession.current =
          new google.maps.places.AutocompleteSessionToken();
    };

    if (apiKey) {
      handleLoadScript().then(() => buildService());
    } else {
      buildService();
    }
  }, []);

  return {
    placesService: placesService.current,
    autocompleteSessionToken: autocompleteSession.current,
    placesAutocompleteService: placesAutocompleteService.current,
    placePredictions: placeInputValue ? placePredictions : [],
    isPlacePredictionsLoading: isPlacePredsLoading,
    getPlacePredictions: (opt) => {
      if (opt.input) {
        setPlaceInputValue(opt.input);
        setIsPlacePredsLoading(true);
        debouncedPlacePredictions(opt);
        return;
      }
      setPlacePredictions([]);
      setPlaceInputValue(null);
      debouncedPlacePredictions(opt);
      setIsPlacePredsLoading(false);
    },
    queryPredictions: queryInputValue ? queryPredictions : [],
    isQueryPredictionsLoading: isQueryPredsLoading,
    getQueryPredictions: (opt) => {
      if (opt.input) {
        setQueryInputValue(opt.input);
        setIsQueryPredsLoading(true);
        debouncedQueryPredictions(opt);
        return;
      }
      setQueryPredictions([]);
      setQueryInputValue(null);
      debouncedQueryPredictions(opt);
      setIsQueryPredsLoading(false);
    },
    refreshSessionToken: () => {
      autocompleteSession.current =
        new google.maps.places.AutocompleteSessionToken();
    },
  };
}
