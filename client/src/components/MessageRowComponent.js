import React from 'react';
import { UserAvatar } from './UserAvatar';
import { Typography } from 'antd';

const { Text } = Typography
export const MessageRowComponent = ({ username, message }) => {

    console.log('new message row : ', message);

    const formattedDate = new Date(message.sentAt).toLocaleString()


    return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          marginBottom: '25px',
          padding: '10px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}>
          <div style={{ marginRight: '15px' }}>
            <UserAvatar username={username} size={40} />
          </div>
    
          <div style={{ flex: 1 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '5px'
            }}>
              <div style={{ 
                fontWeight: 'bold', 
                color: '#333',
                fontSize: '16px'
              }}>
                {username}
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {formattedDate}
              </Text>
            </div>
            <div>
              <Text style={{ fontSize: '14px', lineHeight: '1.5' }}>
                {message.content}
              </Text>
            </div>
          </div>
        </div>
      );
}