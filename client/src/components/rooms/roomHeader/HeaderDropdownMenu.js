// src/components/MessageOptionsDropdown.js
import React from 'react';
import { Dropdown, Button } from 'antd';
import { MoreOutlined, PushpinOutlined, TeamOutlined } from '@ant-design/icons';
import { useRooms } from '../../../contexts/roomsContext';

export const HeaderDropdownMenu = ({ onShowPinnedMessages, onShowMembersList }) => {

    const { activeRoom } = useRooms()
    
    const items = [
        {
            label: 'Messages épinglés',
            key: '1',
            icon: <PushpinOutlined />,
            onClick: onShowPinnedMessages
        },
        !activeRoom.isPrivate && {
            label: 'Liste des membres',
            key: '2',
            icon: <TeamOutlined />, 
            onClick: onShowMembersList
        }
    ]

    return (
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button
                type="text"
                icon={<MoreOutlined />}
                style={{ marginLeft: 'auto' }}
            />
        </Dropdown>
    )
}
