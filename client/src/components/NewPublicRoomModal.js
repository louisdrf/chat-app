// src/components/NewPublicRoomFormModal.js

import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

export const NewPublicRoomFormModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form.validateFields().then(values => {
      form.resetFields()
      onCreate(values)
    }).catch(info => {
      console.log('Validate Failed:', info)
    })
  }

  return (
    <Modal
      title="Créer un nouveau salon"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Annuler
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Créer
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="name"
          label="Nom du salon"
          rules={[
            {
              required: true,
              message: 'Veuillez entrer un nom de salon',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
