// src/components/MessageOptionsDropdown.js
import React from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSocket } from '../contexts/socketContext'; 

export const MessageRowDropdownMenu = ({ message, room }) => {
    const socket = useSocket()

    const handleDelete = () => {
      socket.emit('delete_message', message.id, room.id)
    }

    const items = [
        {
            label : 'Modifier le message',
            key : '1',
            icon : <EditOutlined />
        },
        {
            label : 'Supprimer le message',
            key : '2',
            icon : <DeleteOutlined />,
            onClick : () => handleDelete(),
            danger : true
        }
    ]

  return (
    <Dropdown menu={{items}} trigger={['click']} placement="bottomRight">
      <Button
        type="text"
        icon={<MoreOutlined />}
        style={{ marginLeft: 'auto' }}
      />
    </Dropdown>
  )
}

