import React from 'react';
import { Typography, Tooltip, Button } from 'antd';
import { UserAvatar } from '../../UserAvatar';
import { PushpinOutlined } from '@ant-design/icons';
import '../../../styles/components/roomHeader/room-header-container.scss'

const { Title } = Typography;

export const HeaderComponent = ({ roomName, onShowPinnedMessages }) => (
    <div className="headerContainer">
      <div className="headerContent">
        <UserAvatar username={roomName} size={32} />
        <Title level={4} className="title">{roomName}</Title>
      </div>
      <Tooltip title="Messages épinglés">
        <Button
          type="text"
          icon={<PushpinOutlined />}
          onClick={onShowPinnedMessages}
        />
      </Tooltip>
    </div>
  )