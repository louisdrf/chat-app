import React, { useMemo } from 'react';
import { List } from 'antd';
import { FriendItem } from './FriendItem';
import { useUsers } from '../../../contexts/usersContext';

export const OnlineFriendsList = () => {
  const { userFriends } = useUsers();

  const onlineFriends = useMemo(() => {
    return userFriends.filter(user => user.isOnline);
  }, [userFriends]);

  return (
    <List
      dataSource={onlineFriends}
      renderItem={user => (
        <List.Item key={user.id}>
          <FriendItem user={user} />
        </List.Item>
      )}
    />
  );
};
