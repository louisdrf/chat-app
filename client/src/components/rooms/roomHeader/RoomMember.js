import React from 'react';
import { Card } from 'antd';
import { UserAvatar } from '../../UserAvatar'; // Assurez-vous que ce chemin est correct

const { Meta } = Card;

export const RoomMember = ({ member }) => {
  return (
    <Card
      style={{ margin: '10px 0', padding: '10px', border: 'none' }}
      bodyStyle={{ padding: '0' }}
    >
      <Meta
        avatar={<UserAvatar username={member.username} size={32} />}
        title={member.username}
        style={{ margin: '0' }}
      />
    </Card>
  );
};