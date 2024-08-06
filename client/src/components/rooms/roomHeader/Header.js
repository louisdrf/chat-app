import React from 'react';
import { Typography } from 'antd';
import '../../../styles/components/roomHeader/room-header-container.scss'
import { HeaderDropdownMenu } from './HeaderDropdownMenu';
import { RoomAvatar } from '../../RoomAvatar';
import { SearchMessage } from './SearchMessage';

const { Title } = Typography;

export const HeaderComponent = ({ room, roomName, onShowPinnedMessages, onShowMembersList }) => (
    <div className="headerContainer">

      <div className="headerContent">
        <RoomAvatar roomName={roomName} size={32} />
        <Title level={4} className="title">{roomName}</Title>
      </div>

      <div className="headerContent">
        <SearchMessage messages={room.messages}/>
        <HeaderDropdownMenu 
          onShowPinnedMessages={onShowPinnedMessages} 
          onShowMembersList={onShowMembersList}
          room={room}
        />
      </div>

    </div>
  )