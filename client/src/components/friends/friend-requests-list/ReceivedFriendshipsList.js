import React, { useMemo } from 'react';
import { List, Button, Typography, message as antdMessage } from 'antd';
import { useFriendships } from '../../../contexts/friendshipsContext'; // Assurez-vous d'importer correctement
import { useSocket } from '../../../contexts/socketContext'; // Assurez-vous d'importer correctement

const { Text } = Typography;

// Fonction pour formater le temps écoulé depuis l'envoi de la demande
const formatTimeElapsed = (sentAt) => {
  const now = new Date();
  const sentDate = new Date(sentAt);
  const timeDiff = now - sentDate;
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const daysDiff = Math.floor(hoursDiff / 24);

  if (daysDiff > 0) {
    return `Il y a ${daysDiff} jour${daysDiff > 1 ? 's' : ''}`;
  }
  return `Il y a ${hoursDiff} heure${hoursDiff > 1 ? 's' : ''}`;
};

export const ReceivedFriendshipsList = () => {
  const { receivedFriendships } = useFriendships();
  const socket = useSocket();

  const handleAcceptRequest = (friendshipId) => {
    socket.emit('accept_friendship_request', friendshipId);
  };

  // Écouteur pour la réponse d'acceptation de demande d'ami
  socket.on('friendship_request_accepted', (data) => {
    antdMessage.success('Demande d\'ami acceptée.');
  });

  // Mémorisation de la liste des demandes reçues
  const receivedRequestsList = useMemo(() => {
    return receivedFriendships || [];
  }, [receivedFriendships]);

  return (
    <List
      dataSource={receivedRequestsList}
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
