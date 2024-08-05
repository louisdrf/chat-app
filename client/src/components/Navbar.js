import React, { useState } from 'react';
import { Menu, Layout } from 'antd';
import { UserAvatar } from './UserAvatar'
import { TeamOutlined } from '@ant-design/icons'
import { FriendsModal } from './friends/FriendsModal';
import { useUsers } from '../contexts/usersContext';

const { Sider } = Layout

export const Navbar = ({ onConversationClick }) => {
  const { userFriends } = useUsers()
  const [isFriendsModalVisible, setIsFriendsModalVisible] = useState(false)

  const showFriendsModal = () => setIsFriendsModalVisible(true)
  const hideFriendsModal = () => setIsFriendsModalVisible(false)

  const friendsList = [
    {
      key: 'friends',
      icon: <TeamOutlined />,
      label: 'Amis',
      onClick: () => showFriendsModal()
    },
    userFriends.map(user => ({
      key: user.id.toString(),
      icon: <UserAvatar user={user} size={24} />, 
      label: (
        <span style={{ marginLeft: 10 }}>{user.username}</span>
      ),
      onClick: () => onConversationClick(user.username)
    }))
  ]

  return (
          <Sider width={'20vh'} theme='light'>
            <Menu
            style={{ height: '100vh'}}
              theme='light'
              items={friendsList}
            />
            <FriendsModal visible={isFriendsModalVisible} onCancel={hideFriendsModal}/>
          </Sider>
  )
}
