import React, { useState, useEffect, useMemo } from 'react';
import { List, message as antdMessage } from 'antd';
import { FriendItem } from './FriendItem';
import { useUsers } from '../../../contexts/usersContext';

export const FriendsList = ({ online }) => {
  const {userFriends} = useUsers()
  const [friendsList, setFriendsList] = useState(userFriends)
 

  useEffect(() => {
    const updateFriendsList = () => {
      setFriendsList((prevFriends) => {
        const updatedFriends = prevFriends.map((friend) => userFriends[friend.id] || friend)
        return updatedFriends
      })
    }

    updateFriendsList()
  }, [userFriends])

  // Memoize the filtered list based on the `online` prop
  const filteredFriendsList = useMemo(() => {
    console.log(friendsList);
    
    const result = online
      ? friendsList.filter(friend => userFriends[friend.id]?.isOnline)
      : friendsList
    return result
  }, [online, userFriends])

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
