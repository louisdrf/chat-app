import React, { useState, useEffect, useMemo } from 'react';
import { List, message as antdMessage } from 'antd';
import { FriendItem } from './FriendItem';
import { useSocket } from "../../../contexts/socketContext";
import { getUserAllFriends } from '../../../services/usersServices';

export const FriendsList = ({ online }) => {
  const socket = useSocket();
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const friends = await getUserAllFriends()
        setFriendsList(friends)
      } catch (error) {
        antdMessage.error('Erreur lors de la récupération des amis.');
      }
    }

    fetchFriendsList();

    const handleUserConnected = (user) => {
      setFriendsList((prevList) =>
        prevList.map((friend) =>
          friend.id === user.id ? { ...friend, isOnline: true } : friend
        )
      )
    }

    const handleUserDisconnected = (user) => {
      setFriendsList((prevList) =>
        prevList.map((friend) =>
          friend.id === user.id ? { ...friend, isOnline: false } : friend
        )
      )
    }

    socket.on('user_connected', handleUserConnected)
    socket.on('user_disconnected', handleUserDisconnected)

    return () => {
      socket.off('user_connected', handleUserConnected)
      socket.off('user_disconnected', handleUserDisconnected)
    }
  }, [socket])

  // Memoize the filtered list based on the `online` prop
  const filteredFriendsList = useMemo(() => {
    const result = online ? friendsList.filter(friend => friend.isOnline) : friendsList
    return result
  }, [friendsList, online])

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
