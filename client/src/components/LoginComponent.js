import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import axios from '../axiosConfig'; 

export const LoginComponent = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/login', {
        email: values.email,
        password: values.password,
      });
      message.success('Connexion réussie!');
      console.log('Token:', response.data.token);
      // Vous pouvez maintenant stocker le token, rediriger l'utilisateur, etc.
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      message.error('Erreur de connexion, veuillez vérifier vos informations');
    }
    setLoading(false);
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Veuillez entrer votre email!' }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
      >
        <Input
          type="password"
          placeholder="Mot de passe"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Se souvenir de moi</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="">
          Mot de passe oublié
        </a>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
          Connexion
        </Button>
        Ou <a href="">inscrivez-vous maintenant!</a>
      </Form.Item>
    </Form>
  );
};

