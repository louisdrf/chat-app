import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { getAllUsers } from '../services/usersServices';
import { UserAvatar } from './UserAvatar'

export const Navbar = ({ onConversationClick }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let users = await getAllUsers()
        users = users.filter(u => u.username != localStorage.getItem("username"))
        setUsers(users)
      } 
      catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    }

    fetchUsers()
  }, [])

  const rooms = [
    ...users.map(user => ({
      key: user.id.toString(),
      icon: <UserAvatar username={user.username} size={24} />, 
      label: (
        <span style={{ marginLeft: 10 }}>{user.username}</span>
      ),
      onClick: () => onConversationClick(user.username)
    })),
  ]

  return (
    <Menu
      style={{ width: 256 }}
      theme='light'
      items={rooms}
    />
  )
}
