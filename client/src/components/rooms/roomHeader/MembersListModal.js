import React from 'react';
import { Modal, List } from 'antd';
import { RoomMember } from './RoomMember';

export const RoomMembersModal = ({ visible, onCancel, roomMembers }) => {

  const filteredMembers = roomMembers.filter(member => member.username !== localStorage.getItem('username'))

  return (
    <Modal
      title="Liste des membres"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <List
        dataSource={filteredMembers}
        renderItem={member => (
          <List.Item>
            <RoomMember member={member} />
          </List.Item>
        )}
      />
    </Modal>
  )
  
}