/**
 * API functions untuk Authentication
 * Setiap function memanggil endpoint API yang sesuai.
 */
import api from './axiosInstance';

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const newsApi = {
  getAll: (params) => api.get('/news', { params }),
  getBySlug: (slug) => api.get(`/news/${slug}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

export const profileApi = {
  getAll: () => api.get('/profiles'),
  getByKey: (key) => api.get(`/profiles/${key}`),
  update: (id, data) => api.put(`/profiles/${id}`, data),
};

export const teacherApi = {
  getAll: (params) => api.get('/teachers', { params }),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
};

export const achievementApi = {
  getAll: (params) => api.get('/achievements', { params }),
  create: (data) => api.post('/achievements', data),
  update: (id, data) => api.put(`/achievements/${id}`, data),
  delete: (id) => api.delete(`/achievements/${id}`),
};

export const extracurricularApi = {
  getAll: (params) => api.get('/extracurriculars', { params }),
  create: (data) => api.post('/extracurriculars', data),
  update: (id, data) => api.put(`/extracurriculars/${id}`, data),
  delete: (id) => api.delete(`/extracurriculars/${id}`),
};

export const facilityApi = {
  getAll: (params) => api.get('/facilities', { params }),
  create: (data) => api.post('/facilities', data),
  update: (id, data) => api.put(`/facilities/${id}`, data),
  delete: (id) => api.delete(`/facilities/${id}`),
};

export const pmbApi = {
  register: (data) => api.post('/pmb/register', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  checkStatus: (regNumber) => api.get('/pmb/status', { params: { registration_number: regNumber } }),
  getAll: (params) => api.get('/pmb', { params }),
  updateStatus: (id, data) => api.put(`/pmb/${id}/status`, data),
  delete: (id) => api.delete(`/pmb/${id}`),
};

export const alumniApi = {
  getAll: (params) => api.get('/alumni', { params }),
  create: (data) => api.post('/alumni', data),
  update: (id, data) => api.put(`/alumni/${id}`, data),
  delete: (id) => api.delete(`/alumni/${id}`),
};

export const scheduleApi = {
  getAll: (params) => api.get('/schedules', { params }),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

export const userApi = {
  getAll: (params) => api.get('/users', { params }),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const homeSettingApi = {
  getAll: () => api.get('/home-settings'),
  getByKey: (key) => api.get(`/home-settings/${key}`),
  update: (key, data) => api.put(`/home-settings/${key}`, data),
  init: () => api.post('/home-settings/init'),
  uploadImage: (formData) => api.post('/home-settings/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const pmbSettingApi = {
  getAll: () => api.get('/pmb-settings'),
  getBySection: (key) => api.get(`/pmb-settings/by-section/${key}`),
  getAccepted: () => api.get('/pmb-settings/accepted'),
  getAllAdmin: () => api.get('/pmb-settings/admin'),
  create: (data) => api.post('/pmb-settings', data),
  update: (id, data) => api.put(`/pmb-settings/${id}`, data),
  delete: (id) => api.delete(`/pmb-settings/${id}`),
  init: () => api.post('/pmb-settings/init'),
};

export const mediaApi = {
  getAll: () => api.get('/media'),
  upload: (data) => api.post('/media', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (filename) => api.delete(`/media/${filename}`),
};
