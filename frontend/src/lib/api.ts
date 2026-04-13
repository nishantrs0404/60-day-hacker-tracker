import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const trackerApi = {
  getDays: async () => {
    const res = await api.get("/tracker/days");
    return res.data;
  },
  getDay: async (dayNumber: number) => {
    const res = await api.get(`/tracker/days/${dayNumber}`);
    return res.data;
  },
  updateProgress: async (dayNumber: number, data: {
    dsa_completed: boolean;
    ml_completed: boolean;
    dev_completed: boolean;
    deploy_completed: boolean;
  }) => {
    const res = await api.post(`/tracker/progress/${dayNumber}`, data);
    return res.data;
  }
};
