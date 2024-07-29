import React from 'react';
import { Typography, Divider } from 'antd';
import { UserAvatar } from './UserAvatar';

const { Title } = Typography

export const CurrentConversationHeader = ({ username }) => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px', gap: '10px' }}>
        <UserAvatar username={username} size={32} />
        <Title level={4} style={{ margin: 0 }}>{username}</Title>
      </div>
      <Divider />
    </div>
  )
}