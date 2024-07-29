import React from 'react';
import { Modal, List } from 'antd';
import { PinnedMessage } from './PinnedMessage';

export const PinnedMessagesModal = ({ visible, onCancel, pinnedMessages }) => (
  <Modal
    title="Messages épinglés"
    open={visible}
    onCancel={onCancel}
    footer={null}
  >
    <List
      dataSource={pinnedMessages}
      renderItem={message => (
        <List.Item>
          <PinnedMessage message={message} />
        </List.Item>
      )}
    />
  </Modal>
)