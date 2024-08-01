import React, { useMemo } from 'react';
import { List, Tag, Typography } from 'antd';
import { useFriendships } from '../../../contexts/friendshipsContext';
import { formatTimeElapsed } from '../../../services/helpers';

const { Text } = Typography

export const PendingFriendshipsList = () => {
  const { pendingFriendships } = useFriendships()

  const pendingRequestsList = useMemo(() => {
    return pendingFriendships || []
  }, [pendingFriendships])

  return (
    <List
      dataSource={pendingRequestsList}
      renderItem={friendship => (
        <List.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div>
              <Text style={{ fontSize: '16px', fontWeight: '500' }}>
                {friendship.requestee.username}
              </Text>
              <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                {formatTimeElapsed(friendship.createdAt)}
              </div>
            </div>
            <Tag color="blue" style={{ fontSize: '14px' }}>
              En attente
            </Tag>
          </div>
        </List.Item>
      )}
    />
  )
}
