import React from 'react';
import { type UserProfile } from '../../types/index';


interface PreferenceFieldProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: keyof UserProfile;
}

const PreferenceField: React.FC<PreferenceFieldProps> = ({ label, value, onChange, name }) => {
  const handleStep = (step: number) => {
    const newValue = Number(value) + step;
    if (newValue < 0) return; // Prevent negative values

    // Create a synthetic event to pass to the parent handler
    const event = {
      target: {
        name,
        value: String(newValue),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type="number"
          value={value}
          onChange={onChange}
          className="w-full bg-slate-100/70 rounded-lg p-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => handleStep(1)}
            aria-label={`Increase ${label}`}
            className="h-1/2 px-2 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors rounded-tr-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 5l-5 5h10l-5-5z" />
            </svg>
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => handleStep(-1)}
            aria-label={`Decrease ${label}`}
            className="h-1/2 px-2 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors rounded-br-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15l5-5H5l5 5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface StudyPreferencesProps {
  userProfile: UserProfile;
  setUserProfile: (updates: Partial<UserProfile>) => void;
}

const StudyPreferences: React.FC<StudyPreferencesProps> = ({ userProfile, setUserProfile }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile({
      [name]: Number(value)
    } as Partial<UserProfile>);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900">Study Preferences</h3>
      <p className="text-slate-500 mt-1">Customize your study sessions and learning habits</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <PreferenceField 
            label="Focus Duration (min)" 
            value={userProfile.focusDuration} 
            onChange={handleChange}
            name="focusDuration"
        />
        <PreferenceField 
            label="Break Duration (min)" 
            value={userProfile.breakDuration} 
            onChange={handleChange}
            name="breakDuration"
        />
        <PreferenceField 
            label="Daily Goal (hours)" 
            value={userProfile.dailyGoal} 
            onChange={handleChange}
            name="dailyGoal"
        />
      </div>
    </div>
  );
};

export default StudyPreferences;