import React, { useMemo } from 'react';
import { List, Tag, Typography } from 'antd';
import { useFriendships } from '../../../contexts/friendshipsContext'; // Assurez-vous d'importer correctement

const { Text } = Typography;

const formatTimeElapsed = (sentAt) => {
  const now = new Date()
  const sentDate = new Date(sentAt)
  const timeDiff = now - sentDate
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60))
  const daysDiff = Math.floor(hoursDiff / 24)

  if (daysDiff > 0) {
    return `Il y a ${daysDiff} jour${daysDiff > 1 ? 's' : ''}`
  }
  return `Il y a ${hoursDiff} heure${hoursDiff > 1 ? 's' : ''}`
}


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
