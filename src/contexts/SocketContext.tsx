import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const socketRef = React.useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only connect if user is authenticated and socket doesn't already exist
    if (user?.id && !socketRef.current) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      console.log('🔌 Initializing socket connection to:', API_URL);

      const newSocket = io(API_URL, {
        transports: ['websocket'], // FORCE WEBSOCKETS ONLY - NO POLLING FLOOD
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      newSocket.on('connect', () => {
        setConnected(true);
        console.log('🔌 Socket connected:', newSocket.id);
        newSocket.emit('join', user.id);
      });

      newSocket.on('connect_error', (err) => {
        console.error('🔌 Socket connection error:', err.message);
      });

      newSocket.on('disconnect', (reason) => {
        setConnected(false);
        console.log('🔌 Socket disconnected:', reason);
      });

      socketRef.current = newSocket;
      setSocketInstance(newSocket);
    }

    return () => {
      if (socketRef.current) {
        console.log('🔌 Cleaning up socket connection');
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketInstance(null);
        setConnected(false);
      }
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
