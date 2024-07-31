import React, { useState, useEffect } from 'react';
import { Input, Button, Typography } from 'antd';
import { useSocket } from '../../../contexts/socketContext';

const { Title, Text } = Typography

export const NewFriendRequest = () => {
  const socket = useSocket();
  const [friendUsername, setFriendUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false)

  const handleSendRequest = () => {
    if (friendUsername) {
      socket.emit('send_friendship_request', friendUsername, localStorage.getItem('username'))
    }
  }

  useEffect(() => {
    socket.on('friendship_request_sent', (data) => {
      setMessage(data.message)
      setIsError(false)
    })

    socket.on('friendship_request_error', (data) => {
      setMessage(data.error)
      setIsError(true)
    })

    return () => {
      socket.off('friendship_request_sent')
      socket.off('friendship_request_error')
    }
  }, [socket])

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Title level={4}>AJOUTER</Title>
      <Text type="secondary">
        Vous pouvez ajouter un ami grâce à leur nom d'utilisateur.
      </Text>
      <Input
        placeholder="Entrez le nom d'utilisateur de votre ami..."
        value={friendUsername}
        onChange={(e) => setFriendUsername(e.target.value)}
        style={{ marginTop: '20px', marginBottom: '20px', width: '100%' }}
      />
      <Button type="primary" onClick={handleSendRequest} disabled={!friendUsername}>
        Envoyer la demande
      </Button>
      {message && (
        <div style={{ marginTop: '20px' }}>
          <Text type={isError ? 'danger' : 'success'}>
            {message}
          </Text>
        </div>
      )}
    </div>
  )
}
