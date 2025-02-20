import { decodeJwt } from 'jose'
import { useEffect, useState } from 'react';
import { UserModel } from '../typings/models';
import { AppJwtPayload } from '../typings/types';
import useToken from './useToken';


const useCurrentUser = () => {
    const { token, updateToken } = useToken();
    const initialUser = token ? decodeJwt<AppJwtPayload>(token).user : null;
    const [user, setUser] = useState<UserModel | null>(initialUser);

    const updateUser = (token: string) => {
        updateToken(token);
        const { user } = decodeJwt<AppJwtPayload>(token);
        setUser(user);
    }

    const logout = () => {
        updateToken(null);
        setUser(null);
    }

    useEffect(() => {
        const user = token ? decodeJwt<AppJwtPayload>(token).user : null;
        setUser(user);
    }, [token])

    return {
        user,
        updateUser,
        logout
    }
};

export default useCurrentUser;