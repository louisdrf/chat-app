import React, { useState } from 'react';
import { List } from 'antd';
import { FriendItem } from './FriendItem';
import { getUserAllFriends } from '../../../services/usersServices';

export const FriendsList = ({ online }) => {

  const [friendsList, setFriendsList] = useState([])

  const getAllFriends = async() => {
    const friends = await getUserAllFriends()
    setFriendsList(friends)
  }
  const getOnlineFriends = () => setFriendsList([])
  
  online ? getOnlineFriends() : getAllFriends()

  return (
      <List
        dataSource={friendsList}
        renderItem={user => (
          <List.Item>
            <FriendItem member={user} />
          </List.Item>
        )}
      />
  )
  
}