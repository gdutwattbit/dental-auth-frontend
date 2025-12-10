// src/pages/Login.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../stores/auth';
import MainLayout from '../components/Layout/MainLayout.tsx';

const { Title, Text } = Typography;

// 表单验证规则
const loginSchema = yup.object({
  email: yup
    .string()
    .email('请输入有效的邮箱地址')
    .required('邮箱不能为空'),
  password: yup
    .string()
    .min(6, '密码至少6个字符')
    .required('密码不能为空'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 如果已经登录，重定向到仪表盘
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      message.success('登录成功！');
      
      // 根据用户角色跳转到不同页面
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查邮箱和密码');
    }
  };

  // 演示账号快速填充
  const fillDemoAccount = (role: string) => {
    const accounts: Record<string, { email: string; password: string }> = {
      admin: { email: 'admin@clinic.com', password: 'admin123' },
      doctor: { email: 'doctor@clinic.com', password: 'doctor123' },
      technician: { email: 'tech@clinic.com', password: 'tech123' },
      viewer: { email: 'viewer@clinic.com', password: 'viewer123' },
    };
    
    const account = accounts[role];
    if (account) {
      // 这里需要更新表单值，实际实现可能需要修改
      console.log('填充账号:', account);
    }
  };

  return (
    <MainLayout showHeader={false}>
      <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Col xs={22} sm={18} md={12} lg={8} xl={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={2} style={{ color: '#1890ff' }}>
                牙科诊所管理系统
              </Title>
              <Text type="secondary">请登录您的账户</Text>
            </div>

            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
              <Form.Item
                label="邮箱"
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      placeholder="请输入邮箱"
                      prefix={<UserOutlined />}
                      disabled={isLoading}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="密码"
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
              >
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      size="large"
                      placeholder="请输入密码"
                      prefix={<LockOutlined />}
                      disabled={isLoading}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                  block
                >
                  登录
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Text type="secondary">还没有账号？</Text>
                <Link to="/register" style={{ marginLeft: '8px' }}>
                  立即注册
                </Link>
              </div>

              {/* 演示账号区域 */}
              <div style={{ marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                  演示账号（点击快速填充）:
                </Text>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button size="small" onClick={() => fillDemoAccount('admin')}>
                    管理员
                  </Button>
                  <Button size="small" onClick={() => fillDemoAccount('doctor')}>
                    医生
                  </Button>
                  <Button size="small" onClick={() => fillDemoAccount('technician')}>
                    技师
                  </Button>
                  <Button size="small" onClick={() => fillDemoAccount('viewer')}>
                    查看者
                  </Button>
                </div>
              </div>
            </Form>
          </Card>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text type="secondary">
              © {new Date().getFullYear()} 牙科诊所管理系统
            </Text>
          </div>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Login;
