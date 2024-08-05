import React from 'react';
import { Modal, Button, Tabs } from 'antd';
import { FriendsList } from './friends-list/FriendsList';
import { NewFriendRequest } from './friend-requests-list/NewFriendRequest';
import { PendingFriendshipsList } from './friend-requests-list/PendingFriendshipsList';
import { ReceivedFriendshipsList } from './friend-requests-list/ReceivedFriendshipsList';
import { OnlineFriendsList } from './friends-list/OnlineFriendsList';

const { TabPane } = Tabs

export const FriendsModal = ({ visible, onCancel }) => {
  return (
    <Modal
      title="Amis"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Fermer
        </Button>,
      ]}
      width="50vw" 
      style={{ top: 20, height: '70vh' }} 
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="En ligne" key="1">
          <OnlineFriendsList/>
        </TabPane>
        <TabPane tab="Tous mes amis" key="2">
          <FriendsList/>
        </TabPane>
        <TabPane tab="Demandes en attente" key="3">
          <PendingFriendshipsList/>
        </TabPane>
        <TabPane tab="Demandes reçues" key="4">
          <ReceivedFriendshipsList/>
        </TabPane>
        <TabPane tab="Ajouter un ami" key="5">
          <NewFriendRequest/>
        </TabPane>
      </Tabs>
    </Modal>
  )
}
