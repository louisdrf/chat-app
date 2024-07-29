import React from 'react';
import { Card, Typography } from 'antd';
import { UserAvatar } from '../../UserAvatar';
import '../../../styles/components/messages/message-row-component.scss';

const { Text } = Typography;

export const PinnedMessage = ({ message }) => {

  const formattedDate = new Date(message.sentAt).toLocaleString() 

  return (
    <Card
      className="message-row"
      bodyStyle={{ padding: '0' }}
    >
      <div className="message-content">
        <div className="avatar">
          <UserAvatar username={message.sentBy.username} size={26} />
        </div>
        
        <div className="message-details">
          <div className="header">
            <div className="username-date">
              <div className="username">{message.sentBy.username}</div>
              <Text className="date">
                {formattedDate}
              </Text>
            </div>
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
