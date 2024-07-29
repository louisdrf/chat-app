import React from 'react';
import { Card, Typography } from 'antd';
import '../../../styles/components/messages/message-row-component.scss';
import { UserAvatar } from '../../UserAvatar';
import { MessageRowDropdownMenu } from './MessageRowDropdownMenu';

const { Text } = Typography;

export const MessageRowComponent = ({ username, message, room }) => {
  console.log('new message row:', message);

  const isOwner = username === localStorage.getItem('username')

  const formattedDate = new Date(message.sentAt).toLocaleString() 

  return (
    <Card
      className="message-row"
      bodyStyle={{ padding: '0' }}
    >
      <div className="message-content">
        <div className="avatar">
          <UserAvatar username={username} size={42} />
        </div>
        
        <div className="message-details">
          <div className="header">
            <div className="username-date">
              <div className="username">{username}</div>
              <Text className="date">
                {formattedDate}
              </Text>
            </div>
            {isOwner && (
              <MessageRowDropdownMenu message={message} room={room} />
            )}
          </div>
          <div className="content">
            <Text>
              {message.content}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  )
}
