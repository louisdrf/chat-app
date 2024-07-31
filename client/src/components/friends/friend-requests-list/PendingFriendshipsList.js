import React, { useMemo } from 'react';
import { List, Tag } from 'antd';
import { useFriendships } from '../../../contexts/friendshipsContext'; // Assurez-vous d'importer correctement

export const PendingFriendshipsList = () => {
  const { pendingFriendships } = useFriendships()

  // Memoize the list of pending requests
  const pendingRequestsList = useMemo(() => {
    return pendingFriendships || []
  }, [pendingFriendships])

  return (
    <List
      dataSource={pendingRequestsList}
      renderItem={friendship => (
        <List.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>{friendship.requestee.username}</span>
            <Tag color="blue">En attente</Tag>
          </div>
        </List.Item>
      )}
    />
  );
};
