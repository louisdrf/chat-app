import React, { useState } from 'react';
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
const items = [
  {
    key: '1',
    icon: <MailOutlined />,
    label: 'Navigation One',
  },
  {
    key: '2',
    icon: <CalendarOutlined />,
    label: 'Navigation Two',
  }
]
export const Navbar = () => {
  
  return (
    <>
      <Menu
        style={{
          width: 256
        }}
        defaultSelectedKeys={['1']}
        theme='light'
        items={items}
      />
    </>
  )
}
