'use client';

import React from 'react';
import { 
  Search, 
  ChevronDown,
  User,
  Menu
} from 'lucide-react';
import { 
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from '@heroui/react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar,
  isSidebarCollapsed = false 
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section with Toggle and Search */}
      <div className="flex items-center space-x-4 flex-1">
        {/* Sidebar Toggle Button */}
        <Button
          isIconOnly
          variant="light"
          onPress={onToggleSidebar}
          className="text-gray-600 hover:text-gray-900"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <Input
            placeholder="Search here..."
            startContent={<Search className="w-4 h-4 text-gray-400" />}
            variant="bordered"
            className="w-full"
            classNames={{
              input: "text-sm",
              inputWrapper: "border-gray-200 hover:border-gray-300 focus-within:border-blue-500"
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="light" 
              className="text-sm text-gray-600 font-normal"
              endContent={<ChevronDown className="w-4 h-4" />}
            >
              🇺🇸 Eng (US)
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Language selection">
            <DropdownItem key="en">🇺🇸 English (US)</DropdownItem>
            <DropdownItem key="vi">🇻🇳 Tiếng Việt</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* User Profile */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar 
                size="sm"
                name="Muslig"
                className="w-8 h-8"
              />
              <div className="text-sm">
                <div className="text-gray-900 font-medium">Muslig</div>
                <div className="text-gray-500 text-xs">Admin</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User menu">
            <DropdownItem key="profile">Profile</DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem key="logout" className="text-danger" color="danger">
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
};
