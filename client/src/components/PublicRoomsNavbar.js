import React, { useState, useEffect } from 'react';
import { Menu, Layout, Button } from 'antd';
import { PlusOutlined } from "@ant-design/icons"
import { createRoom, getUserPublicRooms } from '../services/roomsServices';
import { NewPublicRoomFormModal } from './NewPublicRoomModal';
import { RoomAvatar } from './RoomAvatar';

const { Sider } = Layout

export const PublicRoomsNavbar = ({ onConversationClick }) => {
  const username = localStorage.getItem("username")
  const [rooms, setRooms] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true)
  const handleCancel = () => setIsModalVisible(false)
  
  const handleCreate = async (values) => {
    try {
      const createdRoom = await createRoom(values.name, false);
      setIsModalVisible(false);
      setRooms((prevRooms) => [...prevRooms, createdRoom]);
    } catch (error) {
      console.error("Erreur lors de la création du salon :", error);
    }
  };
  
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
    {
        key: 'create',
        icon: <PlusOutlined />,
        label: 'Créer un salon',
        onClick: showModal,
      },
    ...rooms.map(room => ({
      key: room.id.toString(),
      icon: <RoomAvatar roomName={room.name} size={24} />, 
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
            <NewPublicRoomFormModal
                visible={isModalVisible}
                onCreate={handleCreate}
                onCancel={handleCancel}
            />
          </Sider>
  )
}
