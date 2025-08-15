import axios from "axios";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api;
