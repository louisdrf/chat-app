import React, { useState, useEffect, useMemo } from 'react';
import { List, message as antdMessage } from 'antd';
import { FriendItem } from './FriendItem';
import { useUsers } from '../../../contexts/usersContext'; // Assurez-vous d'importer correctement
import { getUserAllFriends } from '../../../services/usersServices';

export const FriendsList = ({ online }) => {
  const [friendsList, setFriendsList] = useState([])
  const users = useUsers()

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const friends = await getUserAllFriends()
        setFriendsList(friends)
      } catch (error) {
        antdMessage.error('Erreur lors de la récupération des amis.');
      }
    }

    fetchFriendsList()
  }, [])

  // Memoize the filtered list based on the `online` prop
  const filteredFriendsList = useMemo(() => {
    const result = online
      ? friendsList.filter(friend => users[friend.id]?.isOnline)
      : friendsList
    return result
  }, [friendsList, online, users])

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
