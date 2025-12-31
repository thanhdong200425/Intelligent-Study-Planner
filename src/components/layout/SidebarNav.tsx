'use client';

import Link from 'next/link';
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import {
  BarChart2,
  BookOpen,
  ChevronsLeft,
  Clock,
  LayoutGrid,
  ListTodo,
  LogOut,
  Timer,
  UserRound,
} from 'lucide-react';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useLogoutMutation } from '@/mutations/auth';
import { useDispatch } from 'react-redux';
import { setSidebarCollapsed } from '@/store/slices/appSlice';

interface MenuItem {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

const menuItems: MenuItem[] = [
  { href: '/', icon: Clock, label: 'Today', collapsed: false },
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
  const collapsed = useAppSelector(state => state.app.sidebarCollapsed);
  const pathname = usePathname();
  const router = useRouter();
  const userProfile = useAppSelector(state => state.auth.user);
  const { mutate: triggerLogout, isPending: isLoggingOut } =
    useLogoutMutation();
  const dispatch = useDispatch();

  const handleToggleCollapse = () => {
    dispatch(setSidebarCollapsed(!collapsed));
  };

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
          <Popover placement='top-start' offset={10}>
            <PopoverTrigger>
              <Button
                variant='light'
                className={`p-0 min-w-0 ${collapsed ? 'mx-auto' : ''}`}
                aria-label='Open profile menu'
              >
                <Avatar
                  showFallback
                  name={userProfile?.name || userProfile?.email || ''}
                  src={userProfile?.avatar || ''}
                  className='w-10 h-10 text-sm font-medium text-white'
                  classNames={{
                    base: 'bg-gradient-to-br from-blue-500 to-purple-600',
                    name: 'text-white',
                  }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
              <div className='w-[240px] rounded-lg border border-gray-200 bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]'>
                <div className='flex items-center gap-3 px-4 pt-4 pb-3'>
                  <Avatar
                    showFallback
                    name={userProfile?.name || userProfile?.email || ''}
                    src={userProfile?.avatar || ''}
                    className='w-10 h-10 text-sm font-medium text-white'
                    classNames={{
                      base: 'bg-gradient-to-br from-blue-500 to-purple-600',
                      name: 'text-white',
                    }}
                  />
                  <div>
                    <p className='text-sm font-medium text-[#101828]'>
                      {userProfile?.name || ''}
                    </p>
                    <p className='text-xs text-[#6a7282]'>
                      {userProfile?.email || ''}
                    </p>
                  </div>
                </div>
                <div className='h-px bg-gray-200' />
                <div className='flex flex-col gap-1 px-2 py-2'>
                  <Button
                    fullWidth
                    variant='light'
                    onPress={() => router.push('/profile')}
                    className='justify-start gap-3 rounded-[8px] text-sm font-normal text-[#364153] hover:bg-[#F2F4F7]'
                    startContent={
                      <UserRound className='size-4 text-[#364153]' />
                    }
                  >
                    Profile
                  </Button>
                  <Button
                    fullWidth
                    variant='light'
                    className='justify-start gap-3 rounded-md text-sm font-normal text-[#e7000b] hover:bg-[#FDECEC]'
                    startContent={<LogOut className='size-4 text-[#e7000b]' />}
                    isLoading={isLoggingOut}
                    onPress={() => triggerLogout()}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
          onPress={handleToggleCollapse}
        ></Button>
      </div>
    </aside>
  );
}
