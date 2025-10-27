import React from 'react';
import StatCard from './StatCard';
import TasksProgressChart from './TasksProgressChart';
import InterestChart from './InterestChart';
import ProductivityChart from './ProductivityChart';
import Schedule from './Schedule';
import Assignments from './Assignments';
import { ClockIcon, RibbonIcon, ChartIcon } from './icons/Icons';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      {/* Left Column */}
      <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            <StatCard icon={<ClockIcon />} title="Hours Spent" value="54 hours" bgColor="bg-violet-100" iconColor="text-violet-600" />
            <StatCard icon={<RibbonIcon />} title="Courses" value="02" bgColor="bg-yellow-100" iconColor="text-yellow-600" />
            <StatCard icon={<ChartIcon />} title="Test Results" value="82%" bgColor="bg-orange-100" iconColor="text-orange-600" />
        </div>
        
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <TasksProgressChart />
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <InterestChart />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <ProductivityChart />
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6 lg:space-y-8">
        <Schedule />
        <Assignments />
      </div>
    </div>
  );
};

export default Dashboard;