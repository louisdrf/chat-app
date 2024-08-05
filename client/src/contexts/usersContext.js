import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { getAllUsers, getUserAllFriends } from '../services/usersServices';

const UserContext = createContext(null)

export const UsersProvider = ({ children }) => {
  const {socket} = useSocket()
  const [users, setUsers] = useState([])
  const [userFriends, setUserFriends] = useState([])

  useEffect(() => {
    if (!socket) {
      console.error('Socket instance is not available')
      return
    }

    const fetchInitialUsers = async () => {
      try {
        const users = await getAllUsers()       
        setUsers(users)
      } catch (error) {
        console.error('Failed to fetch initial users : ', error)
      }
    }


    const fetchInitialUserFriends = async () => {
      try {
        const friends = await getUserAllFriends()
        setUserFriends(friends)
      } catch (error) {
        console.error('Failed to fetch initial friends : ', error)
      }
    }

    fetchInitialUsers()
    fetchInitialUserFriends()


    const handleUserConnected = (user) => {
      user.isOnline = true
      setUsers((prevUsers) => ([ ...prevUsers, user ]))
    }

    const handleUserDisconnected = (user) => {
      user.isOnline = false
      setUsers((prevUsers) => ([ ...prevUsers, user ]))      
    }

    const handleNewFriend = (newFriend) => {
      setUserFriends((currentFriends) => ([...currentFriends, newFriend]))
    }

    const handleDeleteFriend = (user) => {
      setUserFriends((prevFriends) => {
        const friendsWithoutUser = prevFriends.filter(friend => friend.id !== user.id)
        return friendsWithoutUser
      })
    }

    socket.on('user_connected', handleUserConnected)
    socket.on('user_disconnected', handleUserDisconnected)
    socket.on('new_friend', handleNewFriend)
    socket.on('delete_friend', handleDeleteFriend)

    return () => {
      socket.off('user_connected', handleUserConnected)
      socket.off('user_disconnected', handleUserDisconnected)
      socket.off('new_friend', handleNewFriend)
      socket.off('delete_friend', handleDeleteFriend)
    }
  }, [socket])

  return (
    <UserContext.Provider value={{users, userFriends}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUsers = () => useContext(UserContext)
