// src/components/CurrentConversationHeader.js
import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { useSocket } from '../../../contexts/socketContext';
import { PinnedMessagesModal } from './PinnedMessagesModal';
import { HeaderComponent } from './Header';
import { RoomMembersModal } from './MembersListModal';
import { useRooms } from '../../../contexts/roomsContext';


export const CurrentConversationHeader = () => {
  const { socket } = useSocket()
  const { activeRoom } = useRooms()

  // show pinned messages
  const [pinnedMessages, setPinnedMessages] = useState(activeRoom.messages.filter(m => m.isPinned))
  const [isPinnedMessagesModalVisible, setIsPinnedMessagesModalVisible] = useState(false)
  const showPinnedMessages = () => setIsPinnedMessagesModalVisible(true)
  const handlePinnedMessagesModalCancel = () => setIsPinnedMessagesModalVisible(false)
  
  // show members list
  const [roomMembers, setRoomMembers] = useState(activeRoom.users)
  const [isMembersListModalVisible, setIsMembersListModalVisible] = useState(false)
  const showMembersList = () => setIsMembersListModalVisible(true)
  const handleMembersListModalCancel = () => setIsMembersListModalVisible(false)

  useEffect(() => {
    if (!socket) {
      console.error('Socket instance is not available')
      return
    }

    setPinnedMessages(activeRoom.messages.filter(m => m.isPinned))
    
    const handlePinnedMessage = (roomWithPinnedMessage) => {
      if (roomWithPinnedMessage.id === activeRoom.id) {
        setPinnedMessages(roomWithPinnedMessage.messages.filter(m => m.isPinned))
      }
    }

    socket.on('message_pinned', handlePinnedMessage);

    return () => socket.off('message_pinned', handlePinnedMessage)
    
  }, [activeRoom, socket])


  useEffect(() => {
    setRoomMembers(activeRoom.users)
  }, [activeRoom])


  return (
    <div>
      <HeaderComponent 
        onShowPinnedMessages={showPinnedMessages} 
        onShowMembersList={showMembersList}
      />
      <Divider />
      <PinnedMessagesModal
        visible={isPinnedMessagesModalVisible}
        onCancel={handlePinnedMessagesModalCancel}
        pinnedMessages={pinnedMessages}
      />
      <RoomMembersModal
        visible={isMembersListModalVisible}
        onCancel={handleMembersListModalCancel}
        roomMembers={roomMembers}
      />
    </div>
  )
}
