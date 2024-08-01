import React, { useState, useEffect } from 'react';
import { Card, Button, Popconfirm } from 'antd';
import { UserAvatar } from '../../UserAvatar'; // Assurez-vous que ce chemin est correct
import { DeleteOutlined } from '@ant-design/icons';
import { useSocket } from '../../../contexts/socketContext'; // Assurez-vous que ce chemin est correct
import { getFriendship } from '../../../services/friendshipsServices';

export const FriendItem = ({ user }) => {
  console.log('Montage composant avec utilisateur:', user)

  const { socket } = useSocket();
  const [friendship, setFriendship] = useState(null)

  useEffect(() => {
    const fetchFriendship = async () => {
      try {
        const fetchedFriendship = await getFriendship(user.username)
        setFriendship(fetchedFriendship)
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'amitié :', error)
      }
    }

    fetchFriendship()
  }, [])

  const handleDelete = () => {
    if (friendship) {
      socket.emit('delete_friendship', friendship.id)
    } else {
      console.error('Aucune amitié trouvée à supprimer.')
    }
  }

  return (
    <Card
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        margin: '10px 0',
        padding: '10px',
        backgroundColor: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}
      bodyStyle={{ width: '100%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <UserAvatar user={user} size={42} />
        <span style={{ marginLeft: '10px' }}>{user.username}</span>
      </div>
      <Popconfirm
        title="Êtes-vous sûr de vouloir supprimer cet ami ?"
        onConfirm={handleDelete}
        okText="Oui"
        cancelText="Non"
      >
        <Button type="primary" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </Card>
  )
}
