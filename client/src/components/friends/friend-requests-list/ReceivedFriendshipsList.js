import React, { useEffect, useState } from 'react';
import { List, Button, Typography } from 'antd';
import { useFriendships } from '../../../contexts/friendshipsContext';
import { useSocket } from '../../../contexts/socketContext';
import { formatTimeElapsed } from '../../../services/helpers';

const { Text } = Typography

export const ReceivedFriendshipsList = () => {
  const { receivedFriendships } = useFriendships()
  const { socket }  = useSocket()
  const [received, setReceived] = useState(receivedFriendships)

  const handleAcceptRequest = (friendshipId) => {
    socket.emit('accept_friendship_request', friendshipId)
  }

  const handleDeclineRequest = (friendshipId) => {
    socket.emit('decline_friendship_request', friendshipId)
  }

  useEffect(() => {
    setReceived(receivedFriendships)
  }, [receivedFriendships])

  return (
    <List
      dataSource={received}
      renderItem={(friendship) => (
        <List.Item
          style={{
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: 1 }}>
            <Text style={{ fontSize: '16px', fontWeight: '500' }}>
              {friendship.requester.username}
            </Text>
            <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
              {formatTimeElapsed(friendship.createdAt)}
            </div>
          </div>
          <div>
          <Button danger
              onClick={() => handleDeclineRequest(friendship.id)}
              style={{ marginRight: '10px' }}
            >
              Refuser
            </Button>
            <Button
              type="primary"
              onClick={() => handleAcceptRequest(friendship.id)}
              style={{ marginRight: '10px' }}
            >
              Accepter
            </Button>
          </div>
        </List.Item>
      )}
    />
  )
}
