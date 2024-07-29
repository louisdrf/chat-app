// src/components/ConversationComponent.js

import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/socketContext'; 

export const ConversationComponent = ({ room }) => {
  const socket = useSocket()
  const [messages, setMessages] = useState(room.messages)

  useEffect(() => {
    if (!socket) return

    socket.emit('join_room', room.id)

    const handleReceiveMessage = (message) => {
      setMessages(prevMessages => [...prevMessages, message])
    }

    socket.on('receive_message', handleReceiveMessage)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
    }
  }, [socket, room.id])

  return (
    <div className="conversation-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sentBy.username}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};
