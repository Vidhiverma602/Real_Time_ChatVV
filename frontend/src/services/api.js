import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const serverUrl =
  import.meta.env.VITE_SERVER_URL ||
  (isLocalhost
    ? "http://localhost:7000"
    : "https://realtime-messaging-platform.onrender.com");

const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

export default api;
