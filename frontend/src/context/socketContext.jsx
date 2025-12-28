import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { authUser } = useAuth();
  useEffect(() => {
    if (authUser) {
      // Use Vite env var when provided (set VITE_SERVER_URL in production), otherwise fall back to current origin or localhost
      const SERVER_URL = import.meta.env.VITE_SERVER_URL || window.location.origin || "http://localhost:7000";
      const socket = io(SERVER_URL, {
        query: {
          userId: authUser?._id,
        },
      });
      // Listen for the event emitted by the server
      socket.on("getOnlineUser", (users) => {
        setOnlineUser(users);
      });
      setSocket(socket);
      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);
  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
