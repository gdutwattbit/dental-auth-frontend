import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth';

const Debug: React.FC = () => {
  const auth = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 调试信息</h1>
      <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
{`
认证状态:
- isAuthenticated: ${auth.isAuthenticated}
- isLoading: ${auth.isLoading}
- user: ${JSON.stringify(auth.user, null, 2)}
- accessToken: ${auth.accessToken ? '✓ 存在' : '✗ 不存在'}
- refreshToken: ${auth.refreshToken ? '✓ 存在' : '✗ 不存在'}

localStorage 内容:
- accessToken: ${localStorage.getItem('accessToken') ? '✓ 存在' : '✗ 不存在'}
- refreshToken: ${localStorage.getItem('refreshToken') ? '✓ 存在' : '✗ 不存在'}
- user: ${localStorage.getItem('user') ? '✓ 存在' : '✗ 不存在'}

页面加载状态: ${loading ? '加载中...' : '完成'}
`}
      </pre>
      
      <button onClick={() => {
        auth.checkAuth().then(() => {
          console.log('checkAuth() 完成');
          setLoading(false);
        });
      }} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        手动检查认证状态
      </button>
    </div>
  );
};

export default Debug;
