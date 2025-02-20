import { SSE } from 'sse.js';
import useToken from './useToken';
import { useMemo } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

const useSSE = (requestId: string) => {
    const { token } = useToken();

    const source = useMemo(() => {
        return new SSE(`${apiUrl}/sse/${requestId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
    }, [token]);

    return { source,  };
}

export default useSSE;

