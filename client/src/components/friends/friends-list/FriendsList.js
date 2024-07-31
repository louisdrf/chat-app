import React, { useState, useEffect } from 'react';
import { List, message as antdMessage } from 'antd';
import { FriendItem } from './FriendItem';
import { useSocket } from "../../../contexts/socketContext";

export const FriendsList = ({ online }) => {
  const socket = useSocket()
  const [friendsList, setFriendsList] = useState([])

  useEffect(() => {
    const getFriendsWithOnlineStatus = () => {
      socket.emit('getFriendsWithStatus', localStorage.getItem("username"))
    }

    const handleFriendsWithOnlineStatus = (friends) => {
      if (online) {
        setFriendsList(friends.filter(friend => friend.isOnline))
      } else {
        setFriendsList(friends)
      }
    }

    socket.on('friendsWithOnlineStatus', handleFriendsWithOnlineStatus);

    socket.on('friendsWithOnlineStatusError', (error) => {
      console.error('Erreur lors de la récupération des amis en ligne :', error);
      antdMessage.error("Une erreur est survenue pendant la récupération de vos amis.");
    })

    getFriendsWithOnlineStatus()

    return () => {
      socket.off('friendsWithOnlineStatus', handleFriendsWithOnlineStatus)
      socket.off('friendsWithOnlineStatusError')
    }
  }, [online, socket])

  return (
    <List
      dataSource={friendsList}
      renderItem={user => (
        <List.Item>
          <FriendItem user={user} />
        </List.Item>
      )}
    />
  )
}
