import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const originalData = [
  { name: 'M', planning: 3 },
  { name: 'T', research: 4.2 },
  { name: 'W', planning: 3, research: 3 },
  { name: 'T', research: 3.2 },
  { name: 'F', design: 3 },
  { name: 'S', planning: 4.2 },
  { name: 'S', design: 0 },
];

const TaskProgressChart: React.FC = () => {
  // Process data to handle stacked bar radius correctly and merge purple bars
  const data = originalData
    .filter(d => d.planning || d.research || d.design) // Filter out empty entries
    .map(item => {
      const purpleValue = item.planning || item.design || 0;
      const yellowValue = item.research || 0;

      return {
        name: item.name,
        // Value for the purple bar when it's at the bottom of a stack (no top radius)
        purpleBottom: yellowValue > 0 ? purpleValue : 0,
        // Value for the purple bar when it's standalone (has top radius)
        purpleTop: yellowValue === 0 ? purpleValue : 0,
        // Value for the yellow bar, which is always on top or standalone
        yellowTop: yellowValue,
      };
    });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks Progress</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barGap={10} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
            <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} contentStyle={{background: '#fff', border: '1px solid #ddd', borderRadius: '8px'}} />
            
            {/* Bar for the bottom part of a purple stack (sharp corners) */}
            <Bar dataKey="purpleBottom" stackId="a" fill="#818CF8" />

            {/* Bar for standalone purple bars (rounded corners) */}
            <Bar dataKey="purpleTop" stackId="a" fill="#818CF8" radius={[8, 8, 0, 0]} />
            
            {/* Bar for yellow bars, always on top or standalone (rounded corners) */}
            <Bar dataKey="yellowTop" stackId="a" fill="#ca8a04" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
       <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-sm text-gray-500">Time spent</p>
                <div className="flex items-center justify-center gap-2">
                    <p className="font-bold">18h</p>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">120%</span>
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500">Lesson Learnt</p>
                 <div className="flex items-center justify-center gap-2">
                    <p className="font-bold">15h</p>
                    <span className="text-xs font-semibold bg-cyan-100 text-cyan-600 px-2 py-0.5 rounded-full">120%</span>
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500">Exams Passed</p>
                <div className="flex items-center justify-center gap-2">
                    <p className="font-bold">2h</p>
                    <span className="text-xs font-semibold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">100%</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TaskProgressChart;