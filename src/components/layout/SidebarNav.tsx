"use client";

import Link from 'next/link';
import { Button } from '@heroui/react';
import { Calendar, ListTodo, BarChart2, Clock, LayoutGrid, Timer, ChevronsLeft } from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
    href: string;
    icon: React.ElementType;
    label: string;
    collapsed: boolean;
}

const menuItems: MenuItem[] = [
    { href: "/", icon: Clock, label: "Today", collapsed: false },
    { href: "/planner", icon: LayoutGrid, label: "Planner", collapsed: false },
    { href: "/session", icon: Timer, label: "Session", collapsed: false },
    { href: "/?tab=tasks", icon: ListTodo, label: "Tasks", collapsed: false },
    { href: "/?tab=habits", icon: Calendar, label: "Habits", collapsed: false },
    { href: "/?tab=analytics", icon: BarChart2, label: "Analytics", collapsed: false },
]

const Item: React.FC<MenuItem> = ({ icon: Icon, ...props }) => {
    return (
        <Link href={props.href} className={`block justify-center ${props.collapsed ? 'px-3' : 'px-2'}`}>
            <Button
                fullWidth
                variant="light"
                className={`${props.collapsed ? 'justify-center' : 'justify-start'} h-11 text-gray-700`}
                startContent={props.collapsed ? null : <Icon className="size-5" />}
                aria-label={props.label}
            >
                {props.collapsed ? <Icon className="size-5" /> : props.label}
            </Button>
        </Link>
    );
}

export default function SidebarNav() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`bg-white border-r border-gray-200 ${collapsed ? 'max-w-25' : 'w-44'} shrink-0 pt-4 flex flex-col justify-between sticky top-0 h-screen overflow-hidden`}>
            <nav className="space-y-3">
                {menuItems.map((item) => (
                    <Item key={item.href} href={item.href} icon={item.icon} label={item.label} collapsed={collapsed} />
                ))}
            </nav>
            <div className={`mb-4 ${collapsed ? 'px-3' : 'px-2'}`}>
                <Button
                    fullWidth
                    variant="light"
                    className="justify-center h-11 text-gray-700"
                    startContent={<ChevronsLeft className={`size-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />}
                    onPress={() => setCollapsed((v) => !v)}
                >
                    {!collapsed && 'Collapse'}
                </Button>
            </div>
        </aside>
    );
}


