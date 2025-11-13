import React from 'react';
import { type UserProfile } from '../../types/index';
import { CameraIcon, PlannerIcon, LocationIcon, EditIcon } from './icons/Icons'; 

const InfoField: React.FC<{ 
    label: string; 
    value: string; 
    name: keyof UserProfile;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    type?: string; 
}> = ({ label, value, name, onChange, className, type = 'text' }) => (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-100/70 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
);

interface ProfileDetailsProps {
  userProfile: UserProfile;
  setUserProfile: (updates: Partial<UserProfile>) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userProfile, setUserProfile }) => {
  const initials = userProfile.fullName
    ? userProfile.fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : userProfile.email
        ? userProfile.email[0].toUpperCase()
        : 'U';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile({
      [name]: value,
    } as Partial<UserProfile>);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
            {initials}
          </div>
          <button className="absolute bottom-0 right-0 bg-slate-800 text-white rounded-full p-2 hover:bg-slate-700 transition">
            <CameraIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
          <h2 className="text-xl font-bold text-slate-900">{userProfile.fullName}</h2>
          <p className="text-slate-500">{userProfile.email}</p>
          <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center">
              <PlannerIcon className="w-4 h-4 mr-1.5" />
              {userProfile.joinedDate}
            </span>
            <span className="flex items-center">
              <LocationIcon className="w-4 h-4 mr-1.5" />
              {userProfile.location}
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <button className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">
          <EditIcon className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Editable Fields */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField 
          label="Full Name" 
          value={userProfile.fullName} 
          name="fullName"
          onChange={handleChange} 
        />
        <InfoField 
          label="Email Address" 
          value={userProfile.email} 
          name="email"
          type="email"
          onChange={handleChange}
        />
        <div className="md:col-span-2">
          <InfoField 
            label="Location" 
            value={userProfile.location} 
            name="location"
            onChange={handleChange}
          />
          <p className="mt-1 text-xs text-amber-600">
            ⚠️ Thông tin này chỉ được lưu tạm trên trình duyệt, chưa được đồng bộ với server
          </p>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium text-slate-600 mb-1">Bio</label>
          <textarea
            id="bio"
            name="bio"
            className="w-full bg-slate-100/70 rounded-lg p-3 h-24 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            placeholder="Tell us about yourself..."
            value={userProfile.bio}
            onChange={handleChange}
          ></textarea>
          <p className="mt-1 text-xs text-amber-600">
            ⚠️ Thông tin này chỉ được lưu tạm trên trình duyệt, chưa được đồng bộ với server
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
