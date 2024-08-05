import React, { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import { UserAvatar } from './UserAvatar'
import { TeamOutlined } from '@ant-design/icons'
import { FriendsModal } from './friends/FriendsModal';
import { useUsers } from '../contexts/usersContext';

const { Sider } = Layout

export const Navbar = ({ onConversationClick }) => {
  const { userFriends } = useUsers()
  const [friends, setFriends] = useState(userFriends)
  const [isFriendsModalVisible, setIsFriendsModalVisible] = useState(false)

  const showFriendsModal = () => setIsFriendsModalVisible(true)
  const hideFriendsModal = () => setIsFriendsModalVisible(false)


  useEffect(() => {
      setFriends(userFriends)
  }, [userFriends])

  const friendsListItems = [
    {
      key: 'friends',
      icon: <TeamOutlined />,
      label: 'Amis',
      onClick: () => showFriendsModal()
    },
    ...friends.map(user => ({
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
              items={friendsListItems}
            />
            <FriendsModal visible={isFriendsModalVisible} onCancel={hideFriendsModal}/>
          </Sider>
  )
}
