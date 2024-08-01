import React, { useState, useEffect } from 'react';
import { Menu, Layout } from 'antd';
import { getAllUsers, getUserAllFriends } from '../services/usersServices';
import { UserAvatar } from './UserAvatar'
import { TeamOutlined } from '@ant-design/icons'
import { FriendsModal } from './friends/FriendsModal';

const { Sider } = Layout

export const Navbar = ({ onConversationClick }) => {
  const [users, setUsers] = useState([])
  const [isFriendsModalVisible, setIsFriendsModalVisible] = useState(false)

  const showFriendsModal = () => setIsFriendsModalVisible(true)
  const hideFriendsModal = () => setIsFriendsModalVisible(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUserAllFriends()
        setUsers(users)
      } 
      catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    }

    fetchUsers()
  }, [])

  const rooms = [
    {
      key: 'friends',
      icon: <TeamOutlined />,
      label: 'Amis',
      onClick: () => showFriendsModal()
    },
    ...users.map(user => ({
      key: user.id.toString(),
      icon: <UserAvatar user={user} size={24} />, 
      label: (
        <span style={{ marginLeft: 10 }}>{user.username}</span>
      ),
      onClick: () => onConversationClick(user.username)
    })),
  ]

  return (
          <Sider width={'20vh'} theme='light'>
            <Menu
            style={{ height: '100vh'}}
              theme='light'
              items={rooms}
            />
            <FriendsModal visible={isFriendsModalVisible} onCancel={hideFriendsModal}/>
          </Sider>
  )
}
