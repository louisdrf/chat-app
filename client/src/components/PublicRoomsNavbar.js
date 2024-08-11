import React, { useState, useEffect } from 'react';
import { Menu, Layout, Button } from 'antd';
import { PlusOutlined } from "@ant-design/icons"
import { NewPublicRoomFormModal } from './NewPublicRoomModal';
import { RoomAvatar } from './RoomAvatar';
import { useRooms } from '../contexts/roomsContext';

const { Sider } = Layout

export const PublicRoomsNavbar = () => {

  const { 
      activeRoom,
      publicRooms, 
      onPublicConversationClick, 
      createPublicRoom 
  } = useRooms()

  const [rooms, setRooms] = useState(publicRooms)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => setIsModalVisible(true)
  const handleCancel = () => setIsModalVisible(false)
  

  const handleCreate = async (values) => {
      try {
        await createPublicRoom(values.name)
        setIsModalVisible(false)
      } catch (error) {
        console.error("Erreur lors de la création du salon :", error);
      }
  }


  useEffect(() => {
    setRooms(publicRooms)
  }, [publicRooms])


 
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
      onClick: () => onPublicConversationClick(room)
    })),
  ]

  return (
          <Sider width={'20vh'} theme='light'>
            <Menu
            style={{ height: '100vh'}}
              theme='dark'
              items={navBarRooms}
              selectedKeys={[activeRoom?.id?.toString() || '']}
            />
            <NewPublicRoomFormModal
                visible={isModalVisible}
                onCreate={handleCreate}
                onCancel={handleCancel}
            />
          </Sider>
  )
}
