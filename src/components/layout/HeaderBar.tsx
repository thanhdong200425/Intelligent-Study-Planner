"use client";

import { Input, Button } from '@heroui/react';
import { Bell, CalendarDays, Search } from 'lucide-react';

interface HeaderBarProps {
    title: string;
    description: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title = 'Study Planner', description = 'Plan your learning journey' }) => {
    return (
        <header className="bg-white border-b border-gray-200 px-8 pt-4 pb-4 rounded-t-xl sticky top-0 z-10">
            <div className="flex items-center justify-between h-12">
                <div>
                    <h1 className="text-base text-gray-900">{title}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <CalendarDays className="size-4" />
                        <span>{description}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button isIconOnly variant="light" aria-label="notifications">
                        <Bell className="size-5" />
                    </Button>
                    <Input
                        aria-label="Search"
                        placeholder="Search events, tasks..."
                        startContent={<Search className="size-4 text-gray-500" />}
                        className="w-72"
                        variant="bordered"
                        radius="md"
                    />
                </div>
            </div>
        </header>
    );
}

export default HeaderBar;


