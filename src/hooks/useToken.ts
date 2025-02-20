import { useEffect, useState } from "react";

const useToken = () => {
    const initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);

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

    

    return {
        token,
        updateToken
    }
};

export default useToken;