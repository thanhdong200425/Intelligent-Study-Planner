'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ModernCalendarGrid } from '@/components/calendar/ModernCalendarGrid';
import { AnalyticsPanel } from '@/components/analytics/AnalyticsPanel';
import { Timer } from '@/components/timer/Timer';
import { DataEntryTabs } from '@/components/data-entry/DataEntryTabs';
import { HabitTracker } from '@/components/habits/HabitTracker';
import { WeeklySummary } from '@/components/analytics/WeeklySummary';
import { TimeBlock } from '@/types';
import { startOfWeek } from 'date-fns';
import { TimeBlockStorage } from '@/lib/storage';

const TABS = [
  'calendar',
  'timer',
  'tasks',
  'habits',
  'courses',
  'analytics',
  'settings',
] as const;

export default function Home() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('calendar');
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<
    TimeBlock | undefined
  >(undefined);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>Courses</h2>
              <p className='text-gray-500'>Course management coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className='p-6'>
            <div className='text-center py-12'>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>Settings</h2>
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
          onTabChange={tab => setActiveTab(tab as (typeof TABS)[number])}
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
}
