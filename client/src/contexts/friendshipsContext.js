import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { getUserPendingFriendships, getUserReceivedFriendships } from '../services/friendshipsServices';
import { Button, notification } from "antd";

const FriendshipContext = createContext(null)

export const FriendshipsProvider = ({ children }) => {
  const {socket} = useSocket()
  const [pendingFriendships, setPendingFriendships] = useState([])
  const [receivedFriendships, setReceivedFriendships] = useState([])

  useEffect(() => {
    if (!socket) {
      console.error('Socket instance is not available')
      return
    }

    // INITIALISATION DES DONNEES
    const fetchInitialPendingRequests = async () => {
      try {
        const pendingRequests = await getUserPendingFriendships()
        setPendingFriendships(pendingRequests)
      } catch (error) {
        console.error('Failed to fetch initial pending friendships', error)
      }
    }

    const fetchInitialReceivedRequests = async () => {
      try {
        const receivedRequests = await getUserReceivedFriendships()
        setReceivedFriendships(receivedRequests)
      } catch (error) {
        console.error('Failed to fetch initial received friendships', error)
      }
    }

    fetchInitialPendingRequests()
    fetchInitialReceivedRequests()


    // EVENEMENTS D'ECOUTE
    const sendNewFriendRequest = (friendship) => { // pour celui qui envoie la demande d'ami
      setPendingFriendships((prev) => [...prev, friendship])
    }

    const receiveNewFriendRequest = (receivedRequest) => {
      setReceivedFriendships((prev) => [...prev, receivedRequest])
  
      const key = `open${Date.now()}`
  
      const acceptFriendRequest = () => {
        socket.emit('accept_friendship_request', receivedRequest.id)
        notification.destroy(key)
      }
  
      const declineFriendRequest = () => {
        socket.emit('decline_friendship_request', receivedRequest.id)
        notification.destroy(key)
      }
  
      notification.info({
        message: "Nouvelle demande d'ami",
        description: (
          <div>
            <p>{`${receivedRequest.requester.username} vous a envoyé une demande d'ami.`}</p>
            <Button danger onClick={declineFriendRequest} style={{ marginRight: '10px' }}>Refuser</Button>
            <Button type="primary" onClick={acceptFriendRequest} style={{ marginRight: 8 }}>Accepter</Button>
          </div>
        ),
        duration: 0, 
        key,
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

    const deleteReceivedFriendship = (declinedFriendshipRequest) => {
      setReceivedFriendships((prev) => prev.filter((request) => request.id !== declinedFriendshipRequest.id))
    }

    const deletePendingFriendship = (declinedFriendshipRequest)=> {
      setPendingFriendships((prev) => prev.filter((request) => request.id !== declinedFriendshipRequest.id))
    }

    socket.on('new_pending_request', sendNewFriendRequest)
    socket.on('new_friendship_request', receiveNewFriendRequest)
    socket.on('requester_request_accepted', requestAccepted)
    socket.on('requestee_accepted_the_request', acceptRequestConfirmation)
    socket.on('friendship_decline_success', deleteReceivedFriendship)
    socket.on('friendship_declined', deletePendingFriendship)

    return () => {
      socket.off('new_pending_request', sendNewFriendRequest)
      socket.off('new_friendship_request', receiveNewFriendRequest)
      socket.off('requester_request_accepted', requestAccepted)
      socket.off('requestee_accepted_the_request', acceptRequestConfirmation)
      socket.off('friendship_decline_success', deleteReceivedFriendship)
      socket.off('friendship_declined', deletePendingFriendship)
    }
  }, [socket])

  return (
    <FriendshipContext.Provider value={{ pendingFriendships, receivedFriendships }}>
      {children}
    </FriendshipContext.Provider>
  )
}

export const useFriendships = () => useContext(FriendshipContext)
