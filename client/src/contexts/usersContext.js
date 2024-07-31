import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';

const UserContext = createContext(null)

export const UsersProvider = ({ children }) => {
  const socket = useSocket();
  const [users, setUsers] = useState({});

  useEffect(() => {
    if (!socket) {
      console.error('Socket instance is not available');
      return;
    }

    const handleUserConnected = (user) => {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [user.id]: { ...user, isOnline: true },
      }));
    };

    const handleUserDisconnected = (user) => {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [user.id]: { ...user, isOnline: false },
      }));
    };

    socket.on('user_connected', handleUserConnected);
    socket.on('user_disconnected', handleUserDisconnected);

    return () => {
      socket.off('user_connected', handleUserConnected);
      socket.off('user_disconnected', handleUserDisconnected);
    };
  }, [socket]);

  return (
    <UserContext.Provider value={users}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
