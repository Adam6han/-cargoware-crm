import React, { useEffect, useState } from 'react';
import {
  Card,
  List,
  Tag,
  Avatar,
  Space,
  Typography,
  Select,
  Row,
  Col,
  Statistic,
  Empty,
  Badge,
  Button,
} from 'antd';
import {
  PhoneOutlined,
  VideoCameraOutlined,
  CarOutlined,
  MailOutlined,
  DesktopOutlined,
  FileProtectOutlined,
  MoreOutlined,
  FilterOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { salesTeam, eventTypes, eventResults } from '../data/mockData';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const eventTypeIcons = {
  call: <PhoneOutlined />,
  online_meeting: <VideoCameraOutlined />,
  visit: <CarOutlined />,
  email: <MailOutlined />,
  demo: <DesktopOutlined />,
  negotiation: <FileProtectOutlined />,
  other: <MoreOutlined />,
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [typeFilter, setTypeFilter] = useState(null);
  const [resultFilter, setResultFilter] = useState(null);
  const [salesFilter, setSalesFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    storage.init();
    setEvents(storage.getEvents().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setCustomers(storage.getCustomers());
  }, []);

  const getEventTypeInfo = (key) => eventTypes.find((t) => t.key === key) || { label: '其他', color: '#8c8c8c' };
  const getResultInfo = (key) => eventResults.find((r) => r.key === key) || { label: '-', color: '#8c8c8c' };
  const getCustomerName = (id) => {
    const c = customers.find((c) => c.id === id);
    return c ? c.shortName : '未知';
  };
  const getSalesName = (id) => {
    const s = salesTeam.find((s) => s.id === id);
    return s ? s.name : '-';
  };

  const filteredEvents = events.filter((e) => {
    const matchType = !typeFilter || e.type === typeFilter;
    const matchResult = !resultFilter || e.result === resultFilter;
    const matchSales = !salesFilter || e.salesId === salesFilter;
    return matchType && matchResult && matchSales;
  });

  // Stats by type
  const typeStats = eventTypes.map((t) => ({
    ...t,
    count: events.filter((e) => e.type === t.key).length,
  }));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 4 }}>
          事项跟进
        </Title>
        <Text type="secondary">所有客户跟进记录汇总，支持按类型、结果、人员筛选</Text>
      </div>

      {/* Event type stats */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        {typeStats.map((t) => (
          <Col xs={12} sm={8} md={6} lg={3} key={t.key}>
            <Card
              hoverable
              style={{
                borderRadius: 10,
                cursor: 'pointer',
                border: typeFilter === t.key ? `2px solid ${t.color}` : undefined,
              }}
              bodyStyle={{ padding: '12px 16px' }}
              onClick={() => setTypeFilter(typeFilter === t.key ? null : t.key)}
            >
              <div style={{ textAlign: 'center' }}>
                <Avatar
                  size={32}
                  style={{ background: t.color, marginBottom: 6 }}
                  icon={eventTypeIcons[t.key]}
                />
                <div style={{ fontSize: 20, fontWeight: 600, color: t.color }}>{t.count}</div>
                <Text style={{ fontSize: 12 }}>{t.label}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} sm={8}>
            <Space>
              <FilterOutlined style={{ color: '#8c8c8c' }} />
              <Text type="secondary">筛选：</Text>
            </Space>
          </Col>
          <Col xs={24} sm={5}>
            <Select
              placeholder="跟进结果"
              value={resultFilter}
              onChange={setResultFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {eventResults.map((r) => (
                <Option key={r.key} value={r.key}>
                  <Tag color={r.color}>{r.label}</Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={5}>
            <Select
              placeholder="客户经理"
              value={salesFilter}
              onChange={setSalesFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {salesTeam.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={3} style={{ textAlign: 'right' }}>
            <Badge count={filteredEvents.length} style={{ background: '#1890ff' }}>
              <Tag style={{ padding: '4px 12px' }}>共 {events.length} 条记录</Tag>
            </Badge>
          </Col>
        </Row>
      </Card>

      {/* Events list */}
      <Card style={{ borderRadius: 12 }}>
        {filteredEvents.length === 0 ? (
          <Empty description="暂无匹配的跟进记录" />
        ) : (
          <List
            dataSource={filteredEvents}
            renderItem={(event) => {
              const typeInfo = getEventTypeInfo(event.type);
              const resultInfo = getResultInfo(event.result);

              return (
                <List.Item
                  style={{ padding: '16px 0', cursor: 'pointer' }}
                  onClick={() => navigate(`/customers/${event.customerId}`)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={40}
                        style={{ background: typeInfo.color }}
                        icon={eventTypeIcons[event.type]}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text strong style={{ fontSize: 14 }}>
                          {event.title}
                        </Text>
                        <Tag color={typeInfo.color} style={{ borderRadius: 4 }}>
                          {typeInfo.label}
                        </Tag>
                        <Tag color={resultInfo.color} style={{ borderRadius: 4 }}>
                          {resultInfo.label}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ fontSize: 13, color: '#595959', margin: '4px 0' }}
                        >
                          {event.description}
                        </Paragraph>
                        <Space size={16} wrap>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <UserOutlined style={{ marginRight: 4 }} />
                            {getCustomerName(event.customerId)}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <CalendarOutlined style={{ marginRight: 4 }} />
                            {dayjs(event.createdAt).format('YYYY-MM-DD HH:mm')}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {getSalesName(event.salesId)}
                          </Text>
                          {event.duration && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {event.duration}分钟
                            </Text>
                          )}
                        </Space>
                        {event.nextAction && (
                          <div style={{ marginTop: 6 }}>
                            <Tag color="blue" style={{ fontSize: 11 }}>
                              下一步: {event.nextAction}
                            </Tag>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
            pagination={{
              pageSize: 15,
              showTotal: (total) => `共 ${total} 条跟进记录`,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default EventsPage;
