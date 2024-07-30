import React, { useState, useEffect } from 'react';
import { Menu, Layout } from 'antd';
import { getUserPublicRooms } from '../services/roomsServices';
import { UserAvatar } from './UserAvatar'

const { Sider } = Layout

export const PublicRoomsNavbar = ({ onConversationClick }) => {
  const username = localStorage.getItem("username")
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const fetchUserPublicRooms = async () => {
      try {
        const userPublicRooms = await getUserPublicRooms(username)
        setRooms(userPublicRooms)
      } 
      catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    }

    fetchUserPublicRooms()
  }, [])

  const navBarRooms = [
    ...rooms.map(room => ({
      key: room.id.toString(),
      icon: <UserAvatar username={room.name} size={24} />, 
      label: (
        <span style={{ marginLeft: 10 }}>{room.name}</span>
      ),
      onClick: () => onConversationClick(room)
    })),
  ]

  return (
          <Sider width={'20vh'} theme='light'>
            <Menu
            style={{ height: '100vh'}}
              theme='dark'
              items={navBarRooms}
            />
          </Sider>
  )
}
