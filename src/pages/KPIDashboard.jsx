import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Table,
  Tag,
  Avatar,
  Space,
  Progress,
  Select,
  Divider,
} from 'antd';
import {
  UserOutlined,
  TrophyOutlined,
  FireOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  CarOutlined,
  RiseOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { storage } from '../utils/storage';
import { salesTeam, eventTypes, eventResults } from '../data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;

const KPIDashboard = () => {
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    storage.init();
    setEvents(storage.getEvents());
    setCustomers(storage.getCustomers());
  }, []);

  const getFilteredEvents = () => {
    if (period === 'all') return events;
    const now = new Date();
    const cutoff = new Date();
    if (period === 'week') cutoff.setDate(now.getDate() - 7);
    if (period === 'month') cutoff.setMonth(now.getMonth() - 1);
    if (period === 'quarter') cutoff.setMonth(now.getMonth() - 3);
    return events.filter((e) => new Date(e.createdAt) >= cutoff);
  };

  const filteredEvents = getFilteredEvents();

  // Compute KPIs per sales person
  const salesKPIs = salesTeam.map((member) => {
    const memberEvents = filteredEvents.filter((e) => e.salesId === member.id);
    const positiveEvents = memberEvents.filter((e) => e.result === 'positive');
    const riskEvents = memberEvents.filter((e) => e.result === 'risk');
    const totalDuration = memberEvents.reduce((sum, e) => sum + (e.duration || 0), 0);
    const customerIds = [...new Set(memberEvents.map((e) => e.customerId))];
    const visitCount = memberEvents.filter((e) => e.type === 'visit').length;
    const callCount = memberEvents.filter((e) => e.type === 'call').length;
    const meetingCount = memberEvents.filter((e) => e.type === 'online_meeting').length;

    // KPI score (0-100)
    const eventScore = Math.min(memberEvents.length * 8, 40);
    const positiveScore = memberEvents.length > 0 ? (positiveEvents.length / memberEvents.length) * 30 : 0;
    const customerScore = Math.min(customerIds.length * 5, 15);
    const durationScore = Math.min(totalDuration / 30, 15);
    const totalScore = Math.round(eventScore + positiveScore + customerScore + durationScore);

    return {
      ...member,
      eventCount: memberEvents.length,
      positiveCount: positiveEvents.length,
      riskCount: riskEvents.length,
      positiveRate: memberEvents.length > 0 ? Math.round((positiveEvents.length / memberEvents.length) * 100) : 0,
      totalDuration,
      customerCount: customerIds.length,
      visitCount,
      callCount,
      meetingCount,
      avgDuration: memberEvents.length > 0 ? Math.round(totalDuration / memberEvents.length) : 0,
      score: totalScore,
    };
  });

  // Sort by score
  salesKPIs.sort((a, b) => b.score - a.score);

  // Overall stats
  const totalEvents = filteredEvents.length;
  const avgScore = salesKPIs.length > 0 ? Math.round(salesKPIs.reduce((sum, s) => sum + s.score, 0) / salesKPIs.length) : 0;
  const totalPositive = filteredEvents.filter((e) => e.result === 'positive').length;
  const positiveRate = totalEvents > 0 ? Math.round((totalPositive / totalEvents) * 100) : 0;

  // Event type distribution
  const typeDistribution = eventTypes.map((t) => ({
    ...t,
    count: filteredEvents.filter((e) => e.type === t.key).length,
    percent: totalEvents > 0 ? Math.round((filteredEvents.filter((e) => e.type === t.key).length / totalEvents) * 100) : 0,
  }));

  const columns = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, idx) => {
        const colors = ['#faad14', '#8c8c8c', '#ad6800'];
        return idx < 3 ? (
          <Tag color={colors[idx]} style={{ fontWeight: 700, fontSize: 14 }}>
            {idx + 1}
          </Tag>
        ) : (
          <Text type="secondary">{idx + 1}</Text>
        );
      },
    },
    {
      title: '销售人员',
      key: 'name',
      render: (_, record) => (
        <Space>
          <Avatar size={32} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.role} · {record.region}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'KPI 得分',
      dataIndex: 'score',
      key: 'score',
      width: 140,
      sorter: (a, b) => a.score - b.score,
      render: (score) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress
            type="circle"
            percent={score}
            size={44}
            strokeColor={score >= 70 ? '#52c41a' : score >= 50 ? '#faad14' : '#ff4d4f'}
            format={(p) => <Text strong style={{ fontSize: 13 }}>{p}</Text>}
          />
          <Text
            style={{
              color: score >= 70 ? '#52c41a' : score >= 50 ? '#faad14' : '#ff4d4f',
              fontWeight: 600,
            }}
          >
            {score >= 70 ? '优秀' : score >= 50 ? '良好' : '待提升'}
          </Text>
        </div>
      ),
    },
    {
      title: '跟进次数',
      dataIndex: 'eventCount',
      key: 'eventCount',
      width: 90,
      sorter: (a, b) => a.eventCount - b.eventCount,
      render: (count) => (
        <Space>
          <Text strong>{count}</Text>
          <Text type="secondary">次</Text>
        </Space>
      ),
    },
    {
      title: '正面率',
      dataIndex: 'positiveRate',
      key: 'positiveRate',
      width: 100,
      sorter: (a, b) => a.positiveRate - b.positiveRate,
      render: (rate) => (
        <Space>
          <Progress
            percent={rate}
            size="small"
            strokeColor={rate >= 60 ? '#52c41a' : rate >= 40 ? '#faad14' : '#ff4d4f'}
            style={{ width: 60 }}
          />
          <Text style={{ fontSize: 12 }}>{rate}%</Text>
        </Space>
      ),
    },
    {
      title: '覆盖客户',
      dataIndex: 'customerCount',
      key: 'customerCount',
      width: 90,
      render: (count) => (
        <Space>
          <Text>{count}</Text>
          <Text type="secondary">个</Text>
        </Space>
      ),
    },
    {
      title: '跟进明细',
      key: 'breakdown',
      width: 200,
      render: (_, record) => (
        <Space size={4}>
          <Tag icon={<PhoneOutlined />} color="blue">
            电话 {record.callCount}
          </Tag>
          <Tag icon={<VideoCameraOutlined />} color="purple">
            会议 {record.meetingCount}
          </Tag>
          <Tag icon={<CarOutlined />} color="orange">
            拜访 {record.visitCount}
          </Tag>
        </Space>
      ),
    },
    {
      title: '总时长',
      dataIndex: 'totalDuration',
      key: 'totalDuration',
      width: 100,
      sorter: (a, b) => a.totalDuration - b.totalDuration,
      render: (min) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
          <Text>{min >= 60 ? `${Math.floor(min / 60)}h${min % 60}m` : `${min}m`}</Text>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            KPI 看板
          </Title>
          <Text type="secondary">
            基于事项跟进记录自动生成的销售人员绩效指标 — 产品规划预览
          </Text>
        </div>
        <Select value={period} onChange={setPeriod} style={{ width: 130 }}>
          <Option value="week">最近一周</Option>
          <Option value="month">最近一月</Option>
          <Option value="quarter">最近一季</Option>
          <Option value="all">全部时间</Option>
        </Select>
      </div>

      {/* Overall KPI cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #e6f7ff, #bae7ff)' }}>
            <Statistic
              title="总跟进次数"
              value={totalEvents}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="次"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #f6ffed, #d9f7be)' }}>
            <Statistic
              title="平均正面率"
              value={positiveRate}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #fff7e6, #ffe7ba)' }}>
            <Statistic
              title="团队均分"
              value={avgScore}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="/100"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #f9f0ff, #efdbff)' }}>
            <Statistic
              title="活跃客户"
              value={[...new Set(filteredEvents.map((e) => e.customerId))].length}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>

      {/* Sales ranking table */}
      <Card
        title={
          <Space>
            <TrophyOutlined style={{ color: '#faad14' }} />
            <span>销售人员绩效排名</span>
          </Space>
        }
        style={{ borderRadius: 12, marginTop: 16 }}
      >
        <Table
          columns={columns}
          dataSource={salesKPIs}
          rowKey="id"
          pagination={false}
          size="middle"
          scroll={{ x: 800 }}
        />
      </Card>

      {/* KPI scoring explanation */}
      <Card
        title="KPI 评分规则说明"
        style={{ borderRadius: 12, marginTop: 16 }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={6}>
            <div style={{ padding: 16, background: '#f0f5ff', borderRadius: 8 }}>
              <Text strong style={{ color: '#1890ff', fontSize: 14 }}>
                跟进频次 (40分)
              </Text>
              <br />
              <Text style={{ fontSize: 13 }}>
                每次跟进 +8 分，上限 40 分。鼓励持续跟进，保持客户活跃度。
              </Text>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div style={{ padding: 16, background: '#f6ffed', borderRadius: 8 }}>
              <Text strong style={{ color: '#52c41a', fontSize: 14 }}>
                正面率 (30分)
              </Text>
              <br />
              <Text style={{ fontSize: 13 }}>
                跟进结果为"进展顺利"的占比 × 30。衡量跟进质量。
              </Text>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div style={{ padding: 16, background: '#fff7e6', borderRadius: 8 }}>
              <Text strong style={{ color: '#fa8c16', fontSize: 14 }}>
                客户覆盖 (15分)
              </Text>
              <br />
              <Text style={{ fontSize: 13 }}>
                每覆盖一个客户 +5 分，上限 15 分。鼓励广泛维护客户关系。
              </Text>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div style={{ padding: 16, background: '#f9f0ff', borderRadius: 8 }}>
              <Text strong style={{ color: '#722ed1', fontSize: 14 }}>
                投入时长 (15分)
              </Text>
              <br />
              <Text style={{ fontSize: 13 }}>
                累计跟进时长 / 30，上限 15 分。衡量时间投入的深度。
              </Text>
            </div>
          </Col>
        </Row>
        <Divider />
        <Text type="secondary" style={{ fontSize: 12 }}>
          * 此为 CargoWare CRM 产品规划中的 KPI 模块预览。
          评分规则可根据实际业务需求灵活配置，支持按时间周期、客户等级、事项类型等维度进行多维度绩效分析。
          未来将接入更丰富的数据可视化图表和趋势分析功能。
        </Text>
      </Card>
    </div>
  );
};

export default KPIDashboard;
