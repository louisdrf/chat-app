import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { getUserPendingFriendships, getUserReceivedFriendships } from '../services/friendshipsServices';
import { notification } from "antd";

const FriendshipContext = createContext(null);

export const FriendshipsProvider = ({ children }) => {
  const socket = useSocket();
  const [pendingFriendships, setPendingFriendships] = useState([]);
  const [receivedFriendships, setReceivedFriendships] = useState([]);

  useEffect(() => {
    if (!socket) {
      console.error('Socket instance is not available');
      return;
    }

    const fetchInitialPendingRequests = async () => {
      try {
        const pendingRequests = await getUserPendingFriendships();
        setPendingFriendships(pendingRequests);
      } catch (error) {
        console.error('Failed to fetch initial pending friendships', error);
      }
    };

    const fetchInitialReceivedRequests = async () => {
      try {
        const receivedRequests = await getUserReceivedFriendships();
        setReceivedFriendships(receivedRequests);
      } catch (error) {
        console.error('Failed to fetch initial received friendships', error);
      }
    };

    fetchInitialPendingRequests();
    fetchInitialReceivedRequests();

    const handleFriendshipRequestSent = (data) => {
      setPendingFriendships((prev) => [...prev, data.friendship])
    }

    const handleFriendshipRequestReceived = (data) => {
      setReceivedFriendships((prev) => [...prev, data.friendship])
      notification.info({
        message: "Nouvelle demande d'ami",
        description: `${data.friendship.requester.username} vous a envoyé une demande d'ami.`,
        duration: 5,
      })
    }

    const handleFriendshipAcceptedRequester = (data) => {
      setPendingFriendships((prev) => prev.filter((request) => request.id !== data.friendship.id))
      notification.success({
        message: "Demande d'ami acceptée",
        description: `${data.friendship.requestee.username} a accepté votre demande d'ami.`,
        duration: 5,
      })
    }

    const handleFriendshipAcceptedRequestee = (data) => {
      setReceivedFriendships((prev) => prev.filter((request) => request.id !== data.friendship.id))
      notification.success({
        message: "Demande d'ami acceptée",
        description: `${data.friendship.requester.username} et toi êtes désormais amis.`,
        duration: 5,
      })
    }

    socket.on('friendship_request_sent', handleFriendshipRequestSent)
    socket.on('new_friendship_request', handleFriendshipRequestReceived)
    socket.on('friendship_request_accepted_requester', handleFriendshipAcceptedRequester)
    socket.on('friendship_request_accepted_requestee', handleFriendshipAcceptedRequestee)

    return () => {
      socket.off('friendship_request_sent', handleFriendshipRequestSent)
      socket.off('new_friendship_request', handleFriendshipRequestReceived)
      socket.off('friendship_request_accepted_requester', handleFriendshipAcceptedRequester)
      socket.off('friendship_request_accepted_requestee', handleFriendshipAcceptedRequestee)
    }
  }, [socket])

  return (
    <FriendshipContext.Provider value={{ pendingFriendships, receivedFriendships }}>
      {children}
    </FriendshipContext.Provider>
  );
};

export const useFriendships = () => useContext(FriendshipContext);
