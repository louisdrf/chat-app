// src/components/CurrentConversationHeader.js
import React, { useState, useEffect } from 'react';
import { Typography, Divider, Tooltip, Button, Modal, List } from 'antd';
import { UserAvatar } from './UserAvatar';
import { PushpinOutlined } from '@ant-design/icons';
import { PinnedMessageComponent } from './PinnedMessageComponent';
import { useSocket } from '../contexts/socketContext';

const { Title } = Typography;

export const CurrentConversationHeader = ({ room }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pinnedMessages, setPinnedMessages] = useState(room.messages.filter(m => m.isPinned))
  const socket = useSocket()

  const showPinnedMessages = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {

    setPinnedMessages(room.messages.filter(m => m.isPinned))
    
    const handlePinnedMessage = (roomWithPinnedMessage) => {
      if (roomWithPinnedMessage.id === room.id) {
        setPinnedMessages(roomWithPinnedMessage.messages.filter(m => m.isPinned));
      }
    };

    socket.on('message_pinned', handlePinnedMessage);

    return () => {
      socket.off('message_pinned', handlePinnedMessage);
    };
  }, [room, socket])


  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserAvatar username={room.name} size={32} />
          <Title level={4} style={{ margin: 0 }}>{room.name}</Title>
        </div>
        <Tooltip title="Messages épinglés">
          <Button
            type="text"
            icon={<PushpinOutlined />}
            onClick={showPinnedMessages}
          />
        </Tooltip>
      </div>
      <Divider />

      <Modal
        title="Messages épinglés"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          dataSource={pinnedMessages}
          renderItem={message => (
            <List.Item>
              <PinnedMessageComponent message={message}/>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  )
}
