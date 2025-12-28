import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/socketContext.jsx";
import axios from "axios";

// Set axios base URL from Vite env at build time. If not provided, keep relative URLs (useful when backend is same origin).
if (import.meta.env.VITE_SERVER_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
