
import React, { useState } from 'react'
import { LoginComponent } from '../components/LoginComponent.js'
import { RegisterComponent } from '../components/RegisterComponent.js'
import { Button } from 'antd'

export const Auth = () => {

    const [showLoginForm, setShowLoginForm] = useState(true)

    const toggleForm = () => {
        setShowLoginForm(!showLoginForm)
    }


    return (
        <div className="auth-page-container">
          {showLoginForm ? (
            <>
              <h2>Connexion</h2>
              <LoginComponent />
              <p>
                Je n'ai pas de compte ?{' '}
                <Button type="link" onClick={toggleForm}>
                  Inscrivez-vous
                </Button>
              </p>
            </>
          ) : (
            <>
              <h2>Inscription</h2>
              <RegisterComponent />
              <p>
                J'ai déjà un compte ?{' '}
                <Button type="link" onClick={toggleForm}>
                  Connectez-vous
                </Button>
              </p>
            </>
          )}
        </div>
      );
}