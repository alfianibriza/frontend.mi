/**
 * =============================================================
 * AUTH CONTEXT
 * =============================================================
 * 
 * PENJELASAN KONSEP STATE MANAGEMENT:
 * React Context memungkinkan kita berbagi data (state) ke SEMUA component
 * tanpa harus passing props secara manual dari parent ke child.
 * 
 * AuthContext menyimpan:
 * - user: Data user yang sedang login
 * - token: JWT token untuk autentikasi
 * - login/logout functions: Fungsi untuk login dan logout
 * 
 * ALUR:
 * 1. Saat app dimuat → cek token di localStorage
 * 2. Jika ada token → fetch data user dari API (/auth/me)
 * 3. Simpan data user ke state
 * 4. Semua component bisa akses user data via useAuth() hook
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Saat app pertama kali dimuat, cek apakah user sudah login
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await authApi.getMe();
          setUser(response.data.data.user);
        } catch {
          // Token tidak valid, hapus
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { user: userData, token: newToken } = response.data.data;
    
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  };

  const register = async (name, email, password) => {
    const response = await authApi.register({ name, email, password });
    const { user: userData, token: newToken } = response.data.data;
    
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk mengakses auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

export default AuthContext;
