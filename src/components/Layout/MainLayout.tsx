// src/components/Layout/MainLayout.tsx
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Typography,
  Space,
  Badge,
  Drawer,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { generateMenuItems } from '../../routes.tsx';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showSider?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showSider = true,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = user ? generateMenuItems(user.role) : [];

  const userMenu = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: async () => {
        await logout();
        navigate('/login');
      },
    },
  ];

  // 移动端菜单
  const mobileMenu = (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems.map((item: any) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        onClick: () => {
          navigate(item.key);
          setMobileOpen(false);
        },
      }))}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏（桌面端） */}
      {showSider && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          collapsedWidth="0"
          trigger={null}
          width={250}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        >
          <div style={{ padding: '24px 16px', textAlign: 'center' }}>
            <Title level={3} style={{ color: '#fff', margin: 0 }}>
              {collapsed ? '诊所' : '牙科诊所'}
            </Title>
          </div>
          
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems.map((item: any) => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
              onClick: () => navigate(item.key),
            }))}
          />
        </Sider>
      )}

      <Layout style={{ marginLeft: showSider && !collapsed ? 250 : 0 }}>
        {/* 顶部导航栏 */}
        {showHeader && (
          <Header
            style={{
              padding: '0 24px',
              background: '#fff',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 999,
            }}
          >
            <Space>
              {showSider && (
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ fontSize: '16px', width: 64, height: 64 }}
                />
              )}
              
              {/* 移动端菜单按钮 */}
              <Button
                type="text"
                icon={<MenuFoldOutlined />}
                onClick={() => setMobileOpen(true)}
                style={{ display: 'none' }}
                className="mobile-menu-button"
              />
            </Space>

            <Space size="large">
              {/* 通知 */}
              <Badge count={5} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  shape="circle"
                />
              </Badge>

              {/* 用户信息 */}
              <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar
                    icon={<UserOutlined />}
                  />
                  {user && (
                    <span style={{ fontWeight: 500 }}>
                      {user.firstName} {user.lastName}
                    </span>
                  )}
                </Space>
              </Dropdown>
            </Space>
          </Header>
        )}

        {/* 主要内容 */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: '8px',
          }}
        >
          {children}
        </Content>
      </Layout>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="导航菜单"
        placement="left"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        width={250}
      >
        {mobileMenu}
      </Drawer>
    </Layout>
  );
};

export default MainLayout;
