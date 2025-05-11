import { useEffect, useRef, useMemo } from "react";
import { SSE } from "sse.js";
import useToken from "./useToken";

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Subscribe to a server-sent event stream.
 *
 * @param path      the API path, e.g. "/sse/notifications" or `/sse/${requestId}`
 * @param eventName the name of the SSE event, e.g. "message" or "notification:volunteer"
 * @param handler   callback invoked on each event
 */
export function useEventSource(
  path: string,
  eventName: string,
  handler: (ev: MessageEvent) => void
) {
  const { token } = useToken();

  // Build the full URL once per `path`
  const url = useMemo(() => apiUrl + path, [path]);

  // Keep the *latest* handler in a ref so we don't need to re-subscribe on each render
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Hold our SSE instance so we can close it later
  const srcRef = useRef<SSE>();

  // 1) Open & subscribe once per [url, eventName]
  useEffect(() => {
    if (!token) return; // wait for a valid token

    const src = new SSE(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    src.stream();
    srcRef.current = src;

    const listener = (ev: MessageEvent) => {
      handlerRef.current(ev);
    };
    src.addEventListener(eventName, listener);

    return () => {
      src.removeEventListener(eventName, listener);
      src.close();
      srcRef.current = undefined;
    };
  }, [url, eventName]); // ← no `token` here so JWT rotations don’t re-open

  // 2) If user logs out (token→null), tear down the stream
  useEffect(() => {
    if (token) return;
    if (srcRef.current) {
      srcRef.current.close();
      srcRef.current = undefined;
    }
  }, [token]);
}
