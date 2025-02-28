import { useEffect, useState } from "react";
import useAbortSignal from "./useAbortSignal";
import apiService from "../services/api.service";

const useToken = () => {
    const initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);

    const signal = useAbortSignal();

    useEffect(() => {
        const ctrl = new AbortController();
        window.addEventListener('storage', () => {
            const val = localStorage.getItem('token');
            setToken(val)
        }, { signal: ctrl.signal });
        return () => {
            ctrl.abort();
        }
    }, [])

    const updateToken = (val: string | null) => {
        setToken(val);
        if (val === null) {
            localStorage.removeItem('token');
        } else {
            localStorage.setItem('token', val);
        }
        window.dispatchEvent(new Event('storage'));
    }


    const refreshToken = async () => {
        const response = await apiService.post<string>('/auth/refresh-token', {}, { signal });
        if (signal.aborted) return;
        if (!response.success) {
            updateToken(null);
            return;
        }

        updateToken(response.data);
    }



    return {
        token,
        updateToken,
        refreshToken
    }
};

export default useToken;