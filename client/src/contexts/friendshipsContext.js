import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { getUserPendingFriendships, getUserReceivedFriendships } from '../services/friendshipsServices';

const FriendshipContext = createContext(null)

export const FriendshipsProvider = ({ children }) => {
  const socket = useSocket()
  const [pendingFriendships, setPendingFriendships] = useState([])
  const [receivedFriendships, setReceivedFriendships] = useState([])

  useEffect(() => {
    if (!socket) {
      console.error('Socket instance is not available')
      return;
    }

    const fetchInitialPendingRequests = async () => {
      try {
        const pendingRequests = await getUserPendingFriendships()
        setPendingFriendships(pendingRequests)
      } 
      catch (error) {
        console.error('Failed to fetch initial pending friendships', error);
      }
    }

    const fetchInitialReceivedRequests = async () => {
      try {
        const receivedRequests = await getUserReceivedFriendships()
        setReceivedFriendships(receivedRequests)
      } 
      catch (error) {
        console.error('Failed to fetch initial received friendships', error);
      }
    }

    fetchInitialPendingRequests()
    fetchInitialReceivedRequests()


    const handleFriendshipRequestSent = (data) => {
      setPendingFriendships((prev) => [...prev, data.demand])
    }

    const handleFriendshipRequestReceived = (data) => {
      setReceivedFriendships((prev) => [...prev, data.demand])
    }

    const handleFriendshipAccepted = (data) => {
      const { demand } = data
      setPendingFriendships((prev) =>
        prev.filter((request) => request.id !== demand.id)
      )
      setReceivedFriendships((prev) =>
        prev.filter((request) => request.id !== demand.id)
      )
    }

    socket.on('friendship_request_sent', handleFriendshipRequestSent)
    socket.on('new_friendship_request', handleFriendshipRequestReceived)
    socket.on('friendship_request_accepted', handleFriendshipAccepted)

    return () => {
      socket.off('friendship_request_sent', handleFriendshipRequestSent)
      socket.off('new_friendship_request', handleFriendshipRequestReceived)
      socket.off('friendship_request_accepted', handleFriendshipAccepted)
    }
  }, [socket])

  return (
    <FriendshipContext.Provider value={{ pendingFriendships, receivedFriendships }}>
      {children}
    </FriendshipContext.Provider>
  )
}

export const useFriendships = () => useContext(FriendshipContext)
