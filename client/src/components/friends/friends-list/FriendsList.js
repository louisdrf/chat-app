import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { FriendItem } from './FriendItem';
import { useUsers } from '../../../contexts/usersContext';

export const FriendsList = () => {
  const { userFriends } = useUsers()
  const [friends, setFriends] = useState(userFriends)

  useEffect(() => {
    setFriends(userFriends)
  }, [userFriends])

  return (
    <List
      dataSource={friends}
      renderItem={user => (
        <List.Item>
          <FriendItem user={user} />
        </List.Item>
      )}
    />
  )
}
