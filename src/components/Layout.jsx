import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Badge } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  BellOutlined,
  UserOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '工作台' },
  { key: '/customers', icon: <TeamOutlined />, label: '客户管理' },
  { key: '/events', icon: <ScheduleOutlined />, label: '事项跟进' },
  { key: '/kpi', icon: <BarChartOutlined />, label: 'KPI 看板' },
];

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        style={{
          background: '#001529',
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
        trigger={null}
      >
        {/* Logo area */}
        <div
          style={{
            padding: collapsed ? '16px 8px' : '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            minHeight: 64,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <GlobalOutlined style={{ color: '#fff', fontSize: 20 }} />
          </div>
          {!collapsed && (
            <div>
              <Title level={5} style={{ color: '#fff', margin: 0, fontSize: 15, lineHeight: 1.2 }}>
                CargoWare
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                CRM · 事项跟进
              </Text>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            borderRight: 'none',
            marginTop: 8,
          }}
        />

        {/* Bottom user area */}
        {!collapsed && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Avatar size={36} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
            <div style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontSize: 13, display: 'block' }}>张明</Text>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                高级客户经理
              </Text>
            </div>
            <LogoutOutlined style={{ color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }} />
          </div>
        )}
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                onClick: () => setCollapsed(!collapsed),
                style: { fontSize: 18, cursor: 'pointer', color: '#666' },
              }
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Badge count={3}>
              <BellOutlined style={{ fontSize: 18, color: '#666', cursor: 'pointer' }} />
            </Badge>
            <Text style={{ color: '#666', fontSize: 13 }}>WallTech · CargoWare CRM</Text>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 24,
            minHeight: 360,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
