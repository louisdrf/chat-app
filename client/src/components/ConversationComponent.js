// src/components/ConversationComponent.js

import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/socketContext'; 
import { MessageRowComponent } from './MessageRowComponent'

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
      socket.emit('leave_room', room.id)
    }
  }, [socket, room])


  useEffect(() => {
    setMessages(room.messages)
  }, [room])

  return (
    <div className="conversation-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <MessageRowComponent 
            key={index}
            username={msg.sentBy.username}
            message={msg}
        />
        ))}
      </div>
    </div>
  );
};
