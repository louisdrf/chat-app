// src/components/CurrentConversationHeader.js
import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { useSocket } from '../../../contexts/socketContext';
import { PinnedMessagesModal } from './PinnedMessagesModal';
import { HeaderComponent } from './Header';
import { RoomMembersModal } from './MembersListModal';


export const CurrentConversationHeader = ({ name, room }) => {
  const socket = useSocket()

  // show pinned messages
  const [pinnedMessages, setPinnedMessages] = useState(room.messages.filter(m => m.isPinned))
  const [isPinnedMessagesModalVisible, setIsPinnedMessagesModalVisible] = useState(false)
  const showPinnedMessages = () => setIsPinnedMessagesModalVisible(true)
  const handlePinnedMessagesModalCancel = () => setIsPinnedMessagesModalVisible(false)
  
  // show members list
  const [roomMembers, setRoomMembers] = useState(room.users)
  const [isMembersListModalVisible, setIsMembersListModalVisible] = useState(false)
  const showMembersList = () => setIsMembersListModalVisible(true)
  const handleMembersListModalCancel = () => setIsMembersListModalVisible(false)

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


  useEffect(() => {
    setRoomMembers(room.users)
  }, [room])


  return (
    <div>
      <HeaderComponent 
        room={room} 
        roomName={name} 
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
