import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const resetSocket = () => {
    if (socket) {
      socket.disconnect();
    }
    const newSocket = io('http://localhost:3001', {
      query: { token: localStorage.getItem('token') }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setSocket(newSocket);
    });

    return newSocket;
  };

  useEffect(() => {
    resetSocket();
    return () => {
      if (socket) {
        socket.disconnect();
        console.log('Socket instance context disconnected');
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, resetSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
