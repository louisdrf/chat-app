import React from 'react';
import { Avatar } from 'antd';
import { minidenticon } from 'minidenticons';
import { useUsers } from '../contexts/usersContext'; // Assurez-vous du bon chemin d'import

export const UserAvatar = ({ user, size = 42 }) => {
  const users = useUsers();
  const isOnline = users[user.id]?.isOnline;

  const avatarStyle = {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    position: 'relative', // Pour positionner l'indicateur de statut
  };

  const statusIndicatorStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: isOnline ? 'green' : 'gray',
    border: '2px solid white',
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        style={avatarStyle}
        size={size}
        shape="circle"
        src={`data:image/svg+xml;base64,${btoa(minidenticon(user.username, 80, 50))}`}
      />
      <span style={statusIndicatorStyle}></span>
    </div>
  );
};
