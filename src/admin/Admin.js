import React from 'react'
import { useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
// import Menu from '../header/Menu'
import HeaderHomeAccount from '../homeAccount/HeaderHomeAccount'
import Nhaxe from '../homeAccount/Nhaxe'
import { Button, Menu } from 'antd';
import 'antd/dist/antd.css';

import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CarOutlined,
  CommentOutlined,
  SwapOutlined
} from '@ant-design/icons';
import User from './User'
import Car from './Car'
import Tour from './Tour'
import Routeeeee from './Route'



function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}


const items = [
  getItem(
    <Link to="/admin/car" style={{
      fontWeight: 'bold',
      color: 'rgb(241 152 61)'
    }}>
      Quản lý xe
    </Link>,
    '1',
    <CarOutlined />,
  ),
  getItem(
    <Link to="/admin/tour" style={{
      fontWeight: 'bold',
      color: 'rgb(241 152 61)'
    }}>
      Quản lí chuyến xe
    </Link>,
    '2',
    <DesktopOutlined />,
  ),
  getItem(
    <Link to="/admin/route" style={{
      fontWeight: 'bold',
      color: 'rgb(241 152 61)'
    }}>
      Quản lí lộ trình
    </Link>,
    '3',
    <SwapOutlined />,
  ),
  getItem('Quản lí vé', 'sub1', <ContainerOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Option 7', '7'),
    getItem('Option 8', '8'),
  ]),
  getItem('User', 'sub2', <AppstoreOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
  ]),
  getItem('Yêu cầu điều phối xe', '4', <CommentOutlined />),
  getItem(
    <Link to="/login" style={{
      fontWeight: 'bold',
      color: 'red'
    }}>
      Rời khỏi Admin
    </Link>,
    'link',
    <LogoutOutlined />,
  ),

];


function Admin() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const onClick: MenuProps['onClick'] = e => {
    switch (Number(e.keyPath[0].toString())) {
      case 1:
        navigate('/admin/car')
        break;
      case 2:
        navigate('/admin/tour')
        break;
      default:
      // code block
    }
    console.log(Number(e.keyPath[0].toString()))
  };
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div style={{ display: 'flex', padding: '10px' }}>

      {/* body */}
      <div
        style={{
          maxWidth: 256,
        }}
      >
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{
            marginBottom: 16,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={items}
          onClick={onClick}
        />
      </div>

      {/* router v6 */}
      <Routes>
        <Route path="user" element={<User />}></Route>
        <Route path="car" element={<Car />}></Route>
        <Route path="tour" element={<Tour />}></Route>
        <Route path="route" element={<Routeeeee />}></Route>


      </Routes>
    </div>
  )
}

export default Admin