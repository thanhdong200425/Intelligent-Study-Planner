'use client';

import { SidebarNav, HeaderBar } from '@/components';
import {
  AnalyticsStatCard,
  WeeklyStudyHoursChart,
  TaskDistributionChart,
  StudyTimeByCourseChart,
  WeeklyTaskCompletionChart,
  FocusHoursHeatmap,
  RecentAchievements,
} from '@/components/analytics';
import { Clock, BookOpen, BarChart3, Target } from 'lucide-react';
import { Button } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { getAnalyticsStats } from '@/services/analytics';

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: getAnalyticsStats,
  });

  return (
    <div className='flex h-screen bg-gray-50 text-gray-800 font-sans'>
      <SidebarNav />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <HeaderBar
          title='Analytics'
          isShowSearchBar={false}
          isShowNotification={false}
        />

        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8'>
          <div className='max-w-7xl mx-auto space-y-6'>
            {/* Header Section */}
            <div className='flex items-start justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                  Learning Analytics
                </h1>
                <p className='text-gray-500'>
                  Track your progress and insights
                </p>
              </div>
              <div className='flex gap-2 bg-white rounded-lg p-1 border border-gray-200'>
                <Button size='sm' variant='solid' color='primary'>
                  Week
                </Button>
                <Button size='sm' variant='light'>
                  Month
                </Button>
                <Button size='sm' variant='light'>
                  Year
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {isLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className='h-[168px] bg-white rounded-lg animate-pulse'
                    />
                  ))}
                </>
              ) : stats ? (
                <>
                  <AnalyticsStatCard
                    icon={Clock}
                    title='Study Hours This Week'
                    value={`${stats.studyHoursThisWeek}h`}
                    badge={
                      stats.studyHoursGrowthRate !== 0
                        ? {
                            text: `${stats.studyHoursGrowthRate > 0 ? '+' : ''}${stats.studyHoursGrowthRate}%`,
                            variant:
                              stats.studyHoursGrowthRate > 0
                                ? 'success'
                                : 'neutral',
                            showIcon: stats.studyHoursGrowthRate > 0,
                          }
                        : undefined
                    }
                  />
                  <AnalyticsStatCard
                    icon={BookOpen}
                    title='Courses Enrolled'
                    value={stats.coursesEnrolled.toString()}
                    badge={{ text: 'Active', variant: 'neutral' }}
                  />
                  <AnalyticsStatCard
                    icon={BarChart3}
                    title='Total Study Hours'
                    value={`${stats.totalStudyHours}h`}
                    badge={
                      stats.totalStudyHoursGrowthRate !== 0
                        ? {
                            text: `${stats.totalStudyHoursGrowthRate > 0 ? '+' : ''}${stats.totalStudyHoursGrowthRate}%`,
                            variant:
                              stats.totalStudyHoursGrowthRate > 0
                                ? 'success'
                                : 'neutral',
                            showIcon: stats.totalStudyHoursGrowthRate > 0,
                          }
                        : undefined
                    }
                  />
                  <AnalyticsStatCard
                    icon={Target}
                    title='Task Completion Rate'
                    value={`${stats.taskCompletionRate}%`}
                    badge={{
                      text:
                        stats.taskCompletionRate >= 80
                          ? 'On Track'
                          : 'Need Focus',
                      variant:
                        stats.taskCompletionRate >= 80 ? 'neutral' : 'neutral',
                    }}
                  />
                </>
              ) : null}
            </div>

            {/* Charts Row 1 */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <WeeklyStudyHoursChart />
              <TaskDistributionChart />
            </div>

            {/* Charts Row 2 */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <StudyTimeByCourseChart />
              <WeeklyTaskCompletionChart />
            </div>

            {/* Heatmap */}
            <FocusHoursHeatmap />

            {/* Recent Achievements */}
            <RecentAchievements />
          </div>
        </main>
      </div>
    </div>
  );
}
