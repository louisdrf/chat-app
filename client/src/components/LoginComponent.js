import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authServices';
import { useSocket } from '../contexts/socketContext';

export const LoginComponent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resetSocket } = useSocket();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Connexion réussie.');
      resetSocket(); // Reset the socket after successful login
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      message.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Form
      name="login"
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Veuillez saisir un nom d'utilisateur." }]}
      >
        <Input placeholder="Nom d'utilisateur" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Veuillez saisir un mot de passe.' }]}
      >
        <Input
          type="password"
          placeholder="Mot de passe"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Connexion
        </Button>
      </Form.Item>
    </Form>
  );
};
