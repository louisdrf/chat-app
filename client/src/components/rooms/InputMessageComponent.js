// src/components/InputMessageComponent.js
import React, { useState } from 'react';
import { Input } from 'antd';
import { useSocket } from '../../contexts/socketContext'; 

const { TextArea } = Input

export const InputMessageComponent = () => {
  const { socket } = useSocket()
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { 
        content: message, 
        senderUsername: localStorage.getItem('username')
      })
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="inputMessage">
      <TextArea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        maxLength={3500} 
        rows={4}
        placeholder="Tapez votre message ici..."
        style={{ width: '100%' }}
        autoSize={{ minRows: 2, maxRows: 7 }} 
      />
    </div>
  )
}
