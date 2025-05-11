import { useEffect, useRef, useMemo } from "react";
import { SSE } from "sse.js";
import useToken from "./useToken";

const apiUrl = import.meta.env.VITE_API_URL;

export default function useSSE(
  type: "requests" | "notifications" | "messages",
  requestId?: string
) {
  const { token } = useToken();

  // 1) build the URL whenever type or requestId changes
  const url = useMemo(() => {
    switch (type) {
      case "requests":
        return `${apiUrl}/sse/${requestId}`;
      case "notifications":
        return `${apiUrl}/sse/notifications`;
      case "messages":
        return `${apiUrl}/sse/recieve_message`;
    }
  }, [type, requestId]);

  // 2) hold the SSE instance
  const sourceRef = useRef<SSE | null>(null);

  // 3) effect: open exactly once per url (on mount/url change), ignore token churn
  useEffect(() => {
    // only open if we *currently* have a token
    if (!token) return;

    const src = new SSE(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    src.stream();
    sourceRef.current = src;

    return () => {
      // cleanup on unmount or url change
      src.close();
      sourceRef.current = null;
    };
  }, [url]); // <-- note: token is NOT here

  // 4) effect: if token goes null (logout), tear down existing connection
  useEffect(() => {
    if (token) return;            // only run when token flips to falsey
    if (sourceRef.current) {
      sourceRef.current.close();   // close the live connection
      sourceRef.current = null;
    }
  }, [token]);

  return { source: sourceRef.current! };
}
