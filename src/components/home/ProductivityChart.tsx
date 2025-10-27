import React from 'react';
import { ClockIconSmall } from './icons/Icons';

const productivityData = [
    { name: 'Design', start: 1, span: 4, color: 'bg-[#E5B873]' },
    { name: 'Animation', start: 3, span: 4, color: 'bg-[#4AD09F]' },
    { name: 'Research', start: 2, span: 4, color: 'bg-[#5E56E1]' },
];

// FIX: Explicitly typing LegendItem as a React.FC with its props interface resolves the type error, as it allows TypeScript to correctly handle React-specific props like `key` during JSX transformation.
interface LegendItemProps {
    color: string;
    label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
    <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-sm text-gray-600">{label}</span>
    </div>
);

const ProductivityChart: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Productivity</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
                <ClockIconSmall />
                <span>6 hours 24 min</span>
            </div>
        </div>
        
        <div className="flex-grow flex flex-col">
            {/* Day headers */}
            <div className="grid grid-cols-7 text-center text-xs text-gray-400 font-medium">
                {days.map(day => <div key={day}>{day}</div>)}
            </div>

            {/* Chart Area */}
            <div className="relative flex-grow mt-3">
                {/* Vertical Lines */}
                <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
                    {days.map((_, i) => (
                        <div key={`line-${i}`} className={`h-full ${i < days.length -1 ? 'border-r border-gray-200' : ''}`}></div>
                    ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 grid grid-cols-7 grid-rows-3 gap-y-4 py-2">
                    {productivityData.map((item, index) => (
                        <div
                            key={item.name}
                            className={`${item.color} h-5 rounded-lg mx-0.5`}
                            style={{
                                gridColumn: `${item.start} / span ${item.span}`,
                                gridRow: `${index + 1}`
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex justify-center space-x-6 mt-4 pt-2">
            {productivityData.map(item => (
                <LegendItem key={item.name} color={item.color} label={item.name} />
            ))}
      </div>
    </div>
  );
};

export default ProductivityChart;