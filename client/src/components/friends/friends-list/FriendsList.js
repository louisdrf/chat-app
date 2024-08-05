import React, { useState, useEffect, useMemo } from 'react';
import { List } from 'antd';
import { FriendItem } from './FriendItem';
import { useUsers } from '../../../contexts/usersContext';

export const FriendsList = ({ online }) => {
  const { userFriends } = useUsers()
  const [friendsList, setFriendsList] = useState(userFriends)

  useEffect(() => {
    const updateFriendsList = () => {
      setFriendsList(userFriends)
    }

    updateFriendsList()
  }, [userFriends])

  const filteredFriendsList = useMemo(() => {
    const result = online ? friendsList.filter(friend => friend.isOnline) : friendsList
    return result
  }, [online, friendsList])

  return (
    <List
      dataSource={filteredFriendsList}
      renderItem={user => (
        <List.Item>
          <FriendItem user={user} />
        </List.Item>
      )}
    />
  )
}
