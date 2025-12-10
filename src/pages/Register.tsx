// src/pages/Register.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Typography, Row, Col, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../stores/auth';
import { UserRole } from '../types/user';
import MainLayout from '../components/Layout/MainLayout.tsx';

const { Title, Text } = Typography;
const { Option } = Select;

// 表单验证规rules
const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email('请输入有效的邮箱地址')
    .required('邮箱不能为空'),
  password: yup
    .string()
    .min(6, '密码至少6个字符')
    .required('密码不能为空'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '两次输入的密码不一致')
    .required('请确认密码'),
  role: yup
    .mixed<UserRole>()
    .oneOf(Object.values(UserRole) as UserRole[], '请选择有效的角色')
    .required('请选择角色'),
  firstName: yup.string().default(''),
  lastName: yup.string().default(''),
  phone: yup
    .string()
    .matches(/^1[3-9]\d{9}$|^$/, '请输入有效的手机号码或留空')
    .default(''),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.VIEWER,
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // 移除确认密码字段
      const { confirmPassword, ...registerData } = data;
      
      await register(registerData);
      message.success('注册成功！');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.message || '注册失败');
    }
  };

  return (
    <MainLayout showHeader={false}>
      <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Col xs={22} sm={20} md={16} lg={12} xl={10}>
          <Card
            bordered={false}
            style={{
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={2} style={{ color: '#1890ff' }}>
                用户注册
              </Title>
              <Text type="secondary">创建您的账户</Text>
            </div>

            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="名"
                    validateStatus={errors.firstName ? 'error' : ''}
                    help={errors.firstName?.message}
                  >
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="large"
                          placeholder="名"
                          prefix={<UserOutlined />}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="姓"
                    validateStatus={errors.lastName ? 'error' : ''}
                    help={errors.lastName?.message}
                  >
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="large"
                          placeholder="姓"
                          prefix={<UserOutlined />}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

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
                      prefix={<MailOutlined />}
                      disabled={isLoading}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="手机号"
                validateStatus={errors.phone ? 'error' : ''}
                help={errors.phone?.message}
              >
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      placeholder="请输入手机号"
                      prefix={<PhoneOutlined />}
                      disabled={isLoading}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="角色"
                validateStatus={errors.role ? 'error' : ''}
                help={errors.role?.message}
              >
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      placeholder="请选择角色"
                      disabled={isLoading}
                    >
                      <Option value={UserRole.ADMIN}>管理员</Option>
                      <Option value={UserRole.DENTIST}>医生</Option>
                      <Option value={UserRole.TECHNICIAN}>技师</Option>
                      <Option value={UserRole.VIEWER}>查看者</Option>
                      <Option value={UserRole.CLINIC_ADMIN}>诊所管理员</Option>
                    </Select>
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

              <Form.Item
                label="确认密码"
                validateStatus={errors.confirmPassword ? 'error' : ''}
                help={errors.confirmPassword?.message}
              >
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      size="large"
                      placeholder="请再次输入密码"
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
                  注册
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">已经有账号？</Text>
                <Link to="/login" style={{ marginLeft: '8px' }}>
                  立即登录
                </Link>
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

export default Register;
