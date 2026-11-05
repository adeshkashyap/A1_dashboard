import React, { createContext, useContext } from "react";

interface SocketContextType {
  socket: null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

export const useSocket = () => useContext(SocketContext);

/** Demo stub — no live websocket connection. */
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SocketContext.Provider value={{ socket: null, connected: false }}>
    {children}
  </SocketContext.Provider>
);
