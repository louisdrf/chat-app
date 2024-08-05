import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import { minidenticon } from 'minidenticons';
import { useUsers } from '../contexts/usersContext'; 

export const UserAvatar = ({ user, size = 42 }) => {
  const { users } = useUsers()
  const [isOnline, setIsOnline] = useState(user.isOnline)

  useEffect(() => {    
    const updatedUser = users.find(u => u.id === user.id)
    if (updatedUser) {
      setIsOnline(updatedUser.isOnline)
    }
  }, [users, user.id])

  const avatarStyle = {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    position: 'relative',
  }

  const statusIndicatorStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: isOnline ? 'green' : 'red',
    border: '2px solid white',
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        style={avatarStyle}
        size={size}
        shape="circle"
        src={`data:image/svg+xml;base64,${btoa(minidenticon(user.username, 80, 50))}`}
      />
      { user.username !== localStorage.getItem('username') && <span style={statusIndicatorStyle}></span> }
    </div>
  )
}
