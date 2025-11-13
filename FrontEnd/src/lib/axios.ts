import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Helper to read token from localStorage (supports both keys used in repo)
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('accessToken');
};


apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config && config.headers) {
    // don't overwrite if already provided explicitly
    if (!('Authorization' in config.headers)) {
      // @ts-ignore
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  config.headers['Accept'] = 'application/json';
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const resp = error.response;
    try {
      if (resp && resp.status === 401) {
        const errCode = resp.data?.message;
        if (errCode === 'Invalid or expired token') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('accessToken');
          try {
            window.dispatchEvent(new CustomEvent('auth:tokenInvalid', { detail: { reason: errCode } }));
          } catch (e) {
            // ignore if running in non-browser environment
          }
        }
      }
    } catch (e) {
      // swallow any interceptor errors
    }

    return Promise.reject(error);
  }
);

export default apiClient;
