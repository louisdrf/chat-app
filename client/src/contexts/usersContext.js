import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { getAllUsers, getUserAllFriends } from '../services/usersServices';

const UserContext = createContext(null)

export const UsersProvider = ({ children }) => {
  const {socket} = useSocket()
  const [users, setUsers] = useState({})
  const [userFriends, setUserFriends] = useState({})

  useEffect(() => {
    if (!socket) {
      console.error('Socket instance is not available')
      return
    }

    const fetchInitialUsers = async () => {
      try {
        const users = await getAllUsers()
        const usersObj = users.reduce((acc, user) => {
          acc[user.id] = { ...user }
          return acc
        }, {})
        setUsers(usersObj)
      } catch (error) {
        console.error('Failed to fetch initial users : ', error)
      }
    }


    const fetchInitialUserFriends = async () => {
      try {
        const users = await getUserAllFriends()
        const usersObj = users.reduce((acc, user) => {
          acc[user.id] = { ...user }
          return acc
        }, {})
        setUserFriends(usersObj)
      } catch (error) {
        console.error('Failed to fetch initial users : ', error)
      }
    }

    fetchInitialUsers()
    fetchInitialUserFriends()

    const handleUserConnected = (user) => {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [user.id]: { ...user, isOnline: true },
      }))
    }

    const handleUserDisconnected = (user) => {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [user.id]: { ...user, isOnline: false },
      }))
    }

    const handleNewFriend = (user) => {
      setUserFriends((prevUsers) => ({
        ...prevUsers,
        [user.id]: { ...user }
      }))
    }

    socket.on('user_connected', handleUserConnected)
    socket.on('user_disconnected', handleUserDisconnected)
    socket.on('new_friend', handleNewFriend)

    return () => {
      socket.off('user_connected', handleUserConnected)
      socket.off('user_disconnected', handleUserDisconnected)
      socket.off('new_friend', handleNewFriend)
    }
  }, [socket])

  return (
    <UserContext.Provider value={{users, userFriends}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUsers = () => useContext(UserContext)
