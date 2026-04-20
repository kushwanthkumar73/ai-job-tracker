import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ai-job-tracker-backend-phvt.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const res = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
          refresh,
        });
        localStorage.setItem('access_token', res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return API(original);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const register = (data) => API.post('/auth/register/', data);
export const login = (data) => API.post('/auth/login/', data);
export const getProfile = () => API.get('/auth/profile/');

export const getJobs = () => API.get('/jobs/');
export const createJob = (data) => API.post('/jobs/', data);
export const parseJD = (data) => API.post('/jobs/parse-jd/', data);
export const matchResume = (data) => API.post('/jobs/match-resume/', data);
export const generateCoverLetter = (data) => API.post('/jobs/cover-letter/', data);

export const getApplications = () => API.get('/applications/');
export const createApplication = (data) => API.post('/applications/', data);
export const updateApplication = (id, data) => API.patch(`/applications/${id}/`, data);
export const deleteApplication = (id) => API.delete(`/applications/${id}/`);

export default API;