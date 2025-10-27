import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Research', value: 45 },
  { name: 'Design', value: 35 },
  { name: 'Animation', value: 20 },
];

const COLORS = ['#5E56E1', '#E5B873', '#4AD09F'];

const LegendItem = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
        <span className="text-sm text-gray-600">{label}</span>
    </div>
);


const InterestChart: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Your Interest</h3>
      <div className="flex-grow flex flex-col items-center justify-center relative">
        <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                cornerRadius={10}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-2xl font-bold text-gray-800">54h</span>
        </div>
      </div>
      <div className="flex justify-center space-x-6 mt-4">
        <LegendItem color={COLORS[0]} label="Research" />
        <LegendItem color={COLORS[1]} label="Design" />
        <LegendItem color={COLORS[2]} label="Animation" />
      </div>
    </div>
  );
};

export default InterestChart;
