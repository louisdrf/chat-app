// src/components/MessageOptionsDropdown.js
import React, { useState } from 'react';
import { Dropdown, Button } from 'antd';
import { MoreOutlined, PushpinOutlined, TeamOutlined } from '@ant-design/icons';

export const HeaderDropdownMenu = ({ onShowPinnedMessages, onShowMembersList, room }) => {
    
    const items = [
        {
            label: 'Messages épinglés',
            key: '1',
            icon: <PushpinOutlined />,
            onClick: onShowPinnedMessages
        },
        !room.isPrivate && {
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
    );
};
