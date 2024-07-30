import React from 'react';
import { Typography } from 'antd';
import { UserAvatar } from '../../UserAvatar';
import '../../../styles/components/roomHeader/room-header-container.scss'
import { HeaderDropdownMenu } from './HeaderDropdownMenu';

const { Title } = Typography;

export const HeaderComponent = ({ room, roomName, onShowPinnedMessages, onShowMembersList }) => (
    <div className="headerContainer">
      <div className="headerContent">
        <UserAvatar username={roomName} size={32} />
        <Title level={4} className="title">{roomName}</Title>
      </div>
      <HeaderDropdownMenu 
        onShowPinnedMessages={onShowPinnedMessages} 
        onShowMembersList={onShowMembersList}
        room={room}
      />
    </div>
  )