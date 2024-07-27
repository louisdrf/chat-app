import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authServices'

export const RegisterComponent = () => {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const onFinish = async (values) => {
    setLoading(true)
    try {
      await register(values)
      message.success('Votre compte a bien été créé.')
      navigate('/login')

    } catch (error) {
      console.error('Erreur lors de la création du compte : ', error);
      message.error(error.message)
    }
    setLoading(false)
  }

  return (
    <Form
      name="register"
      onFinish={onFinish}
    >
        <Form.Item
        name="email"
        rules={[{ required: true, message: "Veuillez saisir une adresse mail." }]}
      >
        <Input placeholder="Adresse mail" />
      </Form.Item>

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
          Créer
        </Button>
      </Form.Item>
    </Form>
  )
}

