// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { routes } from './routes.tsx';
import { useAuthStore } from './stores/auth';

const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    console.log('🚀 App 初始化，开始检查认证状态...');
    // 初始化时检查认证状态
    checkAuth().catch(err => {
      console.error('❌ checkAuth 失败:', err);
    });

    // 配置全局消息
    message.config({
      maxCount: 3,
      duration: 3,
    });
  }, [checkAuth]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AntdApp>
        <Router>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
