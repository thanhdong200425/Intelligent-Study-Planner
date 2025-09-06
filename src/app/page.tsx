"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { Timer } from "@/components/timer/Timer";
import { DataEntryTabs } from "@/components/data-entry/DataEntryTabs";
import { HabitTracker } from "@/components/habits/HabitTracker";
import { WeeklySummary } from "@/components/analytics/WeeklySummary";
import { WeekPlannerPanel } from "@/components/dashboard/WeekPlannerPanel";
import { TimeBlock } from "@/types";
import { startOfWeek } from "date-fns";

const TABS = ['calendar', 'timer', 'add-data', 'habits', 'analytics', 'statistics'] as const;

export default function Home() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("calendar");
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | null>(
    null
  );
  const [calendarKey, setCalendarKey] = useState(0);

  const handlePlanGenerated = () => {
    setCalendarKey((prev) => prev + 1);
  };

  const handleTimeBlockUpdate = () => {
    setCalendarKey((prev) => prev + 1);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "calendar":
        return (
          <div className="space-y-6">
            <WeekPlannerPanel
              currentWeek={currentWeek}
              onWeekChange={setCurrentWeek}
              onPlanGenerated={handlePlanGenerated}
            />
            <CalendarGrid
              key={calendarKey}
              weekStart={currentWeek}
              onTimeBlockUpdate={handleTimeBlockUpdate}
            />
          </div>
        );
      case "timer":
        return (
          <div className="max-w-2xl mx-auto">
            <Timer
              timeBlock={selectedTimeBlock || undefined}
              onComplete={() => {
                setSelectedTimeBlock(null);
                handleTimeBlockUpdate();
              }}
              onCancel={() => setSelectedTimeBlock(null)}
            />
          </div>
        );
      case "add-data":
        return <DataEntryTabs />;
      case "habits":
        return <HabitTracker />;
      case "analytics":
        return <WeeklySummary weekStart={currentWeek} />;
      case 'statistics': 
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as typeof TABS[number])} />
      <main className="light max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}
