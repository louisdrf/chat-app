// src/components/MessageOptionsDropdown.js
import React, { useState } from 'react';
import { Dropdown, Button, message as antdMessage } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PushpinOutlined } from '@ant-design/icons';
import { useSocket } from '../contexts/socketContext'; 
import { pinOrUnpinMessage } from '../services/messagesServices';

export const MessageRowDropdownMenu = ({ message, room }) => {
    const socket = useSocket();
    const [isPinned, setIsPinned] = useState(message.isPinned);

    const handleDelete = () => {
      socket.emit('delete_message', message.id, room.id)
      antdMessage.info('Message supprimé.')
    };

    const handlePin = async () => {
        await pinOrUnpinMessage(message.id);
        setIsPinned(!isPinned);
        antdMessage.info(isPinned ? 'Message désépinglé.' : 'Message épinglé.');
    };

    const items = [
        {
            label: 'Modifier le message',
            key: '1',
            icon: <EditOutlined />
        },
        {
            label: isPinned ? 'Désépingler le message' : 'Épingler le message',
            key: '2',
            icon: <PushpinOutlined />,
            onClick: handlePin
        },
        {
            label: 'Supprimer le message',
            key: '3',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: handleDelete
        }
    ];

    return (
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button
                type="text"
                icon={<MoreOutlined />}
                style={{ marginLeft: 'auto' }}
            />
        </Dropdown>
    );
};
