import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { createRoom, getUserPublicRooms } from '../services/roomsServices';
import { useUsers } from './usersContext';

const RoomContext = createContext(null)

export const RoomsProvider = ({ children }) => {
  const {socket} = useSocket()
  const { userFriends } = useUsers()

  const [activeRoom, setActiveRoom] = useState(null)
  const [activeRoomName, setActiveRoomName] = useState("")
  const [privateRooms, setPrivateRooms] = useState(userFriends)
  const [publicRooms, setPublicRooms] = useState([])
  const [unreadMessages, setUnreadMessages] = useState([])

  // FONCTIONS UTILITAIRES
    const onPrivateConversationClick = async (roomName) => {
        try {
            const room = await createRoom(roomName, true)
            setActiveRoom(room)
            setActiveRoomName(roomName)
        } catch (error) {
            console.error("Erreur lors de la création ou la récupération de la room privée :", error);
        }
    }

    const onPublicConversationClick = async (room) => {
        try {
            setActiveRoom(room)
            setActiveRoomName(room.name)
        } catch (error) {
            console.error("Erreur lors de la création ou la récupération de la room publique :", error);
        }
    }


    const createPublicRoom = async (name) => {
        const createdPublicRoom = await createRoom(name, false)
        setPublicRooms((prevRooms) => [...prevRooms, createdPublicRoom])
    }


    const handleIncomingUnreadMessage = (roomId, newMessage) => {
        setUnreadMessages(prevUnreadMessages => {
            const updatedUnreadMessages = { ...prevUnreadMessages }
    
            if (!updatedUnreadMessages[roomId]) {
                updatedUnreadMessages[roomId] = []
            }
    
            // Vérifie si le nouveau message est déjà présent dans la liste des messages non lus pour cette room
            const isMessageAlreadyInList = updatedUnreadMessages[roomId].some(existingMessage => existingMessage.id === newMessage.id)
            
            if (!isMessageAlreadyInList) {
                updatedUnreadMessages[roomId].push(newMessage)
            }
    
            return updatedUnreadMessages
        })
    }
    

    
    useEffect(() => {
        setPrivateRooms(userFriends)
    }, [userFriends])


    useEffect(() => {
        if (!socket) {
            console.error('Socket instance is not available in rooms context')
            return
        }

        socket.on('new_unread_message', handleIncomingUnreadMessage)

        return () => socket.off('new_unread_message', handleIncomingUnreadMessage)
        
    }, [socket])


    useEffect(() => {
        // INITIALISATION DES DONNEES
        const setInitialPublicRooms = async () => {
            try {
                const userPublicRooms = await getUserPublicRooms()
                console.log('init public rooms');
                
                setPublicRooms(userPublicRooms)
            } catch (error) {
                console.error('Failed to fetch initial user public rooms', error)
            }
        }

        setInitialPublicRooms()

    }, [])

  return (
    <RoomContext.Provider value={{ 
        activeRoom, 
        activeRoomName,
        privateRooms, 
        publicRooms, 
        onPrivateConversationClick, 
        onPublicConversationClick,
        createPublicRoom,
        unreadMessages
    }}>
      {children}
    </RoomContext.Provider>
  )
}

export const useRooms = () => useContext(RoomContext)
