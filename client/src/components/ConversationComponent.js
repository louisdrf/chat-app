// src/components/ConversationComponent.js

import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/socketContext'; 

export const ConversationComponent = ({ room }) => {
  const socket = useSocket()
  const [messages, setMessages] = useState(room.messages)

  useEffect(() => {
    if (!socket) return

    const handleReceiveMessage = (message) => {
      setMessages(prevMessages => [...prevMessages, message])
    }

    socket.on('receive_message', handleReceiveMessage)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
    }
  }, [socket])

  return (
    <div className="conversation-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};
