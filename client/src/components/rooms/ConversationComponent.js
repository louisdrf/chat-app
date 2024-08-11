import React, { useState, useEffect } from 'react';
import { useSocket } from '../../contexts/socketContext'; 
import { MessageRowComponent } from './messages/MessageRowComponent';
import { useRooms } from '../../contexts/roomsContext';

export const ConversationComponent = () => {
  const { socket } = useSocket()
  const { activeRoom } = useRooms()

  const [room, setRoom] = useState(activeRoom)
  const [messages, setMessages] = useState(room.messages)

  useEffect(() => {
    if (!socket) return

    const currentUsername = localStorage.getItem("username")

    socket.emit('join_room', room.id, currentUsername)

    const handleReceiveMessage = (message) => {
        if (message.room.id === room.id) {
            setMessages(prevMessages => [...prevMessages, message])
        }
    }

    const handleDeleteMessage = (messageId) => setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId))
    
    const handleModifyMessage = (modifiedMessage) => {
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === modifiedMessage.id ? modifiedMessage : msg
      ))
    }

    socket.on('receive_message', handleReceiveMessage)
    socket.on('message_deleted', handleDeleteMessage)
    socket.on('message_modified', handleModifyMessage)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
      socket.off('message_deleted', handleDeleteMessage)
      socket.off('message_modified', handleModifyMessage)
    }
  }, [socket, room])


  useEffect(() => {
    setRoom(activeRoom)
    setMessages(activeRoom.messages)
  }, [activeRoom])

  return (
    <div className="conversation-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <MessageRowComponent 
            key={index}
            user={msg.sentBy}
            message={msg}
            room={room}
        />
        ))}
      </div>
    </div>
  )
}
