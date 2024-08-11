import React, { useEffect, useState } from 'react';
import { Menu, Layout, Badge } from 'antd';
import { UserAvatar } from './UserAvatar'
import { TeamOutlined } from '@ant-design/icons'
import { FriendsModal } from './friends/FriendsModal';
import { useRooms } from '../contexts/roomsContext';

const { Sider } = Layout

export const Navbar = () => {
  const { privateRooms, onPrivateConversationClick, unreadMessages } = useRooms()

  const [rooms, setRooms] = useState(privateRooms)
  const [isFriendsModalVisible, setIsFriendsModalVisible] = useState(false)

  const showFriendsModal = () => setIsFriendsModalVisible(true)
  const hideFriendsModal = () => setIsFriendsModalVisible(false)


  useEffect(() => {
      setRooms(privateRooms)
  }, [privateRooms])

  const friendsRoomListItems = [
    {
      key: 'friends',
      icon: <TeamOutlined />,
      label: 'Amis',
      onClick: () => showFriendsModal()
    },
    ...rooms.map((room) => {
      // Nombre de messages non lus pour cette room
      console.log('messages non lus : ', unreadMessages);
      
      const unreadCount = unreadMessages[room.id] ? unreadMessages[room.id].length : 0

      return {
        key: room.id.toString(),
        icon: <UserAvatar user={room.user} size={24} />,
        label: (
          <span style={{ marginLeft: 10 }}>
            {room.user.username}
            {unreadCount > 0 && (
              <Badge title='messages non lus' color='geekblue' size='small' count={unreadCount} style={{ marginLeft: 8 }} />
            )}
          </span>
        ),
        onClick: () => onPrivateConversationClick(room.user.username),
      }
    })
  ]

  return (
          <Sider width={'20vh'} theme='light'>
            <Menu
            style={{ height: '100vh'}}
              theme='light'
              items={friendsRoomListItems}
            />
            <FriendsModal visible={isFriendsModalVisible} onCancel={hideFriendsModal}/>
          </Sider>
  )
}
