import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiExternal = axios.create({
  baseURL: import.meta.env.VITE_API_EXTERNAL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});