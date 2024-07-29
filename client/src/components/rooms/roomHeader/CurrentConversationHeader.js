// src/components/CurrentConversationHeader.js
import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { useSocket } from '../../../contexts/socketContext';
import { PinnedMessagesModal } from './PinnedMessagesModal';
import { HeaderComponent } from './Header';


export const CurrentConversationHeader = ({ room }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pinnedMessages, setPinnedMessages] = useState(room.messages.filter(m => m.isPinned))
  const socket = useSocket()

  const showPinnedMessages = () => setIsModalVisible(true)
  const handleCancel = () => setIsModalVisible(false)
  

  useEffect(() => {

    setPinnedMessages(room.messages.filter(m => m.isPinned))
    
    const handlePinnedMessage = (roomWithPinnedMessage) => {
      if (roomWithPinnedMessage.id === room.id) {
        setPinnedMessages(roomWithPinnedMessage.messages.filter(m => m.isPinned))
      }
    }

    socket.on('message_pinned', handlePinnedMessage);

    return () => socket.off('message_pinned', handlePinnedMessage)
    
  }, [room, socket])


  return (
    <div>
      <HeaderComponent roomName={room.name} onShowPinnedMessages={showPinnedMessages} />
      <Divider />
      <PinnedMessagesModal
        visible={isModalVisible}
        onCancel={handleCancel}
        pinnedMessages={pinnedMessages}
      />
    </div>
  )
}
