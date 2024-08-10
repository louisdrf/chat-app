import React from 'react';
import { Typography } from 'antd';
import '../../../styles/components/roomHeader/room-header-container.scss'
import { HeaderDropdownMenu } from './HeaderDropdownMenu';
import { RoomAvatar } from '../../RoomAvatar';
import { SearchMessage } from './SearchMessage';
import { useRooms } from '../../../contexts/roomsContext';

const { Title } = Typography

export const HeaderComponent = ({ onShowPinnedMessages, onShowMembersList }) => {
  const { activeRoom, activeRoomName } = useRooms()

  return (
      <div className="headerContainer">

        <div className="headerContent">
          <RoomAvatar roomName={activeRoomName} size={32} />
          <Title level={4} className="title">{activeRoomName}</Title>
        </div>

        <div className="headerContent">
          <SearchMessage messages={activeRoom.messages}/>
          <HeaderDropdownMenu 
            onShowPinnedMessages={onShowPinnedMessages} 
            onShowMembersList={onShowMembersList}
          />
        </div>

      </div>
  )
    
}