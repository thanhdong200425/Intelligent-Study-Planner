import { MainDashboard } from '@/components';
import { startOfWeek } from 'date-fns';

interface HomeProps {
  searchParams: {
    tab?: string;
    week?: string;
  };
}

export default function Home({ searchParams }: HomeProps) {
  // Parse the tab from URL search params
  const validTabs = [
    'calendar',
    'timer',
    'tasks',
    'habits',
    'courses',
    'analytics',
    'settings',
  ];
  const activeTab =
    searchParams.tab && validTabs.includes(searchParams.tab)
      ? searchParams.tab
      : 'calendar';

  // Parse the week from URL search params
  let initialWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  if (searchParams.week) {
    try {
      const parsedWeek = new Date(searchParams.week);
      if (!isNaN(parsedWeek.getTime())) {
        initialWeek = startOfWeek(parsedWeek, { weekStartsOn: 1 });
      }
    } catch (error) {
      // If parsing fails, use default week
      console.warn('Invalid week parameter:', searchParams.week);
    }
  }

  return <MainDashboard initialTab={activeTab} initialWeek={initialWeek} />;
}
