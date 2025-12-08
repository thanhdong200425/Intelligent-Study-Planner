'use client';

import Link from 'next/link';
import { Button, Avatar } from '@heroui/react';
import {
  Calendar,
  ListTodo,
  BarChart2,
  Clock,
  LayoutGrid,
  Timer,
  ChevronsLeft,
  BookOpen,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface MenuItem {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

const menuItems: MenuItem[] = [
  ...(process.env.NEXT_PUBLIC_NODE_ENV === 'production'
    ? []
    : [{ href: '/', icon: Clock, label: 'Today', collapsed: false }]),
  { href: '/planner', icon: LayoutGrid, label: 'Planner', collapsed: false },
  { href: '/tasks', icon: ListTodo, label: 'Tasks', collapsed: false },
  { href: '/session', icon: Timer, label: 'Focus', collapsed: false },
  // { href: '/?tab=habits', icon: Calendar, label: 'Habits', collapsed: false },
  { href: '/courses', icon: BookOpen, label: 'Courses', collapsed: false },
  {
    href: '/analytics',
    icon: BarChart2,
    label: 'Analytics',
    collapsed: false,
  },
  { href: '/profile', icon: User, label: 'Profile', collapsed: false },
];

const Item: React.FC<MenuItem & { isActive?: boolean }> = ({
  icon: Icon,
  isActive,
  ...props
}) => {
  return (
    <Link
      href={props.href}
      className={`block justify-center ${props.collapsed ? 'px-3' : 'px-2'}`}
    >
      <Button
        fullWidth
        variant='light'
        className={`${props.collapsed ? 'justify-center' : 'justify-start'} h-11 ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
        startContent={props.collapsed ? null : <Icon className='size-5' />}
        aria-label={props.label}
      >
        {props.collapsed ? <Icon className='size-5' /> : props.label}
      </Button>
    </Link>
  );
};

export default function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const userProfile = useAppSelector(state => state.auth.user);

  return (
    <aside
      className={`bg-white border-r border-gray-200 ${collapsed ? 'max-w-25' : 'w-44'} shrink-0 pt-4 flex flex-col justify-between sticky top-0 h-screen overflow-hidden`}
    >
      <nav className='space-y-3'>
        {menuItems.map(item => {
          // Handle active state - exact match or for root path
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Item
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              isActive={isActive}
            />
          );
        })}
      </nav>
      <div
        className={`flex justify-between mb-4 px-3 ${collapsed ? 'gap-3' : 'gap-0'}`}
        style={{ flexDirection: collapsed ? 'column' : 'row' }}
      >
        <div
          className={`flex-1 hover:cursor-pointer ${collapsed ? 'flex justify-center' : ''}`}
        >
          <Avatar
            showFallback
            name={userProfile?.email?.charAt(0) || ''}
            src={userProfile?.name || ''}
          />
        </div>
        <Button
          fullWidth
          variant='light'
          className={`h-11 text-gray-700 flex-1 p-2`}
          startContent={
            <ChevronsLeft
              className={`size-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          }
          onPress={() => setCollapsed(v => !v)}
        ></Button>
      </div>
    </aside>
  );
}
