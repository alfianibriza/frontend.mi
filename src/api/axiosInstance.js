/**
 * =============================================================
 * AXIOS INSTANCE
 * =============================================================
 * 
 * PENJELASAN KONSEP:
 * Axios instance adalah "template" untuk semua HTTP request ke API.
 * Dengan membuat instance, kita:
 * - Set base URL sekali saja (tidak perlu tulis ulang setiap request)
 * - Otomatis attach JWT token ke setiap request (via interceptor)
 * - Handle error secara global
 * 
 * ALUR:
 * Component → axiosInstance.get('/news') 
 *   → Interceptor tambahkan token ke header
 *   → Request dikirim ke http://localhost:5000/api/news
 *   → Response diterima
 *   → Jika 401 (token expired) → auto logout
 */

import axios from 'axios';

// Konfigurasi dinamis: Production = API Hostinger, Development = localhost API
const isProd = import.meta.env.PROD;
const API_URL = import.meta.env.VITE_API_URL || (isProd ? 'https://api.mialghazali.sch.id/api' : 'http://localhost:5000/api');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 detik timeout
});

/**
 * REQUEST INTERCEPTOR
 * Dijalankan SEBELUM setiap request dikirim.
 * Otomatis menambahkan JWT token ke header Authorization.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Dijalankan SETELAH setiap response diterima.
 * Jika dapat error 401 (unauthorized), otomatis logout.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect ke login jika bukan di halaman login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
