import React from 'react';
import { Card } from 'antd';
import { UserAvatar } from '../../UserAvatar'; // Assurez-vous que ce chemin est correct

const { Meta } = Card;

export const FriendItem = ({ user }) => {
  return (
    <Card
      style={{ margin: '10px 0', padding: '10px', border: 'none' }}
      bodyStyle={{ padding: '0' }}
    >
      <Meta
        avatar={<UserAvatar user={user} size={42} />}
        title={user.username}
        style={{ margin: '0' }}
      />
    </Card>
  )
}