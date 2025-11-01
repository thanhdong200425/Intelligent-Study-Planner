import React from 'react';
import { Course } from '@/types';
import { Clock } from 'lucide-react';

interface CourseCardProps {
    course: Course & {
        hours?: number; // is calculated based on the tasks and pomodoros technique
        progress?: number;
    };
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const progress = course.progress ?? 0;
    const hours = course.hours ?? 0;
    const color = course.color || '#3b82f6';

    // Determine text color based on progress for better contrast
    const progressColor = progress > 0 ? color : '#dfe2e7';

    return (
        <div className="bg-white border border-gray-200 rounded-[14px] overflow-hidden h-[314px] flex flex-col">
            {/* Colored header section */}
            <div
                className="h-[128px] relative"
                style={{ backgroundColor: color }}
            >
                {/* Optional menu button (hidden in design but structure is there) */}
                <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-white/20 p-2 rounded-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Course details section */}
            <div className="flex-1 flex flex-col gap-4 p-6">
                <h3 className="text-base font-normal text-gray-900 leading-6">
                    {course.name}
                </h3>

                {/* Hours display */}
                <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500 leading-5">
                        {hours} hours
                    </span>
                </div>

                {/* Progress section */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 leading-5">Progress</span>
                        <span
                            className="text-sm leading-5 font-normal"
                            style={{ color: progressColor }}
                        >
                            {progress}%
                        </span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                backgroundColor: progressColor,
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
