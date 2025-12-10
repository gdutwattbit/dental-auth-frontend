import React from 'react';

const DoctorDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">医生工作台</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">今日预约</h2>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">待处理任务</h2>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">患者总数</h2>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">完成率</h2>
          <p className="text-3xl font-bold text-purple-600">0%</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
