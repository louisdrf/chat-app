// src/components/InputMessageComponent.js
import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSocket } from '../contexts/socketContext'; 

export const InputMessageComponent = () => {
  const [message, setMessage] = useState('');
  const socket = useSocket();

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { content : message, senderUsername : localStorage.getItem('username')})
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="inputMessage">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        suffix={
          <Button
            type="text"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
          />
        }
        placeholder="Tapez votre message ici..."
        style={{ width: '100%' }}
      />
    </div>
  )
}
