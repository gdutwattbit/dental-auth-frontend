// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Avatar,
  Typography,
  List,
  Tag,
  Space,
  Dropdown,
  message,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../stores/auth';
import { UserRole } from '../types/user';
import MainLayout from '../components/Layout/MainLayout.tsx';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuthStore();
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    tasks: 0,
    messages: 0,
  });

  useEffect(() => {
    // 模拟获取统计数据
    setTimeout(() => {
      setStats({
        patients: Math.floor(Math.random() * 100),
        appointments: Math.floor(Math.random() * 50),
        tasks: Math.floor(Math.random() * 20),
        messages: Math.floor(Math.random() * 10),
      });
    }, 500);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      message.success('已退出登录');
      navigate('/login');
    } catch (error) {
      message.error('退出登录失败');
    }
  };

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
      onClick: handleLogout,
    },
  ];

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'red';
      case UserRole.DENTIST:
        return 'blue';
      case UserRole.TECHNICIAN:
        return 'green';
      case UserRole.VIEWER:
        return 'orange';
      case UserRole.CLINIC_ADMIN:
        return 'purple';
      default:
        return 'default';
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const recentActivities = [
    { id: 1, action: '新建病例', patient: '张先生', time: '10分钟前' },
    { id: 2, action: '完成治疗', patient: '李女士', time: '1小时前' },
    { id: 3, action: '预约确认', patient: '王先生', time: '2小时前' },
    { id: 4, action: '报告生成', patient: '赵女士', time: '3小时前' },
  ];

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        {/* 头部欢迎信息 */}
        <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <Title level={2}>
              {getWelcomeMessage()}，{user?.firstName || '用户'}！
            </Title>
            <Text type="secondary">
              今天是 {new Date().toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ marginRight: '8px' }}
                  />
                  <span>{user?.firstName} {user?.lastName}</span>
                </Button>
              </Dropdown>
              <Tag color={getRoleColor(user?.role as UserRole)}>
                {user?.role === 'ADMIN' && '管理员'}
                {user?.role === 'DENTIST' && '医生'}
                {user?.role === 'TECHNICIAN' && '技师'}
                {user?.role === 'VIEWER' && '查看者'}
                {user?.role === 'CLINIC_ADMIN' && '诊所管理员'}
              </Tag>
            </Space>
          </Col>
        </Row>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="患者总数"
                value={stats.patients}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="今日预约"
                value={stats.appointments}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="待办任务"
                value={stats.tasks}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="未读消息"
                value={stats.messages}
                prefix={<BellOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* 最近活动 */}
          <Col xs={24} md={16}>
            <Card title="最近活动" style={{ height: '100%' }}>
              <List
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={item.action}
                      description={`患者：${item.patient}`}
                    />
                    <Text type="secondary">{item.time}</Text>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 快捷操作 */}
          <Col xs={24} md={8}>
            <Card title="快捷操作">
              <Space direction="vertical" style={{ width: '100%' }}>
                {hasRole(UserRole.DENTIST) && (
                  <>
                    <Button block onClick={() => navigate('/doctor/patients')}>
                      患者管理
                    </Button>
                    <Button block onClick={() => navigate('/doctor/appointments')}>
                      预约管理
                    </Button>
                    <Button block onClick={() => navigate('/doctor/cases')}>
                      病例管理
                    </Button>
                  </>
                )}
                {hasRole(UserRole.TECHNICIAN) && (
                  <>
                    <Button block onClick={() => navigate('/technician/tasks')}>
                      任务列表
                    </Button>
                    <Button block onClick={() => navigate('/technician/reports')}>
                      报告管理
                    </Button>
                  </>
                )}
                {hasRole(UserRole.ADMIN) && (
                  <>
                    <Button block onClick={() => navigate('/admin/users')}>
                      用户管理
                    </Button>
                    <Button block onClick={() => navigate('/admin/settings')}>
                      系统设置
                    </Button>
                  </>
                )}
                <Button block type="primary" onClick={() => navigate('/help')}>
                  帮助中心
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
