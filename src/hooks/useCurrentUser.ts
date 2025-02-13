import { decodeJwt } from 'jose'
import { useEffect, useState } from 'react';
import { UserModel } from '../typings/models';
import { AppJwtPayload } from '../typings/types';


const useCurrentUser = () => {
    const token = localStorage.getItem('token');
    const initialUser = token ? decodeJwt<AppJwtPayload>(token).user : null;
    const [user, setUser] = useState<UserModel | null>(initialUser);

    const updateUser = (token: string) => {
        localStorage.setItem('token', token);
        window.dispatchEvent(new Event('storage'));
        const { user } = decodeJwt<AppJwtPayload>(token);
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    }

    useEffect(() => {
        const ctrl = new AbortController();
        window.addEventListener('storage', () => {
            const token = localStorage.getItem('token');
            const user = token ? decodeJwt<AppJwtPayload>(token).user : null;
            setUser(user);
        }, { signal: ctrl.signal });
        return () => {
            ctrl.abort();
        }
    }, [])

    return {
        user,
        updateUser,
        logout
    }
};

export default useCurrentUser;