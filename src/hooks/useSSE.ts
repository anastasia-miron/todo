import { SSE } from "sse.js";
import useToken from "./useToken";
import { useMemo } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const useSSE = (
  type: "requests" | "notifications" | "messages",
  requestId?: string
) => {
  const { token } = useToken();

  const url = useMemo(() => {
    switch (type) {
      case "requests":
        return `${apiUrl}/sse/${requestId}`;
      case "notifications":
        return `${apiUrl}/sse/notifications`;
      case "messages":
        return `${apiUrl}/sse/recieve_message`;
    }
  }, [requestId, type]);

  const source = useMemo(() => {
    return new SSE(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [token, url]);

  source.onabort = () => console.log("Abort");

  return { source };
};

export default useSSE;
