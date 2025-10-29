'use client';

import { TimeBlock } from '@/types';
import { useEffect, useState } from 'react';
import { WeeklySummary } from '../analytics/WeeklySummary';
import { ModernCalendarGrid } from '@/components';
import { DataEntryTabs } from '../data-entry/DataEntryTabs';
import { HabitTracker } from '../habits';
import { startOfWeek } from 'date-fns';
import { AnalyticsPanel } from '../analytics/AnalyticsPanel';
import { Header } from '../layout/Header';
import { Sidebar } from '../layout/Sidebar';
import { Timer } from '../timer/Timer';

const TABS = [
  'calendar',
  'timer',
  'tasks',
  'habits',
  'courses',
  'analytics',
  'settings',
] as const;

interface MainDashboardProps {
  initialTab?: string;
  initialWeek?: Date;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
  initialWeek = startOfWeek(new Date(), { weekStartsOn: 1 }),
  initialTab = 'calendar',
}) => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>(
    initialTab as (typeof TABS)[number]
  );
  const [currentWeek, setCurrentWeek] = useState(initialWeek);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<
    TimeBlock | undefined
  >(undefined);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'calendar':
        return <ModernCalendarGrid weekStart={currentWeek} />;
      case 'timer':
        return (
          <div className='p-6'>
            <Timer
              timeBlock={selectedTimeBlock || undefined}
              onComplete={() => {
                setSelectedTimeBlock(undefined);
              }}
              onCancel={() => setSelectedTimeBlock(undefined)}
            />
          </div>
        );
      case 'tasks':
        return (
          <div className='p-6'>
            <DataEntryTabs />
          </div>
        );
      case 'habits':
        return (
          <div className='p-6'>
            <HabitTracker />
          </div>
        );
      case 'analytics':
        return (
          <div className='p-6'>
            <WeeklySummary weekStart={currentWeek} />
          </div>
        );
      case 'courses':
        return (
          <div className='p-6'>
            <div className='text-center py-12'>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                Courses
              </h2>
              <p className='text-gray-500'>Course management coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className='p-6'>
            <div className='text-center py-12'>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                Settings
              </h2>
              <p className='text-gray-500'>Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <ModernCalendarGrid weekStart={currentWeek} />;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex h-screen'>
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab: string) =>
            setActiveTab(tab as (typeof TABS)[number])
          }
          isCollapsed={isSidebarCollapsed}
        />

        {/* Main Content Area */}
        <div className='flex-1 flex flex-col'>
          {/* Header */}
          <Header
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {/* Content with Analytics Panel */}
          <div className='flex-1 flex overflow-hidden'>
            {/* Main Content */}
            <div className='flex-1 overflow-auto bg-gray-50'>
              {renderActiveTab()}
            </div>

            {/* Analytics Panel - Only show on calendar tab */}
            {activeTab === 'calendar' && <AnalyticsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
