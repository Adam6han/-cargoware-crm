import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  List,
  Tag,
  Timeline,
  Avatar,
  Space,
  Progress,
} from 'antd';
import {
  TeamOutlined,
  ScheduleOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  CarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { salesTeam, eventTypes } from '../data/mockData';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const eventTypeIcons = {
  call: <PhoneOutlined />,
  online_meeting: <VideoCameraOutlined />,
  visit: <CarOutlined />,
};

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentEvents, setRecentEvents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    storage.init();
    setStats(storage.getStats());
    setRecentEvents(storage.getEvents().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8));
    setCustomers(storage.getCustomers());
  }, []);

  const getEventTypeInfo = (key) => eventTypes.find((t) => t.key === key) || { label: '其他', color: '#8c8c8c' };
  const getCustomerName = (id) => {
    const c = customers.find((c) => c.id === id);
    return c ? c.shortName : '未知客户';
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 4 }}>
          工作台
        </Title>
        <Text type="secondary">CargoWare CRM 事项跟进系统 — 欢迎回来，张明</Text>
      </div>

      {/* Stats cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/customers')} style={{ borderRadius: 12 }}>
            <Statistic
              title="客户总数"
              value={stats.totalCustomers || 0}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 12 }}>
            <Statistic
              title="活跃客户"
              value={stats.activeCustomers || 0}
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/events')} style={{ borderRadius: 12 }}>
            <Statistic
              title="跟进记录"
              value={stats.totalEvents || 0}
              prefix={<ScheduleOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/kpi')} style={{ borderRadius: 12 }}>
            <Statistic
              title="本周跟进"
              value={stats.eventsThisWeek || 0}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Recent events */}
        <Col xs={24} lg={14}>
          <Card
            title="最近跟进记录"
            style={{ borderRadius: 12 }}
            bodyStyle={{ padding: '12px 24px' }}
            extra={
              <a onClick={() => navigate('/events')}>查看全部</a>
            }
          >
            <List
              dataSource={recentEvents}
              renderItem={(event) => {
                const typeInfo = getEventTypeInfo(event.type);
                return (
                  <List.Item
                    style={{ padding: '12px 0', cursor: 'pointer' }}
                    onClick={() => navigate(`/customers/${event.customerId}`)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ background: typeInfo.color }}
                          icon={eventTypeIcons[event.type] || <ScheduleOutlined />}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{event.title}</Text>
                          <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
                        </Space>
                      }
                      description={
                        <Space size={4}>
                          <Text type="secondary">{getCustomerName(event.customerId)}</Text>
                          <Text type="secondary">·</Text>
                          <Text type="secondary">
                            {dayjs(event.createdAt).format('MM-DD HH:mm')}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        {/* Team activity & customer overview */}
        <Col xs={24} lg={10}>
          <Card
            title="销售团队跟进概览"
            style={{ borderRadius: 12 }}
            bodyStyle={{ padding: '16px 24px' }}
          >
            {salesTeam.map((member) => {
              const memberEvents = storage
                .getEvents()
                .filter((e) => e.salesId === member.id);
              const count = memberEvents.length;
              const maxCount = Math.max(
                ...salesTeam.map(
                  (m) => storage.getEvents().filter((e) => e.salesId === m.id).length
                ),
                1
              );
              return (
                <div key={member.id} style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <Space>
                      <Avatar size={28} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                      <Text strong style={{ fontSize: 13 }}>
                        {member.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {member.region}
                      </Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {count} 次跟进
                    </Text>
                  </div>
                  <Progress
                    percent={Math.round((count / maxCount) * 100)}
                    showInfo={false}
                    strokeColor="#1890ff"
                    size="small"
                  />
                </div>
              );
            })}
          </Card>

          <Card
            title="客户等级分布"
            style={{ borderRadius: 12, marginTop: 16 }}
            bodyStyle={{ padding: '16px 24px' }}
          >
            <Row gutter={16}>
              {['A', 'B', 'C', 'D'].map((level) => {
                const count = customers.filter((c) => c.level === level).length;
                const colors = { A: '#52c41a', B: '#1890ff', C: '#faad14', D: '#ff4d4f' };
                return (
                  <Col span={6} key={level} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 600,
                        color: colors[level],
                        marginBottom: 4,
                      }}
                    >
                      {count}
                    </div>
                    <Tag color={colors[level]}>
                      {level}级客户
                    </Tag>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
