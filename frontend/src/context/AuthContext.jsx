import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Decode JWT to get username (or call /me endpoint if implemented)
            // For simplicity, we just assume valid if token exists, 
            // but in real app we'd verify exp
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({ username: payload.sub });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const res = await axios.post('http://localhost:8000/token', formData);
            const access_token = res.data.access_token;

            localStorage.setItem('token', access_token);
            setToken(access_token);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const register = async (username, password) => {
        try {
            await axios.post('http://localhost:8000/register', { username, password });
            return true; // Registration successful
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
