import React, { useState } from 'react';
import { Card, Typography, Tooltip } from 'antd';
import '../../../styles/components/messages/message-row-component.scss';
import { UserAvatar } from '../../UserAvatar';
import { MessageRowDropdownMenu } from './MessageRowDropdownMenu';
import { useSocket } from '../../../contexts/socketContext'; 
import TextArea from 'antd/es/input/TextArea';
 

const { Text, Link } = Typography;

export const MessageRowComponent = ({ username, message, room }) => {
  const socket = useSocket()

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content)

  const isOwner = username === localStorage.getItem('username')
  const formattedDate = new Date(message.sentAt).toLocaleString() 
  const formattedModifyDate = new Date(message.modifiedAt).toLocaleString() 

  const handleEdit = () => setIsEditing(true)

  const handleSave = () => {
        socket.emit('modify_message', message.id, room.id, editedContent);
        setIsEditing(false);
    };

  const handleCancel = () => {
      setIsEditing(false);
      setEditedContent(message.content);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') handleCancel()
    else if (e.key === 'Enter') handleSave()
  }


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
              <MessageRowDropdownMenu message={message} room={room} onEdit={handleEdit}  />
            )}
          </div>
          <div className="content">
                {isEditing ? (
                    <div className="edit-mode">
                      <TextArea 
                        value={editedContent} 
                        onChange={(e) => setEditedContent(e.target.value)} 
                        onKeyDown={handleKeyDown}
                        maxLength={3500}
                        autoSize={{ minRows: 1, maxRows: 7 }} 
                        style={{ marginBottom: '5px' }}
                      />
                      <div className="edit-instructions">
                        <Text type="secondary">
                          Appuyez sur <Text keyboard>Échap</Text> pour <Link onClick={handleCancel}>annuler</Link>, <Text keyboard>Entrée</Text> pour <Link onClick={handleSave}>enregistrer</Link>.
                        </Text>
                      </div>
                    </div>
                  ) : (
                    <Text>
                      {message.content}
                    </Text>
                  )}
          </div>
        </div>
      </div>
      {message.modifiedAt !== message.sentAt && (
        <Tooltip title={`Modifié le ${formattedModifyDate}`}>
          <Text type="secondary" style={{ position: 'absolute', bottom: '5px', right: '10px', fontSize: '12px' }}>
            (modifié)
          </Text>
        </Tooltip>
      )}
    </Card>
  )
}
