
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, bgColor, iconColor }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center space-x-4">
      <div className={`p-3 rounded-full ${bgColor} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
