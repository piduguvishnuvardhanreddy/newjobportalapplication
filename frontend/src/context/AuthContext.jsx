import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in
    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data.user);
            } catch (error) {
                console.log('Not logged in');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data.user);
        return data.user;
    };

    const register = async (name, email, password, role, secretCode) => {
        const { data } = await api.post('/auth/register', { name, email, password, role, secretCode });
        setUser(data.user);
        return data.user;
    };

    const updateUserProfile = async (userData) => {
        const { data } = await api.put('/auth/updatedetails', userData);
        setUser(data.user); // Update local state
        return data.user;
    };

    const logout = async () => {
        try {
            await api.get('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUserProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
