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


    useEffect(() => {
        setPrivateRooms(userFriends)
    }, [userFriends])

    useEffect(() => {
        if (!socket) {
        console.error('Socket instance is not available in rooms context')
        return
        }

        // INITIALISATION DES DONNEES
        const setInitialPublicRooms = async () => {
            try {
                const userPublicRooms = await getUserPublicRooms()
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
        createPublicRoom
    }}>
      {children}
    </RoomContext.Provider>
  )
}

export const useRooms = () => useContext(RoomContext)
