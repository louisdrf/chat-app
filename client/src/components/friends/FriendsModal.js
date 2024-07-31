// src/components/NewPublicRoomFormModal.js

import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

export const FriendsModal = ({ visible, onCancel }) => {


  return (
    <Modal
      title="Amis"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Fermer
        </Button>,
      ]}
    >
    </Modal>
  )
}
