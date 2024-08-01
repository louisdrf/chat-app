import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { getUserPendingFriendships, getUserReceivedFriendships } from '../services/friendshipsServices';
import { notification } from "antd";

const FriendshipContext = createContext(null);

export const FriendshipsProvider = ({ children }) => {
  const {socket} = useSocket();
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

    const sendNewFriendRequest = (friendship) => { // pour celui qui envoie la demande d'ami
      setPendingFriendships((prev) => [...prev, friendship])
    }

    const receiveNewFriendRequest = (receivedRequest) => { // pour celui qui reçoit la demande d'ami
      setReceivedFriendships((prev) => [...prev, receivedRequest])
      notification.info({
        message: "Nouvelle demande d'ami",
        description: `${receivedRequest.requester.username} vous a envoyé une demande d'ami.`,
        duration: 3,
      })
    }

    const requestAccepted = (acceptedRequest) => { // demande acceptée pour celui qui envoie la demande
      setPendingFriendships((prev) => prev.filter((request) => request.id !== acceptedRequest.id))
      notification.success({
        message: "Demande d'ami acceptée",
        description: `${acceptedRequest.requestee.username} a accepté votre demande d'ami.`,
        duration: 3,
      })
    }

    const acceptRequestConfirmation = (new_friendship) => { // demande acceptée par celui qui reçoit la demande
      setReceivedFriendships((prev) => prev.filter((request) => request.id !== new_friendship.id))
      notification.success({
        message: "Demande d'ami acceptée",
        description: `${new_friendship.requester.username} et toi êtes désormais amis.`,
        duration: 3,
      })
    }

    socket.on('new_pending_request', sendNewFriendRequest)
    socket.on('new_friendship_request', receiveNewFriendRequest)
    socket.on('requester_request_accepted', requestAccepted)
    socket.on('requestee_accepted_the_request', acceptRequestConfirmation)

    return () => {
      socket.off('new_pending_request', sendNewFriendRequest)
      socket.off('new_friendship_request', receiveNewFriendRequest)
      socket.off('requester_request_accepted', requestAccepted)
      socket.off('requestee_accepted_the_request', acceptRequestConfirmation)
    }
  }, [socket])

  return (
    <FriendshipContext.Provider value={{ pendingFriendships, receivedFriendships }}>
      {children}
    </FriendshipContext.Provider>
  );
};

export const useFriendships = () => useContext(FriendshipContext);
