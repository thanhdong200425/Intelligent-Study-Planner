'use client';

import React, { useState } from 'react';
import { WeeklyScheduler } from '@/lib/scheduler';
import { Button } from '@/components/ui/Button';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, RefreshCw, Zap } from 'lucide-react';

interface WeekPlannerPanelProps {
  currentWeek: Date;
  onWeekChange: (week: Date) => void;
  onPlanGenerated: () => void;
}

export const WeekPlannerPanel: React.FC<WeekPlannerPanelProps> = ({
  currentWeek,
  onWeekChange,
  onPlanGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWeeklyPlan = async () => {
    setIsGenerating(true);
    
    try {
      const scheduler = new WeeklyScheduler({ weekStart: currentWeek });
      const blocks = scheduler.generateWeeklySchedule();
      
      console.log(`Generated ${blocks.length} time blocks for the week`);
      onPlanGenerated();
    } catch (error) {
      console.error('Error generating weekly plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const previousWeek = () => {
    onWeekChange(subWeeks(currentWeek, 1));
  };

  const nextWeek = () => {
    onWeekChange(addWeeks(currentWeek, 1));
  };

  const currentWeekEnd = addWeeks(currentWeek, 1);
  currentWeekEnd.setDate(currentWeekEnd.getDate() - 1);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">Week Planner</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={previousWeek}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
              {format(currentWeek, 'MMM d')} - {format(currentWeekEnd, 'MMM d, yyyy')}
            </span>
            <button
              onClick={nextWeek}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <Button
          onClick={generateWeeklyPlan}
          disabled={isGenerating}
          variant="primary"
          className="flex items-center space-x-2"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          <span>{isGenerating ? 'Generating...' : 'Generate Week'}</span>
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click &quot;Generate Week&quot; to create time blocks for your tasks</li>
          <li>• Drag and drop blocks in the calendar to reschedule</li>
          <li>• Use the timer to track actual time spent</li>
          <li>• Check your weekly summary for insights</li>
        </ul>
      </div>
    </div>
  );
};