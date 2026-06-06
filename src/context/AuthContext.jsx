import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authSignup, authLogin, getMe } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cw_token'));
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a stored token and fetch user
  useEffect(() => {
    if (token) {
      getMe()
        .then(userData => {
          setUser(userData);
          setLoading(false);
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('cw_token');
          setToken(null);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authLogin({ email, password });
    localStorage.setItem('cw_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  }, []);

  const signup = useCallback(async (email, username, password) => {
    const data = await authSignup({ email, username, password });
    localStorage.setItem('cw_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cw_token');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
