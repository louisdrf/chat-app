import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketInstance = io('http://localhost:3001', {
      query: { token: localStorage.getItem('token') } 
    })
    setSocket(socketInstance)

    // Cleanup on component unmount
    return () => socketInstance.disconnect()
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
