import React, { useEffect, useState } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Timeline,
  Avatar,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Radio,
  message,
  Divider,
  Empty,
  Badge,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  PhoneOutlined,
  VideoCameraOutlined,
  CarOutlined,
  MailOutlined,
  DesktopOutlined,
  FileProtectOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { salesTeam, eventTypes, eventResults } from '../data/mockData';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
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

const levelColors = { A: '#52c41a', B: '#1890ff', C: '#faad14', D: '#ff4d4f' };

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    storage.init();
    loadData();
  }, [id]);

  const loadData = () => {
    const c = storage.getCustomerById(id);
    setCustomer(c);
    if (c) {
      setEvents(storage.getEventsByCustomerId(id));
    }
  };

  const getSalesInfo = (salesId) => salesTeam.find((s) => s.id === salesId);
  const getEventTypeInfo = (key) => eventTypes.find((t) => t.key === key) || { label: '其他', color: '#8c8c8c' };
  const getResultInfo = (key) => eventResults.find((r) => r.key === key) || { label: '-', color: '#8c8c8c' };

  const filteredEvents = typeFilter ? events.filter((e) => e.type === typeFilter) : events;

  const handleAddEvent = () => {
    setEditingEvent(null);
    form.resetFields();
    form.setFieldsValue({
      type: 'call',
      result: 'neutral',
      duration: 30,
    });
    setModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    form.setFieldsValue({
      ...event,
      eventDate: dayjs(event.createdAt),
      nextActionDate: event.nextActionDate ? dayjs(event.nextActionDate) : null,
    });
    setModalOpen(true);
  };

  const handleSaveEvent = async () => {
    try {
      const values = await form.validateFields();
      const salesInfo = salesTeam[0]; // Current user is 张明 (S001)
      const event = {
        id: editingEvent?.id || `E${Date.now()}`,
        customerId: id,
        type: values.type,
        title: values.title,
        description: values.description,
        result: values.result,
        salesId: 'S001',
        createdAt: values.eventDate?.toISOString() || new Date().toISOString(),
        duration: values.duration,
        nextAction: values.nextAction || null,
        nextActionDate: values.nextActionDate?.format('YYYY-MM-DD') || null,
      };
      storage.saveEvent(event);
      loadData();
      setModalOpen(false);
      messageApi.success(editingEvent ? '跟进记录已更新' : '跟进记录已添加');
    } catch (err) {
      console.error(err);
    }
  };

  if (!customer) {
    return (
      <Card>
        <Empty description="客户信息不存在" />
      </Card>
    );
  }

  const salesInfo = getSalesInfo(customer.salesOwner);

  return (
    <div>
      {contextHolder}

      {/* Back button & header */}
      <div style={{ marginBottom: 20 }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/customers')}
          style={{ padding: 0, marginBottom: 12 }}
        >
          返回客户列表
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Avatar
              size={56}
              shape="square"
              style={{
                background: levelColors[customer.level],
                borderRadius: 12,
                fontSize: 22,
              }}
            >
              {customer.shortName.slice(0, 1)}
            </Avatar>
            <div>
              <Space align="center">
                <Title level={4} style={{ margin: 0 }}>
                  {customer.shortName}
                </Title>
                <Tag color={levelColors[customer.level]}>{customer.level}级客户</Tag>
                <Tag color={customer.status === 'active' ? '#52c41a' : '#8c8c8c'}>
                  {customer.status === 'active' ? '活跃' : '沉默'}
                </Tag>
              </Space>
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {customer.name}
                </Text>
              </div>
            </div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEvent} size="large">
            添加跟进记录
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left: Customer info */}
        <Col xs={24} lg={8}>
          <Card title="客户信息" style={{ borderRadius: 12 }} size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="联系人">
                <Space>
                  <UserOutlined />
                  <Text>{customer.contactPerson}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="电话">
                <Space>
                  <PhoneOutlined />
                  <Text>{customer.contactPhone}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                <Space>
                  <MailOutlined />
                  <Text>{customer.contactEmail}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="地址">
                <Space>
                  <EnvironmentOutlined />
                  <Text>{customer.address}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="行业">
                <Text>{customer.industry}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="合作起始">
                <Space>
                  <CalendarOutlined />
                  <Text>{customer.cooperationSince}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="客户经理">
                <Space>
                  <Avatar size={20} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                  <Text>{salesInfo?.name} · {salesInfo?.role}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="标签">
                <Space wrap>
                  {customer.tags?.map((tag) => (
                    <Tag key={tag} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>
            <Divider style={{ margin: '12px 0' }} />
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                备注
              </Text>
              <Paragraph style={{ fontSize: 13, marginTop: 4 }}>{customer.notes}</Paragraph>
            </div>
          </Card>

          {/* Stats */}
          <Card style={{ borderRadius: 12, marginTop: 16 }} size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="总订单"
                  value={customer.totalOrders}
                  valueStyle={{ fontSize: 20 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="跟进次数"
                  value={events.length}
                  valueStyle={{ fontSize: 20, color: '#1890ff' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="年收入"
                  value={customer.annualRevenue}
                  valueStyle={{ fontSize: 20 }}
                  prefix="¥"
                  formatter={(val) => `${(val / 10000).toFixed(0)}万`}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right: Event timeline */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <span>事项跟进记录</span>
                <Badge count={filteredEvents.length} style={{ background: '#1890ff' }} />
              </Space>
            }
            style={{ borderRadius: 12 }}
            extra={
              <Select
                placeholder="按类型筛选"
                value={typeFilter}
                onChange={setTypeFilter}
                allowClear
                style={{ width: 150 }}
              >
                {eventTypes.map((t) => (
                  <Option key={t.key} value={t.key}>
                    {t.label}
                  </Option>
                ))}
              </Select>
            }
          >
            {filteredEvents.length === 0 ? (
              <Empty description="暂无跟进记录，点击上方按钮添加" />
            ) : (
              <Timeline
                items={filteredEvents.map((event) => {
                  const typeInfo = getEventTypeInfo(event.type);
                  const resultInfo = getResultInfo(event.result);
                  const sales = getSalesInfo(event.salesId);

                  return {
                    key: event.id,
                    color: typeInfo.color,
                    dot: (
                      <Avatar
                        size={32}
                        style={{ background: typeInfo.color }}
                        icon={eventTypeIcons[event.type]}
                      />
                    ),
                    children: (
                      <div
                        style={{
                          background: '#fafafa',
                          borderRadius: 10,
                          padding: '16px 20px',
                          border: '1px solid #f0f0f0',
                          marginBottom: 4,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div>
                            <Space align="center" style={{ marginBottom: 6 }}>
                              <Text strong style={{ fontSize: 15 }}>
                                {event.title}
                              </Text>
                              <Tag color={typeInfo.color} style={{ borderRadius: 4 }}>
                                {typeInfo.label}
                              </Tag>
                              <Tag
                                color={resultInfo.color}
                                style={{ borderRadius: 4 }}
                              >
                                {resultInfo.label}
                              </Tag>
                            </Space>
                          </div>
                          <Tooltip title="编辑">
                            <Button
                              type="text"
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => handleEditEvent(event)}
                            />
                          </Tooltip>
                        </div>

                        <Paragraph
                          style={{
                            fontSize: 13,
                            color: '#595959',
                            marginBottom: 10,
                            lineHeight: 1.8,
                          }}
                        >
                          {event.description}
                        </Paragraph>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Space size={16} wrap>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              <ClockCircleOutlined style={{ marginRight: 4 }} />
                              {dayjs(event.createdAt).format('YYYY-MM-DD HH:mm')}
                            </Text>
                            {event.duration && (
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                时长 {event.duration} 分钟
                              </Text>
                            )}
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              <UserOutlined style={{ marginRight: 4 }} />
                              {sales?.name}
                            </Text>
                          </Space>
                        </div>

                        {event.nextAction && (
                          <div
                            style={{
                              marginTop: 10,
                              padding: '8px 12px',
                              background: '#e6f7ff',
                              borderRadius: 6,
                              borderLeft: '3px solid #1890ff',
                            }}
                          >
                            <Text style={{ fontSize: 12, color: '#1890ff' }}>
                              <CalendarOutlined style={{ marginRight: 4 }} />
                              下一步：{event.nextAction}
                              {event.nextActionDate && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {' '}
                                  ({event.nextActionDate})
                                </Text>
                              )}
                            </Text>
                          </div>
                        )}
                      </div>
                    ),
                  };
                })}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Event Modal */}
      <Modal
        title={editingEvent ? '编辑跟进记录' : '添加跟进记录'}
        open={modalOpen}
        onOk={handleSaveEvent}
        onCancel={() => setModalOpen(false)}
        width={640}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="事项类型"
                rules={[{ required: true, message: '请选择事项类型' }]}
              >
                <Select>
                  {eventTypes.map((t) => (
                    <Option key={t.key} value={t.key}>
                      <Space>
                        {eventTypeIcons[t.key]}
                        <span>{t.label}</span>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="result"
                label="跟进结果"
                rules={[{ required: true, message: '请选择跟进结果' }]}
              >
                <Select>
                  {eventResults.map((r) => (
                    <Option key={r.key} value={r.key}>
                      <Tag color={r.color}>{r.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="事项标题"
            rules={[{ required: true, message: '请输入事项标题' }]}
          >
            <Input placeholder="简要描述本次跟进内容" />
          </Form.Item>

          <Form.Item
            name="description"
            label="详细描述"
            rules={[{ required: true, message: '请输入详细描述' }]}
          >
            <TextArea rows={4} placeholder="记录沟通要点、客户反馈、达成的共识等" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="eventDate" label="跟进时间">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="duration" label="时长(分钟)">
                <Input type="number" placeholder="30" />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '8px 0' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              下一步行动（选填）
            </Text>
          </Divider>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="nextAction" label="下一步动作">
                <Input placeholder="描述需要跟进的下一步动作" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="nextActionDate" label="截止日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerDetail;
