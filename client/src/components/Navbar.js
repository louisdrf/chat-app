import React, { useState, useEffect } from 'react';
import { MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { getAllUsers } from '../services/usersServices';

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

  const items = [
    ...users.map(user => ({
      key: user.id.toString(),
      icon: <MailOutlined />, 
      label: user.username, 
      onClick: () => onConversationClick(user.username)
    })),
  ]

  return (
    <Menu
      style={{ width: 256 }}
      defaultSelectedKeys={['1']}
      theme='light'
      items={items}
    />
  )
}
