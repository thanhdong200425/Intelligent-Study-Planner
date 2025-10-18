import { MainDashboard } from '@/components';
import { startOfWeek } from 'date-fns';

interface HomeProps {
  searchParams: Promise<{
    tab?: string;
    week?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

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
    params.tab && validTabs.includes(params.tab) ? params.tab : 'calendar';

  // Parse the week from URL search params
  let initialWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  if (params.week) {
    try {
      const parsedWeek = new Date(params.week);
      if (!isNaN(parsedWeek.getTime())) {
        initialWeek = startOfWeek(parsedWeek, { weekStartsOn: 1 });
      }
    } catch (error) {
      // If parsing fails, use default week
      console.warn('Invalid week parameter:', params.week);
    }
  }

  return <MainDashboard initialTab={activeTab} initialWeek={initialWeek} />;
}
