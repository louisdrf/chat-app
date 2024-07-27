import React, { useState } from 'react';
import { LoginComponent } from '../components/LoginComponent';
import { RegisterComponent } from '../components/RegisterComponent';
import { Button, Row, Col, Typography } from 'antd';
import Lottie from 'react-lottie';
import loginAnimationData from '../assets/lotties/login.json';
import '../styles/auth-page.scss';

const { Title, Paragraph } = Typography;

export const Auth = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="auth-page">
      <Row className="auth-container">
        <Col span={12} className="auth-animation">
          <Lottie options={defaultOptions} height={400} width={400} />
        </Col>
        <Col span={12} className="auth-form">
          {showLoginForm ? (
            <>
              <Title level={2}>Connexion</Title>
              <LoginComponent />
              <Paragraph>
                Pas de compte ?{' '}
                <Button type="link" onClick={toggleForm}>
                  Inscrivez-vous
                </Button>
              </Paragraph>
            </>
          ) : (
            <>
              <Title level={2}>Inscription</Title>
              <RegisterComponent />
              <Paragraph>
                Vous avez déjà un compte ?{' '}
                <Button type="link" onClick={toggleForm}>
                  Connectez-vous
                </Button>
              </Paragraph>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};
