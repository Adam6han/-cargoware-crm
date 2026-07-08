import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Input,
  Tag,
  Select,
  Button,
  Space,
  Typography,
  Avatar,
  Dropdown,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  MoreOutlined,
  TeamOutlined,
  CrownOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { salesTeam } from '../data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [salesFilter, setSalesFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    storage.init();
    setCustomers(storage.getCustomers());
    setEvents(storage.getEvents());
  }, []);

  const getSalesName = (id) => {
    const s = salesTeam.find((s) => s.id === id);
    return s ? s.name : '-';
  };

  const getEventCount = (customerId) => events.filter((e) => e.customerId === customerId).length;

  const levelColors = { A: '#52c41a', B: '#1890ff', C: '#faad14', D: '#ff4d4f' };
  const statusMap = {
    active: { text: '活跃', color: '#52c41a' },
    inactive: { text: '沉默', color: '#8c8c8c' },
  };

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      !search ||
      c.name.includes(search) ||
      c.shortName.includes(search) ||
      c.contactPerson.includes(search);
    const matchLevel = !levelFilter || c.level === levelFilter;
    const matchStatus = !statusFilter || c.status === statusFilter;
    const matchSales = !salesFilter || c.salesOwner === salesFilter;
    return matchSearch && matchLevel && matchStatus && matchSales;
  });

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/customers/${record.id}`)}>
          <Space>
            <Avatar
              size={36}
              shape="square"
              style={{
                background: levelColors[record.level],
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              {record.shortName.slice(0, 1)}
            </Avatar>
            <div>
              <Text strong style={{ fontSize: 14, display: 'block' }}>
                {record.shortName}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.name}
              </Text>
            </div>
          </Space>
        </div>
      ),
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level) => (
        <Tag color={levelColors[level]} style={{ fontWeight: 600 }}>
          {level}级
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 110,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) =>
        tags?.map((tag) => (
          <Tag key={tag} style={{ marginBottom: 2 }}>
            {tag}
          </Tag>
        )),
    },
    {
      title: '客户经理',
      dataIndex: 'salesOwner',
      key: 'salesOwner',
      width: 100,
      render: (id) => (
        <Space>
          <Avatar size={22} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
          <Text style={{ fontSize: 13 }}>{getSalesName(id)}</Text>
        </Space>
      ),
    },
    {
      title: '跟进次数',
      key: 'events',
      width: 100,
      sorter: (a, b) => getEventCount(a.id) - getEventCount(b.id),
      render: (_, record) => {
        const count = getEventCount(record.id);
        return (
          <Space>
            <Text strong style={{ color: count > 3 ? '#52c41a' : count > 0 ? '#1890ff' : '#8c8c8c' }}>
              {count}
            </Text>
            <Text type="secondary">次</Text>
          </Space>
        );
      },
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => navigate(`/customers/${record.id}`)}
        >
          详情 →
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 4 }}>
          客户管理
        </Title>
        <Text type="secondary">管理客户信息，查看跟进记录，维护客户关系</Text>
      </div>

      {/* Summary stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 10, background: '#f0f5ff' }}>
            <Statistic
              title="全部客户"
              value={customers.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 10, background: '#f6ffed' }}>
            <Statistic
              title="A级客户"
              value={customers.filter((c) => c.level === 'A').length}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 10, background: '#fff7e6' }}>
            <Statistic
              title="活跃客户"
              value={customers.filter((c) => c.status === 'active').length}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 10, background: '#f9f0ff' }}>
            <Statistic
              title="累计跟进"
              value={events.length}
              prefix={<PhoneOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="搜索客户名称、联系人..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="客户等级"
              value={levelFilter}
              onChange={setLevelFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="A">A级</Option>
              <Option value="B">B级</Option>
              <Option value="C">C级</Option>
              <Option value="D">D级</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="客户状态"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="active">活跃</Option>
              <Option value="inactive">沉默</Option>
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
                  {s.name} - {s.region}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={3} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />}>
              新增客户
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Customer table */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个客户`,
          }}
          size="middle"
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
};

export default CustomerList;
