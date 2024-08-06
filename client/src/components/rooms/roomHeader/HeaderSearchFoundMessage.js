import React from 'react';
import { Card, Typography, Tooltip } from 'antd';
import { UserAvatar } from '../../UserAvatar'; 

const { Text } = Typography

export const HeaderSearchFoundMessage = ({ user, message }) => {

  const isOwner = user.username === localStorage.getItem('username')
  const formattedDate = new Date(message.sentAt).toLocaleString()
  const formattedModifyDate = new Date(message.modifiedAt).toLocaleString()

  return (
    <Card className="message-row" bodyStyle={{ padding: '0' }} style={{ marginBottom : '0px'}}>
      <div className="message-content">
        <div className="avatar">
          <UserAvatar user={user} size={42} />
        </div>

        <div className="message-details">
          <div className="header">
            <div className="username-date">
              <div className="username">{ isOwner ? "Moi" : user.username }</div>
              <Text className="date">{formattedDate}</Text>
            </div>
          </div>
          <div className="content">
            <Text>{message.content}</Text>
          </div>
        </div>
      </div>
      {formattedDate !== formattedModifyDate && (
        <Tooltip title={`Modifié le ${formattedModifyDate}`}>
          <Text
            type="secondary"
            style={{ position: 'absolute', bottom: '5px', right: '10px', fontSize: '12px' }}
          >
            (modifié)
          </Text>
        </Tooltip>
      )}
    </Card>
  )
}
