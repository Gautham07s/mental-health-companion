import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Axios Interceptor to handle 401 Unauthorized globally
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    logout(); // Auto logout on token expiration
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []); // Run once on mount

    useEffect(() => {
        if (token) {
            try {
                // Decode JWT payload (simple check)
                const payload = JSON.parse(atob(token.split('.')[1]));

                // Check expiration if needed (basic check)
                const isExpired = payload.exp && payload.exp * 1000 < Date.now();

                if (isExpired) {
                    logout();
                } else {
                    setUser({ username: payload.sub });
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (e) {
                logout();
            }
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
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
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
