import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('robin_token');
    if (token) {
      api.me().then(setUser).catch(() => localStorage.removeItem('robin_token')).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('robin_token', res.token);
    const me = await api.me();
    setUser(me);
    return me;
  };

  const register = async (data) => {
    await api.register(data);
    return login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem('robin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
