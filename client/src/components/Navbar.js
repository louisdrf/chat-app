import React, { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import { UserAvatar } from './UserAvatar'
import { TeamOutlined } from '@ant-design/icons'
import { FriendsModal } from './friends/FriendsModal';
import { useRooms } from '../contexts/roomsContext';

const { Sider } = Layout

export const Navbar = () => {
  const { privateRooms, onPrivateConversationClick } = useRooms()

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
    ...rooms.map(user => ({
      key: user.id.toString(),
      icon: <UserAvatar user={user} size={24} />, 
      label: (
        <span style={{ marginLeft: 10 }}>{user.username}</span>
      ),
      onClick: () => onPrivateConversationClick(user.username)
    }))
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
