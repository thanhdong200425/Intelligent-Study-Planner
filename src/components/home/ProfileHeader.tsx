import React from "react";
import { Input, Button } from "@heroui/react";
import { SearchIcon, BellIcon } from "./icons/Icons";

const ProfileHeader: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        {/* Search Input - HeroUI */}
        <Input
          placeholder="Search settings..."
          startContent={<SearchIcon className="w-5 h-5 text-slate-400" />}
          className="w-full md:w-64"
          radius="lg"
          size="md"
        />

        {/* Notification Button - HeroUI */}
        <Button
          isIconOnly
          variant="light"
          radius="full"
          className="text-slate-500 hover:text-slate-800"
        >
          <BellIcon className="w-6 h-6" />
        </Button>
      </div>
    </header>
  );
};

export default ProfileHeader;
