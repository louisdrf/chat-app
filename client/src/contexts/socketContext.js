import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketInstance = io('http://localhost:3001', {
      query: { token: localStorage.getItem('token') } 
    })
    
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setSocket(socketInstance);
    })

    return () => {
      socketInstance.disconnect()
      console.log('socket instance context disconnected');
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
